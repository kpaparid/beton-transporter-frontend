import { isEqual } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getGridLabelFormat,
  getGridUrl,
  getGridWidgets,
  gridLabels,
  maxWidthByType,
  TitleComponent,
  useTableMonthPicker,
} from "../myComponents/MyConsts";
import FilterComponent from "../myComponents/Filters/FilterComponent";

export const useGridSelectors = ({
  selectors: {
    metaSelector,
    rowsSelector,
    labelsSelector,
    tablesSelector,
    editModesSelector,
    filtersSelector,
    changesSelector,
  },
  entityId,
}) => {
  const selectAllRowsById = useMemo(
    () => rowsSelector.selectEntities,
    [rowsSelector]
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
        ? tablesSelector.selectById(state, entityId).rows
        : [],
    []
  );
  const selectAllRows = useCallback(
    (state) => rowsSelector.selectIds(state, entityId) || [],
    []
  );
  const selectEditMode = useCallback(
    (state) =>
      (editModesSelector.selectById(state, entityId) &&
        editModesSelector.selectById(state, entityId).value) ||
      false,
    [entityId, editModesSelector]
  );
  // const selectAvailableValuesById = useMemo(
  //   () =>
  //     createSelector(
  //       [selectShownLabels, selectAllRows, selectAllRowsById],
  //       (labels, rows, allRowsById) =>
  //         labels
  //           .map((id) => ({
  //             [id]: [
  //               ...new Set(
  //                 rows
  //                   .map((row) => allRowsById[row][id])
  //                   .filter((v) => v !== undefined)
  //               ),
  //             ],
  //           }))
  //           .reduce((a, b) => ({ ...a, ...b }), {})
  //     ),
  //   [selectShownLabels, selectAllRows, selectAllRowsById]
  // );
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
  const selectReactTableData = useMemo(
    () =>
      createSelector(
        [
          selectShownLabels,
          selectAllLabelsById,
          selectConstants,
          selectChangesOverRows,
        ],
        (labelsIds, allLabelsById, constants, shownValues) => {
          const shownLabels = labelsIds.map((id) => allLabelsById[id]);
          return shownValues.map((row) => ({
            id: row.id,
            ...shownLabels
              .map((label) => {
                const props = {
                  id: row.id,
                  idx: label.idx,
                  value: row[label.id],
                  label: label.id,
                  type: label.type,
                  measurement: label.measurement,
                  minWidth: "10px",
                  maxWidth: maxWidthByType(label.type),
                  links: label.links.map(({ connectionIdx, ...rest }) => ({
                    format: getGridLabelFormat(entityId, connectionIdx),
                    ...rest,
                  })),
                };
                if (props.type !== "constant") return { [label.id]: props };
                else
                  return {
                    [label.id]: {
                      ...props,
                      availableValues: constants[label.idx],
                    },
                  };
              })
              .reduce((a, b) => ({ ...a, ...b }), {}),
          }));
        }
      ),
    [selectShownLabels, selectAllLabelsById, selectChangesOverRows, entityId]
  );

  const selectShownHeadersReactTable = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectAllLabelsById],
        (labels, allLabelsById) => {
          return labels.map((id) => ({
            Header: allLabelsById[id].text,
            accessor: id,
            // labelId: id,
            // labelIdx: allLabelsById[id],
            sortType: (a, b) =>
              a.values[id].value > b.values[id].value ? 1 : -1,
          }));
        }
      ),
    [selectShownLabels, selectAllLabelsById]
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
    []
  );
  const selectHiddenHeadersReactTable2 = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectSelectedLabels],
        (labels, selectedLabels) => {
          return (
            labels.filter((id) => !selectedLabels.includes(id)) || []
          ).map((id) => id);
        }
      ),
    []
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
            };
            console.log({ select: labelsById[labelId] });
            return type === "select"
              ? { ...props, availableValues: availableValues[id] }
              : type === "date"
              ? { ...props, portal: false, withButton: true }
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
    (state) =>
      tablesSelector.selectById(state, entityId) &&
      tablesSelector.selectById(state, entityId).sort,
    [entityId, tablesSelector]
  );

  const paramsSelector = useCallback((state, params) => params, []);

  const selectFilter = useCallback(
    (state) => tablesSelector.selectById(state, entityId).filters || {},
    [tablesSelector, entityId]
  );

  // const selectNestedCheckboxFilter = useMemo(
  //   () =>
  //     createSelector(
  //       [, selectFilter, ],
  //       (availableValuesById, filter, labelId) => {
  //         console.log(filter);
  //         return filter;
  //       }
  //     ),
  //   [selectAvailableValuesById, selectFilter, paramsSelector]
  // );
  const selectDate = useCallback(
    (state) =>
      (metaSelector.selectById(state, "date") &&
        metaSelector.selectById(state, "date").value) ||
      moment().format("MM/YYYY"),
    [entityId, tablesSelector]
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
            month: gte || moment(date, "MM/YYY").format("MM"),
            year: lte || moment(date, "MM/YYY").format("YYYY"),
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
    selectLabelsModal,
    selectHiddenHeadersReactTable,
    selectShownHeadersReactTable,
    selectReactTableData,
    selectConstants,
    selectEditMode,
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
    toggleEdit,
    saveChanges,
    changeDate,
    fetchFiltered,
    toggleColumn,
    fetchEntityGrid,
    fetchPage,
    onSelectRow,
    toggleAllChecked,
    fetchSortedEntityGrid,
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
    [dispatch, entityId, setSelectedRows]
  );
  const onSelectAllRowsCallback = useCallback(() => {
    dispatch(toggleAllChecked(entityId));
  }, [dispatch, entityId]);
  const onToggleSort = useCallback(
    (labelId) => {
      dispatch(fetchSortedEntityGrid({ entityId, labelId }));
    },
    [dispatch, entityId, fetchSortedEntityGrid]
  );
  const forceClose = useCallback(() => {
    dispatch(resetChanges(entityId));
  }, [dispatch, entityId, resetChanges]);

  const onToggleEdit = useCallback(() => {
    dispatch(toggleEdit(entityId));
  }, [dispatch, entityId, toggleEdit]);
  const onSave = useCallback(() => {
    dispatch(saveChanges(entityId));
  }, [dispatch, entityId, saveChanges]);
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
    console.log("on Delete");
  }, []);
  const onChangeDate = useCallback(
    (value) => {
      dispatch(changeDate(value));
    },
    [dispatch, changeDate]
  );
  const onChangeCurrentUser = useCallback(
    (value) => {
      dispatch(
        fetchEntityGrid({
          entityId,
          url: "users/" + value + "/" + getGridUrl(entityId) + ".json",
        })
      );
    },
    [dispatch, changeDate]
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
    [entityId]
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
    onCellChange,
    setSelectedRows: setSelectedRowsCallback,
    forceClose,
    onToggleEdit,
    onSave,
    onClose,
    onDownload,
    onAdd,
    onDelete,
    onChangeDate,
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
    selectLabelsModal,
    selectHiddenHeadersReactTable,
    selectShownHeadersReactTable,
    selectSortedHeadersReactTable,
    selectReactTableData,
    selectEditMode,
    selectChangesExist,
    selectSelectedRowsExist,
    selectItemsFilter,
    selectNestedCheckboxFilter,
    selectPaginationData,
    selectLoading,
    selectItemsNestedFilter,
  } = useGridSelectors({ selectors, entityId });

  const {
    onCellChange,
    setSelectedRows,
    onSelectRow,
    onSelectAllRows,
    forceClose,
    onToggleEdit,
    onSave,
    onClose,
    onDownload,
    onAdd,
    onDelete,
    onChangeDate,
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
        // title={"Title"}
        // date={"02/2323"}
        selectDate={selectDate}
        onChange={onChangeDate}
      />
    ),
    [entityId, onChangeDate]
  );
  const nestedFilterComponent = useCallback(
    (props) => (
      <FilterComponent
        onToggleCheckbox={onToggleCheckboxFilter}
        onToggleAllCheckbox={onToggleAllCheckboxFilter}
        onChangeRange={onChangeRangeFilter}
        onReset={onResetFilter}
        {...props}
      ></FilterComponent>
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
    add,
    download,
    remove,
    massEdit,
    pagination,
    pageSize,
    counter,
  } = getGridWidgets(entityId);
  const tableProps = {
    selectSelectedRows,
    editModeSelector: selectEditMode,
    selectShownColumns: selectShownHeadersReactTable,
    selectHiddenColumns: selectHiddenHeadersReactTable,
    selectSortedColumn: selectSortedHeadersReactTable,
    selectData: selectReactTableData,
    onSelectRow,
    onSelectAllRows,
    setSelectedRows,
    onToggleSort,
    onCellChange,
    massEdit,
    selectLoading,
    pagination: {
      selectPaginationData,
      paginationEnabled: true,
      counterEnabled: true,
      onPageChange,
    },
  };
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
    selectEditMode,
    selectChangesExist,
    selectSelectedRowsExist,
    onAdd,
    onDelete,
    onDownload,
    onClose,
    onSave,
    onToggleEdit,
    forceClose,
    download,
    remove,
    modalProps,
    filterProps,
  };
  const titleProps = { title };
  return { tableProps, buttonGroupProps, titleProps };
};
