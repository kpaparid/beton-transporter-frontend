import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import {
  getGridLabelFormat,
  getGridLabelLinks,
  getGridLabelProps,
  getGridLabels,
  getGridMeta,
  getGridUrl,
  getGridWidgets,
  getGridPrimaryLabels,
  getGridSecondaryLabels,
} from "../pages/myComponents/util/labels";

import { API } from "../pages/myComponents/MyConsts";
export function loadOverviewPage(
  { fetchEntityGrid, fetchMeta, addMeta },
  dispatch
) {
  const year = moment().format("YYYY");
  const date = moment().format("YYYY/MM");
  const today = moment().format("YYYY/MM/DD");
  const dateFilter = { date: { eq: [date] } };
  const fetchers = [
    fetch(API + "sales?&date_gte=2021/01&date_lte=2021/12"),
    fetch(API + "cbm?&date_gte=" + year + "/01&date_lte=" + year + "/12"),
    fetch(API + "sales-ByWorkPlant?&date=" + date),
  ];
  const dispatchers = [
    dispatch(fetchMeta("?id=workPlant")),
    dispatch(
      fetchEntityGrid({
        entityId: "workHoursByDate",
        url: getGridUrl("workHoursByDate"),
        limit: getGridWidgets("workHoursByDate").pageSize,
        initialFilters: dateFilter,
        initialSort: { id: "hours", order: "desc" },
      })
    ),
    dispatch(
      fetchEntityGrid({
        entityId: "currentVacations",
        url: getGridUrl("currentVacations"),
        limit: getGridWidgets("currentVacations").pageSize,
        initialFilters: { from: { lte: today }, to: { gte: today } },
        initialSort: { id: "from", order: "desc" },
      })
    ),
  ];
  const meta = ["sales", "cbm", "salesByWorkPlant"];
  return Promise.all(dispatchers).then(() =>
    Promise.all(fetchers)
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((jsonObjects) =>
        dispatch(
          addMeta(
            jsonObjects
              .map((j, index) => ({ id: meta[index], value: j }))
              .concat({ id: "date", value: date })
          )
        )
      )
  );
}

export function loadToursPage(
  { fetchEntityGrid, fetchMeta, addMeta },
  dispatch
) {
  const date = moment().format("YYYY/MM");
  const initialFilters = {
    date: { gte: date + "/01", lte: date + "/31" },
  };
  return dispatch(fetchMeta()).then(() =>
    dispatch(
      fetchEntityGrid({
        entityId: "tours",
        url: "tours",
        limit: getGridWidgets("tours").pageSize,
        initialFilters,
        initialSort: { id: "date", order: "desc" },
      })
    ).then(() => dispatch(addMeta([{ id: "date", value: date }])))
  );
}
export function loadWorkHoursPage(
  { fetchMeta, fetchEntityGrid, addMeta },
  dispatch,
  driver
) {
  return dispatch(fetchMeta()).then(({ payload }) => {
    const driverName =
      driver || payload.find((e) => e.id === "driver").values[0];
    const date = moment().format("YYYY/MM");

    const driverFilter = { driver: { eq: [driverName] } };
    const dateFilter = { date: { gte: date + "/01", lte: date + "/31" } };
    return dispatch(
      fetchEntityGrid({
        entityId: "workHours",
        url: getGridUrl("workHours"),
        limit: getGridWidgets("workHours").pageSize,
        initialFilters: { ...driverFilter, ...dateFilter },
        initialSort: { id: "date", order: "desc" },
      })
    )
      .then(() =>
        dispatch(
          fetchEntityGrid({
            entityId: "absent",
            url: getGridUrl("absent"),
            limit: getGridWidgets("absent").pageSize,
            initialFilters: driverFilter,
            initialSort: { id: "from", order: "desc" },
          })
        )
      )
      .then(() =>
        dispatch(
          fetchEntityGrid({
            entityId: "vacations",
            url: getGridUrl("vacations"),
            limit: getGridWidgets("vacations").pageSize,
            initialFilters: driverFilter,
          })
        )
      )
      .then(() =>
        dispatch(
          fetchEntityGrid({
            entityId: "vacationsOverview",
            url: getGridUrl("vacationsOverview"),
            limit: getGridWidgets("vacationsOverview").pageSize,
            initialFilters: driverFilter,
            initialSort: { id: "from", order: "desc" },
          })
        )
      )

      .then(() =>
        dispatch(
          fetchEntityGrid({
            entityId: "workHoursBank",
            url: getGridUrl("workHoursBank"),
            limit: getGridWidgets("workHoursBank").pageSize,
            initialFilters: driverFilter,
            initialSort: { id: "month", order: "desc" },
          })
        )
      )
      .then(() =>
        dispatch(
          addMeta([
            { id: "date", value: date },
            { id: "driver", value: driverName },
          ])
        )
      );
  });
}

