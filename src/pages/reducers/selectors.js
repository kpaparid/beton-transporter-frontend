import moment from "moment";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { createSelector } from "reselect";
import FilterComponent from "../../components/Filters/FilterComponent";
import TitleComponent from "../../components/Table/TableTitle";
import { useAuth } from "../../contexts/AuthContext";
import {
  getGridDateFilter,
  getGridLabelFn,
  getGridLabelFormat,
  getGridRowClassName,
  getGridTableConnections,
  getGridUrl,
  getGridWidgets,
} from "../myComponents/util/labels";
export const useGridSelectors = ({
  selectors: {
    metaSelector,
    // rowsSelector,
    labelsSelector,
    tablesSelector,
    modesSelector,
    filtersSelector,
    changesSelector,
  },
  entityId,
}) => {
  const selectAllRowsById = useCallback(
    (state) => tablesSelector.selectById(state, entityId).rows,
    [tablesSelector, entityId]
  );

  const selectAllLabelsById = useMemo(
    () => labelsSelector.selectEntities,
    [labelsSelector]
  );
  const selectLoading = useCallback(
    (state) =>
      tablesSelector.selectById(state, entityId)
        ? tablesSelector.selectById(state, entityId).loading
        : true,
    [tablesSelector, entityId]
  );
  const selectSelectedLabels = useCallback(
    (state) =>
      tablesSelector.selectById(state, entityId)
        ? tablesSelector.selectById(state, entityId).selectedLabels
        : [],
    [tablesSelector, entityId]
  );
  const selectSelectedRowsExist = useCallback(
    (state) =>
      tablesSelector.selectById(state, entityId) &&
      tablesSelector.selectById(state, entityId).selectedRows &&
      tablesSelector.selectById(state, entityId).selectedRows.length > 0,
    [tablesSelector, entityId]
  );
  const selectChangesExist = useCallback(
    (state) =>
      (tablesSelector.selectById(state, entityId) &&
        tablesSelector.selectById(state, entityId).changes &&
        tablesSelector.selectById(state, entityId).changes.length > 0) ||
      false,
    [tablesSelector, entityId]
  );
  const selectShownLabels = useCallback(
    (state) =>
      tablesSelector.selectById(state, entityId)
        ? tablesSelector.selectById(state, entityId).labels
        : [],
    [tablesSelector, entityId]
  );
  const selectShownRows = useCallback(
    (state) =>
      tablesSelector.selectById(state, entityId)
        ? tablesSelector.selectById(state, entityId).sortedRowsIds
        : [],
    [tablesSelector, entityId]
  );
  // const selectAllRows = useCallback(
  //   (state) => rowsSelector.selectIds(state, entityId) || [],
  //   [entityId, rowsSelector]
  // );
  const selectMode = useCallback(
    (state) =>
      (modesSelector.selectById(state, entityId) &&
        modesSelector.selectById(state, entityId).value) ||
      false,
    [entityId, modesSelector]
  );
  const selectSettings = useCallback(
    (state) => metaSelector.selectById(state, "settings") || [],
    [metaSelector]
  );
  const selectDrivers = useCallback(
    (state) => metaSelector.selectById(state, "drivers")?.drivers || [],
    [metaSelector]
  );
  const selectPaginationData = useCallback(
    (state) =>
      (tablesSelector.selectById(state, entityId) &&
        tablesSelector.selectById(state, entityId).pagination) ||
      [],
    [tablesSelector, entityId]
  );

  const selectChanges = useCallback(
    (state) => changesSelector.selectEntities(state) || [],
    [changesSelector]
  );
  const selectSelectedRows = useCallback(
    (state) => tablesSelector.selectById(state, entityId).selectedRows || [],
    [tablesSelector, entityId]
  );
  const selectChangesOverRows = useMemo(
    () =>
      createSelector(
        [selectShownRows, selectAllRowsById, selectChanges],
        (shownRows, allRowsById, changesById) => {
          return shownRows.map((r) => ({
            ...allRowsById[r],
            ...changesById[r],
          }));
        }
      ),
    [selectShownRows, selectAllRowsById, selectChanges]
  );
  const selectAdd = useCallback(
    (state) => {
      const addRow = tablesSelector.selectById(state, entityId).addRow;
      const id = Object.entries(addRow)[0][0];
      const change = changesSelector.selectById(state, id);
      return { ...Object.entries(addRow)[0][1], ...change };
    },
    [tablesSelector, entityId, changesSelector]
  );

  const selectAddRow = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectAllLabelsById, selectAdd],
        (labelsIds, allLabelsById, row) => {
          const shownLabels = labelsIds.map((id) => allLabelsById[id]);
          return {
            ...row,
            ...shownLabels
              .map((label) => {
                return {
                  [label.id]: getGridLabelFormat(entityId, label.idx)
                    ? getGridLabelFormat(entityId, label.idx)(row[label.id])
                    : row[label.id],
                };
              })
              .reduce((a, b) => ({ ...a, ...b }), {}),
          };
        }
      ),
    [selectShownLabels, selectAllLabelsById, selectAdd, entityId]
  );

  const selectShownHeadersReactTable = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectAllLabelsById, selectSettings, selectDrivers],
        (labels, allLabelsById, settings, drivers) => {
          return labels.map((l) => {
            const {
              text,
              id,
              idx,
              type,
              measurement,
              maxWidth,
              minWidth,
              links,
              ignoreSort,
              componentId,
            } = allLabelsById[l];

            const props = {
              Header: text,
              id,
              idx,
              type,
              ignoreSort,
              measurement: measurement,
              minWidth,
              maxWidth,
              links:
                links &&
                links.map(({ connectionIdx, ...rest }) => ({
                  format: getGridLabelFn(entityId, connectionIdx),
                  ...rest,
                })),
            };
            if (type === "date")
              return {
                ...props,
              };
            else if (type === "customComponent")
              return { ...props, componentId };
            else if (type !== "constant") return props;
            else
              return {
                ...props,
                availableValues:
                  idx === "driver"
                    ? drivers?.map(({ uid, name, email }) => ({
                        value: uid,
                        label: name || email,
                      }))
                    : settings[idx].map((_) => ({
                        value: _ + "",
                        label: _ + "",
                      })) || [],
              };
          });
        }
      ),
    [
      selectShownLabels,
      selectAllLabelsById,
      selectSettings,
      selectDrivers,
      entityId,
    ]
  );
  const selectReactTableData = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectAllLabelsById, selectChangesOverRows],
        (labelsIds, allLabelsById, shownValues) => {
          const shownLabels = labelsIds.map((id) => allLabelsById[id]);
          return shownValues.map((row) => ({
            id: row.id,
            className: getGridRowClassName(
              entityId,
              labelsIds.reduce(
                (a, b) => ({ ...a, [allLabelsById[b].idx]: row[b] }),
                {}
              )
            ),
            ...shownLabels
              .map((label) => {
                return {
                  [label.id]: getGridLabelFormat(entityId, label.idx)
                    ? getGridLabelFormat(entityId, label.idx)(row[label.id])
                    : row[label.id],
                };
              })
              .reduce((a, b) => ({ ...a, ...b }), {}),
          }));
        }
      ),
    [selectShownLabels, selectAllLabelsById, selectChangesOverRows, entityId]
  );

  const selectHiddenHeadersReactTable = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectSelectedLabels],
        (labels, selectedLabels) => {
          return labels.reduce(
            (a, id) => ({
              ...a,
              [id]: selectedLabels.includes(id) ? "table-cell" : "none",
            }),
            {}
          );
        }
      ),
    [selectShownLabels, selectSelectedLabels]
  );
  const selectLabelsModal = useMemo(
    () =>
      createSelector(
        [selectAllLabelsById, selectShownLabels, selectSettings],
        (labelsById, allLabelsId, availableValues) => {
          return allLabelsId.map((labelId) => {
            const {
              id,
              idx,
              text,
              type,
              measurement,
              grid,
              page,
              required,
              priority,
            } = labelsById[labelId];
            const props = {
              id,
              idx,
              text,
              type,
              measurement,
              grid,
              page,
              required,
              priority,
              // maxWidth: maxWidthByType(type),
              placeholder: type === "date" ? moment().format("DD.MM.YYYY") : "",
              // getGridL,
            };

            return type === "constant"
              ? { ...props, availableValues: availableValues[idx] }
              : type === "date"
              ? { ...props, portal: false, withButton: false }
              : props;
          });
        }
      ),
    [selectAllLabelsById, selectShownLabels, selectSettings]
  );
  const selectCheckedFilters = useCallback(
    (state) =>
      (tablesSelector.selectById(state, entityId) &&
        tablesSelector.selectById(state, entityId).selectedLabels) ||
      [],
    [entityId, tablesSelector]
  );
  const selectSortedHeadersReactTable = useCallback(
    (state) => {
      const sort =
        tablesSelector.selectById(state, entityId) &&
        tablesSelector.selectById(state, entityId).sort;
      const id =
        sort &&
        tablesSelector.selectById(state, entityId) &&
        tablesSelector.selectById(state, entityId).nanoids &&
        tablesSelector.selectById(state, entityId).nanoids[sort.id];
      return { id, order: sort && sort.order };
    },
    [entityId, tablesSelector]
  );

  const paramsSelector = useCallback((state, params) => params, []);

  const selectFilter = useCallback(
    (state) => tablesSelector.selectById(state, entityId).filters || {},
    [tablesSelector, entityId]
  );

  const selectDate = useCallback(
    (state) =>
      (metaSelector.selectById(state, "date") &&
        metaSelector.selectById(state, "date").value) ||
      moment().format("MM.YYYY"),
    [metaSelector]
  );

  const selectTableDate = useCallback(
    (state) => tablesSelector.selectById(state, entityId).date,
    [tablesSelector, entityId]
  );

  const selectConstantId = createSelector(
    [selectSettings, selectDrivers, paramsSelector],
    (constants, drivers, { idx }) =>
      idx === "driver"
        ? drivers?.map(({ uid, email, name }) => ({
            id: uid,
            text: name || email,
          }))
        : constants[idx]?.map((c) => ({ id: c, text: c })) || []
  );
  const selectLabelId = createSelector(
    [selectAllLabelsById, paramsSelector],
    (allLabelsById, { label }) => allLabelsById[label]
  );
  const selectFilterId = createSelector(
    [selectFilter, paramsSelector],
    (filterById, { idx }) => filterById[idx] || {}
  );
  const selectItemsNestedFilter = createSelector(
    [selectConstantId, selectLabelId, selectFilterId, selectTableDate],
    (
      constantEntity,
      { max, min, measurement, filterType },
      { gte, lte, neq },
      date
    ) => {
      switch (filterType) {
        case "date": {
          return {
            year: moment(date).format("YYYY"),
            month: moment(date).format("MM"),
            from: gte,
            to: lte,
          };
        }
        case "range": {
          return {
            max,
            min,
            title: measurement,
            gte,
            lte,
          };
        }
        case "time": {
          return {
            gte,
            lte,
          };
        }
        case "checkbox": {
          const checkedAll = neq ? neq.length === 0 : true;
          const rows =
            constantEntity?.map((v) => ({
              value: v,
              checked: neq ? !neq.includes(v.id) : true,
            })) || [];
          return { checkedAll, rows };
        }
        default:
          return {};
      }
    }
  );
  const selectItemsFilter = createSelector(
    [
      selectShownLabels,
      selectSettings,
      selectDrivers,
      selectAllLabelsById,
      selectCheckedFilters,
    ],
    (shownLabels, constants, drivers, allLabelsById, checkedFilters) => {
      return shownLabels
        .filter((label) => !allLabelsById[label].hidden)
        .map((label) => {
          const text = allLabelsById[label].text;
          const filterType = allLabelsById[label].filterType;
          const checked = checkedFilters.includes(label);
          const idx = allLabelsById[label].idx;
          const disabled =
            !filterType ||
            (filterType === "checkbox"
              ? idx === "driver"
                ? !drivers || drivers.length < 0
                : !constants[idx] || constants[idx].length < 0
              : false);

          const props = {
            type: filterType,
            label,
            idx,
          };
          return {
            disabled,
            id: label,
            displayArrow: !disabled,
            text,
            checked,
            props,
          };
        });
    }
  );

  return {
    selectSelectedRows,
    selectDate,
    selectTableDate,
    selectLabelsModal,
    selectHiddenHeadersReactTable,
    selectShownHeadersReactTable,
    selectReactTableData,
    selectSettings,
    selectMode,
    selectAddRow,
    selectShownRows,
    selectShownLabels,
    selectChangesExist,
    selectSelectedRowsExist,
    selectAllRowsById,
    selectAllLabelsById,
    selectSelectedLabels,
    selectNestedCheckboxFilter: selectFilter,
    selectItemsFilter,
    selectPaginationData,
    selectSortedHeadersReactTable,
    selectLoading,
    selectItemsNestedFilter,
  };
};

