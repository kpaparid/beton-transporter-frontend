import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEqual } from "lodash.isequal";
import _, { debounce } from "lodash";
import isequal from "lodash.isequal";
import {
  reactTableData,
  visibleHeaders,
  hiddenColumnsReselect,
  editModeSelector,
  nestedFilterTourData,
  dateSelector,
  modalLabelsReselect,
  changesByIdSelector,
  checkedIdSelector,
} from "./MySelectors";

import moment from "moment";
import { createReduxStore2, reducer } from "../reducers/redux2";
import { DateSelector, MonthSelectorDropdown } from "./MyOwnCalendar";
import { MyCheckboxFilter } from "./MyCheckbox";
import { nanoid } from "@reduxjs/toolkit";
import { Button } from "@themesberg/react-bootstrap";
import {
  BottomNavigationAction,
  getFormLabelUtilityClasses,
} from "@mui/material";
import { MyRangeSlider } from "./MyRangeSlider";
import { Box } from "@material-ui/system";
import { Portal } from "react-portal";
import { loadToursPage } from "../../api/apiMappers";
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

function filtersToUrl2(props) {
  // ?exclude=/aboutMe%7C/address
  const c = Object.keys(props).map((label) => {
    const neq =
      (props[label] &&
        props[label].neq &&
        props[label].neq.length !== 0 &&
        props[label].neq
          .reduce((a, b) => a + b + ",", "+" + label + ".exclude=[")
          .slice(0, -1) + "]") ||
      "";
    const gte =
      (props[label].gte && "+" + label + ".gte=" + props[label].gte) || "";
    const lte =
      (props[label].lte && "+" + label + ".lte=" + props[label].lte) || "";
    return (neq + gte + lte).substring(1);
  });
  const urli = c.reduce((a, b) => a + "+" + b, "");
  return urli === "+" ? "" : urli;
  // + => &
}
export function calcFilters(
  oldFilters,
  { label, value = [], action, gte, lte }
) {
  const f =
    oldFilters && oldFilters[label]
      ? action === "toggle"
        ? oldFilters[label].neq && oldFilters[label].neq.includes(value[0])
          ? {
              ...oldFilters,
              [label]: {
                ...oldFilters[label],
                neq: oldFilters[label].neq.filter((e) => e !== value[0]),
              },
            }
          : {
              ...oldFilters,
              [label]: {
                ...oldFilters[label],
                neq: [...oldFilters[label].neq, value[0]],
              },
            }
        : action === "toggleAll"
        ? { ...oldFilters, [label]: { ...oldFilters[label], neq: value } }
        : { ...oldFilters, [label]: { neq: value, gte, lte } }
      : { ...oldFilters, [label]: { neq: [...value], gte, lte } };
  return f;
}
function filtersToUrl(filters) {
  const c = Object.entries(filters).reduce((a, b) => {
    const { neq, gte, lte } = b[1];
    const neqLink = neq ? "&" + b[0] + "_ne=" + neq : "";
    const gteLink = gte ? "&" + b[0] + "_gte=" + gte : "";
    const lteLink = lte ? "&" + b[0] + "_lte=" + lte : "";
    return a + "&" + neqLink + gteLink + lteLink;
  }, "");
  return c;
}

const dateToDay = (date) => moment(date[0], "DD/MM/YYYY").format("dddd");
const calcDaysDifference = (arr) => {
  const t1 = moment(arr[0], "DD/MM/YYYY");
  const t2 = moment(arr[1], "DD/MM/YYYY");
  return t2.diff(t1, "days");
};
const calcMinuteDifference = (arr) => {
  const t1 = moment(arr[0], "HH:mm");
  const t2 = moment(arr[1], "HH:mm");
  return t2.diff(t1, "minutes");
};

export const getGridTitle = (entityId) => gridLabels[entityId].title;
export const getGridUrl = (entityId) => gridLabels[entityId].url;
export const getGridMeta = (entityId) => gridLabels[entityId].meta || {};
export const getGridWidgets = (entityId) => gridLabels[entityId].widgets;
export const getGridLabelFormat = (entityId, labelIdx) =>
  gridLabels[entityId].labels[labelIdx].format;
export const getGridLabelLinks = (entityId, labelIdx) =>
  (gridLabels[entityId].labels[labelIdx].connections || []).map((c) => ({
    connection: c,
    dependencies: gridLabels[entityId].labels[c].dependencies,
  }));
