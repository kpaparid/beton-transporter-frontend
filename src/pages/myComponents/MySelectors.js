import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import moment from "moment";
import { convertArrayToObject } from "./util/utilities";
import { createSelector } from "reselect";
import MyInput from "./MyInput";
import { inputLabelsWidths } from "./MyConsts";

function visibleLabelsSelector(state) {
  const c = state.tourTable.checkedLabelsId;
  const shownLabels = [...c].sort(
    (a, b) =>
      state.tourTable.labelsById[a].priority -
      state.tourTable.labelsById[b].priority
  );
  return shownLabels.map((l) => state.tourTable.labelsById[l]);
}
function visibleLabelsSelector2(state) {
  const c = state.tourTable.checkedLabelsId;
  const shownLabels = [...c].sort(
    (a, b) =>
      state.tourTable.labelsById[a].priority -
      state.tourTable.labelsById[b].priority
  );

  return shownLabels.map((l) => ({
    Header: state.tourTable.labelsById[l].text,
    accessor: "col-" + l,
    sortType: (a, b) =>
      a.values["col-" + l].value > b.values["col-" + l].value ? 1 : -1,
  }));
}
function tableReactData(state) {
  const visLabel = visibleLabelsSelector(state);
  // console.log(shownTours);
  const tour = shownToursSelector2(state);
  const editMode = state.tourTable.editMode;
  const l = tour.map((t) => {
    return {
      tourId: t.id,
      // "col-checkbox": state.tourTable.checkedId.find((e) => e === t.id)
      //   ? true
      //   : false,
      ...convertArrayToObject(
        visLabel.map((label) => ({
          ["col-" + label.id]: {
            value: t.value[label.id],
            availableValues: availableValues(state, label.id),
            type: label.type,
            style: inputLabelsWidths[label.id],
            editable: editMode,
          },
        }))
      ),
    };
  });
  return l;
}
function checkedExistsSelector(state) {
  const { tourTable } = state;
  return tourTable.checkedId.length !== 0 ? true : false;
}
function shownToursSelector(state) {
  const shownId = state.tourTable.shownId;
  const table = [];

  shownId.forEach((item) => {
    var flag = true;
    flag &&
      state.tourTable.allLabelsId.forEach((label) => {
        if (
          state.tourTable.filteredOutValues[label] &&
          state.tourTable.filteredOutValues[label].findIndex(
            (f) => f === state.tourTable.byId[item][label]
          ) !== -1
        ) {
          flag = false;
        }
      });
    flag && table.push({ id: item, value: state.tourTable.byId[item] });
  });
  return table;
}
function shownToursSelector2(state) {
  const shownId = state.tourTable.shownId;

  const table = shownId
    .filter((id) => {
      state.tourTable.allLabelsId.forEach((label) => {
        if (
          state.tourTable.filteredOutValues[label] &&
          state.tourTable.filteredOutValues[label].findIndex(
            (f) => f === state.tourTable.byId[id][label]
          ) !== -1
        ) {
          return false;
        }
      });
      return true;
    })
    .map((item) => ({ id: item, value: state.tourTable.byId[item] }));
  return table;
}
function shownToursSelector3(state) {
  const shownId = state.tourTable.shownId;
  //  col1: "Hello",
  //         col2: "World",
  console.log(state.tourTable);
  const table = shownId
    .filter((id) => {
      state.tourTable.allLabelsId.forEach((label) => {
        if (
          state.tourTable.filteredOutValues[label] &&
          state.tourTable.filteredOutValues[label].findIndex(
            (f) => f === state.tourTable.byId[id][label]
          ) !== -1
        ) {
          return false;
        }
      });
      return true;
    })
    .map((item) => ({
      id: item,
      value: state.tourTable.byId[item],
      availableValues: allAvailableValues(state),
      checked: state.tourTable.checkedId.find((e) => e === item) ? true : false,
    }));
  // .map((item) => ({
  //   id: item,
  //   value: state.tourTable.byId[item],
  //   availableValues: allAvailableValues(state),
  // }));
  return table;
}

