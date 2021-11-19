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
import {
  Card,
  Form,
  Nav,
  Pagination,
  Table,
} from "@themesberg/react-bootstrap";
import { ComponentPreLoader } from "../../../components/ComponentPreLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faCaretDown,
  faCaretUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { nanoid } from "@reduxjs/toolkit";

const Lazer = React.lazy(() => import("../TextArea/LazyInput"));

const TableCore = memo((props) => {
  const {
    selectData,
    selectShownColumns,
    onCellChange,
    pagination,
    counter,
    ...rest
  } = props;
  const data = useSelector(selectData);
  const headers = useSelector(selectShownColumns);
  const [columns, setColumns] = useState(headers);
  const updateMyData = useCallback(
    ({ value, labelId, rowId }) => {
      onCellChange({ rowId, changes: { labelId, value } });
    },
    [onCellChange]
  );

  const debouncedUpdate = useMemo(
    () => _.debounce(updateMyData, 300),
    [updateMyData]
  );
  useEffect(() => {
    if (!isEqual(headers, columns)) {
      setColumns(headers);
    }
  }, [headers, columns]);
  return (
    <>
      <RTables
        {...rest}
        columns={columns}
        data={data}
        updateMyData={debouncedUpdate}
      />
      <TableFooter {...pagination} currentPageSize={data.length} />
    </>
  );
}, isEqual);

const RTables = memo(
  ({
    data,
    columns,
    selectHiddenColumns,
    massEdit = false,
    modeselector,
    updateMyData,
    onSelectRow,
    onSelectAllRows,
    selectSelectedRows,
    onToggleSort,
    selectSortedColumn,
    selectPaginationData,
    selectAddRow,
  }) => {
    const labels = useMemo(() => columns.map((e) => e), [columns]);
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
            selectSortedColumn={selectSortedColumn}
            selectPaginationData={selectPaginationData}
          ></TableHead>
          <TableBody
            selectAddRow={selectAddRow}
            massEdit={massEdit}
            data={data}
            labels={labels}
            selectHiddenColumns={selectHiddenColumns}
            selectSelectedRows={selectSelectedRows}
            modeselector={modeselector}
            onSelectRow={onSelectRow}
            updateMyData={updateMyData}
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
    updateMyData,
    onSelectRow,
    selectAddRow,
    modeselector,
    massEdit,
  }) => {
    const hiddenColumns = useSelector(selectHiddenColumns);
    const display = useMemo(() => hiddenColumns, [hiddenColumns]);
    const selectedRows = useSelector(selectSelectedRows);
    const mode = useSelector(modeselector);
    const addRow = useSelector(selectAddRow);

    return (
      <>
        <tbody>
          <tr key={"addRow-tr"}>
            {mode === "addRow" && (
              <>
                {!massEdit && <td></td>}
                <AddRow
                  row={addRow}
                  labels={labels}
                  key={"add-row"}
                  index={0}
                  display={display}
                  updateMyData={updateMyData}
                />
              </>
            )}
          </tr>
          {data.map((row, index) => {
            const isSelected = selectedRows.includes(row.id);
            const editable = mode === "edit" && isSelected;
            return (
              <tr key={"row" + index}>
                {!massEdit && (
                  <td className="px-3 py-1" style={{ width: "50px" }}>
                    <IndeterminateCheckbox
                      onChange={() => onSelectRow(row.id)}
                      isSelected={isSelected}
                    />
                  </td>
                )}
                <RenderRow
                  row={row}
                  labels={labels}
                  key={"row" + index}
                  index={index}
                  display={display}
                  updateMyData={updateMyData}
                  isEditable={editable}
                />
              </tr>
            );
          })}
        </tbody>
      </>
    );
  },
  isEqual
);
const AddRow = memo(({ row, labels, index, updateMyData }) => {
  return (
    <>
      {labels.map((label) => (
        <TableCell
          row={row.id}
          isEditable={true}
          value={row[label.id]}
          cellProps={label}
          index={index}
          key={label.id + "-" + index}
          updateMyData={updateMyData}
        />
      ))}
    </>
  );
}, isEqual);

const RenderRow = memo(
  ({ row, labels, index, updateMyData, display, isEditable }) => {
    return labels.map((label) => (
      <TableCell
        row={row.id}
        isEditable={isEditable}
        value={row[label.id]}
        cellProps={label}
        index={index}
        key={label.id + "-" + index}
        display={display[label.id]}
        updateMyData={updateMyData}
      />
    ));
  },
  isEqual
);

