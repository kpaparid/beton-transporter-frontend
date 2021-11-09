import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
  Suspense,
} from "react";
import _ from "lodash";
import isEqual from "lodash.isequal";
import { useSelector } from "react-redux";
// import { hiddenColumnsReselect } from "./MySelectors";
import { Form, Table } from "@themesberg/react-bootstrap";
// import LazyLoad from "react-lazyload";
import { ComponentPreLoader } from "../../../components/ComponentPreLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
// import { LazyLoad } from "react-observer-api";

const Lazer = React.lazy(() => import("../TextArea/LazyInput"));
export const RTables2 = memo(
  ({
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
    selectSortedColumn,
    selectPaginationData,
  }) => {
    const labels = useMemo(() => columns.map((e) => e.accessor), [columns]);
    const renderCell = useCallback(
      (id, cell, index, isEditable) => {
        return (
          <EditableCell
            value={cell}
            // editModeSelector={editModeSelector}
            updateMyData={updateMyData}
            index={index}
            id={id}
            isEditable={isEditable}
          ></EditableCell>
        );
      },
      [updateMyData]
    );

    return (
      <>
        {/* <ComponentPreLoader show={loading} /> */}
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
            selectSortedColumn={selectSortedColumn}
            selectPaginationData={selectPaginationData}
          ></TableHead>
          <TableBody
            massEdit={massEdit}
            data={data}
            labels={labels}
            selectHiddenColumns={selectHiddenColumns}
            selectSelectedRows={selectSelectedRows}
            editModeSelector={editModeSelector}
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
    editModeSelector,
    massEdit,
    // selectedRows,
  }) => {
    const hiddenColumns = useSelector(selectHiddenColumns);
    const display = useMemo(() => hiddenColumns, [hiddenColumns]);
    const selectedRows = useSelector(selectSelectedRows);
    const editMode = useSelector(editModeSelector);

    return (
      <>
        <tbody>
          {data.map((row, index) => {
            // prepareRow(row);
            const isSelected = selectedRows.includes(row.id);
            const editable = editMode && isSelected;
            return (
              <tr key={"row" + index}>
                {!massEdit && (
                  <IndeterminateCheckbox
                    onChange={() => onSelectRow(row.id)}
                    isSelected={isSelected}
                  />
                )}
                <RenderRow
                  row={row}
                  labels={labels}
                  key={"row" + index}
                  index={index}
                  display={display}
                  renderCell={renderCell}
                  isEditable={editable}
                ></RenderRow>
              </tr>
            );
          })}
        </tbody>
      </>
    );
  },
  isEqual
);

const RenderRow = memo(
  ({
    row,
    labels,
    index,
    renderCell,
    display,
    isEditable,
    // selectedRows,
  }) => {
    return labels.map((label) => (
      <TableCell
        id={row.id}
        isEditable={isEditable}
        cell={row[label]}
        index={index}
        key={label + "-" + index}
        display={display[label]}
        renderCell={renderCell}
      />
    ));
  },
  isEqual
);

const TableCell = memo(
  ({ id, cell, index, display, renderCell, isEditable }) => {
    return (
      <td
        style={{
          display: display,
        }}
        className="px-2 py-1"
      >
        <div className="d-flex justify-content-center w-100">
          {renderCell(id, cell, index, isEditable)}
        </div>
      </td>
    );
  },
  isEqual
);
const EditableCell = React.memo(
  ({
    id,
    index,
    isEditable,
    updateMyData,
    value: { value: initialValue, label, idx, links, measurement, ...rest },
  }) => {
    const [value, setValue] = useState(initialValue);
    const handleUpdateData = useCallback(
      (v = value) => {
        updateMyData(index, v, label, id, links);
      },
      [value, index, label, id, links, updateMyData]
    );
    const debouncedUpdate = _.debounce(handleUpdateData, 300);
    const onChange = useCallback((value, type) => {
      setValue(value);
      debouncedUpdate(value);
    }, []);
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <>
        <div className={isEditable ? "d-none" : "d-block"}>
          {value + (measurement ? " " + measurement : "")}
        </div>
        {isEditable && (
          <Suspense
            fallback={
              <ComponentPreLoader show logo={false}></ComponentPreLoader>
            }
          >
            <Lazer {...rest} value={value} onChange={onChange}></Lazer>
          </Suspense>
        )}
      </>
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
  onToggleSort,
  selectPaginationData,
}) => {
  const { rowsCount } = useSelector(selectPaginationData);
  const hiddenColumns = useSelector(selectHiddenColumns);
  const selectedRows = useSelector(selectSelectedRows);
  const sortedColumn = useSelector(selectSortedColumn);
  const state =
    parseInt(rowsCount) === selectedRows.length
      ? "checked"
      : selectedRows.length === 0
      ? "unchecked"
      : "indeterminate";
  return (
    <thead>
      <tr className="text-center" key={"th-0"}>
        {!massEdit && (
          <IndeterminateCheckbox state={state} onChange={onSelectAllRows} />
        )}
        {columns.map(({ Header, accessor }, index) => {
          const display = hiddenColumns[accessor];
          const sorted = sortedColumn && accessor === sortedColumn.id;
          const order = sorted && sortedColumn.order;
          return (
            <TableColumn
              key={accessor}
              column={Header}
              accessor={accessor}
              display={display}
              onToggleSort={onToggleSort}
              sorted={sorted}
              order={order}
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
  sorted = false,
  order,
  sortedComponent = sorted ? (
    <span className="sort-arrow ms-2" style={{ width: "15px", height: "15px" }}>
      <FontAwesomeIcon
        className="w-100 h-100"
        icon={order === "desc" ? faCaretDown : faCaretUp}
      />
    </span>
  ) : (
    <></>
  ),
  display,
  onToggleSort,
}) => {
  const handleClick = useCallback(
    (e) => onToggleSort(accessor),
    [onToggleSort, accessor]
  );
  return (
    <th onClick={handleClick} className="border-0 sortable" style={{ display }}>
      <div>
        <span className="d-flex flex-nowrap justify-content-center align-items-center">
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
      <td className="px-3 py-1" style={{ maxWidth: "50px" }}>
        <div className="d-flex justify-content-center w-100">
          <div>
            <Form.Check
              ref={resolvedRef}
              checked={
                isSelected || state === "checked" || state === "indeterminate"
              }
              {...rest}
              className="checkbox"
            />
          </div>
        </div>
      </td>
    );
  }
);
