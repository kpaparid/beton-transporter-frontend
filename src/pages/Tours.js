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
  const reducerName = "tourTable";
  const stateAPIStatus = useLoadToursData(reducerName);
  const buttonGroupProps = useButtonGroupProps(reducerName);
  const filterProps = useFilterProps(reducerName);
  const tableProps = useTableProps(reducerName);
  const { title } = useTableLabelProps(reducerName);
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

export const FilterComponent = memo(({ type, label, reducerName, ...rest }) => {
  const dispatch = useDispatch();
  const toggleOne = useCallback((value) => {
    console.log("click nestedFilter Single");
    dispatch({
      name: reducerName,
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
      name: reducerName,
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
      name: reducerName,
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
function useLoadToursData(reducerName) {
  const [stateAPIStatus, setAPIStatus] = useState("idle");
  const dispatch = useDispatch();

  useEffect(() => {
    setAPIStatus("loading");
    loadToursData()
      .then((data) => {
        dispatch({
          name: reducerName,
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
function useButtonGroupProps(reducerName) {
  const dispatch = useDispatch();
  const edit = useSelector((state) => editMode(state[reducerName]));
  const checkedRows = useSelector((state) => checkedId(state[reducerName]));
  const changes = useSelector((state) => changesById(state[reducerName]));
  const checkedRowsExist = checkedRows.length !== 0;
  const changesExist = Object.keys(changes).length !== 0;
  const labelsSelector = useCallback(
    (state) => modalLabelsReselect(state[reducerName]),
    [reducerName]
  );
  const forceClose = useCallback(() => {
    dispatch({
      name: reducerName,
      type: ACTIONS.RESET_CHANGES,
    });
  }, []);

  const onToggleEdit = useCallback(() => {
    dispatch({
      name: reducerName,
      type: ACTIONS.EDIT_TOGGLE,
    });
  }, []);
  const onSave = useCallback(() => {
    dispatch({
      name: reducerName,
      type: ACTIONS.SAVE_CHANGES,
    });
  }, []);
  const onClose = useCallback(() => {
    dispatch({
      name: reducerName,
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
    labelsSelector,
    titleModal: "Add Tour",
  };
}
function useTableLabelProps(reducerName) {
  const dispatch = useDispatch();
  const date = useSelector((state) => tourDate(state[reducerName]));
  const handlerMonthChange = useCallback((date) => {
    dispatch({
      name: reducerName,
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
function useFilterProps(reducerName) {
  const dispatch = useDispatch();
  const filterDataSelector = useCallback(
    (state) => nestedFilterTourData(state[reducerName]),
    [reducerName]
  );
  const nestedFilterComponent = useMemo(
    () => <FilterComponent reducerName={reducerName}></FilterComponent>,
    [reducerName]
  );
  const onToggleFilterColumn = useCallback((id) => {
    console.log(id);
    dispatch({
      name: reducerName,
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

function useTableProps(reducerName) {
  const dispatch = useDispatch();
  const dataSelector = useCallback(
    (state) => reactTableData(state[reducerName]),
    [reducerName]
  );
  const headersSelector = useCallback(
    (state) => visibleHeaders(state[reducerName]),
    [reducerName]
  );
  const hiddenColumnsSelector = useCallback(
    (state) => hiddenColumnsReselect(state[reducerName]),
    [reducerName]
  );
  const editSelector = useCallback(
    (state) => editMode(state[reducerName]),
    [reducerName]
  );
  const onCellChange = useCallback((id, label, value) => {
    dispatch({
      name: reducerName,
      type: ACTIONS.ADD_CHANGE,
      payload: {
        id: id,
        key: label,
        change: value,
      },
    });
  }, []);
  const setSelectedRows = useCallback((rows) => {
    dispatch({
      name: reducerName,
      type: ACTIONS.CHECK_ONE,
      payload: {
        ids: rows,
      },
    });
  }, []);

  return {
    setSelectedRows,
    dataSelector,
    headersSelector,
    hiddenColumnsSelector,
    onCellChange,
    editSelector,
  };
}

Tours.displayName = "Tours";
