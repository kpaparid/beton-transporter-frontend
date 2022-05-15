import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import {
  getGridLabelLinks,
  getGridLabelProps,
  getGridLabels,
  getGridPrimaryLabels,
  getGridSecondaryLabels,
  getGridTertiaryLabels,
  getGridUrl,
  getGridWidgets,
} from "../pages/myComponents/util/labels";

export function useLoadData(tableName, actions, meta) {
  const [stateAPIStatus, setAPIStatus] = useState("loading");
  const dispatch = useDispatch();
  const { getHeader } = useAuth();

  useEffect(() => {
    console.log("loading");
    setAPIStatus("loading");
    getHeader()
      .then((header) => {
        switch (tableName) {
          case "messages":
            loadMessagesPage(actions, dispatch, header, meta)
              .then(() => setAPIStatus("success"))
              .catch((e) => {
                setAPIStatus("error");
              });
            break;
          case "workHoursTable":
            loadWorkHoursPage(actions, dispatch, header, meta)
              .then(() => setAPIStatus("success"))
              .catch((e) => {
                setAPIStatus("error");
              });
            break;
          case "toursTable":
            loadToursPage(actions, dispatch, header)
              .then(() => setAPIStatus("success"))
              .catch((e) => {
                setAPIStatus("error");
              });
            break;
          case "overviewTable":
            loadOverviewPage(actions, dispatch, header)
              .then(() => setAPIStatus("success"))
              .catch((e) => {
                setAPIStatus("error");
              });
            break;
          case "settingsTable":
            loadSettingsPage(actions, dispatch, header)
              .then(() => setAPIStatus("success"))
              .catch((e) => {
                setAPIStatus("error");
              });
            break;
          case "usersTable":
            loadUsersPage(actions, dispatch, header)
              .then(() => setAPIStatus("success"))
              .catch((e) => {
                setAPIStatus("error");
              });
            break;
          case "settings":
            loadSettings(actions, dispatch, header)
              .then(() => setAPIStatus("success"))
              .catch((e) => {
                setAPIStatus("error");
              });
            break;
          default:
            setAPIStatus("error");
        }
      })
      .catch((e) => setAPIStatus("error"));
  }, [dispatch, meta, tableName, actions, getHeader]);

  return stateAPIStatus;
}

export function loadMessagesPage({ fetchUsers }, dispatch, header) {
  return dispatch(fetchUsers(header));
}

export function loadOverviewPage(
  { fetchAndInitEntityGrid, fetchMeta, addMeta, fetchDrivers },
  dispatch,
  header
) {
  const API = process.env.REACT_APP_API_URL;
  const date = moment().format("YYYY.MM");
  const dateFilter = { date: { eq: [date] } };
  const requestOptions = {
    method: "GET",
    headers: header,
  };
  const cbmFetchers = [
    fetch(API + "tours/cbm?date=" + moment().format("YYYY.MM"), requestOptions),
    fetch(
      API +
        "tours/cbm?date=" +
        moment().subtract(1, "months").format("YYYY.MM"),
      requestOptions
    ),
    fetch(
      API +
        "tours/cbm?date=" +
        moment().subtract(2, "months").format("YYYY.MM"),
      requestOptions
    ),
    fetch(
      API + "tours/cbm-by-work-plant?date=" + moment().format("YYYY"),
      requestOptions
    ),
    fetch(
      API + "tours/cbm-year/?date=" + moment().format("YYYY"),
      requestOptions
    ),
  ];
  const pendingVacationsFilter = {
    reason: { eq: ["vacations"] },
    dateFrom: { gte: [moment().format("YYYY.MM.DD")] },
    // dateTo: { gte: [moment().format("YYYY.MM.DD")] },
    verified: { eq: [0] },
  };
  const upcomingAbsentFilter = {
    dateFrom: { gte: [moment().format("YYYY.MM.DD")] },
    verified: { eq: [1] },
  };
  const dispatchers = (meta) => [
    dispatch(
      fetchMeta({ header, labels: ["vehicle", "workPlant", "dischargeType"] })
    ),
    dispatch(
      fetchAndInitEntityGrid({
        entityId: "workHoursByDate",
        url: getGridUrl("workHoursByDate"),
        limit: getGridWidgets("workHoursByDate").pageSize,
        page: 0,
        initialFilters: dateFilter,
        initialSort: { id: "hours", order: "asc" },
        header,
        date: moment().toISOString(),
        ...meta,
      })
    ),
    dispatch(
      fetchAndInitEntityGrid({
        entityId: "pendingVacations",
        url: getGridUrl("pendingVacations"),
        limit: getGridWidgets("pendingVacations").pageSize,
        page: 0,
        initialSort: { id: "dateFrom", order: "asc" },
        initialFilters: pendingVacationsFilter,
        postInitialValues: { reason: "vacations" },
        header,
        ...meta,
      })
    ),
    dispatch(
      fetchAndInitEntityGrid({
        entityId: "upcomingAbsent",
        url: getGridUrl("upcomingAbsent"),
        limit: getGridWidgets("upcomingAbsent").pageSize,
        page: 0,
        initialSort: { id: "dateFrom", order: "asc" },
        initialFilters: upcomingAbsentFilter,
        postInitialValues: { verified: 1 },
        header,
        ...meta,
      })
    ),
  ];
  const names = [
    "currentMonth",
    "lastMonth",
    "twoMonthsAgo",
    "byWorkPlant",
    "year",
  ];
  function promiseFetchers(fetchers, names, id) {
    return Promise.all(fetchers)
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((jsonObjects) => {
        dispatch(
          addMeta([
            {
              id,
              ...jsonObjects
                .map((o, index) => ({
                  [names[index]]: o.data,
                }))
                .reduce((a, b) => ({ ...a, ...b }), {}),
            },
          ])
        );
      });
  }

  return dispatch(fetchDrivers(header)).then(({ payload }) => {
    return promiseFetchers(cbmFetchers, names, "cbm").then(() =>
      Promise.all(dispatchers({ drivers: payload }))
    );
  });
}

