import { isEqual } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { TitleComponent } from "../myComponents/MyConsts";
import FilterComponent from "../myComponents/Filters/FilterComponent";
import {
  getGridLabelFn,
  getGridLabelFormat,
  getGridTableConnections,
  getGridUrl,
  getGridWidgets,
  maxWidthByType,
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
  const selectConstants = useCallback(
    (state) => metaSelector.selectById(state, "constants") || [],
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
        [selectShownLabels, selectAllLabelsById, selectConstants],
        (labels, allLabelsById, constants) => {
          return labels.map((l) => {
            const {
              text,
              id,
              idx,
              type,
              measurement,
              maxWidth,
              links,
              ignoreSort,
            } = allLabelsById[l];

            const props = {
              Header: text,
              id,
              idx,
              type,
              ignoreSort,
              measurement: measurement,
              minWidth: "10px",
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
            else if (type !== "constant") return props;
            else
              return {
                ...props,
                availableValues: constants[idx],
              };
          });
        }
      ),
    [selectShownLabels, selectAllLabelsById, selectConstants, entityId]
  );
  const selectReactTableData = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectAllLabelsById, selectChangesOverRows],
        (labelsIds, allLabelsById, shownValues) => {
          const shownLabels = labelsIds.map((id) => allLabelsById[id]);
          return shownValues.map((row) => ({
            id: row.id,
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
        [selectAllLabelsById, selectShownLabels, selectConstants],
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
    [selectAllLabelsById, selectShownLabels, selectConstants]
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
    [selectConstants, paramsSelector],
    (constants, { idx }) => constants[idx] || []
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
    [selectConstantId, selectLabelId, selectFilterId, selectDate],
    (
      constantEntity,
      { max, min, measurement, filterType },
      { gte, lte, neq },
      date
    ) => {
      switch (filterType) {
        case "date": {
          return {
            year: moment(date, "YYYY.MM").format("YYYY"),
            month: moment(date, "YYYY.MM").format("MM"),
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
            (constantEntity &&
              constantEntity.map((v) => ({
                text: v,
                checked: neq ? !neq.includes(v) : true,
              }))) ||
            [];
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
      selectConstants,
      selectAllLabelsById,
      selectCheckedFilters,
    ],
    (shownLabels, constants, allLabelsById, checkedFilters) => {
      return shownLabels.map((label) => {
        const text = allLabelsById[label].text;
        const filterType = allLabelsById[label].filterType;
        const checked = checkedFilters.includes(label);
        const idx = allLabelsById[label].idx;
        const disabled =
          !filterType ||
          (filterType === "checkbox" &&
            (!constants[idx] || constants[idx].length <= 1));

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
    selectConstants,
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
    saveChanges,
    deleteRows,
    changeDate,
    addInitialFilter,
    fetchFiltered,
    fetchUpdatedEntity,
    toggleColumn,
    fetchEntityGrid,
    fetchPage,
    onSelectRow,
    toggleAllChecked,
    fetchSortedEntityGrid,
    addMeta,
    addTableDate,
  },
  entityId,
  dispatch,
}) => {
  const onCellChange = useCallback(
    ({ changes, rowId }) => {
      dispatch(addChange({ id: entityId, changes, rowId }));
    },
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
      dispatch(fetchSortedEntityGrid({ entityId, labelId }));
    },
    [dispatch, entityId, fetchSortedEntityGrid]
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
    dispatch(saveChanges(entityId)).then(() => {
      const connections = getGridTableConnections(entityId);
      const promises = [...connections].map((id) =>
        dispatch(fetchUpdatedEntity({ entityId: id }))
      );
      return dispatch(fetchUpdatedEntity({ entityId })).then(() =>
        Promise.all(promises)
      );
    });
  }, [dispatch, entityId, fetchUpdatedEntity, saveChanges]);
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
    dispatch(deleteRows(entityId)).then(() => {
      const connections = getGridTableConnections(entityId);
      const promises = [...connections, entityId].map((id) =>
        dispatch(fetchUpdatedEntity({ entityId: id }))
      );
      return Promise.all(promises);
    });
  }, [dispatch, entityId, fetchUpdatedEntity, deleteRows]);
  const onChangeCurrentTableDate = useCallback(
    (date) => {
      const initialFilters = {
        year: { eq: [date] },
      };
      dispatch(
        fetchUpdatedEntity({
          entityId,
          initialFilters,
          date,
        })
      ).then(() => dispatch(addTableDate({ id: entityId, date })));
    },
    [dispatch, entityId, fetchUpdatedEntity, addTableDate]
  );
  const onChangeCurrentDate = useCallback(
    (date) => {
      dispatch(
        fetchUpdatedEntity({
          entityId,
          initialFilters: { date: { gte: date + ".01", lte: date + ".31" } },
          date,
        })
      );
    },
    [dispatch, entityId, fetchUpdatedEntity]
  );
  const onChangeCurrentYearMonth = useCallback(
    (date) => {
      const initialFilters = {
        date: { eq: [date] },
      };
      dispatch(
        fetchUpdatedEntity({
          entityId,
          initialFilters,
        })
      ).then(() => dispatch(addTableDate({ id: entityId, date })));
    },
    [dispatch, entityId, fetchUpdatedEntity, addTableDate]
  );
  const onChangeCurrentUser = useCallback(
    (value) => {
      const initialFilters = {
        user: { eq: [value] },
      };
      dispatch(
        fetchEntityGrid({
          entityId,
          url: getGridUrl(entityId),
          limit: getGridWidgets(entityId).pageSize,
          initialFilters,
        })
      );
      // .then(() => dispatch(changeDate(date)));
    },
    [dispatch, entityId, fetchEntityGrid]
  );
  const onToggleCheckboxFilter = useCallback(
    (filter) => {
      dispatch(
        fetchFiltered({ entityId, filter: { ...filter, action: "toggle" } })
      );
    },
    [dispatch, entityId, fetchFiltered]
  );
  const onToggleAllCheckboxFilter = useCallback(
    (filter) => {
      dispatch(
        fetchFiltered({
          entityId,
          filter: { ...filter, action: "toggleAll" },
        })
      );
    },
    [dispatch, entityId, fetchFiltered]
  );
  const onChangeRangeFilter = useCallback(
    (filter) => {
      dispatch(
        fetchFiltered({
          entityId,
          filter: { ...filter, action: "between" },
        })
      );
    },
    [dispatch, entityId, fetchFiltered]
  );
  const onResetFilter = useCallback(
    (filter) => {
      dispatch(
        fetchFiltered({
          entityId,
          filter: { ...filter, action: "reset" },
        })
      );
    },
    [dispatch, entityId, fetchFiltered]
  );
  const onResetAllFilters = useCallback(() => {
    dispatch(
      fetchFiltered({
        entityId,
        filter: { action: "resetAll" },
      })
    );
  }, [dispatch, entityId, fetchFiltered]);
  const onToggleLabel = useCallback(
    (columnId) => {
      dispatch(toggleColumn({ id: entityId, columnId }));
    },
    [entityId, toggleColumn, dispatch]
  );
  const onPageChange = useCallback(
    (page) => {
      dispatch(
        fetchPage({
          entityId,
          page,
        })
      );
    },
    [dispatch, entityId, fetchPage]
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
    onChangeCurrentTableDate,
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
  });

  const title = useMemo(
    () => (
      <TitleComponent
        entityId={entityId}
        selectDate={selectDate}
        selectTableDate={selectTableDate}
        onChange={
          entityId === "workHoursByDate"
            ? onChangeCurrentYearMonth
            : entityId === "vacationsOverview"
            ? onChangeCurrentTableDate
            : onChangeCurrentDate
        }
      />
    ),
    [
      entityId,
      onChangeCurrentTableDate,
      onChangeCurrentYearMonth,
      onChangeCurrentDate,
      selectDate,
      selectTableDate,
    ]
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
