import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from "@themesberg/react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { MyTable } from "./myComponents/MyTourTable";

import {
  editMode,
  hiddenColumnsReselect,
  nestedFilterTourData,
  reactTableData,
  tourDate,
  visibleHeaders,
  checkedId,
  changesById,
  modalLabelsReselect,
} from "./myComponents/MySelectors";
import { loadToursData } from "./reducers/loadToursData";
import { ACTIONS } from "./reducers/redux";
import {
  DateSelector,
  MonthSelectorDropdown,
} from "./myComponents/MyOwnCalendar";
import { MyCheckboxFilter } from "./myComponents/MyCheckbox";
import { isEqual } from "lodash";
import AddRowModal from "./myComponents/AddRowModal";
import { MyBtn } from "./myComponents/MyButtons";

export const Tours = memo(() => {
  const stateAPIStatus = useLoadToursData();
  const buttonGroupProps = useButtonGroupProps();
  const filterProps = useFilterProps();
  const tableProps = useTableProps();
  const { title } = useTableLabelProps();
  return (
    <>
      <div className="d-block pt-4 mb-4 mb-md-0">
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
        >
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} />
          </Breadcrumb.Item>
          <Breadcrumb.Item>faHome</Breadcrumb.Item>
          <Breadcrumb.Item active>Touren</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <MyTable
        tableProps={tableProps}
        stateAPIStatus={stateAPIStatus}
        title={title}
        filterProps={filterProps}
        buttonGroupProps={buttonGroupProps}
      />
    </>
  );
}, isEqual);

export const FilterComponent = memo(({ type, label, ...rest }) => {
  const dispatch = useDispatch();
  const toggleOne = useCallback((value) => {
    console.log("click nestedFilter Single");
    dispatch({
      type: ACTIONS.NESTEDFILTER_TOGGLE_ONE,
      payload: {
        label: label,
        value: value,
      },
    });
  }, []);
  const toggleAll = useCallback((data) => {
    console.log("click nestedFilter All", data);
    dispatch({
      type: ACTIONS.NESTEDFILTER_TOGGLE_ALL,
      payload: {
        label: label,
        data: data,
      },
    });
  }, []);
  const dateChange = useCallback((dates) => {
    console.log("click nestedFilter Date", dates);
    dispatch({
      type: ACTIONS.NESTEDFILTER_ADD_FILTER,
      payload: {
        label: "datum",
        value: dates,
      },
    });
  }, []);
  switch (type) {
    case "checkbox":
      return (
        <MyCheckboxFilter
          {...rest}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
        />
      );
    case "range":
      return (
        <MyCheckboxFilter
          {...rest}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
        />
      );
    case "date":
      return (
        <DateSelector {...rest.data} disableMonthSwap onChange={dateChange} />
      );
    default:
      break;
  }
}, isEqual);
function useLoadToursData() {
  const [stateAPIStatus, setAPIStatus] = useState("idle");
  const dispatch = useDispatch();

  useEffect(() => {
    setAPIStatus("loading");
    loadToursData()
      .then((data) => {
        dispatch({
          type: ACTIONS.LOAD_TOUR_TABLE,
          payload: {
            table: data.table,
            labels: data.labels,
          },
        });
        setAPIStatus("success");
      })
      .catch((error) => {
        setAPIStatus("error");
      });
  }, [dispatch]);

  return stateAPIStatus;
}
function useButtonGroupProps() {
  const dispatch = useDispatch();
  const edit = useSelector(editMode);
  const checkedRows = useSelector(checkedId);
  const changes = useSelector(changesById);
  const checkedRowsExist = checkedRows.length !== 0;
  const changesExist = Object.keys(changes).length !== 0;

  const forceClose = useCallback(() => {
    dispatch({
      type: ACTIONS.RESET_CHANGES,
    });
  }, []);

  const onToggleEdit = useCallback(() => {
    dispatch({
      type: ACTIONS.EDIT_TOGGLE,
    });
  }, []);
  const onSave = useCallback(() => {
    dispatch({
      type: ACTIONS.SAVE_CHANGES,
    });
  }, []);
  const onClose = useCallback(() => {
    dispatch({
      type: ACTIONS.RESET_CHANGES,
    });
  }, []);
  const onDownload = useCallback(() => {
    console.log("on Download");
  }, []);
  const onAdd = useCallback(() => {
    console.log("on Add");
  }, []);
  const onDelete = useCallback(() => {
    console.log("on Delete");
  }, []);
  return {
    onToggleEdit,
    onSave,
    onClose,
    onDownload,
    onAdd,
    onDelete,
    forceClose,
    editMode: edit,
    checkedRowsExist,
    changesExist,
    labelsSelector: modalLabelsReselect,
    titleModal: "Add Tour",
  };
}
function useTableLabelProps() {
  const dispatch = useDispatch();
  const date = useSelector(tourDate);
  const handlerMonthChange = useCallback((date) => {
    dispatch({
      type: ACTIONS.TOURTABLE_CHANGE_TOURDATE,
      payload: {
        date: date,
      },
    });
  }, []);

  const title = useMemo(
    () => (
      <MonthSelectorDropdown
        title="Touren Alle Werke"
        date={date}
        onChange={handlerMonthChange}
      />
    ),
    [date]
  );
  return { title };
}
function useFilterProps() {
  const dispatch = useDispatch();
  const filterDataSelector = nestedFilterTourData;
  const nestedFilterComponent = useMemo(
    () => <FilterComponent></FilterComponent>,
    []
  );
  const onToggleFilterColumn = useCallback((id) => {
    console.log(id);
    dispatch({
      type: ACTIONS.TOGGLE_COLUMN,
      payload: {
        id: id,
      },
    });
  }, []);
  return {
    filterDataSelector,
    nestedFilterComponent,
    onToggleFilterColumn,
  };
}

function useTableProps() {
  const dispatch = useDispatch();
  const dataSelector = reactTableData;
  const headersSelector = visibleHeaders;
  const hiddenColumnsSelector = hiddenColumnsReselect;
  const editSelector = editMode;
  const onCellChange = useCallback((id, label, value) => {
    dispatch({
      type: ACTIONS.ADD_CHANGE,
      payload: {
        id: id,
        key: label,
        change: value,
      },
    });
  }, []);
  const onSelectedRowsChange = useCallback((rows) => {
    dispatch({
      type: ACTIONS.CHECK_ONE,
      payload: {
        ids: rows,
      },
    });
  }, []);

  return {
    onSelectedRowsChange,
    dataSelector,
    headersSelector,
    hiddenColumnsSelector,
    onCellChange,
    editSelector,
  };
}

Tours.displayName = "Tours";
