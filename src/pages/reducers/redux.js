import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import {
  calcFilters,
  calcSort,
  filtersToUrl,
  mapPromiseData,
  normalizeApi,
  normalizeInitApi,
  parsePagination,
  sortToUrl,
} from "../../api/apiMappers";
import {
  getGridDeleteMapper,
  getGridLabelFn,
  getGridPostMapper,
  getGridUrl,
} from "../myComponents/util/labels";

const API = process.env.REACT_APP_API_URL;

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

  const fetchUpdatedEntity = createAsyncThunk(
    "data/fetchUpdatedEntity",
    async (
      {
        entityId,
        filters: addFilters,
        initialFilters: addInitialFilters,
        initialSort: addInitialSort,
        header,
        ...meta
      },
      thunkAPI
    ) => {
      const state = thunkAPI.getState();
      const { sort, filters, initialFilters, initialSort, pagination } =
        tablesAdapter
          .getSelectors()
          .selectById(state[sliceName].tables, entityId);

      const page = 0;
      const limit = pagination?.limit;
      const newFilters = { ...filters };
      const newInitialFilters = {
        ...initialFilters,
        ...addInitialFilters,
      };
      const newInitialSort = {
        ...initialSort,
        ...addInitialSort,
      };
      const filterLink = filtersToUrl({
        ...initialFilters,
        ...newInitialFilters,
      });
      const sortLink = sortToUrl(sort, newInitialSort);
      const url = getGridUrl(entityId);

      const pageSuffix =
        page !== null && page !== undefined && limit
          ? "&page=" + page + "&size=" + limit
          : "";
      const urlSuffix = filterLink + sortLink + pageSuffix;
      const finalUrl = url + (urlSuffix.trim() !== "" ? "?" + urlSuffix : "");

      const requestOptions = {
        method: "GET",
        headers: header,
      };
      return await fetch(finalUrl, requestOptions).then((res) =>
        res.json().then(({ data }) => {
          return {
            data: data.content || data,
            entityId,
            initialSort: newInitialSort,
            initialFilters: newInitialFilters,
            filters: newFilters,
            pagination:
              page !== null &&
              page !== undefined &&
              limit &&
              parsePagination({ res: data, page, limit }),
            ...meta,
            ...meta,
          };
        })
      );
    }
  );
  const fetchAndInitEntityGrid = createAsyncThunk(
    "data/fetchAndInitEntityGrid",
    async (
      {
        entityId,
        url,
        page,
        limit,
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
      const pageSuffix =
        page !== null && page !== undefined && limit
          ? "&page=" + page + "&size=" + limit
          : "";
      const urlSuffix = filterLink + sortLink + pageSuffix;
      const finalUrl = url + (urlSuffix.trim() !== "" ? "?" + urlSuffix : "");
      const requestOptions = {
        method: "GET",
        headers: header,
      };
      return await fetch(finalUrl, requestOptions)
        .then((res) =>
          res.json().then(({ data, status }) => {
            if (status !== 200)
              throw new Error("stop the work, this has been aborted!");
            return {
              data: data.content || data,
              entityId,
              initialFilters: newInitialFilters,
              initialSort: newInitialSort,
              pagination:
                page !== null &&
                page !== undefined &&
                limit &&
                parsePagination({ res: data, page, limit }),
              ...meta,
            };
          })
        )
        .catch(() => ({
          data: [],
          entityId,
        }));
    }
  );
  const fetchMeta = createAsyncThunk(
    "data/fetchMeta",
    async ({ header, labels }) => {
      const requestOptions = {
        method: "GET",
        headers: header,
      };
      return await fetch(API + "settings", requestOptions).then((res) =>
        res.json().then(({ status, data }) => {
          if (status !== 200)
            throw new Error("stop the work, this has been aborted!");
          return { data, labels };
        })
      );
    }
  );
  const fetchDrivers = createAsyncThunk("data/fetchDrivers", async (header) => {
    const requestOptions = {
      method: "GET",
      headers: header,
    };
    return await fetch(API + "users/byRole/ROLE_DRIVER", requestOptions).then(
      (r) =>
        r.json().then(({ status, data }) => {
          if (status !== 200)
            throw new Error("stop the work, this has been aborted!");
          return data;
        })
    );
  });
  const fetchUsers = createAsyncThunk("data/fetchUsers", async (header) => {
    const requestOptions = {
      method: "GET",
      headers: header,
    };
    return await fetch(API + "users", requestOptions).then((res) =>
      res.json().then(({ data }) => data)
    );
  });
  const postRows = createAsyncThunk(
    "data/postRows",
    async ({ entityId, header }, thunkAPI) => {
      const { url, options } = getGridPostMapper({
        entityId,
        state: thunkAPI.getState(),
        tablesSelector,
        labelsSelector,
        changesSelector,
        metaSelector,
      });
      const requestOptions = {
        headers: header,
        ...options,
      };
      return await fetch(url, requestOptions).then((res) => res.json());
    }
  );
  const deleteRows = createAsyncThunk(
    "data/deleteRows",
    async ({ entityId, header }, thunkAPI) => {
      const { url, options } = getGridDeleteMapper({
        entityId,
        state: thunkAPI.getState(),
        tablesSelector,
        labelsSelector,
        changesSelector,
        metaSelector,
      });
      const requestOptions = {
        headers: header,
        ...options,
      };
      return await fetch(url, requestOptions).then((res) => res.json());
    }
  );
  const fetchPage = createAsyncThunk(
    "data/fetchUpdatedEntity",
    async ({ entityId, page = "1", header }, thunkAPI) => {
      const state = thunkAPI.getState();
      const {
        sort,
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
      const url = getGridUrl(entityId);
      const sortLink = sortToUrl(sort, initialSort);
      const realPage = page && parseInt(page) - 1 > 0 ? parseInt(page) - 1 : 0;
      const pageSuffix =
        page !== null && page !== undefined && limit
          ? "&page=" + page + "&size=" + limit
          : "";
      const urlSuffix = filterLink + sortLink + pageSuffix;
      const finalUrl = url + "?" + urlSuffix;

      const requestOptions = {
        method: "GET",
        headers: header,
      };
      return await fetch(finalUrl, requestOptions)
        .then((res) =>
          res.json().then(({ data }) => {
            return {
              data: data.content || data,
              entityId,
              filters,
              initialFilters,
              pagination:
                page !== null &&
                page !== undefined &&
                limit &&
                parsePagination({ res: data, page: page, limit }),
              // url,
              sort,
              selectedRows: [],
            };
          })
        )
        .catch(() => ({
          data: [],
          entityId,
        }));
    }
  );
  const fetchFiltered = createAsyncThunk(
    "data/fetchUpdatedEntity",
    async (
      { entityId, filter: { label, value, action, gte, lte }, header },
      thunkAPI
    ) => {
      const state = thunkAPI.getState();
      const { filters, sort, initialFilters, initialSort, pagination } =
        tablesAdapter
          .getSelectors()
          .selectById(state[sliceName].tables, entityId);
      const url = getGridUrl(entityId);
      const page = 0;
      const limit = pagination?.limit;
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
                action !== "toggleAll"
                  ? [value]
                  : idx === "driver"
                  ? metaAdapter
                      .getSelectors()
                      .selectById(state[sliceName].meta, "drivers")
                      .drivers?.map((v) => v.uid)
                  : metaAdapter
                      .getSelectors()
                      .selectById(state[sliceName].meta, "settings") &&
                    metaAdapter
                      .getSelectors()
                      .selectById(state[sliceName].meta, "settings")[idx],

              gte,
              lte,
              action,
            });
      const filterLink = filtersToUrl(
        { ...initialFilters, ...newFilters },
        initialFilters
      );
      const sortLink = sortToUrl(sort, initialSort);

      const pageSuffix =
        page !== null && page !== undefined && limit
          ? "&page=" + page + "&size=" + limit
          : "";
      const urlSuffix = filterLink + sortLink + pageSuffix;
      const finalUrl = url + (urlSuffix.trim() !== "" ? "?" + urlSuffix : "");

      const requestOptions = {
        method: "GET",
        headers: header,
      };
      return await fetch(finalUrl, requestOptions).then((res) =>
        res.json().then(({ data }) => {
          return {
            data: data.content || data,
            entityId,
            filters: newFilters,
            initialFilters,
            pagination:
              page !== null &&
              page !== undefined &&
              limit &&
              parsePagination({ res: data, page, limit }),
            url,
            sort,
          };
        })
      );
    }
  );
  const fetchSortedEntityGrid = createAsyncThunk(
    "data/fetchUpdatedEntity",
    async ({ entityId, labelId, header }, thunkAPI) => {
      const state = thunkAPI.getState();

      const { filters, sort, initialFilters, initialSort, pagination } =
        tablesAdapter
          .getSelectors()
          .selectById(state[sliceName].tables, entityId);
      const page = pagination?.page;
      const limit = pagination?.limit;
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
      const { id, order } = calculatedSort;

      const pageSuffix =
        page !== null && page !== undefined && limit
          ? "&page=" + (parseInt(page) - 1) + "&size=" + limit
          : "";
      const urlSuffix = filterLink + sortLink + pageSuffix;
      const finalUrl = url + (urlSuffix.trim() !== "" ? "?" + urlSuffix : "");

      const requestOptions = {
        method: "GET",
        headers: header,
      };
      return await fetch(finalUrl, requestOptions)
        .then((res) =>
          res.json().then(({ data }) => {
            return {
              data: data.content || data,
              entityId,
              filters,
              initialFilters,
              initialSort,
              pagination:
                page !== null &&
                page !== undefined &&
                limit &&
                parsePagination({ res: data, page: parseInt(page) - 1, limit }),
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
      [fetchMeta.fulfilled](state, { payload: { data, labels } }) {
        state.loading = false;
        const d = data?.reduce((a, b) => ({ ...a, [b.id]: b.values }), {});
        const g = (labels || Object.keys(d)).reduce(
          (a, l) => ({ ...a, [l]: JSON.parse(d[l]) }),
          {}
        );
        metaAdapter.upsertOne(state.meta, { id: "settings", ...g });
      },
      [fetchDrivers.fulfilled](state, { payload }) {
        state.loading = false;
        const drivers =
          payload
            .map(({ name, email, uid }) => ({
              name,
              email,
              uid,
            }))
            .sort((a, b) =>
              (a.name || a.email).localeCompare(b.name || b.email)
            ) || [];
        metaAdapter.upsertOne(state.meta, { id: "drivers", drivers });
      },
      [fetchUsers.fulfilled](state, { payload }) {
        state.loading = false;
        payload &&
          usersAdapter.setMany(
            state.users,
            payload.map((user) => ({ id: user.uid, ...user }))
          );
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

        const drivers = meta?.drivers;
        const { tables, labels, modes } = normalizeInitApi({
          data: mapped,
          meta: { ...meta, loading: false },
          drivers,
        });

        tablesAdapter.setMany(state.tables, tables);
        labelsAdapter.setMany(state.labels, labels);
        modesAdapter.setMany(state.modes, modes);
        state.loading = false;
      },
      [fetchUpdatedEntity.fulfilled](state, { payload }) {
        const { data, entityId, ...meta } = payload;
        console.log("fullfiled", entityId);
        const mapped = mapPromiseData(data, entityId);
        const drivers = metaAdapter
          .getSelectors()
          .selectById(state.meta, "drivers");
        const { tables, modes } = normalizeApi({
          data: mapped,
          meta: { ...meta, loading: false },
          drivers: drivers?.drivers,
        });

        tablesAdapter.upsertMany(state.tables, tables);
        modesAdapter.upsertMany(state.modes, modes);
        state.loading = false;
      },
      [postRows.fulfilled](state, { meta: { arg } }) {
        state.loading = false;
        console.log("post done", arg);
        const { changes, addRow } = tablesSelectById(state, arg.entityId);
        tablesAdapter.upsertOne(state.tables, {
          id: arg.entityId,
          changes: [],
        });
        changesAdapter.removeMany(state.changes, [...changes, addRow]);
        const selectedLabels = tablesSelectById(state, arg.entityId).memory
          ?.selectedLabels;
        tablesAdapter.upsertOne(state.tables, {
          id: arg.entityId,
          memory: { selectedLabels: [] },
        });
        tablesAdapter.upsertOne(state.tables, {
          id: arg.entityId,
          selectedLabels,
        });

        modesAdapter.upsertOne(state.modes, {
          id: arg.entityId,
          value: false,
        });
      },
      [deleteRows.fulfilled](state, { meta: { arg } }) {
        state.loading = false;
        const { changes, selectedRows } = tablesSelectById(state, arg.entityId);
        const table = {
          id: arg.entityId,
          selectedRows: [],
          changes:
            changes && changes.filter((id) => !selectedRows.includes(id)),
        };
        tablesAdapter.upsertOne(state.tables, table);
        modesAdapter.upsertOne(state.modes, {
          id: arg.entityId,
          value: false,
        });
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
        if (mode === "edit" || mode === "addRow") {
          const labels = tablesSelectById(state, entityId).labels;
          const selectedLabels = tablesSelectById(
            state,
            entityId
          ).selectedLabels;
          tablesAdapter.upsertOne(state.tables, {
            id: entityId,
            memory: { selectedLabels: selectedLabels },
          });
          tablesAdapter.upsertOne(state.tables, {
            id: entityId,
            selectedLabels: labels,
          });
        } else {
          const selectedLabels = tablesSelectById(state, entityId).memory
            ?.selectedLabels;
          tablesAdapter.upsertOne(state.tables, {
            id: entityId,
            memory: { selectedLabels: [] },
          });
          tablesAdapter.upsertOne(state.tables, {
            id: entityId,
            selectedLabels,
          });
        }
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
        const allRows = Object.keys(tablesSelectById(state, id).rows);
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
              [connection]: format([
                null,
                ...dependencies.map((d) => {
                  return d === labelId ? value : newRow[d];
                }),
              ]),
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
        tablesAdapter.upsertOne(state.tables, { id, changes: [] });
      },

      addMeta: (state, action) => {
        metaAdapter.upsertMany(state.meta, action.payload);
      },
      addTableDate: (state, action) => {
        const { id, date } = action.payload;
        tablesAdapter.upsertOne(state.tables, { id, date });
      },
      clearTables: (state) => {
        tablesAdapter.removeAll(state.tables);
        labelsAdapter.removeAll(state.tables);
        changesAdapter.removeAll(state.changes);
        modesAdapter.removeAll(state.modes);
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
      fetchUsers,
      fetchMeta,
      fetchDrivers,
      fetchAndInitEntityGrid,
      fetchUpdatedEntity,
      fetchSortedEntityGrid,
      fetchPage,
      fetchFiltered,
      postRows,
      deleteRows,
    },
  };
}

export const gridTableSlice = createGenericSlice("gridTable");

export function createReduxStore() {
  const store = configureStore({
    reducer: {
      gridTable: gridTableSlice.reducer,
    },
    devTools: window.__REDUX_DEVTOOLS_EXTENSION__?.(),
  });
  return store;
}
