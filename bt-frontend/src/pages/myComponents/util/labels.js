import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import ContactAvatar from "../../../components/ContactAvatar";
import RolesBadges from "../../../components/RolesBadges";
import StatusBadges from "../../../components/StatusBadges";
import VerifiedButton from "../../../components/VerifiedButton";
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
    const t1 = moment(arr[1], "HH:mm", true);
    const t2 = moment(arr[2], "HH:mm", true);
    const diff = t1.isValid() && t2.isValid() && t2.diff(t1, "minutes");
    const hours = (diff && parseInt(diff / 60)) || 0;
    const minutes = (diff && diff % 60) || 0;
    return hours + ":" + minutes;
  } catch (error) {
    return "";
  }
};

const dateApproved = ({ dateFrom, dateTo, verified }) => {
  const from = moment(dateFrom, "YYYY.MM.DD");
  const to = moment(dateTo, "YYYY.MM.DD");
  const now = moment();
  return from.isBefore(now) && to.isAfter(now) ? "bg-quinary" : "";
};
const toDateFormat = (date) =>
  moment(date, "YYYY.MM.DD", true).isValid()
    ? moment(date, "YYYY.MM.DD").format("DD.MM.YYYY")
    : date;
const dateToMonth = (date) =>
  moment(date, "YYYY.MM", true).isValid()
    ? moment(date, "YYYY.MM").format("MMMM")
    : date;

const dateToDay = (arr) => {
  return moment(arr[1], "YYYY.MM.DD", true).isValid()
    ? moment(arr[1], "YYYY.MM.DD").format("dddd")
    : arr[1];
};
const calcDistance = (arr) => {
  return arr[2] - arr[1];
};
const userPostMapper = ({ entityId, ...rest }) => {
  const { url, options } = defaultPostMapper({ entityId, ...rest });
  const data = JSON.parse(options.body);
  const body = data.map((user) => ({
    ...user,
    uid: user?.id,
    disabled: user.disabled === "0",
    photoUrl: user.photoUrl[0],
    claims: {
      vehicle: user?.vehicle,
      workPlant: user?.workPlant,
      vacationDays: user?.vacationDays,
    },
  }));
  return { url, options: { ...options, body: JSON.stringify(body) } };
};

const defaultPostMapper = ({
  entityId,
  state,
  tablesSelector,
  labelsSelector,
  changesSelector,
  metaSelector,
}) => {
  const { changes, addRow, postInitialValues, rows } =
    tablesSelector.selectById(state, entityId);
  const c = changesSelector
    .selectAll(state)
    .reduce((a, b) => ({ ...a, [b.id]: { ...rows[b.id], ...b } }), {});

  const body = changes.map((bodyE) => {
    const rest = Object.keys(c[bodyE]);
    const startingValue =
      bodyE === Object.keys(addRow)[0]
        ? postInitialValues
        : { id: bodyE, ...postInitialValues };
    const r = rest
      .filter((e) => e !== "id")
      .reduce(
        (a, b) => {
          const label = labelsSelector.selectById(state, b).idx;

          const value = (c[bodyE][b] + "").trim() === "" ? null : c[bodyE][b];
          if (label === "driver") {
            const { drivers } = metaSelector.selectById(state, "drivers");
            const v = drivers.find(
              (a) => a.name === value || a.email === value
            );
            return { ...a, [label]: v.uid };
          }
          return { ...a, [label]: value };
        },
        { ...startingValue }
      );
    return r;
  });
  return {
    url: getGridUrl(entityId),
    options: { method: "PUT", body: JSON.stringify(body) },
  };
};

