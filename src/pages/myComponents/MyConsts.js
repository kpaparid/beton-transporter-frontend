import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  availableValues,
  visibleLabelsSelector,
  checkedExistsSelector,
  shownToursSelector,
  selectorMenu,
  checkedAllSelector,
  sortedLabelsSelector,
} from "./MySelectors";

import moment from "moment";
import { validateNumber, validateNumberSeparator } from "./util/utilities";

const useTourTable = () => useSelector((state) => state.tourTable);
const useTourDate = () =>
  useSelector((state) =>
    moment(state.tourTable.tourDate, "MM/YYYY").format("MMMM YYYY")
  );
const useCheckedExists = () => useSelector(checkedExistsSelector);

const useShownTourTable = () => useSelector(shownToursSelector, shallowEqual);
const useCheckedAll = () => useSelector(checkedAllSelector);
const useChecked = () => useSelector(selectorMenu);
const useShownLabels = () => useSelector(sortedLabelsSelector);
const useAllLabels = () => useSelector((state) => state.tourTable.labelsById);
const useGetVisibleLabels = () => useSelector(visibleLabelsSelector);
const useGetAvailableValuesSelectInput = (key) =>
  useSelector((state) => availableValues(state, key));
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
const inputLabelsWidths = {
  wagen: { minWidth: "20px", maxWidth: "200px" },
  werk: { minWidth: "130px", maxWidth: "200px" },
  fahrer: { minWidth: "150px", maxWidth: "200px" },
  entladeTyp: { minWidth: "20px", maxWidth: "200px" },
  datum: { minWidth: "20px", maxWidth: "200px" },
  cbm: { minWidth: "20px", maxWidth: "200px" },
  abfahrt: { minWidth: "20px", maxWidth: "200px" },
  kmAbfahrt: { minWidth: "20px", maxWidth: "200px" },
  kmAnkunft: { minWidth: "20px", maxWidth: "200px" },
  ankunft: { minWidth: "20px", maxWidth: "200px" },
  lieferscheinNr: { minWidth: "20px", maxWidth: "200px" },
  baustelle: { minWidth: "150px", maxWidth: "200px" },
  entladeBeginn: { minWidth: "20px", maxWidth: "200px" },
  entladeEnde: { minWidth: "20px", maxWidth: "200px" },
  wartezeit: { minWidth: "20px", maxWidth: "200px" },
  sonstiges: { minWidth: "20px", maxWidth: "200px" },
};
const calcInvalidation = (text, type, invalidation, isUnlimited = false) => {
  const delimiter = ":";
  // invalidation &&
  //   console.log(
  //     "unlim: " + isUnlimited,
  //     "type: " +
  //       type +
  //       "\ntext: " +
  //       text +
  //       "\ninvalidation: " +
  //       invalidation +
  //       "\nvalidatenr: " +
  //       validateNumber(parseInt(text.replace(":", ""))) +
  //       validateNumberSeparator(text) +
  //       ((text.match(new RegExp(",", "g")) || []).length <= 1) +
  //       "\n" +
  //       // moment("00:" + text, "HH:mm", true).isValid() +
  //       // moment(text + ":00", "HH:mm", true).isValid() +
  //       "\n" +
  //       !moment("00:" + text, "HH:m", true).isValid() +
  //       "\n" +
  //       !moment(text, "H" + delimiter + "m", true).isValid() +
  //       isNaN(text.replace(delimiter, ""))
  //   );

  if (!invalidation || text === "" || type === "text") return false;
  switch (type) {
    case "number":
      return validateNumber(text) &&
        validateNumberSeparator(text) &&
        (text.match(new RegExp(",", "g")) || []).length <= 1
        ? false
        : true;
    case "date":
      return !moment(text, "DD/MM/YYYY", true).isValid();
    case "time":
      return isUnlimited
        ? isNaN(text.replace(delimiter, ""))
        : !moment(text, "H" + delimiter + "m", true).isValid();
    case "hour":
      return isUnlimited
        ? isNaN(text)
        : !moment(
            text + delimiter + "00",
            "H" + delimiter + "mm",
            true
          ).isValid()
        ? false
        : true;
    case "minute":
      return isUnlimited
        ? isNaN(text)
        : !moment(
            "00" + delimiter + text,
            "HH" + delimiter + "m",
            true
          ).isValid()
        ? false
        : true;
    default:
      break;
  }

  // !invalidation || text === "" || type === "text"
  //   ? false
  //   : !isUnlimited ?
  //     type === "minute" &&
  //     moment("00:" + text, "HH:mm", true).isValid()? false
  //   ? false
  //   : !isUnlimited ?
  //     type === "hour" &&
  //     moment(text + ":00", "HH:mm", true).isValid() ? false
  //   ? false
  //   : (type === "number" || type === "minute" || type === "hour") &&
  //     validateNumber(text) &&
  //     validateNumberSeparator(text) &&
  //     (text.match(new RegExp(",", "g")) || []).length <= 1
  //   ? false
  //   : type === "date" && moment(text, "DD/MM/YYYY", true).isValid()
  //   ? false
  //   : (type === "time" &&
  //       !isUnlimited &&
  //       moment(text, "H:mm", true).isValid()) ||
  //     (type === "time" && isUnlimited && validateNumber(text.replace(":", "")))
  //   ? false
  //   : true;
};

const calcValidation = (text, type, validation) =>
  !validation
    ? false
    : text === ""
    ? false
    : type === "text"
    ? true
    : // type === 'number' && !isNaN(text.replaceAll('.', '').replaceAll(',', '')) && (text.match(new RegExp(',', "g")) || []).length <= 1 ? true :
    (type === "number" || type === "hour" || type === "minute") &&
      validateNumber(text) &&
      (text.match(new RegExp(",", "g")) || []).length <= 1
    ? true
    : type === "date" && moment(text, "DD/MM/YYYY", true).isValid()
    ? true
    : type === "time" && moment(text, "HH:mm", true).isValid()
    ? true
    : type === "duration" && moment(text, "H[h] mm[m]", true).isValid()
    ? true
    : false;
const imgValid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2305A677' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`;
const imgInvalid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23FA5252' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23FA5252' stroke='none'/%3e%3c/svg%3e")`;

export {
  useTourTable,
  useTourDate,
  useCheckedExists,
  useShownTourTable,
  useCheckedAll,
  useChecked,
  useShownLabels,
  useAllLabels,
  useGetVisibleLabels,
  inputLabelsWidths,
  useGetAvailableValuesSelectInput,
  calcValidation,
  calcInvalidation,
  imgValid,
  imgInvalid,
  useActiveElement,
};
