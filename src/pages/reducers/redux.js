import { combineReducers, createStore } from "redux";
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
  status: "IDLE",
  byId: {},
  allId: [],
  shownId: [],
  checkedId: [],
  changesById: {},
  editMode: false,
  allLabelsId: [],
  checkedLabelsId: [],
  labelsById: {},
  tourDate: "12/2021",
  filteredOutValues: {},
};

function MyReducer(state = myInitialState, action) {
  switch (action.type) {
    case ACTIONS.LOAD_TOUR_TABLE: {
      const { table, labels } = action.payload;

      console.log("LOADING TOUR TABLE", labels);
      console.log(state);

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
          state.tourDate
      );
      console.log({
        ...state,
        byId: newTourTableById,
        allId: [...newTourTableAllId],
        shownId: newShownId,
        labelsById: newLabelsById,
        allLabelsId: newAllLabelsId,
        checkedLabelsId: checkedLabelsId,
        filteredOutValues: { datum: [state.tourDate] },
      });
      return {
        ...state,
        byId: newTourTableById,
        allId: [...newTourTableAllId],
        shownId: newShownId,
        labelsById: newLabelsById,
        allLabelsId: newAllLabelsId,
        checkedLabelsId: checkedLabelsId,
        filteredOutValues: { datum: [state.tourDate] },
      };
    }

    case ACTIONS.STATUS_CHANGE: {
      const { status } = action.payload;
      return {
        ...state,
        ...state,
        status: status,
      };
    }
    case ACTIONS.TOGGLE_COLUMN: {
      const { id } = action.payload;
      console.log("Toggle_Column: " + id);

      const checkedLabelsId = [...state.checkedLabelsId];
      const newCheckedLabelsId =
        checkedLabelsId.indexOf(id) === -1
          ? [...checkedLabelsId, id]
          : checkedLabelsId.filter((label) => label !== id);

      return {
        ...state,
        checkedLabelsId: newCheckedLabelsId,
      };
    }

    case ACTIONS.EDIT_TOGGLE: {
      const c = produce(state, (draftState) => {
        draftState.editMode = !draftState.editMode;
        return draftState;
      });
      return c;
    }

    case ACTIONS.TOGGLE_CHECK_ALL: {
      const tourTable = state;
      const checkedAll = tourTable.checkedId.length === tourTable.allId.length;
      var newCheckedId = checkedAll ? [] : tourTable.allId;
      return {
        ...state,
        checkedId: [...newCheckedId],
      };
    }
    case ACTIONS.CLOSE_CHECK_ALL: {
      return {
        ...state,
        checkedId: [],
      };
    }

    case ACTIONS.CHECK_ONE: {
      const { ids } = action.payload;
      return {
        ...state,
        checkedId: ids,
      };
    }

    case ACTIONS.SAVE_CHANGES: {
      console.log("Saving Changes!");
      const changesById = state.changesById;
      const newById = { ...state.byId };
      Object.keys(changesById).forEach((tour) => {
        newById[tour] = { ...newById[tour], ...changesById[tour] };
      });

      /**
       * TODO
       * post to backend
       */

      return {
        ...state,
        byId: newById,
        changesById: {},
        status: "IDLE",
      };
    }
    case ACTIONS.ADD_CHANGE: {
      const { id, key, change } = action.payload;
      const newChangesById = { ...state.changesById };
      newChangesById[id] = { ...newChangesById[id], [key]: change };
      console.log("add change: ", newChangesById);
      return {
        ...state,
        changesById: newChangesById,
      };
    }
    case ACTIONS.RESET_CHANGES: {
      if (Object.keys(state.changesById).length !== 0) {
        console.log("clearing changes");
        return {
          ...state,
          changesById: {},
          status: "IDLE",
        };
      }
      return state;
    }
    case ACTIONS.NESTEDFILTER_ADD_FILTER: {
      const { label, value } = action.payload;
      console.log(value);
      const newValues = {
        ...state.filteredOutValues,
        [label]: value,
      };
      return {
        ...state,
        filteredOutValues: newValues,
      };
    }
    case ACTIONS.NESTEDFILTER_TOGGLE_ONE: {
      const { label, value } = action.payload;
      const newFilteredOutValues = { ...state.filteredOutValues };
      console.log(label, value);
      const newLabel = newFilteredOutValues[label]
        ? newFilteredOutValues[label].find((item) => item === value)
          ? [...newFilteredOutValues[label]].filter((item) => item !== value)
          : [...newFilteredOutValues[label], value]
        : [value];
      const newValues = { ...newFilteredOutValues, [label]: newLabel };
      return {
        ...state,
        filteredOutValues: newValues,
      };
    }
    case ACTIONS.NESTEDFILTER_TOGGLE_ALL: {
      const { label, data } = action.payload;
      const filteredOutValues = state.filteredOutValues;
      const newFilteredOutValues =
        !filteredOutValues[label] || filteredOutValues[label].length === 0
          ? { ...filteredOutValues, [label]: data }
          : { ...filteredOutValues, [label]: [] };
      return {
        ...state,
        filteredOutValues: newFilteredOutValues,
      };
    }
    case ACTIONS.TOURTABLE_CHANGE_TOURDATE: {
      const { date } = action.payload;

      return {
        ...state,
        tourDate: date,
      };
    }

    default:
      return state;
  }
}

const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

function createNamedWrapperReducer(reducerFunction, reducerName) {
  return (state, action) => {
    const { name } = action;
    const isInitializationCall = state === undefined;
    if (name !== reducerName && !isInitializationCall) return state;

    return reducerFunction(state, action);
  };
}

const rootReducer = combineReducers({
  tourTable: createNamedWrapperReducer(MyReducer, "tourTable"),
  workHours: createNamedWrapperReducer(MyReducer, "WorkHours"),
  // counterB: MyReducer,
});

// const rootReducer = combineReducers({
//   tourTable: MyReducer,
//   Arbeitszeiten: MyReducer,
//   // counterB: MyReducer,
// });

export function createReduxStore() {
  const store = createStore(rootReducer, enableReduxDevTools);
  console.log(store.getState());
  return store;
}