const settingsPostMapper = ({
  entityId,
  state,
  tablesSelector,
  labelsSelector,
  changesSelector,
}) => {
  const {
    rows,
    changes: changesIds,
    labels,
    addRow,
  } = tablesSelector.selectById(state, entityId);
  const label = labels[0];
  const { idx } = labelsSelector.selectById(state, label);
  const rowsIds = Object.keys({ ...rows, ...addRow });
  const newRows = rowsIds
    .map((id) => {
      const c = changesIds.includes(id)
        ? changesSelector.selectById(state, id)
        : {};
      return { ...(rows[id] || addRow[id]), ...c };
    })
    .filter((r) => r[label].trim() !== "");
  const body = {
    id: idx,
    value: JSON.stringify([
      ...new Set(
        newRows.map((a) => a[label]).sort((a, b) => a.localeCompare(b))
      ),
    ]),
  };
  const url = getGridUrl(entityId);

  return { url, options: { method: "PUT", body: JSON.stringify(body) } };
};
const settingsDeleteMapper = ({
  entityId,
  state,
  tablesSelector,
  labelsSelector,
}) => {
  const { selectedRows, rows, labels } = tablesSelector.selectById(
    state,
    entityId
  );
  const label = labels[0];
  const { idx } = labelsSelector.selectById(state, label);
  const rowsIds = Object.keys(rows).filter((id) => !selectedRows.includes(id));
  const newRows = rowsIds.map((id) => {
    return { ...rows[id] };
  });
  const body = {
    id: idx,
    value: JSON.stringify([...new Set(newRows.map((a) => a[label]))]),
  };
  const url = getGridUrl(entityId);

  return {
    url: url,
    options: { method: "PUT", body: JSON.stringify(body) },
  };
};
const defaultDeleteMapper = ({ entityId, state, tablesSelector }) => {
  const { selectedRows } = tablesSelector.selectById(state, entityId);
  const url = getGridUrl(entityId);
  const finalUrl = url + "/" + selectedRows.join(",");
  return {
    url: finalUrl,
    options: { method: "DELETE" },
  };
};
export const getGridPostMapper = (props) => {
  const fn = gridLabels[props.entityId].postMapper || defaultPostMapper;
  return fn(props);
};
export const getGridDeleteMapper = (props) => {
  const fn = gridLabels[props.entityId].deleteMapper || defaultDeleteMapper;
  return fn(props);
};
export const getGridTableConnections = (entityId) =>
  gridLabels[entityId].connections;
export const getGridRowClassName = (entityId, row) =>
  (gridLabels[entityId].rowClassName &&
    gridLabels[entityId].rowClassName(row)) ||
  "active";
export const getGridTitle = (entityId) => gridLabels[entityId].title;

export const getGridDateFilter = (entityId, date) =>
  gridLabels[entityId].dateFilter(date);
export const getGridUrl = (entityId) => gridLabels[entityId].url;
export const getGridMeta = (entityId) => gridLabels[entityId].meta || {};
export const getGridWidgets = (entityId) => gridLabels[entityId].widgets;
export const getGridPrimaryLabels = (entityId) =>
  gridLabels[entityId].primaryLabels || [];
export const getGridSecondaryLabels = (entityId) =>
  gridLabels[entityId].secondaryLabels || [];
export const getGridTertiaryLabels = (entityId) =>
  gridLabels[entityId].tertiaryLabels || [];
export const getGridLabelFormat = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].format;
export const getGridLabelFn = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].fn;
export const getGridLabelType = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].type;
export const getGridLabelUserType = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].userType;
export const getGridLabelDefaultValue = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].defaultValue;
export const getGridLabelIsNotRequired = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].notRequired;
export const getGridLabelLinks = (entityId, labelIdx) =>
  getGridLabels(entityId)[labelIdx].connections?.map((c) => ({
    connection: c,
    dependencies: getGridLabels(entityId)[c].dependencies,
  }));
export const getGridLabelProps = (entityId, labelIdx) => {
  const { format, fn, id, connections, nanoid, ...rest } =
    getGridLabels(entityId)[labelIdx];
  return { idx: id, ...rest };
};
export const getGridLabels = (entityId) => gridLabels[entityId].labels || [];
export const getLabel = (id) => gridLabels[id];
export const getCustomComponent = (props) => {
  return props.Header === "verified" ? (
    <VerifiedButton {...props} />
  ) : props.Header === "Roles" ? (
    <RolesBadges {...props} />
  ) : props.Header === "Status" ? (
    <StatusBadges {...props} />
  ) : props.Header === "photoUrl" ? (
    <ContactAvatar {...props} />
  ) : (
    <div>error</div>
  );
};

