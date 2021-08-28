import { createStore } from "redux";
import moment from "moment";
import produce from "immer";
import { tourDate } from "../myComponents/MySelectors";

export const ACTIONS = {
  STATUS_CHANGE: "STATUS_CHANGE",
  CLOSE_CHECK_ALL: "CLOSE_CHECK_ALL",
  LOAD_MENU: "LOAD_MENU",
  TOGGLE_CHECK_ALL: "CHECK_ALL",
  LOAD_TOUR_TABLE: "LOAD_TOUR_TABLE",
  CHECK_ONE: "CHECK_ONE",
  SAVE_CHANGES: "SAVE_CHANGES",
  ADD_CHANGE: "ADD_CHANGE",
  RESET_CHANGES: "RESET_CHANGES",
  EDIT_TOGGLE: "EDIT_TOGGLE",
  TOGGLE_COLUMN: "TOGGLE_COLUMN",
  NESTEDFILTER_TOGGLE_ALL: "NESTEDFILTER_TOGGLE_ALL",
  NESTEDFILTER_TOGGLE_ONE: "NESTEDFILTER_TOGGLE_ONE",
  TOURTABLE_CHANGE_TOURDATE: "TOURTABLE_CHANGE_TOURDATE",
  NESTEDFILTER_ADD_FILTER: "NESTEDFILTER_ADD_FILTER",
};
export const myInitialState = {
  checkedAll: "",
  transactionsTable: [],
  checked: [],
  changes: [],
  transactionsDate: "12-2021",
  transactionsFilter: {
    nestedFilter: [
      {
        label: "",
        filter: [
          {
            checked: true,
            value: "",
          },
        ],
      },
    ],
    checked: [],
  },

  tourTable: {
    status: "IDLE",
    byId: {},
    allId: [],
    shownId: [],
    checkedId: [],
    changesById: {},
    tableChanges: {},
    editMode: false,

    allLabelsId: [],
    checkedLabelsId: [],
    labelsById: {},
    tourDate: "12/2021",

    filteredOutValues: {},
  },
};