export const getGridLabelProps = (entityId, labelIdx) => {
  const { format, id, connections, nanoid, ...rest } =
    gridLabels[entityId].labels[labelIdx];
  return { idx: id, ...rest };
};
export const getGridLabels = (entityId) => {
  return gridLabels[entityId].labels || [];
};
const GRIDTYPE = {
  CARD: "card",
  TABLE: "table",
};
export const gridLabels = {
  tours: {
    url: "tours",
    meta: ["date", "user"],
    widgets: {
      filter: true,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: true,
      pagination: true,
      counter: true,
      pageSize: 20,
    },
    title: "Tours",
    gridType: GRIDTYPE.TABLE,
    size: 20,
    primaryLabels: [
      "date",
      "vehicle",
      "workPlant",
      "cbm",
      "departure",
      "arrival",
      "kmDeparture",
      "kmArrival",
      "deliveryNr",
      "driver",
      "buildingSite",
      "dischargeBegin",
      "dischargeEnd",
      "dischargeType",
      "waitTime",
      "other",
    ],
    secondaryLabels: [],
    editable: [
      "date",
      "vehicle",
      "workPlant",
      "cbm",
      "departure",
      "arrival",
      "kmDeparture",
      "kmArrival",
      "deliveryNr",
      "driver",
      "buildingSite",
      "dischargeBegin",
      "dischargeEnd",
      "dischargeType",
      "waitTime",
      "other",
    ],
    labels: {
      date: {
        nanoid: nanoid(),
        id: "date",
        text: "Date",
        type: "date",
        filterType: "date",
      },
      vehicle: {
        nanoid: nanoid(),
        id: "vehicle",
        text: "Vehicle",
        type: "constant",
        filterType: "checkbox",
      },
      workPlant: {
        nanoid: nanoid(),
        id: "workPlant",
        text: "Work Plant",
        type: "text",
        filterType: "checkbox",
      },
      cbm: {
        nanoid: nanoid(),
        id: "cbm",
        text: "Cbm",
        type: "number",
        filterType: "range",
      },
      departure: {
        nanoid: nanoid(),
        id: "departure",
        text: "Departure",
        type: "time",
      },
      arrival: {
        nanoid: nanoid(),
        id: "departure",
        text: "Departure",
        type: "time",
      },
      kmDeparture: {
        nanoid: nanoid(),
        id: "kmDeparture",
        text: "Km at Departure",
        type: "number",
        filterType: "range",
      },
      kmArrival: {
        nanoid: nanoid(),
        id: "kmArrival",
        text: "Km at Arrival",
        type: "number",
        filterType: "range",
      },
      deliveryNr: {
        nanoid: nanoid(),
        id: "deliveryNr",
        text: "Delivery Nr",
        type: "number",
        filterType: "checkbox",
      },
      driver: {
        nanoid: nanoid(),
        id: "driver",
        text: "Driver",
        type: "constant",
        filterType: "checkbox",
      },
      buildingSite: {
        nanoid: nanoid(),
        id: "buildingSite",
        text: "Building Site",
        type: "text",
        filterType: "checkbox",
      },
      dischargeBegin: {
        nanoid: nanoid(),
        id: "dischargeBegin",
        text: "Discharge Begin",
        type: "time",
      },
      dischargeEnd: {
        nanoid: nanoid(),
        id: "dischargeEnd",
        text: "Discharge End",
        type: "time",
      },
      dischargeType: {
        nanoid: nanoid(),
        id: "dischargeType",
        text: "Discharge End",
        type: "text",
      },
      waitTime: {
        nanoid: nanoid(),
        id: "waitTime",
        text: "Time Waiting",
        type: "number",
      },
      other: {
        nanoid: nanoid(),
        id: "other",
        text: "Other",
        type: "text",
      },
    },
  },
  workHours: {
    url: "workhours",
    meta: ["date", "user"],
    widgets: {
      filter: true,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: true,
      pagination: true,
      counter: true,
      pageSize: 35,
    },
    title: "Workhours",
    gridType: GRIDTYPE.TABLE,
    primaryLabels: ["date", "begin", "end", "pause"],
    secondaryLabels: ["day", "duration"],
    editable: ["date", "begin", "end", "pause"],
    labels: {
      date: {
        nanoid: nanoid(),
        id: "date",
        text: "Date",
        type: "date",
        filterType: "date",
        connections: ["day"],
      },
      day: {
        nanoid: nanoid(),
        id: "day",
        text: "Day",
        type: "text",
        filterType: "checkbox",
        dependencies: ["date"],
        format: dateToDay,
      },

      begin: {
        nanoid: nanoid(),
        id: "begin",
        text: "Begin",
        type: "time",
        connections: ["duration"],
      },
      end: {
        nanoid: nanoid(),
        id: "end",
        text: "End",
        type: "time",
        connections: ["duration"],
      },
      duration: {
        nanoid: nanoid(),
        id: "duration",
        text: "Duration",
        type: "number",
        measurement: "min",
        dependencies: ["begin", "end"],
        format: calcMinuteDifference,
      },
      pause: {
        nanoid: nanoid(),
        id: "pause",
        text: "Pause",
        type: "number",
        measurement: "min",
        filterType: "range",
      },
    },
  },
  workHoursBank: {
    url: "workhours-bank",
    widgets: {
      filter: false,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: true,
      pagination: true,
      counter: false,
      pageSize: 6,
    },
    title: "Workhours Bank",
    gridType: GRIDTYPE.CARD,
    primaryLabels: ["month", "hours"],
    secondaryLabels: [],
    editable: ["hours"],
    labels: {
      month: {
        nanoid: nanoid(),
        id: "month",
        text: "Month",
        type: "text",
      },
      hours: {
        nanoid: nanoid(),
        id: "hours",
        text: "Hours",
        type: "number",
        measurement: "h",
      },
    },
  },
  absent: {
    url: "absent",
    widgets: {
      filter: false,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: true,
      pagination: true,
      counter: false,
      pageSize: 5,
    },
    title: "Absent",
    gridType: GRIDTYPE.CARD,
    primaryLabels: ["from", "to", "reason"],
    secondaryLabels: ["days"],
    editable: ["from", "to", "reason"],
    labels: {
      from: {
        nanoid: nanoid(),
        id: "from",
        text: "from",
        type: "date",
        connections: ["days"],
      },
      to: {
        nanoid: nanoid(),
        id: "to",
        text: "to",
        type: "date",
        connections: ["days"],
      },
      days: {
        nanoid: nanoid(),
        id: "days",
        text: "Days",
        type: "number",
        dependencies: ["from", "to"],
        format: calcDaysDifference,
      },
      reason: {
        nanoid: nanoid(),
        id: "reason",
        text: "Reason",
        type: "text",
      },
    },
  },
  vacations: {
    url: "vacations",
    widgets: {
      filter: false,
      add: false,
      download: true,
      remove: false,
      massEdit: true,
      pagination: false,
      counter: false,
      pageSize: 5,
    },
    title: "Vacations",
    gridType: GRIDTYPE.CARD,
    primaryLabels: ["taken", "rest"],
    editable: ["taken", "rest"],
    labels: {
      taken: {
        nanoid: nanoid(),
        id: "taken",
        text: "Taken",
        type: "number",
        // measurement: "",
        // grid: 5,
        // page: 1,
        // required: true,
        // priority: 1,
      },
      rest: {
        nanoid: nanoid(),
        id: "rest",
        text: "Rest",
        type: "number",
      },
    },
  },
  vacationsOverview: {
    widgets: {
      filter: false,
      add: true,
      download: true,
      remove: true,
      massEdit: false,
      pagination: true,
      counter: false,
      pageSize: 5,
    },
    gridType: GRIDTYPE.CARD,
    title: "Vacations Overview",
    footer: ["Total", "", "SUM"],
    size: 5,
    primaryLabels: ["from", "to"],
    secondaryLabels: ["days"],
    editable: ["from", "to"],

    labels: {
      from: {
        nanoid: nanoid(),
        id: "from",
        text: "From",
        type: "date",
        connections: ["days"],
      },
      to: {
        nanoid: nanoid(),
        id: "to",
        text: "To",
        type: "date",
        connections: ["days"],
      },
      days: {
        nanoid: nanoid(),
        id: "days",
        text: "Days",
        type: "text",
        dependencies: ["from", "to"],
        format: calcDaysDifference,
      },
    },
  },
};
export function getLabel(id) {
  return gridLabels[id];
}

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
function useLoadData(tableName, actions) {
  const [stateAPIStatus, setAPIStatus] = useState("idle");
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("loading");
    setAPIStatus("loading");
    switch (tableName) {
      case "workHoursTable":
        loadWorkHoursPage(actions, dispatch).then(() =>
          setAPIStatus("success")
        );
        break;
      case "toursTable":
        loadToursPage(actions, dispatch).then(() => setAPIStatus("success"));
        break;
      default:
        break;
    }
  }, [dispatch]);

  return stateAPIStatus;
}

