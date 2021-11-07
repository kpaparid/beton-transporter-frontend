import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";

const toDateFormat = (date) => moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
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
export const getGridPrimaryLabels = (entityId) =>
  gridLabels[entityId].primaryLabels || [];
export const getGridSecondaryLabels = (entityId) =>
  gridLabels[entityId].secondaryLabels || [];
export const getGridLabelFormat = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].format;
export const getGridLabelLinks = (entityId, labelIdx) =>
  (getGridLabels(entityId)[labelIdx].connections || []).map((c) => ({
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
      pageSize: 40,
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
        format: toDateFormat,
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
        type: "constant",
        filterType: "checkbox",
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
      },
      departure: {
        nanoid: nanoid(),
        id: "departure",
        text: "Departure",
        type: "time",
        filterType: "time",
      },
      arrival: {
        nanoid: nanoid(),
        id: "arrival",
        text: "Arrival",
        type: "time",
        filterType: "time",
      },
      kmDeparture: {
        nanoid: nanoid(),
        id: "kmDeparture",
        text: "Km at Departure",
        type: "bigNumber",
      },
      kmArrival: {
        nanoid: nanoid(),
        id: "kmArrival",
        text: "Km at Arrival",
        type: "bigNumber",
      },
      deliveryNr: {
        nanoid: nanoid(),
        id: "deliveryNr",
        text: "Delivery Nr",
        type: "bigText",
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
        type: "bigText",
        filterType: "checkbox",
      },
      dischargeBegin: {
        nanoid: nanoid(),
        id: "dischargeBegin",
        text: "Discharge Begin",
        type: "time",
        filterType: "time",
      },
      dischargeEnd: {
        nanoid: nanoid(),
        id: "dischargeEnd",
        text: "Discharge End",
        type: "time",
        filterType: "time",
      },
      dischargeType: {
        nanoid: nanoid(),
        id: "dischargeType",
        text: "Discharge Type",
        type: "constant",
        filterType: "checkbox",
      },
      waitTime: {
        nanoid: nanoid(),
        id: "waitTime",
        text: "Time Waiting",
        type: "number",
        min: 0,
        max: 480,
        measurement: "minutes",
        filterType: "range",
      },
      other: {
        nanoid: nanoid(),
        id: "other",
        text: "Other",
        type: "bigText",
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
        fn: dateToDay,
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
        fn: calcMinuteDifference,
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
