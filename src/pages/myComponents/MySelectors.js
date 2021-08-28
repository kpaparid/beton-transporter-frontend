import { convertArrayToObject } from "./util/utilities";
import { inputLabelsWidths } from "./MyConsts";
import { createSelector } from "reselect";
import moment from "moment";

const status = (state) => state.tourTable.status;
const changesById = (state) => state.tourTable.changesById;
const editMode = (state) => state.tourTable.editMode;
const tourDate = (state) => state.tourTable.tourDate;
const allId = (state) => state.tourTable.allId;
const checkedId = (state) => state.tourTable.checkedId;
const shownId = (state) => state.tourTable.shownId;
const allLabelsId = (state) => state.tourTable.allLabelsId;
const filteredOutValues = (state) => state.tourTable.filteredOutValues;
const byId = (state) => state.tourTable.byId;
const checkedLabelsId = (state) => state.tourTable.checkedLabelsId;
const labelsById = (state) => state.tourTable.labelsById;
function customFilterFunction({ type, values, value, defaultDate }) {
  // if (type === "date") {
  //   console.log(value);
  //   console.log(defaultDate);
  // }
  switch (type) {
    case "date":
      return values.length !== 0 &&
        moment(values[0], "D/M/YYYY", true).isValid() &&
        moment(values[1], "D/M/YYYY", true).isValid()
        ? !moment(value, "D/M/YYYY").isBetween(
            moment(values[0], "D/MM/YYYY"),
            moment(values[1], "D/MM/YYYY"),
            undefined,
            []
          )
        : moment(value, "D/M/YYYY").format("MM/YYYY") !==
            moment(defaultDate, "MM/YYYY").format("MM/YYYY");
    default:
      return values.includes(value);
  }
}
const shownToursReselect = createSelector(
  [allId, filteredOutValues, byId, changesById, labelsById, tourDate],
  (allId, filteredOutValues, byId, changes, labelsById, tourDate) => {
    const table = allId
      .filter((id) => {
        return Object.keys(filteredOutValues).find((label) =>
          customFilterFunction({
            type: labelsById[label].filterType,
            values: filteredOutValues[label],
            value: byId[id][label],
            defaultDate: tourDate,
          })
        )
          ? false
          : true;
      })
      .map((item) => ({
        id: item,
        value: changes[item] ? { ...byId[item], ...changes[item] } : byId[item],
      }));
    return table;
  }
);

const labelsReselect = createSelector(
  [allLabelsId, labelsById],
  (allLabelsId, labelsById) => {
    const labels = [...allLabelsId].sort(
      (a, b) => labelsById[a].priority - labelsById[b].priority
    );
    return labels.map((l) => labelsById[l]);
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

const visibleHeaders = createSelector([labelsReselect], (labels) => {
  return labels.map(({ text, id }) => ({
    Header: text,
    accessor: "col-" + id,
    label: id,
    sortType: (a, b) =>
      a.values["col-" + id].value > b.values["col-" + id].value ? 1 : -1,
  }));
});

const reactTableData = createSelector(
  [allLabelsId, shownToursReselect, labelsById, availableValuesReselect],
  (allLabelsId, shownToursReselect, labelsById, availableValues) => {
    return shownToursReselect.map(({ id, value }) => ({
      ...convertArrayToObject(
        allLabelsId.map((label) => {
          const props = {
            id: id,
            value: value[label],
            label: label,
            type: labelsById[label].type,
            measurement: labelsById[label].measurement,
            minWidth: "10px",
            maxWidth: "200px",
          };
          if (props.type !== "constant") return { ["col-" + label]: props };
          else
            return {
              ["col-" + label]: {
                ...props,
                availableValues: availableValues[label],
              },
            };
        })
      ),
    }));
  }
);

const hiddenColumnsReselect = createSelector(
  [labelsReselect, checkedLabelsId],
  (labels, checkedLabelsId) => {
    return labels
      .filter(({ id }) => !checkedLabelsId.includes(id))
      .map(({ id }) => "col-" + id);
  }
);
const filteredOutValuesReselect = createSelector(
  [filteredOutValues, (_, label) => label],
  (filteredOutValues, label) => {
    return label ? filteredOutValues[label] : filteredOutValues;
  }
);

const nestedFilterTourData = createSelector(
  [
    labelsReselect,
    checkedLabelsId,
    availableValuesReselect,
    filteredOutValuesReselect,
    tourDate,
  ],
  (labels, checkedLabelsId, availableValues, filteredOutValues, tourDate) => {
    return labels.map(({ id, text, filterType }) => {
      const disabled = filterType === "none" || availableValues[id].length <= 1;
      const checked = checkedLabelsId.includes(id);
      const displayArrow =
        filterType !== "none" && availableValues[id].length > 1;
      const data =
        filterType === "date"
          ? { month: tourDate.split("/")[0], year: tourDate.split("/")[1] }
          : availableValues[id].map((value) => ({
              text: value,
              checked: !(
                filteredOutValues[id] &&
                customFilterFunction({
                  type: filterType,
                  values: filteredOutValues[id],
                  value,
                  defaultDate: tourDate,
                })
              ),
            }));
      const props = {
        type: filterType,
        label: id,
        checkedAll: filteredOutValues[id] && filteredOutValues[id].length === 0,
        data: data,
      };
      return {
        disabled,
        text,
        id,
        checked,
        displayArrow,
        availableValues: availableValues[id],
        props,
      };
    });
  }
);

export {
  nestedFilterTourData,
  hiddenColumnsReselect,
  tourDate,
  reactTableData,
  editMode,
  visibleHeaders,
};