export const useGridCallbacks = ({
  actions: {
    addChange,
    setSelectedRows,
    resetChanges,
    changeMode,
    toggleColumn,
    onSelectRow,
    toggleAllChecked,
    fetchAndInitEntityGrid,
    fetchUpdatedEntity,
    fetchSortedEntityGrid,
    fetchPage,
    fetchFiltered,
    postRows,
    deleteRows,
  },
  entityId,
  dispatch,
  getHeader,
}) => {
  const onCellChange = useCallback(
    ({ changes, rowId }) =>
      dispatch(addChange({ id: entityId, changes, rowId })),
    [dispatch, entityId, addChange]
  );
  const setSelectedRowsCallback = useCallback(
    (rows) => {
      dispatch(setSelectedRows({ id: entityId, rows }));
    },
    [dispatch, entityId, setSelectedRows]
  );
  const onSelectRowCallback = useCallback(
    (rowId) => {
      dispatch(onSelectRow({ id: entityId, rowId }));
    },
    [dispatch, entityId, onSelectRow]
  );
  const onSelectAllRowsCallback = useCallback(() => {
    dispatch(toggleAllChecked(entityId));
  }, [dispatch, entityId, toggleAllChecked]);
  const onToggleSort = useCallback(
    (labelId) => {
      getHeader().then((header) =>
        dispatch(fetchSortedEntityGrid({ entityId, labelId, header }))
      );
    },
    [dispatch, entityId, fetchSortedEntityGrid, getHeader]
  );
  const forceClose = useCallback(() => {
    dispatch(resetChanges(entityId));
  }, [dispatch, entityId, resetChanges]);

  const onChangeMode = useCallback(
    (mode) => {
      dispatch(changeMode({ entityId, mode }));
    },
    [dispatch, entityId, changeMode]
  );
  const onSave = useCallback(() => {
    return getHeader().then((header) => {
      return dispatch(postRows({ entityId, header })).then(({ payload }) => {
        if (payload.status !== 200) throw new Error(payload.message);
        const connections = getGridTableConnections(entityId)?.onUpdate || [];
        const promises = [...connections, entityId].map((id) =>
          dispatch(fetchUpdatedEntity({ entityId: id, header }))
        );
        return dispatch(fetchUpdatedEntity({ entityId, header })).then(
          Promise.all(promises)
        );
      });
    });
  }, [dispatch, entityId, fetchUpdatedEntity, postRows, getHeader]);
  const onClose = useCallback(() => {
    dispatch(resetChanges(entityId));
  }, [dispatch, entityId, resetChanges]);
  const onDownload = useCallback(() => {
    console.log("on Download");
  }, []);
  const onAdd = useCallback(() => {
    console.log("on Add");
  }, []);
  const onDelete = useCallback(() => {
    getHeader().then((header) =>
      dispatch(deleteRows({ entityId, header })).then(() => {
        const connections = getGridTableConnections(entityId)?.onUpdate || [];
        const promises = [...connections, entityId].map((id) =>
          dispatch(fetchUpdatedEntity({ entityId: id, header }))
        );
        return dispatch(fetchUpdatedEntity({ entityId, header })).then(
          Promise.all(promises)
        );
      })
    );
  }, [dispatch, entityId, fetchUpdatedEntity, deleteRows, getHeader]);

  const onChangeCurrentYearMonth = useCallback(
    (date) => {
      return getHeader().then((header) =>
        dispatch(
          fetchUpdatedEntity({
            entityId,
            initialFilters: {
              date: { eq: [moment(date).format("YYYY.MM")] },
            },
            selectedRows: [],
            date,
            header,
          })
        ).then(() => {
          const connections =
            getGridTableConnections(entityId)?.onDateChange || [];
          const promises = connections.map((id) => {
            return dispatch(
              fetchUpdatedEntity({
                entityId: id,
                initialFilters: getGridDateFilter(id, date),
                filters: { date: undefined },
                header,
              })
            );
          });
          return Promise.all(promises);
        })
      );
    },
    [dispatch, entityId, fetchUpdatedEntity, getHeader]
  );
  const onChangeCurrentDate = useCallback(
    (date) =>
      getHeader().then((header) =>
        dispatch(
          fetchUpdatedEntity({
            entityId,
            initialFilters: {
              date: {
                gte: moment(date).format("YYYY.MM") + ".01",
                lte: moment(date).format("YYYY.MM") + ".31",
              },
            },
            selectedRows: [],
            date,
            header,
          })
        ).then(() => {
          const connections =
            getGridTableConnections(entityId)?.onDateChange || [];
          const promises = connections.map((id) => {
            return dispatch(
              fetchUpdatedEntity({
                entityId: id,
                initialFilters: getGridDateFilter(id, date),
                filters: { date: undefined },
                header,
              })
            );
          });
          return Promise.all(promises);
        })
      ),
    [dispatch, entityId, fetchUpdatedEntity, getHeader]
  );

  const onChangeCurrentUser = useCallback(
    (value) =>
      getHeader().then((header) => {
        const initialFilters = {
          user: { eq: [value] },
        };
        dispatch(
          fetchAndInitEntityGrid({
            entityId,
            url: getGridUrl(entityId),
            limit: getGridWidgets(entityId).pageSize,
            initialFilters,
            header,
          })
        );
      }),
    [dispatch, entityId, fetchAndInitEntityGrid, getHeader]
  );
  const onToggleCheckboxFilter = useCallback(
    (filter) => {
      getHeader().then((header) =>
        dispatch(
          fetchFiltered({
            entityId,
            filter: { ...filter, action: "toggle" },
            header,
          })
        )
      );
    },
    [dispatch, entityId, fetchFiltered, getHeader]
  );
  const onToggleAllCheckboxFilter = useCallback(
    (filter) =>
      getHeader().then((header) =>
        dispatch(
          fetchFiltered({
            entityId,
            filter: { ...filter, action: "toggleAll" },
            header,
          })
        )
      ),
    [dispatch, entityId, fetchFiltered, getHeader]
  );
  const onChangeRangeFilter = useCallback(
    (filter) =>
      getHeader().then((header) =>
        dispatch(
          fetchFiltered({
            entityId,
            filter: { ...filter, action: "between" },
            header,
          })
        )
      ),
    [dispatch, entityId, fetchFiltered, getHeader]
  );
  const onResetFilter = useCallback(
    (filter) =>
      getHeader().then((header) =>
        dispatch(
          fetchFiltered({
            entityId,
            filter: { ...filter, action: "reset" },
            header,
          })
        )
      ),
    [dispatch, entityId, fetchFiltered, getHeader]
  );
  const onResetAllFilters = useCallback(
    () =>
      getHeader().then((header) =>
        dispatch(
          fetchFiltered({
            entityId,
            filter: { action: "resetAll" },
            header,
          })
        )
      ),
    [dispatch, entityId, fetchFiltered, getHeader]
  );

  const onPageChange = useCallback(
    (page) =>
      getHeader().then((header) =>
        dispatch(
          fetchPage({
            entityId,
            page,
            header,
          })
        )
      ),
    [dispatch, entityId, fetchPage, getHeader]
  );
  const onToggleLabel = useCallback(
    (columnId) => {
      dispatch(toggleColumn({ id: entityId, columnId }));
    },
    [entityId, toggleColumn, dispatch]
  );
  return {
    onChangeCurrentUser,
    onChangeCurrentYearMonth,
    onCellChange,
    setSelectedRows: setSelectedRowsCallback,
    forceClose,
    onChangeMode,
    onSave,
    onClose,
    onDownload,
    onAdd,
    onDelete,
    onChangeCurrentDate,
    // onChangeCurrentTableDate,
    onToggleCheckboxFilter,
    onToggleAllCheckboxFilter,
    onChangeRangeFilter,
    onToggleLabel,
    onResetAllFilters,
    onResetFilter,
    onPageChange,
    onSelectRow: onSelectRowCallback,
    onSelectAllRows: onSelectAllRowsCallback,
    onToggleSort,
  };
};