export function loadSettings({ fetchMeta, fetchDrivers }, dispatch, header) {
  return dispatch(
    fetchMeta({ header, labels: ["vehicle", "workPlant", "dischargeType"] })
  ).then(() => dispatch(fetchDrivers(header)));
}
export function loadSettingsPage(
  { fetchAndInitEntityGrid, clearTables, fetchMeta },
  dispatch,
  header
) {
  const date = moment().toISOString();
  const formattedDate = moment().format("YYYY.MM");
  const initialFilters = {
    date: { gte: formattedDate + ".01", lte: formattedDate + ".31" },
  };
  const postInitialValues = {
    countryCode: "DE",
  };

  dispatch(clearTables());
  return dispatch(
    fetchAndInitEntityGrid({
      entityId: "publicHolidays",
      url: getGridUrl("publicHolidays"),
      limit: getGridWidgets("publicHolidays").pageSize,
      initialFilters,
      initialSort: { id: "date", order: "desc" },
      header,
      postInitialValues,
      date,
    })
  ).then(() =>
    dispatch(
      fetchAndInitEntityGrid({
        entityId: "settingsVehicle",
        url: getGridUrl("settingsVehicle"),
        header,
        initialFilters: { id: { eq: ["vehicle"] } },
      })
    )
      .then(() =>
        dispatch(
          fetchAndInitEntityGrid({
            entityId: "settingsWorkPlant",
            url: getGridUrl("settingsWorkPlant"),
            header,
            initialFilters: { id: { eq: ["workPlant"] } },
          })
        )
      )
      .then(() =>
        dispatch(
          fetchAndInitEntityGrid({
            entityId: "settingsDischargeType",
            url: getGridUrl("settingsDischargeType"),
            header,
            initialFilters: { id: { eq: ["dischargeType"] } },
          })
        )
      )
  );
}
export function loadUsersPage(
  { fetchAndInitEntityGrid, clearTables, fetchMeta },
  dispatch,
  header
) {
  const date = moment().toISOString();
  dispatch(clearTables());
  return dispatch(
    fetchMeta({ header, labels: ["vehicle", "workPlant", "dischargeType"] })
  ).then(() =>
    dispatch(
      fetchAndInitEntityGrid({
        entityId: "users",
        url: getGridUrl("users"),
        page: 0,
        limit: getGridWidgets("users").pageSize,
        header,
        // hiddenColumns: ["password"],
        initialSort: { id: "name", order: "desc" },
        date,
      })
    )
  );
}
export function loadToursPage(
  { fetchAndInitEntityGrid, fetchMeta, clearTables, fetchDrivers },
  dispatch,
  header
) {
  const date = moment().toISOString();
  const formattedDate = moment().format("YYYY.MM");
  const initialFilters = {
    date: { gte: formattedDate + ".01", lte: formattedDate + ".31" },
  };
  dispatch(clearTables());
  return dispatch(
    fetchMeta({ header, labels: ["vehicle", "workPlant", "dischargeType"] })
  ).then(() =>
    dispatch(fetchDrivers(header)).then(({ payload }) => {
      return dispatch(
        fetchAndInitEntityGrid({
          entityId: "tours",
          url: getGridUrl("tours"),
          limit: getGridWidgets("tours").pageSize,
          page: 0,
          initialFilters,
          initialSort: { id: "date", order: "desc" },
          date,
          header,
          drivers: payload,
        })
      );
    })
  );
}
export function loadWorkHoursPage(
  { fetchMeta, fetchAndInitEntityGrid, addMeta, clearTables, fetchDrivers },
  dispatch,
  header,
  driver,
  date = moment()
) {
  dispatch(clearTables());
  return dispatch(
    fetchMeta({ header, labels: ["vehicle", "workPlant", "dischargeType"] })
  ).then(() =>
    dispatch(fetchDrivers(header)).then(({ payload }) => {
      payload.sort((a, b) =>
        (a.name || a.email).localeCompare(b.name || b.email)
      );
      const driverName = driver || payload[0]?.uid;
      const formattedDate = date.format("YYYY.MM");
      const driverFilter = { driver: { eq: [driverName] } };
      const workHoursFilter = {
        ...driverFilter,
        date: { gte: formattedDate + ".01", lte: formattedDate + ".31" },
      };
      const absentDaysFilter = {
        ...driverFilter,
        reason: { neq: ["vacations"] },
      };
      const vacationsFilter = {
        ...driverFilter,
        reason: { eq: ["vacations"] },
      };
      const workHoursBankFilter = {
        ...driverFilter,
        date: { eq: [date.format("YYYY")] },
      };
      const vacationsOverviewFilter = {
        ...driverFilter,
        date: { eq: [date.format("YYYY")] },
      };
      const postInitialValueWorkHours = { driver: driverName };
      const postInitialValueAbsentDays = {
        driver: driverName,
        reason: "vacations",
        verified: 1,
      };
      const postInitialValueVacations = {
        driver: driverName,
        reason: "vacations",
      };
      return dispatch(
        fetchAndInitEntityGrid({
          entityId: "workHours",
          url: getGridUrl("workHours"),
          limit: getGridWidgets("workHours").pageSize,
          page: 0,
          initialFilters: workHoursFilter,
          initialSort: { id: "date", order: "desc" },
          postInitialValues: postInitialValueWorkHours,
          header,
          date: moment().toISOString(),
        })
      )
        .then(() =>
          dispatch(
            fetchAndInitEntityGrid({
              entityId: "absent",
              url: getGridUrl("absent"),
              limit: getGridWidgets("absent").pageSize,
              page: 0,
              initialFilters: absentDaysFilter,
              initialSort: { id: "dateFrom", order: "desc" },
              header,
              postInitialValues: postInitialValueAbsentDays,
            })
          )
        )
        .then(() =>
          dispatch(
            fetchAndInitEntityGrid({
              entityId: "vacations",
              url: getGridUrl("vacations"),
              limit: getGridWidgets("vacations").pageSize,
              page: 0,
              initialFilters: vacationsFilter,
              initialSort: { id: "dateFrom", order: "desc" },
              header,
              postInitialValues: postInitialValueVacations,
            })
          )
        )
        .then(() =>
          dispatch(
            fetchAndInitEntityGrid({
              entityId: "vacationsOverview",
              url: getGridUrl("vacationsOverview"),
              limit: getGridWidgets("vacationsOverview").pageSize,
              page: 0,
              initialFilters: vacationsOverviewFilter,
              header,
            })
          )
        )

        .then(() =>
          dispatch(
            fetchAndInitEntityGrid({
              entityId: "workHoursBank",
              url: getGridUrl("workHoursBank"),
              limit: getGridWidgets("workHoursBank").pageSize,
              page: 0,
              initialFilters: workHoursBankFilter,
              initialSort: { id: "date", order: "asc" },
              header,
            })
          )
        )
        .then(() =>
          dispatch(
            addMeta([
              {
                id: "driver",
                value: payload?.find((d) => d.uid === driverName),
              },
            ])
          )
        );
    })
  );
}

