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
              "&" + idx + "_gte=" + initialFilters[idx].gte) ||
            "";
        const lteLink = lte
          ? "&" + idx + "_lte=" + lte
          : (initialFilters &&
              initialFilters[idx] &&
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
export function loadToursPage(
  { fetchEntityGrid, fetchMeta, changeDate },
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
      })
    ).then(() => dispatch(changeDate(date)))
  );
}
export function loadWorkHoursPage(
  { fetchMeta, fetchEntityGrid, changeDate },
  dispatch
) {
  return dispatch(fetchMeta()).then(({ payload }) => {
    const driver = payload.find((e) => e.id === "driver").values[0];
    const date = moment().format("YYYY/MM");
    const initialFilters = {
      driver: { eq: [driver] },
      date: { gte: date + "/01", lte: date + "/31" },
    };

    return dispatch(
      fetchEntityGrid({
        entityId: "workHours",
        url: getGridUrl("workHours"),
        limit: getGridWidgets("workHours").pageSize,
        initialFilters: initialFilters,
      })
    ).then(() => dispatch(changeDate(date)));
    // .then(() =>
    //   dispatch(
    //     fetchEntityGrid({
    //       entityId: "absent",
    //       url: getGridUrl("absent"),
    //       limit: getGridWidgets("absent").pageSize,
    //       initialFilters: initialFilters,
    //     })
    //   )
    // );
    // .then(() =>
    //   dispatch(
    //     fetchEntityGrid({
    //       entityId: "vacations",
    //       url: "users/" + payload.users[0].id + "/" + getGridUrl("vacations"),
    //     })
    //   )
    // )
    // .then(() =>
    //   dispatch(
    //     fetchEntityGrid({
    //       entityId: "workHoursBank",
    //       url:
    //         "users/" +
    //         payload.users[0].id +
    //         "/" +
    //         getGridUrl("workHoursBank"),
    //     })
    //   )
    // );
  });
}

export function normalizeRows(data, nanoidLabelsTable) {
  const mObject = getConnections(data);
  const tableIds = Object.keys(mObject);

  const labelsByTableId = getLabelsByTableId(tableIds, nanoidLabelsTable);

  const rowsByTableId = mapRowsToNanoidLabels(mObject, nanoidLabelsTable);
  const rows = tableIds
    .map((r) => rowsByTableId[r])
    .reduce((a, b) => [...a, ...b], []);

  const tables = getTable(mObject, labelsByTableId);

  return {
    rows,
    tables,
  };
}
export function normalizeApi({ data, meta }) {
  const mObject = getConnections(data);
  const tableIds = Object.keys(mObject);

  const nanoidLabelsTable = getNanoidLabelsTable(mObject);
  const labelsByTableId = getLabelsByTableId(tableIds, nanoidLabelsTable);
  const labels = tableIds
    .map((r) => labelsByTableId[r])
    .reduce((a, b) => [...a, ...b], []);

  const rowsByTableId = mapRowsToNanoidLabels(mObject, nanoidLabelsTable);
  const rows = tableIds
    .map((r) => rowsByTableId[r])
    .reduce((a, b) => [...a, ...b], []);

  const tables = getTable(mObject, labelsByTableId, meta);

  const editModes = tableIds.map((id) => ({ id: id, value: false }));
  return {
    labels,
    rows,
    tables,
    editModes,
  };
}
export function getConnections(m) {
  const tableIds = Object.keys(m);
  return tableIds
    .map((tableId) => {
      return {
        [tableId]: m[tableId].map(({ id, ...rest }) => {
          const labels = Object.keys(rest).filter((l) =>
            getGridPrimaryLabels(tableId).includes(l)
          );
          const secondaryLabels = getGridSecondaryLabels(tableId)
            .filter(
              (s) =>
                getGridLabels[s] &&
                getGridLabels[s].dependencies &&
                getGridLabels.dependencies
                  .map((d) => labels.includes(d))
                  .reduce((a, b) => a && b, true)
            )
            .reduce((a, b) => {
              const calcValue = getGridLabels[b].fn;
              const dependantValues = getGridLabels[b].dependencies.map(
                (label) => rest[label]
              );
              return { ...a, [b]: calcValue(dependantValues) };
            }, {});
          return {
            id,
            ...labels.reduce((a, b) => ({ ...a, [b]: rest[b] }), {}),
            ...secondaryLabels,
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
                  links: getGridLabelLinks(tableId, b).map(
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
            [nanoidsByLabelIdByTableId[tableId][idx]]: getGridLabelFormat(
              tableId,
              idx
            )
              ? getGridLabelFormat(tableId, idx)(rest[idx])
              : rest[idx],
          }))
          .reduce((a, b) => ({ ...a, ...b }), {});
        return { id, ...d };
      }),
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}
export function getTable(mObject, labelsByTableId, meta) {
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
      ...meta,
    };
  });
}
export function mapPromiseData(data, entityId) {
  return entityId === "vacations"
    ? {
        ...data,
        vacations: [
          {
            id: "vacations1",
            rest: data["vacations"].rest,
            taken: data["vacations"].taken,
          },
        ],
        vacationsOverview: data["vacations"].overview,
      }
    : entityId === "workHours"
    ? { workHours: Object.values(data) }
    : entityId === "tours"
    ? { tours: Object.values(data) }
    : data;

  // const tablesIds = Object.keys(data);
  // return tablesIds.includes("vacations")
  //   ? {
  //       ...data,
  //       vacations: [
  //         {
  //           id: "vacations1",
  //           rest: data["vacations"].rest,
  //           taken: data["vacations"].taken,
  //         },
  //       ],
  //       vacationsOverview: data["vacations"].overview,
  //     }
  //   : data;
}
export function mapWork(data) {
  const { vacations, workHours = [], workHoursBank = [], absent = [] } = data;
  return {
    tables: {
      vacations: [
        { id: "vacations1", rest: vacations.rest, taken: vacations.taken },
      ],
      vacationsOverview: vacations.overview,
      workHours,
      workHoursBank,
      absent,
    },
  };
}
