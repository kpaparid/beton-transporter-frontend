import { isEqual } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  FilterComponent,
  getGridLabelFormat,
  getGridUrl,
  getGridWidgets,
  gridLabels,
  maxWidthByType,
  TitleComponent,
  useTableMonthPicker,
} from "../myComponents/MyConsts";
import { MonthSelectorDropdown } from "../myComponents/MyOwnCalendar";
import { Filter } from "../myComponents/Table/TableLabel";

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
  const selectAvailableValuesById = useMemo(
    () =>
      createSelector(
        [selectShownLabels, selectAllRows, selectAllRowsById],
        (labels, rows, allRowsById) =>
          labels
            .map((id) => ({
              [id]: [
                ...new Set(
                  rows
                    .map((row) => allRowsById[row][id])
                    .filter((v) => v !== undefined)
                ),
              ],
            }))
            .reduce((a, b) => ({ ...a, ...b }), {})
      ),
    [selectShownLabels, selectAllRows, selectAllRowsById]
  );
  const selectChanges = useCallback(
    (state) => changesSelector.selectEntities(state) || [],
    [changesSelector]
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
          selectAvailableValuesById,
          selectChangesOverRows,
        ],
        (labelsIds, allLabelsById, availableValuesById, shownValues) => {
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
                if (props.type !== "select") return { [label.id]: props };
                else
                  return {
                    [label.id]: {
                      ...props,
                      availableValues: availableValuesById[label.id],
                    },
                  };
              })
              .reduce((a, b) => ({ ...a, ...b }), {}),
          }));
        }
      ),
    [
      selectShownLabels,
      selectAllLabelsById,
      selectAvailableValuesById,
      selectChangesOverRows,
      entityId,
    ]
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
        [selectAllLabelsById, selectShownLabels, selectAvailableValuesById],
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
    [selectAllLabelsById, selectShownLabels, selectAvailableValuesById]
  );
  const selectCheckedFilters = useCallback(
    (state) =>
      (tablesSelector.selectById(state, entityId) &&
        tablesSelector.selectById(state, entityId).selectedLabels) ||
      [],
    [entityId, tablesSelector]
  );

  const paramsSelector = useCallback((state, params) => params, []);

  const selectFilter = useCallback(
    (state) => filtersSelector.selectEntities(state),
    [filtersSelector]
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
  const selectItemsFilter = createSelector(
    [
      selectShownLabels,
      selectAvailableValuesById,
      selectAllLabelsById,
      selectCheckedFilters,
      selectFilter,
      selectDate,
    ],
    (
      shownLabels,
      availableValuesById,
      allLabelsById,
      checkedFilters,
      selectFilter,
      date
    ) => {
      return shownLabels.map((label) => {
        const text = allLabelsById[label].text;
        const filterType = allLabelsById[label].filterType;
        const checked = checkedFilters.includes(label);
        const data =
          filterType === "date"
            ? {
                month: moment(date).format("MM"),
                year: moment(date).format("YYYY"),
              }
            : filterType === "range"
            ? { min: 5, max: 40 }
            : filterType !== undefined
            ? availableValuesById[label].map((v) => ({
                text: v,
                checked:
                  selectFilter[label] && selectFilter[label].neq
                    ? !selectFilter[label].neq.includes(v)
                    : true,
              }))
            : {};
        const disabled =
          !filterType ||
          !availableValuesById[label] ||
          availableValuesById[label].length <= 1;

        const checkedAll =
          selectFilter[label] && selectFilter[label].neq
            ? selectFilter[label].neq.length === 0
            : true;

        const props = {
          type: filterType,
          label,
          checkedAll,
          data,
        };
        // const props = !disabled && {
        //   type: filterType,
        //   label,
        //   checkedAll,
        //   data,
        // };
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
    selectDate,
    selectLabelsModal,
    selectHiddenHeadersReactTable,
    selectShownHeadersReactTable,
    selectReactTableData,
    selectAvailableValuesById,
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
    addFilter,
    toggleColumn,
    fetchEntityGrid,
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
        addFilter({ id: entityId, filter: { ...filter, action: "toggle" } })
      );
    },
    [dispatch, entityId, addFilter]
  );
  const onToggleAllCheckboxFilter = useCallback(
    (filter) => {
      dispatch(
        addFilter({
          id: entityId,
          filter: { ...filter, action: "toggleAll" },
        })
      );
    },
    [dispatch, entityId, addFilter]
  );
  const onChangeRangeFilter = useCallback(
    (filter) => {
      dispatch(
        addFilter({
          id: entityId,
          filter: { ...filter, action: "between" },
        })
      );
    },
    [dispatch, entityId, addFilter]
  );
  const onResetFilter = useCallback(
    (filter) => {
      dispatch(
        addFilter({
          id: entityId,
          filter: { ...filter, action: "reset" },
        })
      );
    },
    [dispatch, entityId, addFilter]
  );
  const onToggleLabel = useCallback(
    (columnId) => {
      dispatch(toggleColumn({ id: entityId, columnId }));
    },
    [entityId]
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
    onResetFilter,
  };
};

export const useGridTableProps = ({ actions, selectors, entityId }) => {
  const dispatch = useDispatch();
  const {
    selectDate,
    selectLabelsModal,
    selectHiddenHeadersReactTable,
    selectShownHeadersReactTable,
    selectReactTableData,
    selectEditMode,
    selectChangesExist,
    selectSelectedRowsExist,
    selectItemsFilter,
    selectNestedCheckboxFilter,
  } = useGridSelectors({ selectors, entityId });

  const {
    onCellChange,
    setSelectedRows,
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
    onResetFilter,
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
  const nestedFilterComponent = useMemo(
    () => (
      <FilterComponent
        onToggleCheckbox={onToggleCheckboxFilter}
        onToggleAllCheckbox={onToggleAllCheckboxFilter}
        onChangeRange={onChangeRangeFilter}
        onReset={onResetFilter}
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
    editModeSelector: selectEditMode,
    selectShownColumns: selectShownHeadersReactTable,
    selectHiddenColumns: selectHiddenHeadersReactTable,
    selectData: selectReactTableData,
    setSelectedRows,
    onCellChange,
    massEdit,
    pagination,
    pageSize,
    counter,
  };
  const filterProps = filter && {
    selectItemsFilter,
    selectNestedCheckboxFilter,
    nestedFilterComponent,
    onToggleLabel,
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