export function normalizeInitApi({ data, meta, drivers }) {
  const mObject = getConnections(data, drivers);
  const tableIds = Object.keys(mObject);

  const nanoidLabelsTable = getNanoidLabelsTable(mObject);
  const addRow = tableIds.reduce(
    (a, tableId) => ({
      ...a,
      [tableId]: {
        id: nanoid(),
        ...Object.values(nanoidLabelsTable[tableId]).reduce(
          (a, b) => ({ ...a, [b]: "" }),
          {}
        ),
      },
    }),
    {}
  );
  const labelsByTableId = getLabelsByTableId(tableIds, nanoidLabelsTable);
  const labels = tableIds
    .map((r) => labelsByTableId[r])
    .reduce((a, b) => [...a, ...b], []);

  const rowsByTableId = mapRowsToNanoidLabels(mObject, nanoidLabelsTable);

  const tables = getTable(
    mObject,
    labelsByTableId,
    meta,
    addRow,
    rowsByTableId
  );

  const modes = tableIds.map((id) => ({ id: id, value: "idle" }));
  return {
    labels,
    tables,
    modes,
  };
}
export function normalizeApi({ data, meta, drivers }) {
  const mObject = getConnections(data, drivers);
  const tableIds = Object.keys(mObject);

  const nanoidLabelsTable = getNanoidLabelsTable(mObject);
  const rowsByTableId = mapRowsToNanoidLabels(mObject, nanoidLabelsTable);

  const tables = updateTableRows(mObject, meta, rowsByTableId);

  const modes = tableIds.map((id) => ({ id: id, value: "idle" }));
  return {
    tables,
    modes,
  };
}

