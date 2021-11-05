import React, { useEffect, useLayoutEffect, useState } from "react";

import moment from "moment";
import BigNumber from "bignumber.js";
import { darkblue, green, grey, lightblue, red } from "../MyConsts";
/* global BigInt */
export function useWindowSize() {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  });
  return size;
}
export function formatInput(value, type) {
  switch (type) {
    case "number":
    case "distance": {
      return formatNumberInput(value);
    }
    // case "date": {
    //   return formatDateInput(value);
    // }
    case "time": {
      return formatTimeInput(value);
    }
    default:
      return value;
  }
}
export const calcColor = (color, percent = "100%") =>
  `rgb(${color}, ${percent})`;
export const calcInvalidation = (
  text,
  type,
  invalidation,
  isUnlimited = false
) => {
  const delimiter = ":";
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
};
export const calcValidation = (
  text,
  type,
  validation = true,
  isUnlimited = false
) => {
  const delimiter = ":";
  if (!validation) return false;
  if (text === "" || type === "text") return true;
  switch (type) {
    case "number":
      return validateNumber(text) &&
        validateNumberSeparator(text) &&
        (text.match(new RegExp(",", "g")) || []).length <= 1
        ? true
        : false;
    case "date":
      return moment(text, "DD/MM/YYYY", true).isValid();
    case "time":
      return isUnlimited
        ? !isNaN(text.replace(delimiter, ""))
        : moment(text, "H" + delimiter + "m", true).isValid();
    case "hour":
      return isUnlimited
        ? isNaN(text)
        : !moment(
            text + delimiter + "00",
            "H" + delimiter + "mm",
            true
          ).isValid()
        ? true
        : false;
    case "minute":
      return isUnlimited
        ? !isNaN(text)
        : !moment(
            "00" + delimiter + text,
            "HH" + delimiter + "m",
            true
          ).isValid()
        ? true
        : false;
    default:
      break;
  }
};
export function parseBigInt(value) {
  if (!value || value === "") return "0";
  const negative = value[0] === "-" ? true : false;
  const clearedValue = negative
    ? removeLeadingZeroes(value.replace(/[^\d-]/g, "").slice(-1))
    : removeLeadingZeroes(value.replace(/[^\d]/g, ""));
  const number = clearedValue.replace(/[^\d]/g, "");

  return negative ? "-" + number : number;
}
export function convertToThousands(number, decimal = 0) {
  if (!validateNumber(number)) {
    return number;
  }
  const n = BigNumber((number + "").replace(/\./g, "").replace(/,/g, "."));
  const value = decimal === 0 ? n.toFormat() : n.toFormat(decimal);
  const i = value.indexOf(".");
  const v = value.replace(/,/g, ".");
  if (i !== -1) {
    return v.substring(0, i) + "," + v.substring(i + 1);
  } else return v;
}
export const countNumberSeparators = (number) =>
  (number.match(/\./g) || []).length;
export function getDifferenceOfStrings(str1, str2) {
  const longString = str1.length > str2.length ? str1 : str2;
  const shortString = str1.length > str2.length ? str2 : str1;
  var l = 0;
  var s = 0;
  const outliers = [];
  while (l < longString.length && s < longString.length) {
    if (longString[l] === shortString[s]) {
      l++;
      s++;
    } else {
      outliers.push(l);
      l++;
    }
  }
  return { value: outliers.map((i) => longString[i]), index: outliers };
}

export function convertToLocalNumber(number) {
  return (number + "").replace(/\./g, "").replace(/,/g, ".");
}
export function validateNumberSeparator(number) {
  const value = number + "";
  const indexOfComma =
    value.indexOf(",") === -1 ? value.length : value.indexOf(",");
  const dotIndexes =
    [...value]
      .map((v, i) => ({ value: v, index: i }))
      .filter((c) => c.value === ".")
      .map((_) =>
        (value.substr(0, indexOfComma).length - _.index) % 4 === 0
          ? true
          : false
      )
      .indexOf(false) === -1
      ? true
      : false;
  return dotIndexes;
}

export function validateNumber(number) {
  const num = convertToLocalNumber(number);
  return !BigNumber(num).isNaN() && !(number + "").includes(" ");
}

const fillTopWhites = (arr, index) => {
  if (arr[0] - (index + 1) > 0) return [null, ...arr];
  return [...arr];
};
const fillBottomWhites = (n, arr) => {
  if (n === 0) return [...arr];
  if (n === 1) return [...arr, null];
  if (n === 2) return [...arr, null, null];
  return [...arr];
};
export const fillWhites = (arr, index, numRows) => {
  const arr1 = fillTopWhites(arr, index);
  const whites = numRows - arr1.length;
  const newArr = fillBottomWhites(whites, arr1);
  return newArr;
};
export const rotateArray = (arr, k) => arr.slice(k).concat(arr.slice(0, k));

