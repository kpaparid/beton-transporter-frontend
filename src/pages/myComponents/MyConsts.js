import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  // availableValues,
  // visibleLabelsSelector,
  checkedExistsSelector,
  shownToursSelector,
  shownToursSelector2,
  selectorMenu,
  checkedAllSelector,
  sortedLabelsSelector,
} from "./MySelectors";

import moment from "moment";
import { validateNumber, validateNumberSeparator } from "./util/utilities";
import { createReduxStore } from "../reducers/redux";

const store = createReduxStore();
// const useTourTable = () => useSelector((state) => state.tourTable);
const useTourDate = () =>
  useSelector((state) =>
    moment(state.tourTable.tourDate, "MM/YYYY").format("MMMM YYYY")
  );
// const useCheckedExists = () => useSelector(checkedExistsSelector);

// const useShownTourTable = () => useSelector(shownToursSelector);
// const useShownTourTable2 = () => useSelector(shownToursSelector2, shallowEqual);
// const useCheckedAll = () => useSelector(checkedAllSelector);
// const useChecked = () => useSelector(selectorMenu);
// const useShownLabels = () => useSelector(sortedLabelsSelector);
// const useAllLabels = () => useSelector((state) => state.tourTable.labelsById);
// const useGetVisibleLabels = () =>
//   useSelector(visibleLabelsSelector, shallowEqual);
// const useGetAvailableValuesSelectInput = (key) =>
//   useSelector((state) => availableValues(state, key));
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
// const useToursTableData = () => useSelector(tableData);
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

export {
  validationType,
  store,
  // useTourTable,
  useTourDate,
  // useCheckedExists,
  // useShownTourTable,
  // useCheckedAll,
  // useChecked,
  // useShownLabels,
  // useAllLabels,
  // useGetVisibleLabels,
  inputLabelsWidths,
  // useGetAvailableValuesSelectInput,
  imgValid,
  imgInvalid,
  useActiveElement,
  // useToursTableData,
  // useShownTourTable2,
  red,
  grey,
  lightblue,
  darkblue,
  green,
};