export function getConnections(m, drivers) {
  const tableIds = Object.keys(m);
  return tableIds
    .map((tableId) => {
      return {
        [tableId]: m[tableId].map(({ id = nanoid(), ...rest }) => {
          const getValue = (b) => {
            const value =
              rest[b] === 0
                ? "0"
                : typeof rest[b] == "boolean"
                ? rest[b]
                  ? "true"
                  : "false"
                : rest[b];
            if (b === "driver") {
              const v = drivers?.find((a) => a.uid === value);
              return v?.name || v?.email || value;
            }
            return value;
          };
          const allLabels = getGridLabels(tableId);
          const primaryLabels = Object.keys(rest).filter((l) =>
            getGridPrimaryLabels(tableId).includes(l)
          );
          const secondaryLabels = getGridSecondaryLabels(tableId)?.filter((s) =>
            allLabels[s]?.dependencies
              ?.map((d) => primaryLabels.includes(d))
              .reduce((a, b) => a && b, true)
          );
          const tertiaryLabels = getGridTertiaryLabels(tableId)?.filter((s) =>
            allLabels[s]?.dependencies
              ?.map((d) => primaryLabels.includes(d))
              .reduce((a, b) => a && b, true)
          );

          const primaryCells = primaryLabels.reduce(
            (a, b) => ({ ...a, [b]: getValue(b) || "" }),
            {}
          );
          const secondaryCells = secondaryLabels?.reduce((a, b) => {
            const calcValue = allLabels[b].fn;
            const dependantValues = [
              getValue(b),
              ...allLabels[b].dependencies.map((label) => getValue(label)),
            ];
            return { ...a, [b]: getValue(b) || calcValue(dependantValues) };
          }, {});
          const tertiaryCells = tertiaryLabels?.reduce((a, b) => {
            const calcValue = allLabels[b].fn;
            const dependantValues = [
              getValue(b),
              ...allLabels[b].dependencies.map((label) => getValue(label)),
            ];
            return { ...a, [b]: calcValue(dependantValues) };
          }, {});
          return {
            id,
            ...primaryCells,
            ...secondaryCells,
            ...tertiaryCells,
          };
        }),
      };
    })
    .reduce((a, b) => ({ ...a, ...b }), {});
}
export function getNanoidLabelsTable(mObject) {
  const tableIds = Object.keys(mObject);
  return tableIds
    .map((tableId) => ({
      [tableId]: Object.keys(getGridLabels(tableId)).reduce(
        (a, b) => ({ ...a, [b]: getGridLabels(tableId)[b].nanoid }),
        {}
      ),
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}
export function getLabelsByTableId(tableIds, nanoidsByLabelIdByTableId) {
  return tableIds
    .map((tableId) => ({
      [tableId]: Object.keys(nanoidsByLabelIdByTableId[tableId]).reduce(
        (a, b) => {
          return getGridLabels(tableId)[b]
            ? [
                ...a,
                {
                  ...getGridLabelProps(tableId, b),
                  links:
                    getGridLabelLinks(tableId, b) &&
                    getGridLabelLinks(tableId, b).map(
                      ({ connection, dependencies }) => ({
                        connectionIdx: connection,
                        connection:
                          nanoidsByLabelIdByTableId[tableId][connection],
                        dependencies: dependencies.map(
                          (c) => nanoidsByLabelIdByTableId[tableId][c]
                        ),
                      })
                    ),
                  id: nanoidsByLabelIdByTableId[tableId][b],
                },
              ]
            : [...a];
        },
        []
      ),
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}
export function mapRowsToNanoidLabels(mObject, nanoidsByLabelIdByTableId) {
  const tableIds = Object.keys(mObject);
  return tableIds
    .map((tableId) => ({
      [tableId]: mObject[tableId].map(({ id, ...rest }) => {
        const d = Object.keys(rest)
          .map((idx) => ({
            [nanoidsByLabelIdByTableId[tableId][idx]]: rest[idx],
          }))
          .reduce((a, b) => ({ ...a, ...b }), {});
        return { id: id + "", ...d };
      }),
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}
export function getTable(
  mObject,
  labelsByTableId,
  meta,
  addRow,
  rowsByTableId
) {
  return Object.keys(mObject).map((tableId) => {
    const tableRowsIds = rowsByTableId[tableId].map(({ id }) => id);
    const labels = labelsByTableId[tableId].map((l) => l.id);
    const selectedLabels = labelsByTableId[tableId]
      .filter((l) => !l.hidden)
      .map((l) => l.id);
    const permaHiddenLabels = labelsByTableId[tableId]
      .filter((l) => l.hidden)
      .map((l) => l.id);
    const nanoids = labelsByTableId[tableId].reduce(
      (a, b) => ({ ...a, [b.idx]: b.id }),
      {}
    );
    return {
      id: tableId,
      labels: labels,
      sortedRowsIds: rowsByTableId[tableId].map(({ id }) => id),
      rows: rowsByTableId[tableId].reduce(
        (a, b) => ({ ...a, [b.id]: { ...b } }),
        {}
      ),
      permaHiddenLabels,
      selectedRows: getGridWidgets(tableId).massEdit ? tableRowsIds : [],
      selectedLabels: selectedLabels,
      nanoids: nanoids,
      addRow: { [addRow[tableId].id]: addRow[tableId] },
      memory: {},
      ...meta,
    };
  });
}
export function updateTableRows(mObject, meta, rowsByTableId) {
  return Object.keys(mObject).map((tableId) => {
    return {
      id: tableId,
      sortedRowsIds: rowsByTableId[tableId].map(({ id }) => id),
      rows: rowsByTableId[tableId].reduce(
        (a, b) => ({ ...a, [b.id]: { ...b } }),
        {}
      ),
      ...meta,
    };
  });
}
export function mapPromiseData(data, entityId) {
  return entityId === "vacationsOverview"
    ? { [entityId]: [{ id: nanoid(), ...data }] }
    : entityId === "upcomingVacations"
    ? { [entityId]: Object.values(data) }
    : entityId === "settingsVehicle"
    ? {
        [entityId]:
          data?.length && data[0].values && data[0].values[0]
            ? JSON.parse(data[0].values[0]).map((e) => ({
                id: nanoid(),
                vehicle: e,
              }))
            : [],
      }
    : entityId === "settingsWorkPlant"
    ? {
        [entityId]:
          data?.length && data[0].values && data[0].values[0]
            ? JSON.parse(data[0].values[0]).map((e) => ({
                id: nanoid(),
                workPlant: e,
              }))
            : [],
      }
    : entityId === "settingsDischargeType"
    ? {
        [entityId]:
          data?.length && data[0].values && data[0].values[0]
            ? JSON.parse(data[0]?.values[0]).map((e) => ({
                id: nanoid(),
                dischargeType: e,
              }))
            : [],
      }
    : entityId === "users"
    ? {
        [entityId]: data.map((u) => ({
          ...u,
          id: u.uid,
          vehicle: u.claims.vehicle || "",
          workPlant: u.claims.workPlant || "",
          vacationDays: u.claims.vacationDays || "",
        })),
      }
    : { [entityId]: Object.values(data) };
}

export function calcSort(oldSort, id) {
  return oldSort && oldSort.id === id
    ? oldSort.order === "asc"
      ? { id, order: "desc" }
      : { id }
    : { id, order: "asc" };
}
export function sortToUrl(sort, initialSort) {
  return sort && sort.order
    ? "&sort=" + sort.id + "," + sort.order
    : (initialSort &&
        initialSort.id &&
        initialSort.order &&
        "&sort=" + initialSort.id + "," + initialSort.order) ||
        "";
}
export function sortToUrl2(sort, initialSort) {
  return sort && sort.order
    ? "&_sort=" + sort.id + "&_order=" + sort.order
    : (initialSort &&
        "&_sort=" + initialSort.id + "&_order=" + initialSort.order) ||
        "";
}

export function calcFilters(oldFilters, { label, value, action, gte, lte }) {
  return oldFilters && oldFilters[label]
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
      ? {
          ...oldFilters,
          [label]: {
            ...oldFilters[label],
            neq:
              oldFilters[label].neq &&
              oldFilters[label].neq.length === value.length
                ? []
                : value,
          },
        }
      : { ...oldFilters, [label]: { gte, lte } }
    : { ...oldFilters, [label]: { neq: value && [...value], gte, lte } };
}
export function filtersToUrl(filters, initialFilters) {
  const url = filters
    ? Object.entries(filters).reduce((a, b) => {
        const idx = b[0];
        const { neq, gte, lte, eq } = b[1];

        const eqLink =
          eq && eq.length !== 0
            ? "&" + idx + "=" + eq.join(",")
            : (initialFilters &&
                initialFilters[idx] &&
                initialFilters[idx].eq &&
                initialFilters[idx].eq.length !== 0 &&
                "&" + idx + "=" + initialFilters[idx].eq.join(",")) ||
              "";
        const neqLink =
          neq && neq.length !== 0
            ? "&" + idx + "_ne=" + neq.join(",")
            : (initialFilters &&
                initialFilters[idx] &&
                initialFilters[idx].neq &&
                initialFilters[idx].neq.length !== 0 &&
                "&" + idx + "_ne=" + initialFilters[idx].neq.join(",")) ||
              "";
        const gteLink = gte
          ? "&" + idx + "_gte=" + gte
          : (initialFilters &&
              initialFilters[idx] &&
              initialFilters[idx].gte &&
              "&" + idx + "_gte=" + initialFilters[idx].gte) ||
            "";
        const lteLink = lte
          ? "&" + idx + "_lte=" + lte
          : (initialFilters &&
              initialFilters[idx] &&
              initialFilters[idx].lte &&
              "&" + idx + "_lte=" + initialFilters[idx].lte) ||
            "";
        return a + eqLink + neqLink + gteLink + lteLink;
      }, "")
    : "";
  return url !== "" ? url.substring(1, url.length) : url;
}

export function parsePagination({ res, page, limit }) {
  return {
    rowsCount: res.totalElements,
    page: page + 1,
    limit,
    pagesCount: res.totalPages - 1,
  };
}
export function parseJsonServerPagination({ res, page, limit }) {
  return {
    paginationLinks:
      res.headers.get("Link") && parseLinkHeader(res.headers.get("Link")),
    rowsCount: res.headers.get("X-Total-Count"),
    page,
    limit,
    pagesCount: Math.ceil(res.headers.get("X-Total-Count") / limit),
  };
}
export function parseLinkHeader(linkHeader) {
  const linkHeadersArray = linkHeader
    .split(", ")
    .map((header) => header.split("; "));
  const linkHeadersMap = linkHeadersArray.map((header) => {
    const thisHeaderRel = header[1].replace(/"/g, "").replace("rel=", "");
    const thisHeaderUrl = header[0].slice(1, -1);
    return [thisHeaderRel, thisHeaderUrl];
  });
  return Object.fromEntries(linkHeadersMap);
}