export function loadWorkHoursPageGrids(userId, { fetchEntityGrid }, dispatch) {
  return dispatch(
    fetchEntityGrid({
      entityId: "workHours",
      url: "users/" + userId + "/" + getGridUrl("workHours"),
    })
  )
    .then(() =>
      dispatch(
        fetchEntityGrid({
          entityId: "absent",
          url: "users/" + userId + "/" + getGridUrl("absent"),
        })
      )
    )
    .then(() =>
      dispatch(
        fetchEntityGrid({
          entityId: "vacations",
          url: "users/" + userId + "/" + getGridUrl("vacations"),
        })
      )
    )
    .then(() =>
      dispatch(
        fetchEntityGrid({
          entityId: "workHoursBank",
          url: "users/" + userId + "/" + getGridUrl("workHoursBank"),
        })
      )
    );
}

function loadWorkHoursPage({ fetchUsers, fetchEntityGrid }, dispatch) {
  return dispatch(fetchUsers()).then(({ payload }) =>
    dispatch(
      fetchEntityGrid({
        entityId: "workHours",
        url: "users/" + payload.users[0].id + "/" + getGridUrl("workHours"),
      })
    )
      .then(() =>
        dispatch(
          fetchEntityGrid({
            entityId: "absent",
            url: "users/" + payload.users[0].id + "/" + getGridUrl("absent"),
          })
        )
      )
      .then(() =>
        dispatch(
          fetchEntityGrid({
            entityId: "vacations",
            url: "users/" + payload.users[0].id + "/" + getGridUrl("vacations"),
          })
        )
      )
      .then(() =>
        dispatch(
          fetchEntityGrid({
            entityId: "workHoursBank",
            url:
              "users/" +
              payload.users[0].id +
              "/" +
              getGridUrl("workHoursBank"),
          })
        )
      )
  );
}