const TableCell = memo(
  ({
    row,
    value,
    index,
    display = "auto",
    updateMyData,
    isEditable,
    cellProps,
    measurement = true,
  }) => {
    return (
      <td style={{ display }} className="px-2 py-1">
        <div className="w-100 d-flex justify-content-center">
          <div className="w-100 d-flex justify-content-center">
            <EditableCell
              cellProps={cellProps}
              value={value}
              updateMyData={updateMyData}
              index={index}
              row={row}
              isEditable={isEditable}
              measurement={measurement}
            />
          </div>
        </div>
      </td>
    );
  },
  isEqual
);
const EditableCell = React.memo(
  ({
    row,
    index,
    isEditable,
    updateMyData,
    cellProps,
    value: initialValue,
    measurement: measurementEnabled,
  }) => {
    const { id: label, idx, links, measurement, ...rest } = cellProps;
    const [value, setValue] = useState(initialValue);
    const handleUpdateData = useCallback(
      (v = value) =>
        updateMyData({
          value: v,
          labelId: label,
          rowId: row,
        }),
      [value, label, row, updateMyData]
    );

    const onChange = useCallback(
      (value, type) => {
        switch (type) {
          case "date":
            const v = moment(value, "YYYY/MM/DD", true).isValid()
              ? moment(value, "YYYY/MM/DD").format("DD.MM.YYYY")
              : value;
            setValue(v);
            handleUpdateData(value);
            break;

          default:
            setValue(value);
            handleUpdateData(value);
        }
      },
      [handleUpdateData]
    );
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <>
        <div
          style={{
            padding: "1px ",
            minWidth: rest.maxWidth,
            // whiteSpace: "pre-wrap",
          }}
          className={
            isEditable && cellProps.type !== "nonEditable"
              ? "p-0 d-none dummy"
              : "d-block text-center fallback"
          }
        >
          {value +
            (measurementEnabled && value !== "" && measurement
              ? " " + measurement
              : "")}
        </div>
        {isEditable && cellProps.type !== "nonEditable" && (
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
          <th className="border-0" style={{ width: "50px" }}>
            <IndeterminateCheckbox state={state} onChange={onSelectAllRows} />
          </th>
        )}
        {columns.map(({ Header, id, maxWidth, ...rest }, index) => {
          const display = hiddenColumns[id];
          const sorted = sortedColumn && id === sortedColumn.id;
          const order = sorted && sortedColumn.order;
          return (
            <TableColumn
              key={id}
              column={Header}
              id={id}
              display={display}
              maxWidth={maxWidth}
              onToggleSort={onToggleSort}
              sorted={sorted}
              order={order}
            />
          );
        })}
      </tr>
    </thead>
  );
};
const TableColumn = ({
  column,
  id,
  sorted = false,
  order,
  display = "auto",
  maxWidth = "auto",
  onToggleSort,
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
}) => {
  const handleClick = useCallback((e) => onToggleSort(id), [onToggleSort, id]);
  return (
    <th
      onClick={handleClick}
      className="border-0 sortable align-items-center"
      style={{ display }}
    >
      <div>
        <span
          style={{ lineHeight: "21px" }}
          className="d-flex flex-nowrap justify-content-center align-self-center"
        >
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
    );
  }
);
const PaginationItem = ({ page, gotoPage, active = false }) => {
  return (
    <Pagination.Item active={active} onClick={() => gotoPage(page)}>
      {page}
    </Pagination.Item>
  );
};
const TableFooter = React.memo(
  ({
    paginationEnabled = true,
    counterEnabled = true,
    currentPageSize = 0,
    onPageChange,
    selectPaginationData,
  }) => {
    const {
      rowsCount: maxRows,
      page: pageIndex,
      pagesCount,
    } = useSelector(selectPaginationData);
    return (
      <Card.Footer className="p-0 border-0 d-lg-flex flex-wrap align-items-center justify-content-between">
        {paginationEnabled && currentPageSize < maxRows && (
          <Nav className="pt-4">
            <Pagination className="mb-2 mb-lg-0 d-flex flex-wrap">
              <Pagination.Prev
                onClick={() => onPageChange(1)}
                disabled={parseInt(pageIndex) === 1}
              >
                <FontAwesomeIcon icon={faAngleDoubleLeft}></FontAwesomeIcon>
              </Pagination.Prev>
              <Pagination.Prev
                onClick={() => onPageChange(parseInt(pageIndex) - 1)}
                disabled={parseInt(pageIndex) === 1}
              >
                <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
              </Pagination.Prev>
              {[...Array(pagesCount > 5 ? 5 : pagesCount)].map((_, index) => {
                const itemProps = {
                  page:
                    pagesCount <= 4
                      ? index + 1
                      : pagesCount <= parseInt(pageIndex) + 1
                      ? pagesCount - 4 + index
                      : pageIndex > 3
                      ? parseInt(pageIndex) - 2 + index
                      : index + 1,
                  gotoPage: onPageChange,
                  active:
                    pagesCount <= 4
                      ? parseInt(pageIndex) === index + 1
                      : pagesCount <= parseInt(pageIndex) + 1
                      ? pagesCount - 4 + index === parseInt(pageIndex)
                      : parseInt(pageIndex) > 3
                      ? parseInt(pageIndex) - 2 + index === parseInt(pageIndex)
                      : index + 1 === parseInt(pageIndex),
                };
                return (
                  <PaginationItem
                    {...itemProps}
                    key={"pagination-item-" + index}
                  />
                );
              })}
              <Pagination.Next
                onClick={() => onPageChange(parseInt(pageIndex) + 1)}
                disabled={parseInt(pageIndex) === pagesCount}
              >
                <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
              </Pagination.Next>
              <Pagination.Next
                onClick={() => onPageChange(pagesCount)}
                disabled={parseInt(pageIndex) === pagesCount}
              >
                <FontAwesomeIcon icon={faAngleDoubleRight}></FontAwesomeIcon>
              </Pagination.Next>
              <></>
            </Pagination>
          </Nav>
        )}

        {counterEnabled && (
          <small className="fw-bold ps-3 pt-4">
            Showing <b>{currentPageSize}</b> out of <b>{maxRows}</b> entries
          </small>
        )}
      </Card.Footer>
    );
  }
);
export default TableCore;
