import { convertArrayToObject } from "./util/utilities";
import { maxWidthByType } from "./MyConsts";
import { createSelector } from "reselect";
import moment from "moment";
import Input from "./TextArea/MyNewInput";

const changesByIdSelector = (state) => (state && state.changesById) || {};
const dateSelector = (state) =>
  (state && state.date) || moment().format("MM/YYYY");
const allIdSelector = (state) => (state && state.allId) || [];
const checkedIdSelector = (state) => (state && state.checkedId) || [];
const allLabelsIdSelector = (state) => (state && state.allLabelsId) || [];
const filteredOutValuesSelector = (state) =>
  (state && state.filteredOutValues) || {};
const byIdSelector = (state) => (state && state.byId) || {};
const checkedLabelsIdSelector = (state) =>
  (state && state.checkedLabelsId) || [];
const labelsByIdSelector = (state) => (state && state.labelsById) || {};
const editModeSelector = (state) => (state && state.editMode) || false;

const labelsReselect = createSelector(
  [allLabelsIdSelector, labelsByIdSelector],
  (allLabelsId, labelsById) => {
    const labels = [...allLabelsId].sort(
      (a, b) => labelsById[a].priority - labelsById[b].priority
    );
    return labels.map((l) => labelsById[l]);
  }
);

const availableValuesReselect = createSelector(
  [allIdSelector, byIdSelector, allLabelsIdSelector],
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
function customFilterFunction({ type, values, value, defaultDate }) {
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
  [
    allIdSelector,
    filteredOutValuesSelector,
    byIdSelector,
    changesByIdSelector,
    labelsByIdSelector,
    dateSelector,
  ],
  (allId, filteredOutValues, byId, changes, labelsById, date) => {
    const table = allId
      .filter((id) => {
        return Object.keys(filteredOutValues).find((label) =>
          customFilterFunction({
            type: labelsById[label].filterType,
            values: filteredOutValues[label],
            value: byId[id][label],
            defaultDate: date,
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

const reactTableData = createSelector(
  [
    allLabelsIdSelector,
    shownToursReselect,
    labelsByIdSelector,
    availableValuesReselect,
  ],
  (allLabelsId, shownToursReselect, labelsById, availableValues) => {
    return shownToursReselect.map(({ id, value }) => ({
      id: id,
      ...convertArrayToObject(
        allLabelsId.map((label) => {
          const props = {
            id: id,
            value: value[label],
            label: label,
            type: labelsById[label].type,
            measurement: labelsById[label].measurement,
            minWidth: "10px",
            // maxWidth: "70px",
            maxWidth: maxWidthByType(labelsById[label].type),
          };
          if (props.type !== "select") return { ["col-" + label]: props };
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
  [labelsReselect, checkedLabelsIdSelector],
  (labels, checkedLabelsId) => {
    return labels
      .filter(({ id }) => !checkedLabelsId.includes(id))
      .map(({ id }) => "col-" + id);
  }
);
const hiddenColumnsReselect2 = createSelector(
  [labelsReselect, checkedLabelsIdSelector],
  (labels, checkedLabelsId) => {
    return labels
      .filter(({ id }) => !checkedLabelsId.includes(id))
      .map(({ id }) => id);
  }
);
const filteredOutValuesReselect = createSelector(
  [filteredOutValuesSelector, (_, label) => label],
  (filteredOutValues, label) => {
    return label ? filteredOutValues[label] : filteredOutValues;
  }
);

const nestedFilterTourData = createSelector(
  [
    labelsReselect,
    checkedLabelsIdSelector,
    availableValuesReselect,
    filteredOutValuesReselect,
    dateSelector,
  ],
  (labels, checkedLabelsId, availableValues, filteredOutValues, date) => {
    return labels.map(({ id, text, filterType }) => {
      const disabled = filterType === "none" || availableValues[id].length <= 1;
      const checked = checkedLabelsId.includes(id);
      const displayArrow =
        filterType !== "none" && availableValues[id].length > 1;
      const data =
        filterType === "date"
          ? { month: date.split("/")[0], year: date.split("/")[1] }
          : availableValues[id].map((value) => ({
              text: value,
              checked: !(
                filteredOutValues[id] &&
                customFilterFunction({
                  type: filterType,
                  values: filteredOutValues[id],
                  value,
                  defaultDate: date,
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
const modalLabelsReselect = createSelector(
  [allLabelsIdSelector, labelsByIdSelector, availableValuesReselect],
  (allLabelsId, labelsById, availableValues) => {
    return allLabelsId.map((labelId) => {
      const { id, text, type, measurement, grid, page, required, priority } =
        labelsById[labelId];
      const props = {
        id,
        text,
        type,
        measurement,
        grid,
        page,
        required,
        priority,
      };
      return type === "select"
        ? { ...props, availableValues: availableValues[id] }
        : type === "date"
        ? { ...props, portal: false, withButton: true }
        : props;
    });
  }
);
const reactTableData2 = createSelector(
  [
    allLabelsIdSelector,
    shownToursReselect,
    labelsByIdSelector,
    availableValuesReselect,
  ],
  (allLabelsId, shownToursReselect, labelsById, availableValues) => {
    return shownToursReselect.map(({ id, value }) => ({
      id: id,
      ...convertArrayToObject(
        allLabelsId.map((label) => {
          const props = {
            id: id,
            value: value[label],
            label: label,
            type: labelsById[label].type,
            measurement: labelsById[label].measurement,
            minWidth: "10px",
            maxWidth: "250px",
          };

          return { id: id, [label]: value[label] };
        })
      ),
    }));
  }
);

const visibleHeaders2 = createSelector(
  [labelsReselect, hiddenColumnsReselect2, checkedIdSelector, editModeSelector],
  (labels, hiddenColumns, checkedId, editMode) => {
    const editable = (id) => editMode && checkedId.includes(id);
    return labels.map(({ text, id }) => ({
      field: id,
      headerName: text,
      // maxWidth: 250,
      flex: 1,
      minWidth: 100,
      // maxWidth: 250,
      // editable: true,
      disableClickEventBubbling: true,
      hide: hiddenColumns.includes(id),
      renderCell: (params) => {
        // return (
        //   <div style={{ overflow: "visible" }} value={params.value}>
        //     {params.value}
        //   </div>
        // );
        //   // console.log(id, editable(id));
        return (
          // <div>{params.value}</div>
          <Input
            minWidth="10px"
            maxWidth="250px"
            value={params.value}
            editable={editable(params.id)}
            extendable
          ></Input>
        );
        //   // return <div>hi</div>;
      },
    }));
  }
);

export {
  visibleHeaders2,
  modalLabelsReselect,
  changesByIdSelector,
  checkedIdSelector,
  nestedFilterTourData,
  hiddenColumnsReselect,
  dateSelector,
  reactTableData,
  reactTableData2,
  editModeSelector,
  visibleHeaders,
};
