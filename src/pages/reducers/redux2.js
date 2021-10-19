import { getInitialGridState } from "@mui/x-data-grid";
import { normalize, schema } from "normalizr";
import { createStore, applyMiddleware } from "redux";
import {
  combineReducers,
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import produce, { current } from "immer";
import { isEqual } from "lodash";
import moment from "moment";
import { useCallback } from "react";
import { mapData, filtersToUrl, getGridUrl } from "../myComponents/MyConsts";
import {
  mapPromiseData,
  mapWork,
  mapWorkHours,
  normalizeApi,
  normalizeRows,
} from "../myComponents/util/apiMappers";

const myInitialState = {};

export const reducer = (props) => {
  const { data, labels, date } = props;

  // const dataById = action.payload;
  // const dataAllId = Object.keys(dataById);
  // console.log({ props });
  const byId = data
    .map(({ id, ...rest }) => ({ [id]: { ...rest } }))
    .reduce((prev, curr) => ({ ...prev, ...curr }));
  const allId = Object.keys(byId);
  const labelsById = labels
    .map((label, index) => ({
      [label.id]: { ...label, priority: index },
    }))
    .reduce((prev, curr) => ({ ...prev, ...curr }));
  const allLabelsId = Object.keys(labelsById);
  const checkedLabelsId = [...allLabelsId];

  return {
    date,
    status: "IDLE",
    // checkedId: [],
    changesById: {},
    // editMode: false,
    // filteredOutValues: {},
    byId,
    allId,
    labelsById,
    allLabelsId,
    checkedLabelsId,
  };
};

function createGenericSlice(sliceName) {
  const metaAdapter = createEntityAdapter();
  const usersAdapter = createEntityAdapter();
  const tablesAdapter = createEntityAdapter();
  const rowsAdapter = createEntityAdapter();
  const datesAdapter = createEntityAdapter();
  const labelsAdapter = createEntityAdapter();
  const changesAdapter = createEntityAdapter();
  const editModesAdapter = createEntityAdapter();
  const filtersAdapter = createEntityAdapter();

  const metaSelector = metaAdapter.getSelectors(
    (state) => state[sliceName].meta
  );
  const usersSelector = usersAdapter.getSelectors(
    (state) => state[sliceName].users
  );
  const tablesSelector = tablesAdapter.getSelectors(
    (state) => state[sliceName].tables
  );
  const rowsSelector = rowsAdapter.getSelectors(
    (state) => state[sliceName].rows
  );
  const datesSelector = datesAdapter.getSelectors(
    (state) => state[sliceName].dates
  );
  const labelsSelector = labelsAdapter.getSelectors(
    (state) => state[sliceName].labels
  );
  const changesSelector = changesAdapter.getSelectors(
    (state) => state[sliceName].changes
  );
  const editModesSelector = editModesAdapter.getSelectors(
    (state) => state[sliceName].editModes
  );
  const filtersSelector = filtersAdapter.getSelectors(
    (state) => state[sliceName].filters
  );

  const rowsSelectIds = (state) =>
    rowsAdapter.getSelectors().selectEntities(state.rows);
  const editModesSelectById = (state, id) =>
    editModesAdapter.getSelectors().selectById(state.editModes, id);
  const tablesSelectById = (state, id) =>
    tablesAdapter.getSelectors().selectById(state.tables, id);
  const changesSelectById = (state, id) =>
    changesAdapter.getSelectors().selectById(state.changes, id);
  const rowsSelectById = (state, id) =>
    rowsAdapter.getSelectors().selectById(state.rows, id);
  const filtersSelectById = (state, id) =>
    filtersAdapter.getSelectors().selectById(state.filters, id);
  const filtersSelectByAction = (state, id, operator) =>
    (filtersSelectById(state, id) && filtersSelectById(state, id)[operator]) ||
    [];

  const fetchUsers = createAsyncThunk("data/fetchUser", async () => {
    return await fetch("http://127.0.0.1:8887/users.json").then((res) =>
      res.json()
    );
  });

  const fetchEntityGrid = createAsyncThunk(
    "data/fetchEntityGrid",
    async ({ entityId, url }) => {
      return await fetch("http://127.0.0.1:8887/" + url)
        .then((res) => res.json())
        .then((data) => ({ data, entityId }))
        .catch((e) => ({ data: { [entityId]: [] }, entityId }));
    }
  );

  const fetchData = createAsyncThunk("data/fetchData", async () => {
    const id = "user1";
    const date = "_" + "09.2021";
    const f = [
      fetch(
        "http://127.0.0.1:8887/users/" + id + "/workhours" + date + ".json"
      ),
      fetch("http://127.0.0.1:8887/users/" + id + "/absent.json"),
      fetch("http://127.0.0.1:8887/users/" + id + "/vacations.json"),
      fetch("http://127.0.0.1:8887/users/" + id + "/workhours-bank.json"),
    ];
    return await Promise.all(f)
      .then(function (responses) {
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );
      })
      .then(function (data) {
        console.log(data);
        return data;
      });

    // return await fetch(
    //   "http://127.0.0.1:8887/users/Uwe%20Schwille/workhours.json"
    //   // "http://127.0.0.1:8887/workhours.json"
    // ).then((res) => res.json());
  });
  const postRows = createAsyncThunk("data/postRows", async (id, thunkAPI) => {
    console.log(thunkAPI);
    console.log(thunkAPI.getState()[sliceName]);
    // const changes = changesSelector.selectById(thunkAPI.getState(), id);
    // console.log(changes);
    return await fetch("http://127.0.0.1:8887/workhours.json").then((res) =>
      res.json()
    );
    // .then((_) => changes);
  });
  function addFilter(props) {
    const { id, filter } = props;
    console.log(props);
    console.log("Add filter", id);
    const filterUrl = "";
    // const c = filtersAdapter.getSelectors().selectById(state.filters, id)
    // console.log(c)
    return fetchFilteredData({ id, filter });
  }
  const fetchFilteredData = createAsyncThunk(
    "data/fetchFilteredData",
    async ({ id, filter }, thunkAPI) => {
      return await fetch(
        "http://127.0.0.1:8887/users/Uwe%20Schwille/workhours-filtered.json"
      )
        .then((res) => res.json())
        .then((res) => ({ res: res, filter, id }));
    },
    {
      // condition: ({ id, filter: { label } }, { getState, extra }) => {
      //   return (
      //     filtersSelector.selectById(getState(), id).labels[label] !== undefined
      //   );
      // },
    }
  );

  const slice = createSlice({
    name: sliceName,
    initialState: {
      meta: metaAdapter.getInitialState(),
      tables: tablesAdapter.getInitialState(),
      rows: rowsAdapter.getInitialState(),
      dates: datesAdapter.getInitialState(),
      labels: labelsAdapter.getInitialState(),
      changes: changesAdapter.getInitialState(),
      editModes: editModesAdapter.getInitialState(),
      filters: filtersAdapter.getInitialState(),
      users: usersAdapter.getInitialState(),
    },
    reducers: {
      changeCurrentUser: (state, action) => {
        metaAdapter.upsertOne(state.meta, {
          id: "user",
          value: action.payload,
        });
      },
      toggleColumn: (state, action) => {
        const { id, columnId } = action.payload;
        const oldValues = tablesSelectById(state, id).selectedLabels;
        const newValue = oldValues.includes(columnId)
          ? oldValues.filter((v) => v !== columnId)
          : [...oldValues, columnId];
        tablesAdapter.upsertOne(state.tables, { id, selectedLabels: newValue });
      },
      toggleEdit: (state, action) => {
        const id = action.payload;
        const oldValue = editModesSelectById(state, id).value;
        editModesAdapter.updateOne(state.editModes, {
          id,
          changes: {
            value: !oldValue,
          },
        });
      },
      toggleAllChecked: (state, action) => {
        const id = action.payload;
        console.log("ToggleAll", id);

        const oldSelectedRows = tablesSelectById(state, id).selectedRows;
        const allRows = tablesSelectById(state, id).rows;
        tablesAdapter.updateOne(state.tables, {
          id,
          changes: {
            selectedRows:
              ((!oldSelectedRows ||
                (oldSelectedRows.length >= 0 &&
                  oldSelectedRows.length < allRows.length)) &&
                allRows) ||
              [],
          },
        });
      },
      closeAllChecked: (state, action) => {
        const id = action.payload;
        tablesAdapter.updateOne(state.tables, {
          id,
          changes: {
            selectedRows: [],
          },
        });
      },
      setSelectedRows: (state, action) => {
        const { id, rows } = action.payload;
        tablesAdapter.updateOne(state.tables, {
          id,
          changes: {
            selectedRows: rows,
          },
        });
      },
      addChange: (state, action) => {
        const { id, rowId, changes } = action.payload;
        const originalRow = rowsSelectById(state, rowId);
        changesAdapter.upsertOne(state.changes, { id: rowId, ...changes });

        const oldChangesIds = tablesSelectById(state, id).changes || [];
        const sad = "";
        const newChanges = oldChangesIds.concat(rowId);
        tablesAdapter.upsertOne(state.tables, {
          id,
          changes: newChanges,
        });
      },
      resetChanges: (state, action) => {
        const id = action.payload;
        const changesIds = tablesSelectById(state, id).changes || [];
        changesAdapter.removeMany(state.changes, changesIds);
        console.log({ changesIds });
        tablesAdapter.upsertOne(state.tables, { id, changes: [] });
      },

      changeDate: (state, action) => {
        metaAdapter.upsertOne(state.meta, {
          id: "date",
          value: action.payload,
        });
      },
    },
    extraReducers: {
      [fetchUsers.pending](state) {
        state.loading = true;
      },
      [fetchUsers.fulfilled](state, { payload }) {
        state.loading = false;
        console.log("fullfiled", payload);

        const data = payload.users;

        usersAdapter.setAll(state.users, data);
        metaAdapter.upsertMany(state.meta, [
          {
            id: "user",
            value: data[0].id,
          },
          {
            id: "date",
            value: moment().format("MM/YYYY"),
          },
        ]);
      },
      [fetchUsers.rejected](state) {
        state.loading = false;
      },

      [fetchData.pending](state) {
        state.loading = true;
      },

      [fetchEntityGrid.fulfilled](state, { payload }) {
        state.loading = false;
        const { data, entityId } = payload;
        console.log("fullfiled", entityId);
        const { id, ...rest } = data;
        const mapped = mapPromiseData(rest, entityId);

        const { tables, rows, labels, editModes } = normalizeApi({
          data: mapped,
        });
        tablesAdapter.upsertMany(state.tables, tables);
        rowsAdapter.upsertMany(state.rows, rows);
        labelsAdapter.upsertMany(state.labels, labels);
        editModesAdapter.upsertMany(state.editModes, editModes);
      },
      [fetchEntityGrid.rejected](state) {
        state.loading = false;
      },

      [fetchEntityGrid.pending](state) {
        state.loading = true;
      },

      [fetchData.fulfilled](state, { payload }) {
        state.loading = false;
        console.log("fullfiled", payload);
        const data = payload.reduce((a, b) => ({ ...a, ...b }), {});
        const mapped = mapWork(data);

        const { tables, rows, labels, editModes } = normalizeApi({
          data: mapped.tables,
        });
        tablesAdapter.setAll(state.tables, tables);
        rowsAdapter.setAll(state.rows, rows);
        labelsAdapter.setAll(state.labels, labels);
        editModesAdapter.setAll(state.editModes, editModes);
      },
      [fetchData.rejected](state) {
        state.loading = false;
      },
      [postRows.rejected](state) {
        state.loading = false;
      },
      [postRows.pending](state) {
        state.loading = true;
      },
      [postRows.fulfilled](state, { meta: { arg } }) {
        state.loading = false;
        console.log("post done", arg);
        const changesIds = tablesSelectById(state, arg).changes || [];
        const newRows = changesIds.map((id) => changesSelectById(state, id));
        rowsAdapter.upsertMany(state.rows, newRows);
        changesAdapter.removeMany(state.changes, changesIds);
        tablesAdapter.upsertOne(state.tables, { id: arg, changes: [] });
        editModesAdapter.upsertOne(state.editModes, {
          id: arg,
          value: false,
        });
      },
      [fetchFilteredData.rejected](state) {
        state.loading = false;
      },
      [fetchFilteredData.pending](state) {
        state.loading = true;
      },
      [fetchFilteredData.fulfilled](state, { payload }) {
        console.log("fetch filter fullfilled", payload);
        const {
          res,
          id,
          filter: { label, value, gte, lte, action },
        } = payload;

        switch (action) {
          case "toggle": {
            const values = filtersSelectByAction(state, label, "neq");
            const newValues = values.includes(value)
              ? values.filter((v) => v !== value)
              : [...values, value];
            filtersAdapter.upsertOne(state.filters, {
              id: label,
              neq: newValues,
            });
            break;
          }
          case "toggleAll": {
            const ids = tablesSelectById(state, id).rows;
            const rows = rowsSelectIds(state);
            const values = ids.reduce((a, b) => [...a, rows[b][label]], []);
            const availableValues = [...new Set(values)];
            console.log(current(rows));
            const neq =
              filtersSelectByAction(state, label, "neq").length === 0
                ? availableValues
                : [];
            filtersAdapter.upsertOne(state.filters, {
              id: label,
              neq,
            });
            break;
          }
          case "between": {
            filtersAdapter.upsertOne(state.filters, {
              id: label,
              gte,
              lte,
            });
            break;
          }
          case "reset": {
            filtersAdapter.removeOne(state.filters, label);
            break;
          }
          case "resetAll": {
            filtersAdapter.removeAll(state.filters);
            break;
          }
          default:
            break;
        }

        const nanoids = tablesSelectById(state, id).nanoids;
        const { rows, tables } = normalizeRows(
          { [id]: res },
          { [id]: nanoids }
        );
        tablesAdapter.upsertMany(state.tables, tables);
        rowsAdapter.upsertMany(state.rows, rows);
      },
    },
  });

  return {
    slice,
    selectors: {
      tablesSelector,
      labelsSelector,
      rowsSelector,
      datesSelector,
      changesSelector,
      editModesSelector,
      filtersSelector,
      usersSelector,
      metaSelector,
    },
    reducer: slice.reducer,
    actions: {
      ...slice.actions,
      fetchData,
      fetchUsers,
      fetchEntityGrid,
      saveChanges: postRows,
      addFilter,
    },
  };
}

export const toursSlice = createGenericSlice("tourTable");
export const workHoursSlice = createGenericSlice("workHoursTable");

export function createReduxStore2() {
  const store = configureStore({
    reducer: {
      // toursTable: tourTableSlice.reducer,
      workHoursTable: workHoursSlice.reducer,
    },
    devTools: window.__REDUX_DEVTOOLS_EXTENSION__?.(),
  });
  return store;
}

// const store = createStore(
//   yourReducer,
//   composeEnhancers(applyMiddleware(/* put your middlewares here */))
// );