function useButtonGroupProps(statePath, stateOffset, actions, selectors) {
  return {};
}

export const TitleComponent = memo(({ entityId, selectDate, ...props }) => {
  const title = getGridTitle(entityId);
  const date = useSelector(selectDate);
  useEffect(() => {
    const k = date;
  }, [date]);
  if (entityId === "workHours" || entityId === "tours") {
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

function useFilterProps(statePath, stateOffset, actions) {
  const { toggleColumn } = actions;
  const dispatch = useDispatch();
  const filterDataSelector = useCallback(
    (state) => nestedFilterTourData(_.get(state, statePath)),
    [statePath]
  );
  const nestedFilterComponent = useMemo(
    () => <FilterComponent stateOffset={stateOffset}></FilterComponent>,
    [stateOffset]
  );
  const onToggleFilterColumn = useCallback((id) => {
    dispatch(toggleColumn({ id, stateOffset }));
  }, []);
  return {
    filterDataSelector,
    nestedFilterComponent,
    onToggleFilterColumn,
  };
}

const FilterComponent = memo((props) => {
  const {
    type,
    label,
    onToggleCheckbox,
    onToggleAllCheckbox,
    onChangeRange,
    onReset,
    ...rest
  } = props;

  const toggleOne = useCallback(
    (value) => {
      onToggleCheckbox({ label, value });
    },
    [label]
  );
  const toggleAll = useCallback(() => {
    onToggleAllCheckbox({ label });
  }, [label]);
  const dateChange = useCallback(
    (dates) => {
      dates.length === 2 &&
        onChangeRange({ label, gte: dates[0], lte: dates[1] });
      dates.length === 0 && onReset({ label });
    },
    [label]
  );
  const handleChangeRangeSlider = useCallback((values) => {
    onChangeRange({ label, gte: values[0], lte: values[1] });
  }, []);
  const debouncedChangeRangeSlider = debounce(handleChangeRangeSlider, 800);
  switch (type) {
    case "checkbox":
      return (
        <MyCheckboxFilter
          {...rest}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
        />
      );
    case "range":
      return <MyRangeSlider onChange={debouncedChangeRangeSlider} />;
    case "date":
      return (
        <DateSelector {...rest.data} disableMonthSwap onChange={dateChange} />
      );
    default:
      break;
  }
}, isEqual);
function maxWidthByType(type) {
  return type === "date"
    ? "120px"
    : type === "number"
    ? "60px"
    : type === "day"
    ? "100px"
    : type === "time"
    ? "75px"
    : "250px";
}

export const grids = {
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
  filtersToUrl,
  mapData,
  GRIDTYPE,
  useLoadData,
  useButtonGroupProps,
  useFilterProps,
  // useTableProps,
  FilterComponent,
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
  maxWidthByType,
};
