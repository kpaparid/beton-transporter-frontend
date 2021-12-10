import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
// import { API } from "../myComponents/MyConsts";
import {
  calcFilters,
  mapPromiseData,
  mapWork,
  filtersToUrl,
  normalizeApi,
  parsePagination,
  calcSort,
  sortToUrl,
  normalizeInitApi,
} from "../../api/apiMappers";
import { getGridLabelFn, getGridUrl } from "../myComponents/util/labels";
import { useAuth } from "../../contexts/AuthContext";
import { API2 } from "../myComponents/MyConsts";
import { reduce } from "lodash";

const myInitialState = {};

function createGenericSlice(sliceName) {
  const metaAdapter = createEntityAdapter();
  const usersAdapter = createEntityAdapter();
  const tablesAdapter = createEntityAdapter();
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

  const modesSelectById = (state, id) =>
    modesAdapter.getSelectors().selectById(state.modes, id);
  const tablesSelectById = (state, id) =>
    tablesAdapter.getSelectors().selectById(state.tables, id);
  const labelsSelectById = (state, id) =>
    labelsAdapter.getSelectors().selectById(state.labels, id);
  const changesSelectById = (state, id) =>
    changesAdapter.getSelectors().selectById(state.changes, id);
  const filtersSelectById = (state, id) =>
    filtersAdapter.getSelectors().selectById(state.filters, id);
  const fetchUpdatedEntity = createAsyncThunk(
    "data/fetchUpdatedEntity",
    async (
      {
        entityId,
        initialFilters: addInitialFilters,
        initialSort: addInitialSort,
        ...meta
      },
      thunkAPI
    ) => {
      const state = thunkAPI.getState();
      const {
        sort,
        filters,
        initialFilters,
        initialSort,
        pagination: { limit, page },
        header,
      } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].tables, entityId);

      const newInitialFilters = {
        ...initialFilters,
        ...addInitialFilters,
      };
      const newInitialSort = {
        ...initialSort,
        ...addInitialSort,
      };
      const filterLink = filtersToUrl(newInitialFilters);
      const sortLink = sortToUrl(newInitialSort);

      const realPage = parseInt(page) - 1;
      const url = getGridUrl(entityId);
      const finalUrl =
        url +
        "?" +
        filterLink +
        "&page=" +
        (realPage > 0 ? realPage : 0) +
        "&size=" +
        limit +
        sortLink;
      return await fetch(finalUrl, header)
        .then((res) =>
          res.json().then(({ data }) => {
            return {
              data: data.content || data,
              entityId,
              initialSort: newInitialSort,
              initialFilters: newInitialFilters,
              ...meta,
            };
          })
        )
        .catch((e) => ({
          data: [],
          entityId,
          url,
          pagination: { page: 0, limit, rowsCount: 0, pagesCount: 0 },
        }));
    }
  );
  const fetchAndInitEntityGrid = createAsyncThunk(
    "data/fetchAndInitEntityGrid",
    async (
      {
        entityId,
        url,
        page = "0",
        limit = "20",
        initialFilters,
        initialSort,
        header,
        ...meta
      },
      thunkAPI
    ) => {
      const state = thunkAPI.getState();
      const newInitialFilters = {
        ...tablesAdapter
          .getSelectors()
          .selectById(state[sliceName].tables, entityId).initialFilters,
        ...initialFilters,
      };
      const newInitialSort = {
        ...tablesAdapter
          .getSelectors()
          .selectById(state[sliceName].tables, entityId).initialSort,
        ...initialSort,
      };
      const filterLink = filtersToUrl(newInitialFilters);
      const sortLink = sortToUrl(newInitialSort);

      const finalUrl =
        url + "?" + filterLink + "&page=" + page + "&size=" + limit + sortLink;

      return await fetch(finalUrl)
        .then((res) =>
          res.json().then(({ data }) => {
            return {
              data: data.content || data,
              entityId,
              initialFilters: newInitialFilters,
              initialSort: newInitialSort,
              pagination: parsePagination({ res: data, page, limit }),
              ...meta,
            };
          })
        )
        .catch((e) => ({
          data: [],
          entityId,
          initialFilters: newInitialFilters,
          url,
          initialSort: newInitialSort,
          pagination: { page, limit, rowsCount: 0, pagesCount: 0 },
        }));
    }
  );
  const fetchMeta = createAsyncThunk("data/fetchMeta", async (filter = "") => {
    return await fetch(API2 + "values" + filter).then((res) => res.json());
  });
  const postRows = createAsyncThunk(
    "data/postRows",
    async (entityId, thunkAPI) => {
      const state = thunkAPI.getState();
      const { changes, addRow, postInitialValues, rows } =
        tablesSelector.selectById(thunkAPI.getState(), entityId);
      const url = getGridUrl(entityId);
      const c = changesSelector
        .selectAll(state)
        .reduce((a, b) => ({ ...a, [b.id]: { ...rows[b.id], ...b } }), {
          // addRow: rows[addRow],
        });

      const body = changes.map((bodyE) => {
        const rest = Object.keys(c[bodyE]);
        const startingValue =
          bodyE === Object.keys(addRow)[0]
            ? postInitialValues
            : { id: bodyE, ...postInitialValues };
        const r = rest
          .filter((e) => e !== "id")
          .reduce(
            (a, b) => ({
              ...a,
              [labelsSelector.selectById(state, b).idx]: c[bodyE][b],
            }),
            { ...startingValue }
          );
        return r;
      });
      // console.log(changes);
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };
      return await fetch(url, requestOptions).then((res) => res.json());
    }
  );
  const deleteRows = createAsyncThunk(
    "data/deleteRows",
    async (entityId, thunkAPI) => {
      const state = thunkAPI.getState();
      const { selectedRows } = tablesSelector.selectById(
        thunkAPI.getState(),
        entityId
      );
      const url = getGridUrl(entityId);
      const finalUrl = url + "/" + selectedRows.join(",");

      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      return await fetch(finalUrl, requestOptions).then((res) => res.json());
    }
  );
  const fetchPage = createAsyncThunk(
    "data/fetchUpdatedEntity",
    async ({ entityId, page = "1" }, thunkAPI) => {
      const state = thunkAPI.getState();
      const {
        sort,
        filters,
        initialFilters,
        initialSort,
        pagination: { limit },
        header,
      } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].tables, entityId);
      const filterLink = filtersToUrl(
        { ...initialFilters, ...filters },
        initialFilters
      );
      const url = getGridUrl(entityId);
      const sortLink = sortToUrl(sort, initialSort);
      const finalUrl =
        url + "?" + filterLink + "&page=" + page + "&size=" + limit + sortLink;
      return await fetch(finalUrl, header)
        .then((res) =>
          res.json().then(({ data }) => {
            return {
              data: data.content || data,
              entityId,
              filters,
              initialFilters,
              pagination: parsePagination({ res: data, page, limit }),
              // url,
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
    "data/fetchUpdatedEntity",
    async (
      { entityId, filter: { label, value, action, gte, lte } },
      thunkAPI
    ) => {
      const state = thunkAPI.getState();
      const {
        filters,
        sort,
        initialFilters,
        initialSort,
        pagination: { limit },
        header,
      } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].tables, entityId);
      const url = getGridUrl(entityId);
      const page = 0;
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
        url + "?" + filterLink + "&page=" + page + "&size=" + limit + sortLink;

      return await fetch(finalUrl, header).then((res) =>
        res
          .json()
          .then(({ data }) => {
            return {
              data: data.content || data,
              entityId,
              filters: newFilters,
              initialFilters,
              pagination: parsePagination({ res: data, page, limit }),
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
    "data/fetchUpdatedEntity",
    async ({ entityId, labelId }, thunkAPI) => {
      const state = thunkAPI.getState();

      const {
        filters,
        sort,
        initialFilters,
        initialSort,
        pagination: { limit, page },
        header,
      } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].tables, entityId);

      const url = getGridUrl(entityId);
      const filterLink = filtersToUrl(
        { ...initialFilters, ...filters },
        initialFilters
      );
      const { idx } = tablesAdapter
        .getSelectors()
        .selectById(state[sliceName].labels, labelId);
      const calculatedSort = calcSort(sort, idx);
      const sortLink = sortToUrl(calculatedSort, initialSort);
      const realPage = parseInt(page) - 1;
      const { id, order } = calculatedSort;
      const finalUrl =
        url +
        "?" +
        filterLink +
        "&page=" +
        (realPage > 0 ? realPage : 0) +
        "&size=" +
        limit +
        sortLink;
      return await fetch(finalUrl, header)
        .then((res) =>
          res.json().then(({ data }) => {
            return {
              data: data.content || data,
              entityId,
              filters,
              initialFilters,
              initialSort,
              pagination: parsePagination({ res: data, page: realPage, limit }),
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
  const slice = createSlice({
    name: sliceName,
    initialState: {
      meta: metaAdapter.getInitialState(),
      tables: tablesAdapter.getInitialState(),
      // rows: rowsAdapter.getInitialState(),
      dates: datesAdapter.getInitialState(),
      labels: labelsAdapter.getInitialState(),
      changes: changesAdapter.getInitialState(),
      modes: modesAdapter.getInitialState(),
      filters: filtersAdapter.getInitialState(),
      users: usersAdapter.getInitialState(),
    },
    extraReducers: {
      [fetchMeta.fulfilled](state, { payload }) {
        state.loading = false;
        console.log("fullfiled", payload);
        const data = payload.reduce((a, b) => ({ ...a, [b.id]: b.values }), {});
        metaAdapter.upsertOne(state.meta, { id: "constants", ...data });
      },
      [fetchAndInitEntityGrid.pending](
        state,
        {
          meta: {
            arg: { entityId },
          },
        }
      ) {
        tablesAdapter.upsertOne(state.tables, { id: entityId, loading: true });
      },
      [fetchAndInitEntityGrid.fulfilled](state, { payload }) {
        const { data, entityId, ...meta } = payload;
        console.log("fullfiled", entityId);
        const mapped = mapPromiseData(data, entityId);
        const { tables, labels, modes } = normalizeInitApi({
          data: mapped,
          meta: { ...meta, loading: false },
        });
        tablesAdapter.setMany(state.tables, tables);
        labelsAdapter.upsertMany(state.labels, labels);
        modesAdapter.upsertMany(state.modes, modes);
        state.loading = false;
      },
      [fetchUpdatedEntity.fulfilled](state, { payload }) {
        const { data, entityId, ...meta } = payload;
        console.log("fullfiled", entityId);
        const mapped = mapPromiseData(data, entityId);
        const { tables, modes } = normalizeApi({
          data: mapped,
          meta: { ...meta, loading: false },
        });

        tablesAdapter.upsertMany(state.tables, tables);
        modesAdapter.upsertMany(state.modes, modes);
        state.loading = false;
      },
      [postRows.fulfilled](state, { meta: { arg } }) {
        state.loading = false;
        console.log("post done", arg);
        const { changes, addRow } = tablesSelectById(state, arg);
        changesAdapter.removeMany(state.changes, [...changes, addRow]);
        modesAdapter.upsertOne(state.modes, {
          id: arg,
          value: false,
        });
      },
      [deleteRows.fulfilled](state, { meta: { arg } }) {
        state.loading = false;
        const { changes, selectedRows } = tablesSelectById(state, arg);
        const table = {
          id: arg,
          selectedRows: [],
          changes:
            changes && changes.filter((id) => !selectedRows.includes(id)),
        };
        tablesAdapter.upsertOne(state.tables, table);
      },
    },
    reducers: {
      addInitialFilter: (state, action) => {
        const { id, filter } = action.payload;
        const oldInitialFilters = tablesSelectById(state, id).initialFilters;
        tablesAdapter.upsertOne(state.tables, {
          id,
          initialFilters: { ...oldInitialFilters, ...filter },
        });
      },
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
        const allRows = Object.keys(tablesSelectById(state, id).rows).map((e) =>
          parseInt(e)
        );
        const newSelectedRows =
          ((!oldSelectedRows ||
            (oldSelectedRows.length >= 0 &&
              oldSelectedRows.length < allRows.length)) &&
            allRows) ||
          [];
        tablesAdapter.updateOne(state.tables, {
          id,
          changes: {
            selectedRows: newSelectedRows,
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
        const {
          id,
          rowId,
          changes: { labelId, value },
        } = action.payload;

        const oldChangesIds = tablesSelectById(state, id).changes || [];
        const newChanges = oldChangesIds.includes(rowId)
          ? oldChangesIds
          : oldChangesIds.concat(rowId);

        const oldChanges = changesSelectById(state, rowId);
        // const oldRow = rowsSelectById(state, rowId);
        const oldRow = tablesSelectById(state, id).rows[rowId];
        const newRow = { ...oldRow, ...oldChanges };
        const { links = [], idx } = labelsSelectById(state, labelId);
        const changesById = {
          [labelId]: value,
          ...links.reduce((a, { connection, connectionIdx, dependencies }) => {
            const format = getGridLabelFn(id, connectionIdx);
            return {
              ...a,
              [connection]: format(
                dependencies.map((d) => {
                  return d === labelId ? value : newRow[d];
                })
              ),
            };
          }, {}),
        };
        tablesAdapter.upsertOne(state.tables, {
          id,
          changes: newChanges,
        });
        changesAdapter.upsertOne(state.changes, {
          id: rowId,
          ...changesById,
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
      addTableDate: (state, action) => {
        const { id, date } = action.payload;
        tablesAdapter.upsertOne(state.tables, { id, date });
      },
    },
  });

  return {
    slice,
    selectors: {
      tablesSelector,
      labelsSelector,
      // rowsSelector,
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
      fetchEntityGrid: fetchAndInitEntityGrid,
      fetchUpdatedEntity,
      fetchSortedEntityGrid,
      fetchPage,
      saveChanges: postRows,
      deleteRows,
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