export const calcCalendarRows = (date, labels) => {
  const startofMonth = moment(date, "MM/YYYY").startOf("month").format("dddd");
  const endOfMonth = parseInt(
    moment(date, "MM/YYYY").endOf("month").format("DD")
  );
  const rows =
    (endOfMonth === 31 &&
      labels.findIndex((day) => day === startofMonth) === 5) ||
    (endOfMonth >= 30 && labels.findIndex((day) => day === startofMonth) === 6)
      ? 6
      : 5;
  return rows;
};
export const transpose = (arr, numRows = arr.length) =>
  new Array(numRows)
    .fill()
    .map((_, colIndex) => arr.map((row) => row[colIndex]));
export const calcIndexedCalendarDays = (date, labels) => {
  const numRows = calcCalendarRows(date, labels);
  const days = [...Array(moment(date, "MM/YYYY").daysInMonth()).keys()]
    .map((d) => {
      const day = d + 1;
      const da = moment(day.toString() + `/` + date.toString(), "DD/MM/YYYY");
      return { [da.format("dddd")]: [parseInt(da.format("DD"))] };
    })
    .reduce((prev, curr) => {
      const newLine = { ...curr };
      const key = Object.keys(newLine)[0];
      var newCurr;
      if (prev[key]) {
        newCurr = { [key]: [...prev[key], ...newLine[key]] };
      } else {
        newCurr = { [key]: [...newLine[key]] };
      }
      return { ...prev, ...newCurr };
    });

  const filledIndexWithEmptyDays = labels.map((label, index) =>
    fillWhites(days[label], index, numRows)
  );
  return transpose(filledIndexWithEmptyDays, numRows);
};
export const convertArrayToObject = (array = []) =>
  array.length !== 0
    ? array.reduce((prev, curr) => ({ ...prev, ...curr }))
    : [];
export function colorizeBorder(
  ref,
  isValid = false,
  isInvalid = false,
  focused = false
) {
  const borderColor = isInvalid
    ? red
    : isValid
    ? green
    : focused
    ? darkblue
    : lightblue;
  const color = isInvalid ? red : isValid ? green : grey;
  console.log("colorize");
  if (focused) {
    ref.current.style.boxShadow = "0 0 0 0.2rem rgb(" + color + ", 25%)";
    ref.current.style.border = "1.5px solid rgb(" + borderColor + ")";
  } else {
    ref.current.style.boxShadow = "none";
    ref.current.style.border = "1.5px solid rgb(" + borderColor + ")";
  }
}
export function addValueToTimeUnit(value, number) {
  return removeLeadingZeroes(addValueToString(value, number), 2);
}
export function clearThousandsSeparators(number) {
  return number.replace(/,/g, "").replace(/\./g, "");
}
export function addValueToString(value, number) {
  const newValue = BigInt(BigInt(value) + BigInt(number)).toLocaleString();
  return clearThousandsSeparators(newValue);
}
export function removeLeadingZeroes(text, number = 0) {
  if (!text) return "";
  const symbol = text[0] === "-" ? "-" : "";
  const newText = clearThousandsSeparators(
    BigInt(text).toLocaleString().replace("-", "")
  );
  const size = number < newText.length ? 0 : number - newText.length;
  const arrayOfZeroes =
    size === 0
      ? ""
      : symbol === "-"
      ? new Array(size - 1).fill("0").join("")
      : new Array(size).fill("0").join("");
  return symbol + arrayOfZeroes + newText;
}
export function addToTime(
  time,
  amount,
  disabledHours,
  disabledMinutes,
  type,
  delimiter,
  disableReset = false,
  isUnlimited = false,
  availableMinutes = [...Array(60).keys()],
  availableHours = [...Array(24).keys()]
) {
  const splitValue = time.split(delimiter);
  if (splitValue.length > 1) {
    const hour =
      type === "hour"
        ? addValueToTimeUnit(splitValue[0], amount)
        : splitValue[0];
    const minute =
      type === "minute"
        ? addValueToTimeUnit(splitValue[1], amount)
        : splitValue[1];
    const newTime = hour + delimiter + minute;
    return formatTime({
      time: newTime,
      disabledHours,
      disabledMinutes,
      delimiter,
      disableReset,
      isUnlimited,
      availableHours,
      availableMinutes,
    });
  }
}