const gridLabels = {
  settingsVehicle: {
    url: API + "settings",
    widgets: {
      filter: false,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: false,
      sort: false,
      pagination: PAGINATION.NONE,
      counter: false,
      // pageSize: 25,
      edit: true,
    },
    title: "Vehicle",
    primaryLabels: ["vehicle"],
    secondaryLabels: [],
    postMapper: settingsPostMapper,
    deleteMapper: settingsDeleteMapper,
    labels: {
      vehicle: {
        nanoid: nanoid(),
        id: "vehicle",
        text: "Vehicles",
        type: "text",
        minWidth: "50px",
        maxWidth: "80px",
      },
    },
  },
  settingsDischargeType: {
    url: API + "settings",
    widgets: {
      filter: false,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: false,
      sort: false,
      pagination: PAGINATION.NONE,
      counter: false,
      edit: true,
    },
    title: "Discharge Type",
    primaryLabels: ["dischargeType"],
    secondaryLabels: [],
    postMapper: settingsPostMapper,
    deleteMapper: settingsDeleteMapper,
    labels: {
      dischargeType: {
        nanoid: nanoid(),
        id: "dischargeType",
        text: "Discharge Types",
        type: "dischargeType",
        maxWidth: "150px",
        minWidth: "50px",
      },
    },
  },
  settingsWorkPlant: {
    url: API + "settings",
    widgets: {
      filter: false,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: false,
      sort: false,
      pagination: PAGINATION.NONE,
      counter: false,
      edit: true,
    },
    postMapper: settingsPostMapper,
    deleteMapper: settingsDeleteMapper,
    title: "Work Plants",
    primaryLabels: ["workPlant"],
    secondaryLabels: [],
    labels: {
      workPlant: {
        nanoid: nanoid(),
        id: "workPlant",
        text: "Work Plant",
        type: "text",
        minWidth: "50px",
        maxWidth: "200px",
      },
    },
  },
  publicHolidays: {
    url: API + "public-holidays",
    meta: ["date"],
    widgets: {
      filter: true,
      add: true,
      remove: true,
      delete: true,
      massEdit: false,
      download: true,
      sort: true,
      pagination: PAGINATION.NONE,
      counter: true,
      edit: true,
    },
    title: "Public Holidays",
    primaryLabels: ["date", "name"],
    secondaryLabels: [],
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
      name: {
        nanoid: nanoid(),
        id: "name",
        text: "Name",
        type: "bigText",
        maxWidth: "150px",
      },
    },
  },
  users: {
    url: API + "users",
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
      pageSize: 10,
      edit: true,
    },
    title: "Users",
    postMapper: userPostMapper,
    primaryLabels: [
      "email",
      "name",
      "roles",
      "workPlant",
      "vehicle",
      "password",
      "disabled",
      "vacationDays",
    ],
    tertiaryLabels: ["photoUrl"],
    labels: {
      photoUrl: {
        nanoid: nanoid(),
        id: "photoUrl",
        text: "photoUrl",
        maxWidth: "150px",
        type: "customComponent",
        fn: (arr) => {
          return arr;
        },
        dependencies: ["name", "email"],
      },
      email: {
        nanoid: nanoid(),
        id: "email",
        text: "Email",
        type: "email",
        maxWidth: "230px",
        connections: ["photoUrl"],
      },
      name: {
        nanoid: nanoid(),
        id: "name",
        text: "Name",
        type: "bigText",
        maxWidth: "150px",
        connections: ["photoUrl"],
      },
      roles: {
        nanoid: nanoid(),
        id: "roles",
        text: "Roles",
        maxWidth: "150px",
        type: "customComponent",
      },

      disabled: {
        nanoid: nanoid(),
        id: "disabled",
        text: "Status",
        maxWidth: "80px",
        type: "customComponent",
        format: (v) => {
          return String(v).toLowerCase() === "false" ? "1" : "0";
        },
      },

      vehicle: {
        nanoid: nanoid(),
        id: "vehicle",
        text: "Vehicle",
        type: "constant",
        // maxWidth: "80px",
        minWidth: "50px",
        maxWidth: "100px",
      },
      workPlant: {
        nanoid: nanoid(),
        id: "workPlant",
        text: "Work Plant",
        type: "constant",
        maxWidth: "180px",
      },
      vacationDays: {
        nanoid: nanoid(),
        id: "vacationDays",
        text: "vacationDays",
        type: "number",
        maxWidth: "50px",
      },
      password: {
        nanoid: nanoid(),
        id: "password",
        text: "Password",
        type: "bigText",
        maxWidth: "150px",
        hidden: true,
      },
    },
  },
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
      "driver",
      "vehicle",
      "workPlant",
      "deliveryNr",
      "buildingSite",
      "cbm",
      "arrival",
      "departure",
      "kmArrival",
      "kmDeparture",
      "dischargeBegin",
      "dischargeEnd",
      "dischargeType",
      "waitTime",
      "other",
    ],
    secondaryLabels: ["distance"],
    labels: {
      date: {
        nanoid: nanoid(),
        id: "date",
        text: "Date",
        type: "date",
        filterType: "date",
        format: toDateFormat,
        maxWidth: "100px",
        userType: "disabled",
      },

      driver: {
        nanoid: nanoid(),
        id: "driver",
        text: "Driver",
        type: "constant",
        filterType: "checkbox",
        maxWidth: "200px",
        userType: "disabled",
      },
      vehicle: {
        nanoid: nanoid(),
        id: "vehicle",
        text: "Vehicle",
        type: "constant",
        filterType: "checkbox",
        minWidth: "100px",
        maxWidth: "150px",
        userType: "modal",
      },
      workPlant: {
        nanoid: nanoid(),
        id: "workPlant",
        text: "Work Plant",
        type: "constant",
        filterType: "checkbox",
        maxWidth: "270px",
        userType: "modal",
      },
      deliveryNr: {
        nanoid: nanoid(),
        id: "deliveryNr",
        text: "Delivery Nr",
        type: "bigText",
        maxWidth: "150px",
        userType: "input-number",
        defaultValue: "550",
      },
      buildingSite: {
        nanoid: nanoid(),
        id: "buildingSite",
        text: "Address",
        type: "navi",
        filterType: "checkbox",
        maxWidth: "250px",
        userType: "navi",
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
        userType: "input-number",
      },
      arrival: {
        nanoid: nanoid(),
        id: "arrival",
        text: "Arrival",
        type: "time",
        filterType: "time",
        maxWidth: "100px",
        userType: "time",
      },
      departure: {
        nanoid: nanoid(),
        id: "departure",
        text: "Departure",
        type: "time",
        filterType: "time",
        maxWidth: "100px",
        userType: "time",
      },
      kmArrival: {
        nanoid: nanoid(),
        id: "kmArrival",
        text: "Km at Arrival",
        type: "bigNumber",
        maxWidth: "150px",
        connections: ["distance"],
        userType: "input-number",
      },
      kmDeparture: {
        nanoid: nanoid(),
        id: "kmDeparture",
        text: "Km at Departure",
        type: "bigNumber",
        maxWidth: "150px",
        connections: ["distance"],
        userType: "input-number",
      },
      distance: {
        nanoid: nanoid(),
        id: "distance",
        text: "Distance",
        type: "nonEditable",
        maxWidth: "80px",
        minWidth: "50px",
        dependencies: ["kmArrival", "kmDeparture"],
        fn: calcDistance,
      },
      dischargeBegin: {
        nanoid: nanoid(),
        id: "dischargeBegin",
        text: "Discharge Begin",
        type: "time",
        filterType: "time",
        maxWidth: "130px",
        userType: "time",
      },
      dischargeEnd: {
        nanoid: nanoid(),
        id: "dischargeEnd",
        text: "Discharge End",
        type: "time",
        filterType: "time",
        maxWidth: "130px",
        userType: "time",
      },
      dischargeType: {
        nanoid: nanoid(),
        id: "dischargeType",
        text: "Discharge Type",
        type: "constant",
        filterType: "checkbox",
        maxWidth: "160px",
        userType: "modal",
      },
      waitTime: {
        nanoid: nanoid(),
        id: "waitTime",
        text: "Wait Time",
        type: "number",
        maxWidth: "130px",
        userType: "input-number",
      },
      other: {
        nanoid: nanoid(),
        id: "other",
        text: "Other",
        type: "bigText",
        maxWidth: "250px",
        userType: "textarea",
        notRequired: true,
      },
    },
  },
  workHours: {
    connections: {
      onUpdate: ["workHoursBank"],
      onDateChange: ["workHoursBank", "vacationsOverview"],
    },
    url: API + "work-hours",
    dateFilter: (date) => ({ date: { eq: [moment(date).format("YYYY.MM")] } }),
    meta: ["date", "user"],
    dateType: "YYYY.MM",
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
        minWidth: "100px",
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
        minWidth: "100px",
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
        minWidth: "100px",
      },
      end: {
        nanoid: nanoid(),
        id: "end",
        text: "End",
        type: "time",
        connections: ["duration"],
        filterType: "time",
        maxWidth: "100px",
        minWidth: "100px",
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
        minWidth: "100px",
      },
      pause: {
        nanoid: nanoid(),
        id: "pause",
        text: "Pause",
        type: "time",
        max: "180",
        filterType: "time",
        maxWidth: "100px",
        minWidth: "100px",
      },
    },
  },
  workHoursBank: {
    url: API + "work-hours-bank",
    dateFilter: (date) => ({ date: { eq: [moment(date).format("YYYY")] } }),
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
        minWidth: "100px",
      },

      hours: {
        nanoid: nanoid(),
        id: "hours",
        text: "Hours",
        type: "number",
        measurement: "h",
        maxWidth: "100px",
        minWidth: "100px",
      },
    },
  },
  absent: {
    connections: {
      onUpdate: ["vacationsOverview"],
    },
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
    primaryLabels: ["dateFrom", "dateTo", "reason", "days"],
    // secondaryLabels: ["days"],
    labels: {
      dateFrom: {
        nanoid: nanoid(),
        id: "dateFrom",
        text: "from",
        type: "date",
        format: toDateFormat,
        // connections: ["days"],
        maxWidth: "100px",
        minWidth: "100px",
      },
      dateTo: {
        nanoid: nanoid(),
        id: "dateTo",
        text: "to",
        type: "date",
        format: toDateFormat,
        // connections: ["days"],
        maxWidth: "100px",
        minWidth: "100px",
      },
      days: {
        nanoid: nanoid(),
        id: "days",
        text: "Days",
        type: "nonEditable",
        maxWidth: "80px",
        minWidth: "80px",
        // dependencies: ["dateFrom", "dateTo"],
        // fn: calcDaysDifference,
      },
      reason: {
        nanoid: nanoid(),
        id: "reason",
        text: "Reason",
        type: "bigText",
        maxWidth: "100px",
        minWidth: "100px",
      },
    },
  },
  vacationsOverview: {
    url: API + "absent-days/vacations/rest",
    dateFilter: (date) => ({ date: { eq: [moment(date).format("YYYY")] } }),
    dateType: "YYYY",
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
        minWidth: "100px",
      },
      rest: {
        nanoid: nanoid(),
        id: "rest",
        text: "Rest",
        type: "number",
        maxWidth: "100px",
        minWidth: "100px",
      },
    },
  },
  vacations: {
    connections: {
      onUpdate: ["vacationsOverview"],
    },
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
    primaryLabels: ["dateFrom", "dateTo", "days", "verified"],
    // secondaryLabels: ["days"],
    // tertiaryLabels: ["verified"],
    labels: {
      dateFrom: {
        nanoid: nanoid(),
        id: "dateFrom",
        text: "from",
        type: "date",
        format: toDateFormat,
        // connections: ["verified"],
        maxWidth: "100px",
        minWidth: "100px",
      },
      dateTo: {
        nanoid: nanoid(),
        id: "dateTo",
        text: "to",
        type: "date",
        format: toDateFormat,
        // connections: ["verified"],
        maxWidth: "100px",
        minWidth: "100px",
      },
      days: {
        nanoid: nanoid(),
        id: "days",
        text: "Days",
        type: "nonEditable",
        maxWidth: "80px",
        minWidth: "80px",
        // dependencies: ["dateFrom", "dateTo"],
        // fn: calcDaysDifference,
      },

      verified: {
        nanoid: nanoid(),
        id: "verified",
        text: "verified",
        type: "customComponent",
        maxWidth: "100px",
        minWidth: "100px",
        // dependencies: ["dateFrom", "dateTo"],
        format: (v) => v + "",
      },
    },
  },
  workHoursByDate: {
    url: API + "work-hours-bank/by-date-driver",
    widgets: {
      filter: false,
      add: false,
      download: true,
      remove: false,
      massEdit: true,
      pagination: true,
      counter: true,
      pageSize: 20,
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
        maxWidth: "200px",
      },
      hours: {
        nanoid: nanoid(),
        id: "hours",
        text: "Hours",
        type: "nonEditable",
        maxWidth: "50px",
        minWidth: "50px",
      },
    },
  },
  pendingVacations: {
    url: API + "absent-days",
    connections: {
      onUpdate: ["upcomingAbsent"],
    },
    widgets: {
      filter: false,
      add: true,
      download: false,
      remove: true,
      massEdit: false,
      pagination: PAGINATION.SERVER,
      counter: true,
      pageSize: 3,
      sort: true,
      edit: true,
    },
    // rowClassName: dateApproved,
    title: "Pending Vacations",
    primaryLabels: ["driver", "dateFrom", "dateTo", "verified"],

    labels: {
      driver: {
        nanoid: nanoid(),
        id: "driver",
        text: "Driver",
        type: "constant",
        maxWidth: "200px",
      },
      dateFrom: {
        nanoid: nanoid(),
        id: "dateFrom",
        text: "From",
        type: "date",
        maxWidth: "90px",
        minWidth: "90px",
        format: toDateFormat,
      },
      dateTo: {
        nanoid: nanoid(),
        id: "dateTo",
        text: "To",
        type: "date",
        maxWidth: "90px",
        minWidth: "90px",
        format: toDateFormat,
      },
      verified: {
        nanoid: nanoid(),
        id: "verified",
        text: "verified",
        type: "customComponent",
        maxWidth: "100px",
        minWidth: "100px",
      },
    },
  },
  upcomingAbsent: {
    url: API + "absent-days",
    widgets: {
      filter: false,
      add: true,
      download: false,
      remove: true,
      massEdit: false,
      pagination: PAGINATION.SERVER,
      counter: true,
      pageSize: 3,
      sort: true,
      edit: true,
    },
    rowClassName: dateApproved,
    title: "Upcoming Absents",
    primaryLabels: ["dateFrom", "dateTo", "driver", "reason"],
    secondaryLabels: [],

    labels: {
      driver: {
        nanoid: nanoid(),
        id: "driver",
        text: "Driver",
        type: "constant",
        maxWidth: "200px",
      },
      dateFrom: {
        nanoid: nanoid(),
        id: "dateFrom",
        text: "From",
        type: "date",
        maxWidth: "90px",
        minWidth: "90px",
        format: toDateFormat,
      },
      dateTo: {
        nanoid: nanoid(),
        id: "dateTo",
        text: "To",
        type: "date",
        maxWidth: "90px",
        minWidth: "90px",
        format: toDateFormat,
      },
      reason: {
        nanoid: nanoid(),
        id: "reason",
        text: "reason",
        type: "text",
        maxWidth: "90px",
        minWidth: "90px",
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