export function normalizeApi({ data, meta }) {
  const mObject = getConnections(data);
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
  const rows = tableIds
    .map((r) => rowsByTableId[r].concat(addRow[r]))
    .reduce((a, b) => [...a, ...b]);

  const tables = getTable(mObject, labelsByTableId, meta, addRow);

  const modes = tableIds.map((id) => ({ id: id, value: "idle" }));
  return {
    labels,
    rows,
    tables,
    modes,
  };
}
export function getConnections(m) {
  const tableIds = Object.keys(m);
  return tableIds
    .map((tableId) => {
      return {
        [tableId]: m[tableId].map(({ id, ...rest }) => {
          const allLabels = getGridLabels(tableId);
          const primaryLabels = Object.keys(rest).filter((l) =>
            getGridPrimaryLabels(tableId).includes(l)
          );
          const secondaryLabels = getGridSecondaryLabels(tableId).filter(
            (s) =>
              allLabels[s] &&
              allLabels[s].dependencies &&
              allLabels[s].dependencies
                .map((d) => primaryLabels.includes(d))
                .reduce((a, b) => a && b, true)
          );
          const primaryCells = primaryLabels.reduce(
            (a, b) => ({ ...a, [b]: rest[b] }),
            {}
          );
          const secondaryCells = secondaryLabels.reduce((a, b) => {
            const calcValue = allLabels[b].fn;
            const dependantValues = allLabels[b].dependencies.map(
              (label) => rest[label]
            );
            return { ...a, [b]: calcValue(dependantValues) };
          }, {});
          return {
            id,
            ...primaryCells,
            ...secondaryCells,
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
        return { id, ...d };
      }),
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}
export function getTable(mObject, labelsByTableId, meta, addRow) {
  return Object.keys(mObject).map((tableId) => {
    const tableRowsIds = mObject[tableId].map(({ id }) => id);
    const tableLabelIds = labelsByTableId[tableId].map((l) => l.id);
    const nanoids = labelsByTableId[tableId].reduce(
      (a, b) => ({ ...a, [b.idx]: b.id }),
      {}
    );
    return {
      id: tableId,
      labels: tableLabelIds,
      rows: tableRowsIds,
      selectedRows: getGridWidgets(tableId).massEdit ? tableRowsIds : [],
      selectedLabels: tableLabelIds,
      nanoids: nanoids,
      addRow: addRow[tableId].id,
      ...meta,
    };
  });
}
export function mapPromiseData(data, entityId) {
  const values = Object.values(data);
  return entityId === "vacations2"
    ? {
        vacations: [
          {
            id: nanoid(),
            rest: values[0].rest,
            taken: values[0].taken,
          },
        ],
        vacationsOverview: values[0].overview,
      }
    : { [entityId]: values };
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
  return filters
    ? Object.entries(filters).reduce((a, b) => {
        const idx = b[0];
        const { neq, gte, lte, eq } = b[1];
        const eqLink =
          eq && eq.length !== 0
            ? eq.reduce((c, d) => c + "&" + idx + "=" + d, "")
            : (initialFilters &&
                initialFilters[idx] &&
                initialFilters[idx].eq &&
                initialFilters[idx].eq.length !== 0 &&
                initialFilters[idx].eq.reduce(
                  (c, d) => c + "&" + idx + "=" + d,
                  ""
                )) ||
              "";
        const neqLink =
          neq && neq.length !== 0
            ? neq.reduce((c, d) => c + "&" + idx + "_ne=" + d, "")
            : (initialFilters &&
                initialFilters[idx] &&
                initialFilters[idx].neq &&
                initialFilters[idx].neq.length !== 0 &&
                initialFilters[idx].neq.reduce(
                  (c, d) => c + "&" + idx + "_ne=" + d,
                  ""
                )) ||
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
}

export function parsePagination({ res, page, limit }) {
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
