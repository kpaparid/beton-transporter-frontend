import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import { PAGINATION } from "./types";
const API = process.env.REACT_APP_API_URL;

export const durationFormat = (duration = "0:0") => {
  const split = duration.split(":");
  const hours = parseInt(split[0]);
  const minutes = parseInt(split[1]);
  return (
    (hours !== 0 && !isNaN(hours) ? hours + "h" : "") +
    (!isNaN(hours) && !isNaN(minutes) && hours !== 0 && minutes !== 0
      ? " "
      : "") +
    (!isNaN(minutes) && minutes !== 0 ? minutes + "min" : "")
  );
};
export const calcDurationAndFormat = (arr) => {
  try {
    const t1 = moment(arr[0], "HH:mm", true);
    const t2 = moment(arr[1], "HH:mm", true);
    const diff = t1.isValid() && t2.isValid() && t2.diff(t1, "minutes");
    const hours = (diff && parseInt(diff / 60)) || 0;
    const minutes = (diff && diff % 60) || 0;
    return hours + ":" + minutes;
  } catch (error) {
    return "";
  }
};

const toDateFormat = (date) =>
  moment(date, "YYYY.MM.DD", true).isValid()
    ? moment(date, "YYYY.MM.DD").format("DD.MM.YYYY")
    : date;
const dateToMonth = (date) =>
  moment(date, "YYYY.MM", true).isValid()
    ? moment(date, "YYYY.MM").format("MMMM")
    : date;

const dateToDay = (date) => {
  return moment(date[0], "YYYY.MM.DD", true).isValid()
    ? moment(date[0], "YYYY.MM.DD").format("dddd")
    : date[0];
};
const calcDaysDifference = (arr) => {
  const t1 = moment(arr[0], "YYYY.MM.DD", true);
  const t2 = moment(arr[1], "YYYY.MM.DD", true);
  return t1.isValid() && t2.isValid() ? t2.diff(t1, "days") + 1 : "";
};
export const getGridTableConnections = (entityId) =>
  gridLabels[entityId].connections;
export const getGridTitle = (entityId) => gridLabels[entityId].title;
export const getGridUrl = (entityId) => gridLabels[entityId].url;
export const getGridMeta = (entityId) => gridLabels[entityId].meta || {};
export const getGridWidgets = (entityId) => gridLabels[entityId].widgets;
export const getGridPrimaryLabels = (entityId) =>
  gridLabels[entityId].primaryLabels || [];
export const getGridSecondaryLabels = (entityId) =>
  gridLabels[entityId].secondaryLabels || [];
export const getGridLabelFormat = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].format;
export const getGridLabelFn = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].fn;
export const getGridLabelLinks = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].connections &&
  getGridLabels(entityId)[labelIdx].connections.map((c) => ({
    connection: c,
    dependencies: getGridLabels(entityId)[c].dependencies,
  }));
export const getGridLabelProps = (entityId, labelIdx) => {
  const { format, fn, id, connections, nanoid, ...rest } =
    getGridLabels(entityId)[labelIdx];
  return { idx: id, ...rest };
};
export const getGridLabels = (entityId) => {
  return gridLabels[entityId].labels || [];
};
export function getLabel(id) {
  return gridLabels[id];
}

