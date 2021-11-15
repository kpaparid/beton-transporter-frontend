import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import isequal from "lodash.isequal";

import moment from "moment";
import { createReduxStore2 } from "../reducers/redux2";
import { MonthSelectorDropdown } from "./TextArea/MonthPicker";
import { nanoid } from "@reduxjs/toolkit";
import { Button } from "@themesberg/react-bootstrap";
import {
  loadOverviewPage,
  loadToursPage,
  loadWorkHoursPage,
} from "../../api/apiMappers";
import { getGridTitle } from "./util/labels";
// dark 0
// #485354  1
// #037070  3
// #4B5757  2
// #5DA3A3  4
// #DDFFFF  5
export const API = "http://localhost:3034/";
const primaryVariant = "#037070";

const store = createReduxStore2();
const useActiveElement = () => {
  const [listenersReady, setListenersReady] =
    useState(false); /** Useful when working with autoFocus */
  const [activeElement, setActiveElement] = useState(document.activeElement);

  useEffect(() => {
    const onFocus = (event) => setActiveElement(event.target);
    const onBlur = (event) => setActiveElement(null);

    window.addEventListener("focus", onFocus, true);
    window.addEventListener("blur", onBlur, true);

    setListenersReady(true);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return {
    activeElement,
    listenersReady,
  };
};
const red = "250, 82, 82";
const green = "5, 166, 119";
const grey = "46,54, 80";
const lightblue = "209, 215, 224";
const darkblue = "86, 97, 144";
const inputLabelsWidths = {
  wagen: { minWidth: "10px", maxWidth: "200px" },
  werk: { minWidth: "10px", maxWidth: "200px" },
  fahrer: { minWidth: "10px", maxWidth: "200px" },
  entladeTyp: { minWidth: "10px", maxWidth: "200px" },
  datum: { minWidth: "10px", maxWidth: "200px" },
  cbm: { minWidth: "10px", maxWidth: "200px" },
  abfahrt: { minWidth: "10px", maxWidth: "200px" },
  kmAbfahrt: { minWidth: "10px", maxWidth: "200px" },
  kmAnkunft: { minWidth: "10px", maxWidth: "200px" },
  ankunft: { minWidth: "10px", maxWidth: "200px" },
  lieferscheinNr: { minWidth: "10px", maxWidth: "200px" },
  baustelle: { minWidth: "10px", maxWidth: "200px" },
  entladeBeginn: { minWidth: "10px", maxWidth: "200px" },
  entladeEnde: { minWidth: "10px", maxWidth: "200px" },
  wartezeit: { minWidth: "10px", maxWidth: "200px" },
  sonstiges: { minWidth: "10px", maxWidth: "200px" },
};
const validationType = (type) =>
  type === "time"
    ? "time"
    : type === "distance" ||
      type === "number" ||
      type === "duration" ||
      type === "date"
    ? type
    : "text";
const imgValid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2305A677' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`;
const imgInvalid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23FA5252' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23FA5252' stroke='none'/%3e%3c/svg%3e")`;

const GRIDTYPE = {
  CARD: "card",
  TABLE: "table",
};
function mapData(data) {
  console.log({ data });
  const r = Object.keys(data).map((id) => {
    const tables = [
      {
        // id2: nanoid(),
        id: id,
        rows: data[id].data.map(({ id }) => id),
        labels: data[id].labels.map(({ id }) => id),
        selectedRows: [],
        selectedLabels: data[id].labels.map(({ id }) => id),
      },
    ];
    const rows = data[id].data;
    const labels = data[id].labels;
    const dates = [{ id, value: data[id].date }];
    const changes = [{ id, value: [] }];
    const editModes = [{ id, value: false }];
    const filters = [
      {
        id,
        checked: data[id].labels.map(({ id }) => id),
        labels: data[id].labels
          .map(({ id }) => ({ [id]: [] }))
          .reduce((a, b) => ({ ...a, ...b }), {}),
      },
    ];
    return {
      rows,
      labels,
      dates,
      tables,
      changes,
      editModes,
      filters,
    };
  });

  console.log({ r });
  const c = r.reduce(
    (a, b) =>
      Object.keys(b)
        .map((e) =>
          a[e] && b[e] ? { [e]: [...a[e], ...b[e]] } : { [e]: [...b[e]] }
        )
        .reduce((a, b) => ({ ...a, ...b }), {}),
    {}
  );
  console.log(c);
  return c;
}
function useLoadData(tableName, actions, meta) {
  const [stateAPIStatus, setAPIStatus] = useState("idle");
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("loading");
    setAPIStatus("loading");
    switch (tableName) {
      case "workHoursTable":
        loadWorkHoursPage(actions, dispatch, meta).then(() =>
          setAPIStatus("success")
        );
        break;
      case "toursTable":
        loadToursPage(actions, dispatch).then(() => setAPIStatus("success"));
        break;
      case "overviewTable":
        loadOverviewPage(actions, dispatch).then(() => setAPIStatus("success"));
        break;
      default:
        break;
    }
  }, [dispatch, meta, tableName, actions]);

  return stateAPIStatus;
}

const TitleComponent = memo(({ entityId, selectDate, ...props }) => {
  const title = getGridTitle(entityId);
  const date = useSelector(selectDate);

  if (
    entityId === "workHours" ||
    entityId === "tours" ||
    entityId === "workHoursByDate"
  ) {
    return <MonthSelectorDropdown {...props} title={title} date={date} />;
  } else
    return (
      <Button split variant="transparent" className="btn-title">
        {/* {title} */}
        <h5> {title} </h5>
        {/* <h5 className="m-0 py-0 px-2"> {title} </h5> */}
      </Button>
    );
}, isequal);

const grids = {
  tours: {
    title: "Tours",
    type: GRIDTYPE.TABLE,
    size: 20,
    editable: true,
    filter: true,
  },
  workHours: {
    title: "Workhours",
    type: GRIDTYPE.TABLE,
    size: 20,
    editable: true,
    filter: true,
  },
  workHoursBank: {
    title: "WorkhoursBank",
    type: GRIDTYPE.TABLE,
    size: 5,
    editable: true,
    filter: false,
    footer: ["Total", "", "SUM"],
  },
  absent: {
    title: "Absent",
    type: GRIDTYPE.TABLE,
    size: 1,
    editable: true,
    filter: false,
  },

  vacations: {
    title: "Vacations",
    type: GRIDTYPE.TABLE,
    size: 1,
    editable: true,
    filter: false,
  },
  vacationsOverview: {
    title: "Vacations Overview",
    type: GRIDTYPE.TABLE,
    size: 5,
    editable: true,
    filter: false,
    footer: ["Total", "", "SUM"],
  },
};

export {
  grids,
  TitleComponent,
  mapData,
  GRIDTYPE,
  useLoadData,
  validationType,
  store,
  inputLabelsWidths,
  imgValid,
  imgInvalid,
  useActiveElement,
  red,
  grey,
  lightblue,
  darkblue,
  green,
  primaryVariant,
};
