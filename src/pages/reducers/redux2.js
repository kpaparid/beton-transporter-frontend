import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { API } from "../myComponents/MyConsts";
import {
  calcFilters,
  mapPromiseData,
  mapWork,
  filtersToUrl,
  normalizeApi,
  parsePagination,
  calcSort,
  sortToUrl,
} from "../../api/apiMappers";

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
  const modesAdapter = createEntityAdapter();
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
  const modesSelector = modesAdapter.getSelectors(
    (state) => state[sliceName].modes
  );
  const filtersSelector = filtersAdapter.getSelectors(
    (state) => state[sliceName].filters
  );

  const rowsSelectIds = (state) =>
    rowsAdapter.getSelectors().selectEntities(state.rows);
  const modesSelectById = (state, id) =>
    modesAdapter.getSelectors().selectById(state.modes, id);
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

  const fetchMeta = createAsyncThunk("data/fetchMeta", async () => {
    return await fetch(API + "values").then((res) => res.json());
  });

  const fetchEntityGrid = createAsyncThunk(
    "data/fetchEntityGrid",
    async (
      { entityId, url, page = "1", limit = "20", initialFilters, initialSort },
      thunkAPI
    ) => {
      const state = thunkAPI.getState();
      const newInitialFilters = {
        ...tablesAdapter
          .getSelectors()
          .selectById(state[sliceName].tables, entityId).initialFilters,
        ...initialFilters,
      };
      const filterLink = filtersToUrl(newInitialFilters);
      const sortLink = sortToUrl(initialSort);

      const finalUrl =
        API +
        url +
        "?" +
        filterLink +
        "&_page=" +
        page +
        "&_limit=" +
        limit +
        sortLink;

      return await fetch(finalUrl)
        .then((res) =>
          res.json().then((data) => {
            return {
              data,
              entityId,
              initialFilters: newInitialFilters,
              url,
              initialSort,
              pagination: parsePagination({ res, page, limit }),
            };
          })
        )
        .catch((e) => ({
          data: [],
          entityId,
          initialFilters: newInitialFilters,
          url,
          initialSort,
          pagination: { page, limit, rowsCount: 0, pagesCount: 0 },
        }));
    }
  );
  const fetchPage = createAsyncThunk(
    "data/fetchEntityGrid",
    async ({ entityId, page = "1" }, thunkAPI) => {
      const state = thunkAPI.getState();
      const {
        sort,
        url,
        filters,
        initialFilters,
        initialSort,
        pagination: { limit },
      } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].tables, entityId);
      const filterLink = filtersToUrl(
        { ...initialFilters, ...filters },
        initialFilters
      );

      const sortLink = sortToUrl(sort, initialSort);
      const finalUrl =
        API +
        url +
        "?" +
        filterLink +
        "&_page=" +
        page +
        "&_limit=" +
        limit +
        sortLink;
      return await fetch(finalUrl)
        .then((res) =>
          res.json().then((data) => {
            return {
              data,
              entityId,
              filters,
              initialFilters,
              pagination: parsePagination({ res, page, limit }),
              url,
              sort,
            };
          })
        )
        .catch((e) => ({
          data: [],
          entityId,
          url,
          pagination: { page, limit, rowsCount: 0, pagesCount: 0 },
        }));
    }
  );
  const fetchFiltered = createAsyncThunk(
    "data/fetchEntityGrid",
    async (
      { entityId, filter: { label, value, action, gte, lte } },
      thunkAPI
    ) => {
      const state = thunkAPI.getState();
      const {
        filters,
        sort,
        url,
        initialFilters,
        initialSort,
        pagination: { limit, page },
      } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].tables, entityId);

      const idx =
        label &&
        tablesAdapter.getSelectors().selectById(state[sliceName].labels, label)
          .idx;
      const newFilters =
        action === "resetAll"
          ? null
          : calcFilters(filters, {
              label: idx,
              value:
                action === "toggleAll"
                  ? metaAdapter
                      .getSelectors()
                      .selectById(state[sliceName].meta, "constants") &&
                    metaAdapter
                      .getSelectors()
                      .selectById(state[sliceName].meta, "constants")[idx]
                  : value && [value],
              gte,
              lte,
              action,
            });
      const filterLink = filtersToUrl(
        { ...initialFilters, ...newFilters },
        initialFilters
      );
      const sortLink = sortToUrl(sort, initialSort);
      const finalUrl =
        API +
        url +
        "?" +
        filterLink +
        "&_page=" +
        page +
        "&_limit=" +
        limit +
        sortLink;

      return await fetch(finalUrl).then((res) =>
        res
          .json()
          .then((data) => {
            return {
              data,
              entityId,
              filters: newFilters,
              initialFilters,
              pagination: parsePagination({ res, page, limit }),
              url,
              sort,
            };
          })
          .catch((e) => ({
            data: [],
            entityId,
            initialFilters,
            filters: newFilters,
            url,
            sort,
            pagination: { page, limit, rowsCount: 0, pagesCount: 0 },
          }))
      );
    }
  );
  const fetchSortedEntityGrid = createAsyncThunk(
    "data/fetchEntityGrid",
    async ({ entityId, labelId }, thunkAPI) => {
      const state = thunkAPI.getState();

      const {
        filters,
        sort,
        url,
        initialFilters,
        initialSort,
        pagination: { limit, page },
      } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].tables, entityId);

      const filterLink = filtersToUrl(
        { ...initialFilters, ...filters },
        initialFilters
      );
      const { idx } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].labels, labelId);
      const c = calcSort(sort, idx);
      const sortLink = sortToUrl(c, initialSort);
      const { id, order } = c;
      const finalUrl =
        API +
        url +
        "?" +
        filterLink +
        "&_page=" +
        page +
        "&_limit=" +
        limit +
        sortLink;
      return await fetch(finalUrl)
        .then((res) =>
          res.json().then((data) => {
            return {
              data,
              entityId,
              filters,
              initialFilters,
              initialSort,
              pagination: parsePagination({ res, page, limit }),
              url,
              sort: order && { id, order },
            };
          })
        )
        .catch((e) => ({
          data: [],
          entityId,
          initialFilters,
          initialSort,
          filters,
          url,
          pagination: { page, limit, rowsCount: 0, pagesCount: 0 },
          sort:
            order !== "" &&
            (order !== "initial" ? { id: idx, order } : { ...initialSort }),
        }));
    }
  );
  const postRows = createAsyncThunk("data/postRows", async (id, thunkAPI) => {
    console.log(thunkAPI);
    console.log(thunkAPI.getState()[sliceName]);
    // const changes = changesSelector.selectById(thunkAPI.getState(), id);
    // console.log(changes);
    return await fetch(API + "/tours").then((res) => res.json());
    // .then((_) => changes);
  });
  const slice = createSlice({
    name: sliceName,
    initialState: {
      meta: metaAdapter.getInitialState(),
      tables: tablesAdapter.getInitialState(),
      rows: rowsAdapter.getInitialState(),
      dates: datesAdapter.getInitialState(),
      labels: labelsAdapter.getInitialState(),
      changes: changesAdapter.getInitialState(),
      modes: modesAdapter.getInitialState(),
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
        const mode = modesSelectById(state, id).value;
        mode === "addRow" &&
          modesAdapter.upsertOne(state.modes, { id, value: "idle" });
        const newValue = oldValues.includes(columnId)
          ? oldValues.filter((v) => v !== columnId)
          : [...oldValues, columnId];
        tablesAdapter.upsertOne(state.tables, { id, selectedLabels: newValue });
      },
      changeMode: (state, action) => {
        const { entityId, mode } = action.payload;
        const oldValue = modesSelectById(state, entityId).value;
        mode === "addRow" &&
          tablesAdapter.upsertOne(state.tables, {
            id: entityId,
            selectedLabels: tablesSelectById(state, entityId).labels || [],
          });
        modesAdapter.upsertOne(state.modes, {
          id: entityId,
          value:
            mode === "edit" ? (oldValue === "edit" ? "idle" : "edit") : mode,
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
      onSelectRow: (state, action) => {
        const { id, rowId } = action.payload;
        const oldSelectedRows = tablesSelectById(state, id).selectedRows;
        const newV = oldSelectedRows.includes(rowId)
          ? oldSelectedRows.filter((r) => r !== rowId)
          : [...oldSelectedRows, rowId];
        tablesAdapter.updateOne(state.tables, {
          id,
          changes: {
            selectedRows: newV,
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

      addMeta: (state, action) => {
        metaAdapter.upsertMany(state.meta, action.payload);
      },
    },
    extraReducers: {
      [fetchMeta.fulfilled](state, { payload }) {
        state.loading = false;
        console.log("fullfiled", payload);
        const data = payload.reduce((a, b) => ({ ...a, [b.id]: b.values }), {});
        metaAdapter.upsertOne(state.meta, { id: "constants", ...data });
      },
      [fetchEntityGrid.pending](
        state,
        {
          meta: {
            arg: { entityId },
          },
        }
      ) {
        tablesAdapter.upsertOne(state.tables, { id: entityId, loading: true });
      },
      [fetchEntityGrid.fulfilled](state, { payload }) {
        const { data, entityId, ...meta } = payload;
        console.log("fullfiled", entityId);
        const { id, ...rest } = data;
        const mapped = mapPromiseData(rest, entityId);
        const { tables, rows, labels, modes } = normalizeApi({
          data: mapped,
          meta: { ...meta, loading: false },
        });

        tablesAdapter.upsertMany(state.tables, tables);
        rowsAdapter.upsertMany(state.rows, rows);
        labelsAdapter.upsertMany(state.labels, labels);
        modesAdapter.upsertMany(state.modes, modes);
        state.loading = false;
      },
      [postRows.fulfilled](state, { meta: { arg } }) {
        state.loading = false;
        console.log("post done", arg);
        const changesIds = tablesSelectById(state, arg).changes || [];
        const newRows = changesIds.map((id) => changesSelectById(state, id));
        rowsAdapter.upsertMany(state.rows, newRows);
        changesAdapter.removeMany(state.changes, changesIds);
        tablesAdapter.upsertOne(state.tables, { id: arg, changes: [] });
        modesAdapter.upsertOne(state.modes, {
          id: arg,
          value: false,
        });
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
      modesSelector,
      filtersSelector,
      usersSelector,
      metaSelector,
    },
    reducer: slice.reducer,
    actions: {
      ...slice.actions,
      fetchMeta,
      fetchEntityGrid,
      fetchSortedEntityGrid,
      fetchPage,
      saveChanges: postRows,
      fetchFiltered,
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
