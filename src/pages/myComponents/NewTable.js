import React, {
  memo,
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import _ from "lodash";
import isEqual from "lodash.isequal";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { useSelector } from "react-redux";
// import { hiddenColumnsReselect } from "./MySelectors";
import {
  Card,
  Form,
  Nav,
  Pagination,
  Table,
} from "@themesberg/react-bootstrap";
import Input from "./TextArea/MyNewInput";
import "./MyForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortDown,
  faSortUp,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleRight,
  faAngleDoubleLeft,
} from "@fortawesome/free-solid-svg-icons";
import LazyLoad from "react-lazyload";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";

export const RTables2 = memo(
  ({
    size = 20,
    data,
    columns,
    selectHiddenColumns,
    massEdit = false,
    editModeSelector,
    updateMyData,
    onSelectRow,
    onSelectAllRows,
    selectSelectedRows,
    onToggleSort,
  }) => {
    const labels = useMemo(() => columns.map((e) => e.accessor), [columns]);
    const renderCell = useCallback(
      (cell, index, isSelected) => {
        return (
          <EditableCell
            value={cell}
            editModeSelector={editModeSelector}
            updateMyData={updateMyData}
            index={index}
            id={0}
            isSelected={isSelected}
          ></EditableCell>
        );
      },
      [editModeSelector, updateMyData]
    );
    return (
      <>
        <Table
          responsive
          className="align-items-center table-flush align-items-center user-table"
        >
          <TableHead
            massEdit={massEdit}
            columns={columns}
            selectHiddenColumns={selectHiddenColumns}
            onSelectAllRows={onSelectAllRows}
            selectSelectedRows={selectSelectedRows}
            onToggleSort={onToggleSort}
            size={size}
          ></TableHead>
          <TableBody
            massEdit={massEdit}
            data={data}
            labels={labels}
            selectHiddenColumns={selectHiddenColumns}
            selectSelectedRows={selectSelectedRows}
            onSelectRow={onSelectRow}
            renderCell={renderCell}
          />
        </Table>
      </>
    );
  },
  isEqual
);

const TableBody = React.memo(
  ({
    data,
    labels,
    selectHiddenColumns,
    selectSelectedRows,
    renderCell,
    onSelectRow,
    // selectedRows,
  }) => {
    const hiddenColumns = useSelector(selectHiddenColumns);
    const display = useMemo(() => hiddenColumns, [hiddenColumns]);

    const selectedRows = useSelector(selectSelectedRows);
    // const display = useMemo(() => hiddenColumns, [hiddenColumns]);
    return (
      <tbody>
        {data.map((row, index) => {
          // prepareRow(row);
          return (
            <RenderRow
              row={row}
              labels={labels}
              key={"row" + index}
              index={index}
              display={display}
              renderCell={renderCell}
              onSelectRow={onSelectRow}
              isSelected={selectedRows.includes(row.id)}
            ></RenderRow>
          );
        })}
      </tbody>
    );
  },
  isEqual
);

const RenderRow = memo(
  ({
    row,
    labels,
    index,
    massEdit,
    renderCell,
    onSelectRow,
    display,
    isSelected,
    // selectedRows,
  }) => {
    const handleChange = useCallback(() => {
      onSelectRow(row.id);
    }, [row.id]);

    return (
      <tr key={"row" + index}>
        {!massEdit && (
          <td className="px-2 py-1">
            <div className="d-flex justify-content-center w-100">
              <div>
                <IndeterminateCheckbox
                  onChange={handleChange}
                  isSelected={isSelected}
                ></IndeterminateCheckbox>
              </div>
            </div>
          </td>
        )}
        {labels.map((label) => (
          <TableCell
            isSelected={isSelected}
            cell={row[label]}
            index={index}
            key={label + "-" + index}
            display={display[label]}
            renderCell={renderCell}
          />
        ))}
      </tr>
    );
  },
  isEqual
);

const TableCell = memo(({ cell, index, display, renderCell, isSelected }) => {
  return (
    <td
      style={{
        display: display,
      }}
      className="px-2 py-1"
    >
      <div className="d-flex justify-content-center w-100">
        <LazyLoad
          offset={300}
          placeholder={
            <ComponentPreLoader show logo={false}></ComponentPreLoader>
          }
        >
          {renderCell(cell, index, isSelected)}
        </LazyLoad>
      </div>
    </td>
  );
}, isEqual);
const EditableCell = React.memo(
  ({
    value: {
      value: initialValue = "error",
      label,
      idx,
      id: cellId,
      links,
      format,
      ...rest
    },
    index,
    isSelected,
    id,
    updateMyData,
    editModeSelector,
  }) => {
    // console.log({ connections });
    const [value, setValue] = useState(initialValue);
    const handleUpdateData = useCallback(
      (v = value) => {
        console.log("UPDATING DATA");
        updateMyData(index, id, v, label, idx, cellId, links);
      },
      [value, initialValue]
    );
    const debouncedUpdate = _.debounce(handleUpdateData, 300);
    const onChange = useCallback((value, type) => {
      setValue(value);
      debouncedUpdate(value);

      // if (type === "select" || type === "date") handleUpdateData(value);
    }, []);
    const onBlur = useCallback(() => console.log("blur"), []);
    // const onBlur = useCallback(() => handleUpdateData(), [handleUpdateData]);

    const editMode = useSelector(editModeSelector);
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const editable = useMemo(
      () => isSelected && editMode,
      [editMode, isSelected]
    );
    return (
      <Input
        extendable
        {...{
          value,
          onChange,
          onBlur,
          editable,
          ...rest,
        }}
      />
    );
  },
  isEqual
);

const TableHead = ({
  columns,
  selectHiddenColumns,
  selectSortedColumn,
  massEdit,
  onSelectAllRows,
  selectSelectedRows,
  size,
  onToggleSort,
}) => {
  const hiddenColumns = useSelector(selectHiddenColumns);
  const selectedRows = useSelector(selectSelectedRows);
  const state =
    size === selectedRows.length
      ? "checked"
      : selectedRows.length === 0
      ? "unchecked"
      : "indeterminate";
  return (
    <thead>
      <tr className="text-center" key={"th-0"}>
        {!massEdit && (
          <th className="border-0">
            <div>
              <span>
                <IndeterminateCheckbox
                  state={state}
                  onChange={onSelectAllRows}
                ></IndeterminateCheckbox>
              </span>
            </div>
          </th>
        )}
        {columns.map(({ Header, accessor }, index) => {
          const display = hiddenColumns[accessor];
          return (
            <TableColumn
              key={accessor}
              column={Header}
              accessor={accessor}
              display={display}
              onToggleSort={onToggleSort}
              // sortedComponent={sortedComponent}
            />
          );
        })}
      </tr>
    </thead>
  );
};
const TableColumn = ({
  column,
  accessor,
  sortedComponent,
  display,
  onToggleSort,
}) => {
  return (
    <th
      onClick={() => onToggleSort(accessor)}
      className="border-0"
      style={{
        display,
      }}
    >
      <div>
        <span>
          {column}
          {sortedComponent}
        </span>
      </div>
    </th>
  );
};

const IndeterminateCheckbox = memo(
  ({ isSelected, state = "unchecked", ...rest }) => {
    const resolvedRef = React.useRef();

    React.useEffect(() => {
      resolvedRef.current.indeterminate = state === "indeterminate";
    }, [resolvedRef, state]);
    return (
      <Form.Check
        ref={resolvedRef}
        checked={isSelected || state === "checked" || state === "indeterminate"}
        {...rest}
        className="checkbox"
      />
    );
  }
);