function MyReducer(state = myInitialState, action) {
  switch (action.type) {
    case ACTIONS.LOAD_TOUR_TABLE: {
      const { table, labels } = action.payload;

      console.log("LOADING TOUR TABLE");
      const newTransactionsTable = table.map((item, index) => ({
        ...item,
        labelId: item.id,
        // id: index,
      }));
      const newChecked = table.map((item) => "");
      const newTransactionsFilterChecked = Array(
        Object.keys(table[0]).length - 1
      ).fill(true);
      const newTransactionsFilterFilters = Object.keys(table[0]).map(
        (item) => ({
          label: item,
          filter: [...new Set(table.map((row) => row[item]))].map((item) => ({
            checked: true,
            value: item,
          })),
        })
      );

      const newTourTableById = table
        .map((item, index) => ({ ["Tour" + index]: { ...item } }))
        .reduce((prev, curr) => ({ ...prev, ...curr }));
      const newTourTableAllId = Object.keys(newTourTableById);

      const newLabelsById = labels
        .map((label, index) => ({ [label.id]: { ...label, priority: index } }))
        .reduce((prev, curr) => ({ ...prev, ...curr }));
      const newAllLabelsId = labels.map((label) => label.id);
      const checkedLabelsId = [...newAllLabelsId];

      const newShownId = newTourTableAllId.filter(
        (id) =>
          moment(newTourTableById[id].datum, "DD/MM/YYYY").format("MM/YYYY") ===
          state.tourTable.tourDate
      );

      return {
        ...state,
        checked: newChecked,
        transactionsTable: newTransactionsTable,
        transactionsFilter: {
          checked: newTransactionsFilterChecked,
          nestedFilter: newTransactionsFilterFilters,
        },
        tourTable: {
          ...state.tourTable,
          byId: newTourTableById,
          allId: [...newTourTableAllId],
          shownId: newShownId,
          labelsById: newLabelsById,
          allLabelsId: newAllLabelsId,
          checkedLabelsId: checkedLabelsId,
          filteredOutValues: { datum: [state.tourTable.tourDate] },
        },
      };
    }

    case ACTIONS.STATUS_CHANGE: {
      const { status } = action.payload;
      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          status: status,
        },
      };
    }
    case ACTIONS.TOGGLE_COLUMN: {
      const { id } = action.payload;
      console.log("Toggle_Column: " + id);

      const checkedLabelsId = [...state.tourTable.checkedLabelsId];
      const newCheckedLabelsId =
        checkedLabelsId.indexOf(id) === -1
          ? [...checkedLabelsId, id]
          : checkedLabelsId.filter((label) => label !== id);

      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          checkedLabelsId: newCheckedLabelsId,
        },
      };
    }

    case ACTIONS.EDIT_TOGGLE: {
      const c = produce(state, (draftState) => {
        draftState.tourTable.editMode = !draftState.tourTable.editMode;
        return draftState;
      });
      return c;

      // return {
      //   ...state,
      //   editMode: true,
      // };
    }

    case ACTIONS.TOGGLE_CHECK_ALL: {
      const tourTable = state.tourTable;
      const checkedAll = tourTable.checkedId.length === tourTable.allId.length;
      var newCheckedId = checkedAll ? [] : tourTable.allId;
      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          checkedId: [...newCheckedId],
        },
      };
    }
    case ACTIONS.CLOSE_CHECK_ALL: {
      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          checkedId: [],
        },
      };
    }

    case ACTIONS.CHECK_ONE: {
      const { id } = action.payload;
      console.log(state.tourTable);
      const index = state.tourTable.checkedId.findIndex((item) => item === id);
      var newCheckedId2 = [...state.tourTable.checkedId];
      index === -1
        ? newCheckedId2.push(id)
        : (newCheckedId2 = newCheckedId2.filter((item) => item !== id));

      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          checkedId: newCheckedId2,
        },
      };
    }

    case ACTIONS.SAVE_CHANGES: {
      console.log("Saving Changes!");
      const changesById = state.tourTable.changesById;
      const newById = { ...state.tourTable.byId };
      Object.keys(changesById).forEach((tour) => {
        newById[tour] = { ...newById[tour], ...changesById[tour] };
      });

      /**
       * TODO
       * post to backend
       */

      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          byId: newById,
          changesById: {},
          status: "IDLE",
        },
      };
    }
    case ACTIONS.ADD_CHANGE: {
      const { id, key, change } = action.payload;
      const newChangesById = { ...state.tourTable.changesById };
      newChangesById[id] = { ...newChangesById[id], [key]: change };
      console.log("add change: ", newChangesById);
      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          changesById: newChangesById,
        },
      };
    }
    case ACTIONS.RESET_CHANGES: {
      if (Object.keys(state.tourTable.changesById).length !== 0) {
        console.log("clearing changes");
        return {
          ...state,
          tourTable: {
            ...state.tourTable,
            changesById: {},
            status: "IDLE",
          },
        };
      }
      return state;
    }
    case ACTIONS.NESTEDFILTER_TOGGLE_ALL: {
      const { label, data } = action.payload;
      const filteredOutValues = state.tourTable.filteredOutValues;
      const newFilteredOutValues =
        !filteredOutValues[label] || filteredOutValues[label].length === 0
          ? { ...filteredOutValues, [label]: data }
          : {};

      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          filteredOutValues: newFilteredOutValues,
        },
      };
    }
    case ACTIONS.NESTEDFILTER_ADD_FILTER: {
      const { label, value } = action.payload;
      console.log(value);
      const newValues = {
        ...state.tourTable.filteredOutValues,
        [label]: value,
      };
      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          filteredOutValues: newValues,
        },
      };
    }
    case ACTIONS.NESTEDFILTER_TOGGLE_ONE: {
      const { label, value } = action.payload;
      const newFilteredOutValues = { ...state.tourTable.filteredOutValues };
      console.log(label, value);
      const newLabel = newFilteredOutValues[label]
        ? newFilteredOutValues[label].find((item) => item === value)
          ? [...newFilteredOutValues[label]].filter((item) => item !== value)
          : [...newFilteredOutValues[label], value]
        : [value];
      const newValues = { ...newFilteredOutValues, [label]: newLabel };
      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          filteredOutValues: newValues,
        },
      };
    }
    case ACTIONS.TOURTABLE_CHANGE_TOURDATE: {
      const { date } = action.payload;

      return {
        ...state,
        tourTable: {
          ...state.tourTable,
          tourDate: date,
        },
      };
    }

    default:
      return state;
  }
}

const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export function createReduxStore() {
  const store = createStore(MyReducer, enableReduxDevTools);
  return store;
}