export const useGridTableProps = ({ actions, selectors, entityId }) => {
  const dispatch = useDispatch();

  const { getHeader } = useAuth();
  const {
    selectSelectedRows,
    selectDate,
    selectTableDate,
    selectLabelsModal,
    selectHiddenHeadersReactTable,
    selectShownHeadersReactTable,
    selectSortedHeadersReactTable,
    selectReactTableData,
    selectMode,
    selectChangesExist,
    selectSelectedRowsExist,
    selectItemsFilter,
    selectNestedCheckboxFilter,
    selectPaginationData,
    selectLoading,
    selectAddRow,
    selectItemsNestedFilter,
  } = useGridSelectors({ selectors, entityId });

  const {
    onChangeCurrentYearMonth,
    onCellChange,
    setSelectedRows,
    onSelectRow,
    onSelectAllRows,
    forceClose,
    onChangeMode,
    onSave,
    onClose,
    onDownload,
    onAdd,
    onDelete,
    onChangeCurrentDate,
    onChangeCurrentUser,
    onChangeCurrentTableDate,
    onToggleCheckboxFilter,
    onToggleAllCheckboxFilter,
    onChangeRangeFilter,
    onToggleLabel,
    onResetAllFilters,
    onResetFilter,
    onPageChange,
    onToggleSort,
  } = useGridCallbacks({
    actions,
    entityId,
    dispatch,
    getHeader,
  });

  const title = useMemo(
    () => (
      <TitleComponent
        entityId={entityId}
        selectTableDate={selectTableDate}
        onChange={
          entityId === "workHoursByDate"
            ? onChangeCurrentYearMonth
            : onChangeCurrentDate
        }
      />
    ),
    [entityId, onChangeCurrentYearMonth, onChangeCurrentDate, selectTableDate]
  );
  const nestedFilterComponent = useCallback(
    (props) => (
      <FilterComponent
        onToggleCheckbox={onToggleCheckboxFilter}
        onToggleAllCheckbox={onToggleAllCheckboxFilter}
        onChangeRange={onChangeRangeFilter}
        onReset={onResetFilter}
        {...props}
      />
    ),
    [
      onToggleCheckboxFilter,
      onToggleAllCheckboxFilter,
      onChangeRangeFilter,
      onResetFilter,
    ]
  );

  const {
    filter,
    sort,
    add,
    download,
    remove,
    massEdit,
    pagination,
    pageSize,
    edit,
    counter,
  } = getGridWidgets(entityId);

  const tableProps = {
    selectShownColumns: selectShownHeadersReactTable,
    selectData: selectReactTableData,
    onCellChange,
    massEdit,
    size: pageSize,
    selectLoading,
    footerProps: {
      selectPaginationData,
      paginationProps: pagination && {
        selectPaginationData,
        paginationEnabled: pagination,
        onPageChange,
      },
      counterProps: counter,
    },
    bodyProps: {
      selectAddRow,
      massEdit,
      selectHiddenColumns: selectHiddenHeadersReactTable,
      selectSelectedRows,
      modeselector: selectMode,
      onSelectRow,
    },
    headerProps: {
      selectHiddenColumns: selectHiddenHeadersReactTable,
      selectPaginationData,
      onSelectAllRows,
      selectSelectedRows,
      massEdit,
      selectSortedColumn: selectSortedHeadersReactTable,
      sortProps: {
        sortEnabled: sort,
        onToggleSort,
      },
    },
  };
  const outsideProps = { onChangeCurrentUser };
  const filterProps = filter && {
    selectItemsFilter,
    selectNestedCheckboxFilter,
    nestedFilterComponent,
    selectItemsNestedFilter,
    onToggleLabel,
    onResetAllFilters,
  };
  const modalProps = add && {
    selectLabelsModal,
    title: "ModalTitle",
  };
  const buttonGroupProps = {
    edit,
    add,
    filter,
    selectMode,
    selectChangesExist,
    selectSelectedRowsExist,
    onAdd,
    onDelete,
    onDownload,
    onClose,
    onSave,
    onChangeMode,
    forceClose,
    download,
    remove,
    modalProps,
    filterProps,
  };
  const titleProps = { title };
  return { outsideProps, tableProps, buttonGroupProps, titleProps };
};