function selectorMenu(state) {
  const { tourTable } = state;
  if (tourTable.shownId.length > 0 && tourTable.checkedId.length > 0) {
    const unchecked = tourTable.shownId
      .map((tour) => ({ [tour]: "" }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
    const checked = tourTable.checkedId
      .map((tour) => ({ [tour]: "checked" }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
    return { ...unchecked, ...checked };
  }
  if (tourTable.shownId.length > 0) {
    const unchecked = tourTable.shownId
      .map((tour) => ({ [tour]: "" }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
    return unchecked;
  }
}
function checkedAllSelector(state) {
  const checkedIdLength = state.tourTable.checkedId.length;
  const allIdLength = state.tourTable.allId.length;
  return checkedIdLength === allIdLength;
}
function sortedLabelsSelector(state) {
  const c = state.tourTable.checkedLabelsId;
  const shownLabels = c.sort(
    (a, b) =>
      state.tourTable.labelsById[a].priority -
      state.tourTable.labelsById[b].priority
  );
  return shownLabels;
}

function availableValues(state, key) {
  return [
    ...new Set(
      state.tourTable.allId.map((tour) => state.tourTable.byId[tour][key])
    ),
  ];
}

function allAvailableValues(state) {
  const allValues = state.tourTable.allLabelsId.map((key) => {
    return { [key]: availableValues(state, key) };
  });

  return allValues.length !== 0 ? convertArrayToObject(allValues) : [];
}
function tableData(state) {
  return {
    // tours: shownToursSelector(state),
    tours: shownToursSelector2(state),
    availableValues: allAvailableValues(state),
    checkedRows: selectorMenu(state),
    checkedAll: checkedAllSelector(state),
    editMode: state.tourTable.editMode,
    visibleLabels: visibleLabelsSelector(state),
  };
}

const changesById = (state) => state.tourTable.changesById;
const editMode = (state) => state.tourTable.editMode;
const date = (state) => state.tourTable.tourDate;
const allId = (state) => state.tourTable.allId;
const checkedId = (state) => state.tourTable.checkedId;
const shownId = (state) => state.tourTable.shownId;
const allLabelsId = (state) => state.tourTable.allLabelsId;
const filteredOutValues = (state) => state.tourTable.filteredOutValues;
const byId = (state) => {
  return state.tourTable.byId;
};
const checkedLabelsId = (state) => state.tourTable.checkedLabelsId;
const labelsById = (state) => state.tourTable.labelsById;

const tableDataReselect = createSelector(
  [visibleLabelsSelector2, tableReactData, editMode, checkedId],
  (visibleLabels, shownTours, editMode, checkedIdSel) => {
    console.log({ visibleLabels, shownTours, editMode, checkedId });

    return { checkedId, visibleLabels, shownTours, editMode };
  }
);
const shownToursReselect = createSelector(
  [shownId, allLabelsId, filteredOutValues, byId, changesById],
  (shownId, allLabelsId, filteredOutValues, byId, changes) => {
    const table = shownId
      .filter((id) => {
        allLabelsId.forEach((label) => {
          if (
            filteredOutValues[label] &&
            filteredOutValues[label].findIndex((f) => f === byId[id][label]) !==
              -1
          ) {
            return false;
          }
        });
        return true;
      })
      // .map((item) => ({ id: item, value: byId[item] }));
      .map((item) => ({
        id: item,
        value: changes[item] ? { ...byId[item], ...changes[item] } : byId[item],
      }));
    console.log(table);
    return table;
  }
);
const visibleLabelsReselect = createSelector(
  [checkedLabelsId, labelsById],
  (checkedLabelsId, labelsById) => {
    const shownLabels = [...checkedLabelsId].sort(
      (a, b) => labelsById[a].priority - labelsById[b].priority
    );
    return shownLabels.map((l) => labelsById[l]);
  }
);
const availableValuesReselect = createSelector(
  [allId, byId, allLabelsId],
  (allId, byId, allLabelsId) => {
    return convertArrayToObject(
      allLabelsId.map((label) => {
        return {
          [label]: [...new Set(allId.map((tour) => byId[tour][label]))],
        };
      })
    );
  }
);

const tableReactData3 = createSelector(
  [visibleLabelsReselect, shownToursReselect, availableValuesReselect],
  (visibleLabels, shownTours, availableValues) => {
    return shownTours.map((t) => {
      return {
        tourId: t.id,
        ...convertArrayToObject(
          visibleLabels.map((label) => ({
            ["col-" + label.id]: {
              value: t.value[label.id],
              availableValues: availableValues[label.id],
              type: label.type,
              ...inputLabelsWidths[label.id],
              label: label.id,
              id: t.id,
              measurement: label.measurement,
            },
          }))
        ),
      };
    });
  }
);
const visibleHeaders = createSelector(
  [visibleLabelsReselect, labelsById],
  (visibleLabels, labelsById) => {
    console.log(visibleLabels);
    return visibleLabels.map(({ text, id }) => ({
      Header: text,
      accessor: "col-" + id,
      sortType: (a, b) =>
        a.values["col-" + id].value > b.values["col-" + id].value ? 1 : -1,
    }));
  }
);

export {
  changesById,
  editMode,
  checkedId,
  visibleHeaders,
  tableReactData3,
  tableDataReselect,
  allAvailableValues,
  checkedExistsSelector,
  shownToursSelector,
  shownToursSelector2,
  shownToursSelector3,
  selectorMenu,
  checkedAllSelector,
  sortedLabelsSelector,
  visibleLabelsSelector,
  visibleLabelsSelector2,
  availableValues,
  tableData,
  tableReactData,
};
