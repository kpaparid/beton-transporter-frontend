import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import { normalize, schema } from "normalizr";
import {
  getGridLabelLinks,
  getGridLabelProps,
  getGridLabels,
  getGridMeta,
  getGridWidgets,
  gridLabels,
} from "../pages/myComponents/MyConsts";

export function parsePagination({ res, page, limit }) {
  return {
    paginationLinks: parseLinkHeader(res.headers.get("Link")),
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

export function loadToursPage({ fetchEntityGrid, changeDate }, dispatch) {
  return dispatch(
    fetchEntityGrid({
      entityId: "tours",
      url: "tours",
    })
  ).then(() => dispatch(changeDate(moment().format("MM/YYYY"))));
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
      meta: getGridMeta(tableId),
      nanoids: nanoids,
      ...meta,
    };
  });
}

export function getLabelsByTableId(tableIds, nanoidsByLabelIdByTableId) {
  return tableIds
    .map((tableId) => ({
      [tableId]: Object.keys(nanoidsByLabelIdByTableId[tableId]).reduce(
        (a, b) => {
          return gridLabels[tableId].labels[b]
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
export function getConnections(m) {
  const tableIds = Object.keys(m);
  return tableIds
    .map((tableId) => {
      return {
        [tableId]: m[tableId].map(({ id, ...rest }) => {
          const labels = Object.keys(rest);
          const secondaryLabels = (gridLabels[tableId].secondaryLabels || [])
            .filter(
              (s) =>
                gridLabels[tableId].labels[s] &&
                gridLabels[tableId].labels[s].dependencies &&
                gridLabels[tableId].labels[s].dependencies
                  .map((d) => labels.includes(d))
                  .reduce((a, b) => a && b, true)
            )
            .reduce((a, b) => {
              const calcValue = gridLabels[tableId].labels[b].format;
              const dependantValues = gridLabels[tableId].labels[
                b
              ].dependencies.map((label) => rest[label]);
              return { ...a, [b]: calcValue(dependantValues) };
            }, {});
          return {
            id,
            ...rest,
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
    ? { workHours: data.workHours }
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