const gridLabels = {
  tours: {
    url: API + "tours",
    meta: ["date", "user"],
    widgets: {
      filter: true,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: true,
      sort: true,
      pagination: PAGINATION.SERVER,
      counter: true,
      pageSize: 20,
      edit: true,
    },
    title: "Tours",
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
    labels: {
      date: {
        nanoid: nanoid(),
        id: "date",
        text: "Date",
        type: "date",
        filterType: "date",
        format: toDateFormat,
        maxWidth: "100px",
      },
      vehicle: {
        nanoid: nanoid(),
        id: "vehicle",
        text: "Vehicle",
        type: "constant",
        filterType: "checkbox",
        maxWidth: "80px",
      },
      workPlant: {
        nanoid: nanoid(),
        id: "workPlant",
        text: "Work Plant",
        type: "constant",
        filterType: "checkbox",
        maxWidth: "200px",
      },
      cbm: {
        nanoid: nanoid(),
        id: "cbm",
        text: "Cbm",
        type: "number",
        filterType: "range",
        min: 0,
        max: 30,
        measurement: "m³",
        maxWidth: "60px",
      },
      departure: {
        nanoid: nanoid(),
        id: "departure",
        text: "Departure",
        type: "time",
        filterType: "time",
        maxWidth: "100px",
      },
      arrival: {
        nanoid: nanoid(),
        id: "arrival",
        text: "Arrival",
        type: "time",
        filterType: "time",
        maxWidth: "100px",
      },
      kmDeparture: {
        nanoid: nanoid(),
        id: "kmDeparture",
        text: "Km at Departure",
        type: "bigNumber",
        maxWidth: "150px",
      },
      kmArrival: {
        nanoid: nanoid(),
        id: "kmArrival",
        text: "Km at Arrival",
        type: "bigNumber",
        maxWidth: "150px",
      },
      deliveryNr: {
        nanoid: nanoid(),
        id: "deliveryNr",
        text: "Delivery Nr",
        type: "bigText",
        maxWidth: "150px",
      },
      driver: {
        nanoid: nanoid(),
        id: "driver",
        text: "Driver",
        type: "constant",
        filterType: "checkbox",
        maxWidth: "200px",
      },
      buildingSite: {
        nanoid: nanoid(),
        id: "buildingSite",
        text: "Building Site",
        type: "bigText",
        filterType: "checkbox",
        maxWidth: "250px",
      },
      dischargeBegin: {
        nanoid: nanoid(),
        id: "dischargeBegin",
        text: "Discharge Begin",
        type: "time",
        filterType: "time",
        maxWidth: "130px",
      },
      dischargeEnd: {
        nanoid: nanoid(),
        id: "dischargeEnd",
        text: "Discharge End",
        type: "time",
        filterType: "time",
        maxWidth: "130px",
      },
      dischargeType: {
        nanoid: nanoid(),
        id: "dischargeType",
        text: "Discharge Type",
        type: "constant",
        filterType: "checkbox",
        maxWidth: "130px",
      },
      waitTime: {
        nanoid: nanoid(),
        id: "waitTime",
        text: "Time Waiting",
        type: "number",
        min: 0,
        max: 480,
        measurement: "min",
        filterType: "range",
        maxWidth: "100px",
      },
      other: {
        nanoid: nanoid(),
        id: "other",
        text: "Other",
        type: "bigText",
        maxWidth: "250px",
      },
    },
  },
  workHours: {
    connections: ["workHoursBank"],
    url: API + "work-hours",
    meta: ["date", "user"],
    widgets: {
      filter: true,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: true,
      pagination: PAGINATION.SERVER,
      counter: true,
      pageSize: 20,
      sort: true,
      edit: true,
    },
    title: "Workhours",
    primaryLabels: ["date", "begin", "end", "pause"],
    secondaryLabels: ["day", "duration"],
    labels: {
      date: {
        nanoid: nanoid(),
        id: "date",
        text: "Date",
        type: "date",
        filterType: "date",
        connections: ["day"],
        format: toDateFormat,
        maxWidth: "100px",
      },
      day: {
        nanoid: nanoid(),
        id: "day",
        text: "Day",
        type: "nonEditable",
        filterType: "checkbox",
        dependencies: ["date"],
        fn: dateToDay,
        maxWidth: "100px",
        ignoreSort: true,
      },

      begin: {
        nanoid: nanoid(),
        id: "begin",
        text: "Begin",
        type: "time",
        connections: ["duration"],
        filterType: "time",
        maxWidth: "100px",
      },
      end: {
        nanoid: nanoid(),
        id: "end",
        text: "End",
        type: "time",
        connections: ["duration"],
        filterType: "time",
        maxWidth: "100px",
      },
      duration: {
        nanoid: nanoid(),
        id: "duration",
        text: "Duration",
        type: "nonEditable",
        dependencies: ["begin", "end"],
        fn: calcDurationAndFormat,
        format: durationFormat,
        maxWidth: "100px",
      },
      pause: {
        nanoid: nanoid(),
        id: "pause",
        text: "Pause",
        type: "number",
        measurement: "min",
        max: "180",
        filterType: "range",
        maxWidth: "100px",
      },
    },
  },
  workHoursBank: {
    url: API + "work-hours-bank",
    widgets: {
      filter: false,
      add: false,
      remove: false,
      delete: false,
      massEdit: true,
      download: true,
      pagination: true,
      counter: false,
      pageSize: 6,
      sort: true,
      edit: false,
    },
    title: "Workhours Bank",
    primaryLabels: ["date", "hours"],
    secondaryLabels: [],
    editable: ["hours"],
    labels: {
      date: {
        nanoid: nanoid(),
        id: "date",
        text: "Month",
        type: "text",
        format: dateToMonth,
        maxWidth: "100px",
      },

      hours: {
        nanoid: nanoid(),
        id: "hours",
        text: "Hours",
        type: "number",
        measurement: "h",
        maxWidth: "100px",
      },
    },
  },
  absent: {
    connections: ["vacationsOverview", "vacations"],
    url: API + "absent-days",
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
      sort: true,
      edit: true,
    },
    title: "Absent",
    primaryLabels: ["dateFrom", "dateTo", "reason"],
    secondaryLabels: ["days"],
    labels: {
      dateFrom: {
        nanoid: nanoid(),
        id: "dateFrom",
        text: "from",
        type: "date",
        format: toDateFormat,
        connections: ["days"],
        maxWidth: "100px",
      },
      dateTo: {
        nanoid: nanoid(),
        id: "dateTo",
        text: "to",
        type: "date",
        format: toDateFormat,
        connections: ["days"],
        maxWidth: "100px",
      },
      days: {
        nanoid: nanoid(),
        id: "days",
        text: "Days",
        type: "nonEditable",
        maxWidth: "80px",
        minWidth: "50px",
        dependencies: ["dateFrom", "dateTo"],
        fn: calcDaysDifference,
      },
      reason: {
        nanoid: nanoid(),
        id: "reason",
        text: "Reason",
        type: "bigText",
        maxWidth: "100px",
      },
    },
  },
  vacationsOverview: {
    url: API + "absent-days/vacations/rest",
    widgets: {
      filter: false,
      add: false,
      download: true,
      remove: false,
      massEdit: true,
      pagination: false,
      counter: false,
      pageSize: 5,
      sort: false,
      edit: false,
    },
    title: "Vacations Overview",
    primaryLabels: ["taken", "rest"],
    labels: {
      taken: {
        nanoid: nanoid(),
        id: "taken",
        text: "Taken",
        type: "number",
        maxWidth: "100px",
      },
      rest: {
        nanoid: nanoid(),
        id: "rest",
        text: "Rest",
        type: "number",
        maxWidth: "100px",
      },
    },
  },
  vacations: {
    connections: ["vacationsOverview"],
    url: API + "absent-days",
    widgets: {
      filter: false,
      add: true,
      download: true,
      remove: true,
      massEdit: false,
      pagination: PAGINATION.INTERNAL,
      counter: true,
      pageSize: 5,
      sort: true,
      edit: true,
    },
    title: "Vacations",
    footer: ["Total", "", "SUM"],
    primaryLabels: ["dateFrom", "dateTo", "reason"],
    secondaryLabels: ["days"],
    labels: {
      dateFrom: {
        nanoid: nanoid(),
        id: "dateFrom",
        text: "from",
        type: "date",
        format: toDateFormat,
        connections: ["days"],
        maxWidth: "100px",
      },
      dateTo: {
        nanoid: nanoid(),
        id: "dateTo",
        text: "to",
        type: "date",
        format: toDateFormat,
        connections: ["days"],
        maxWidth: "100px",
      },
      days: {
        nanoid: nanoid(),
        id: "days",
        text: "Days",
        type: "nonEditable",
        maxWidth: "80px",
        minWidth: "50px",
        dependencies: ["dateFrom", "dateTo"],
        fn: calcDaysDifference,
      },
    },
  },
  workHoursByDate: {
    url: API + "workhours-byDate",
    widgets: {
      filter: false,
      add: false,
      download: true,
      remove: false,
      massEdit: true,
      pagination: true,
      counter: true,
      pageSize: 15,
      sort: true,
      edit: false,
    },
    title: "Total working time in ",
    primaryLabels: ["driver", "hours"],
    labels: {
      driver: {
        nanoid: nanoid(),
        id: "driver",
        text: "Driver",
        type: "nonEditable",
        maxWidth: "120px",
      },
      hours: {
        nanoid: nanoid(),
        id: "hours",
        text: "Hours",
        type: "nonEditable",
        maxWidth: "50px",
      },
    },
  },
  currentVacations: {
    url: API + "vacations-overview",
    widgets: {
      filter: false,
      add: false,
      download: false,
      remove: false,
      massEdit: true,
      pagination: PAGINATION.INTERNAL,
      counter: true,
      pageSize: 3,
      sort: true,
      edit: false,
    },
    title: "Current Vacations",
    primaryLabels: ["from", "to", "driver"],

    labels: {
      driver: {
        nanoid: nanoid(),
        id: "driver",
        text: "Driver",
        type: "text",
        maxWidth: "150px",
      },
      from: {
        nanoid: nanoid(),
        id: "from",
        text: "From",
        type: "date",
        format: toDateFormat,
        maxWidth: "80px",
      },
      to: {
        nanoid: nanoid(),
        id: "to",
        text: "To",
        type: "date",
        format: toDateFormat,
        maxWidth: "80px",
      },
    },
  },
};
export function maxWidthByType(textType) {
  return textType === "text"
    ? "100px"
    : textType === "number"
    ? "100px"
    : textType === "bigText"
    ? "200px"
    : textType === "bigNumber"
    ? "200px"
    : textType === "smallText"
    ? "75px"
    : textType === "smallNumber"
    ? "50px"
    : "50px";
}