export function formatTime(props) {
  const {
    time,
    disabledHours = false,
    disabledMinutes = false,
    delimiter = ":",
    disableReset = false,
    disableInitialization = false,
    isUnlimited = false,
    leadingZeros = true,
    availableMinutes = [...Array(60).keys()],
    availableHours = [...Array(24).keys()],
  } = props;
  function formUnit(value, availableValues) {
    const hour =
      value !== "" &&
      value.trim() !== "" &&
      !isNaN(value.replace(delimiter, "").replace("-", ""))
        ? value
        : disableReset
        ? "00"
        : availableValues[0];
    return isUnlimited
      ? parseInt(hour) <= 0
        ? "00"
        : leadingZeros && hour.length === 1
        ? "0" + hour
        : hour
      : !isUnlimited &&
        (!availableValues.find((h) => h === parseInt(hour)) || hour === 0)
      ? !disableReset && hour === "-1"
        ? availableValues[availableValues.length - 1] + ""
        : leadingZeros
        ? "00"
        : "0"
      : leadingZeros && hour.length === 1
      ? "0" + hour
      : hour;
  }
  const domTime = time.includes(delimiter)
    ? time
    : disabledHours
    ? "00" + delimiter + time
    : disabledMinutes
    ? time + delimiter + "00"
    : time;

  const formattedHour = disabledHours
    ? "00"
    : disableInitialization
    ? domTime.split(delimiter)[0]
    : formUnit(parseBigInt(domTime.split(delimiter)[0]) + "", availableHours);
  const formattedMinute = disabledMinutes
    ? "00"
    : disableInitialization
    ? domTime.split(delimiter)[1]
    : formUnit(parseBigInt(domTime.split(delimiter)[1]) + "", availableMinutes);

  return formattedMinute
    ? formattedHour + delimiter + formattedMinute
    : formattedHour;
}
export function formatTimeInput(value, digitsSeparator) {
  return value;
}
export function formatDateInput(value, digitsSeparator) {
  // console.log(value);
  var count = (value.match(new RegExp(digitsSeparator, "g")) || []).length;
  var newValue = value;
  if (count === 1 && value.indexOf(digitsSeparator) === 2) newValue = value;
  else if (count === 1 && value.indexOf(digitsSeparator) === 1)
    newValue = "0" + value;
  else if (
    count === 2 &&
    value.indexOf(digitsSeparator, 3) === 5 &&
    value.indexOf(digitsSeparator) === 2
  )
    newValue = value;
  else if (
    count === 2 &&
    value.indexOf(digitsSeparator) === 2 &&
    value.indexOf(digitsSeparator, 3) === 4
  ) {
    const splitValue = value.split(digitsSeparator);
    newValue =
      splitValue[0] +
      digitsSeparator +
      "0" +
      splitValue[1] +
      digitsSeparator +
      splitValue[2];
  }
  return newValue;

  //  + "";
  // seperatorAt.forEach((s, index) => {
  //     const seperatorIndex = s + index
  //     value = value.length > seperatorIndex && value[seperatorIndex] !== digitsSeperator ?
  //         value.slice(0, seperatorIndex) + digitsSeperator + value.slice(seperatorIndex) : value
  // })
  // setChange(text);
}
export function formatNumberInput(value, oldValue, key) {
  const difference = oldValue
    ? getDifferenceOfStrings(oldValue + "", value)
    : { value: [], number: [] };
  const valid = validateNumber(value);
  const validOldValue = oldValue ? validateNumber(oldValue) : false;
  if (value === "" || value === " ") return "0";
  else if (key === "." || key === ",") {
    return value;
  } else if (
    oldValue &&
    difference.value.length === 1 &&
    difference.value[0] === "."
  ) {
    if (key === "Backspace") {
      if (
        !validOldValue ||
        (validOldValue && difference.index[0] === oldValue.length - 1)
      ) {
        const formattedValue =
          oldValue.substr(0, difference.index[0]) +
          oldValue.substr(difference.index[0] + 1);
        return formattedValue;
      } else {
        const formattedValue =
          oldValue.substr(0, difference.index[0] - 1) +
          oldValue.substr(difference.index[0] + 1);
        return convertToThousands(formattedValue);
      }
    } else if (
      key === "Delete" ||
      key === "Ctrl Delete" ||
      key === "Cut" ||
      key === "Ctrl Cut"
    ) {
      if (validOldValue) {
        const formattedValue =
          oldValue.substr(0, difference.index[0]) +
          oldValue.substr(difference.index[0] + 2);
        return convertToThousands(formattedValue);
      } else {
        const formattedValue =
          oldValue.substr(0, difference.index[0]) +
          oldValue.substr(difference.index[0] + 1);
        return formattedValue;
      }
    } else {
      return value;
    }
  } else if (valid) {
    if ((value + "").slice(-2) === ",0") return value;
    else if ((value + "").slice(-1) === ",") return value;
    else return convertToThousands(value);
  } else {
    if (value === ",") return "0,";
    else return value;
  }
}
export function formatValueAndSetCursor(
  value,
  oldValue,
  cursor,
  key,
  type,
  digitsSeparator
) {
  if (type === "number") {
    const formattedValue = formatNumberInput(value, oldValue, key);
    const dotDifference = oldValue
      ? countNumberSeparators(formattedValue.substr(0, cursor)) -
        countNumberSeparators(oldValue.substr(0, cursor))
      : 0;
    const newCursor =
      formattedValue.trim().length === 0 || formattedValue === "0"
        ? 1
        : cursor + dotDifference;
    return { value: formattedValue, cursor: newCursor };
  } else if (type === "date") {
    const formattedValue = formatDateInput(value, digitsSeparator);
    return { value: formattedValue, cursor: cursor };
  } else if (type === "time") {
    const formattedValue = formatTimeInput(value, digitsSeparator);
    return { value: formattedValue, cursor: cursor };
  } else {
    return { value: value, cursor: cursor };
  }
}
export function keyDownController(event) {
  const value = event.target.value;
  const cursorStart = event.target.selectionStart;
  const cursorEnd = event.target.selectionEnd;
  const key = event.key;
  var cursor = cursorStart;
  var newValue = value;
  if (event.ctrlKey) {
    if ((key === "x" || key === "X") && cursorStart !== cursorEnd) {
      newValue = value.substr(0, cursorStart) + value.substr(cursorEnd);
    } else if (key === "Delete") {
      const indexOfSpace = value.substr(cursorStart).indexOf(" ");
      newValue =
        indexOfSpace === -1
          ? value.substr(0, cursorStart)
          : value.substr(0, cursorStart) +
            value.substr(indexOfSpace + cursorStart + 1);
      cursor = indexOfSpace === -1 ? newValue.length : cursorStart;
    } else if (key === "Backspace") {
      const indexOfSpace = value.substr(0, cursorStart).lastIndexOf(" ");
      newValue =
        indexOfSpace === -1
          ? value.substr(cursorStart)
          : value.substr(0, indexOfSpace) + value.substr(cursorStart + 1);
      cursor = indexOfSpace === -1 ? 0 : cursorStart;
    }
  } else if (key === " ") {
    newValue =
      value.substr(0, cursorStart) + " " + value.substr(cursorEnd) === " "
        ? ""
        : value.substr(0, cursorStart) + " " + value.substr(cursorEnd);
    cursor = cursorStart + 1;
  } else if (key === "Backspace") {
    newValue =
      cursorStart === cursorEnd
        ? value.substr(0, cursorStart - 1) + value.substr(cursorEnd)
        : value.substr(0, cursorStart) + value.substr(cursorEnd);
    cursor = cursorStart === cursorEnd ? cursorStart - 1 : cursorStart;
  } else if (key === "Delete") {
    newValue =
      cursorStart === cursorEnd
        ? value.substr(0, cursorStart) + value.substr(cursorEnd + 1)
        : value.substr(0, cursorStart) + value.substr(cursorEnd);
    cursor = cursorStart <= 0 ? 0 : cursorStart;
  } else if (key.length === 1) {
    newValue = value.substr(0, cursorStart) + key + value.substr(cursorEnd);
    cursor = cursorStart + 1;
  }

  if (
    key === "Delete" ||
    key === "Backspace" ||
    key === "Space" ||
    (!event.ctrlKey && key.length === 1)
  ) {
    return { value: newValue, cursor: cursor };
  }
}
export function keyPasteController(event) {
  const value = event.target.value;
  const cursorStart = event.target.selectionStart;
  const cursorEnd = event.target.selectionEnd;
  const text = event.clipboardData ? event.clipboardData.getData("Text") : "";
  const newValue =
    value.substr(0, cursorStart) + text + value.substr(cursorEnd);
  return { value: newValue, cursor: cursorStart };
}
export function keyPreventDefault(event) {
  if (!event.ctrlKey && event.key.length === 1) {
    event.preventDefault();
  }
}
