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
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

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
    ({ value, labelId, rowId, links, row }) => {
      const oldRow = row;
      if (oldRow[labelId] !== value) {
        console.log("yikes", value, oldRow[labelId]);
        const changesById = {
          [labelId]: value,
          ...links.reduce(
            (a, { connection, dependencies, format }) => ({
              ...a,
              [connection]: format(
                dependencies.map((d) => {
                  return d === labelId ? value : oldRow[d];
                })
              ),
            }),
            {}
          ),
        };
        onCellChange({ rowId, changes: changesById });
      }
    },
    [onCellChange]
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
        updateMyData={updateMyData}
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
    editModeSelector,
    updateMyData,
    onSelectRow,
    onSelectAllRows,
    selectSelectedRows,
    onToggleSort,
    selectSortedColumn,
    selectPaginationData,
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
            massEdit={massEdit}
            data={data}
            labels={labels}
            selectHiddenColumns={selectHiddenColumns}
            selectSelectedRows={selectSelectedRows}
            editModeSelector={editModeSelector}
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
    editModeSelector,
    massEdit,
  }) => {
    const hiddenColumns = useSelector(selectHiddenColumns);
    const display = useMemo(() => hiddenColumns, [hiddenColumns]);
    const selectedRows = useSelector(selectSelectedRows);
    const editMode = useSelector(editModeSelector);

    return (
      <>
        <tbody>
          <tr key={"addRow-tr"}>
            {!massEdit && <td />}
            <AddRow
              labels={labels}
              key={"addrow"}
              index={0}
              display={display}
            />
          </tr>
          {data.map((row, index) => {
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
const AddRow = memo(({ row, labels, index, display }) => {
  const renderCell = useCallback((id, cell, index, isEditable) => {
    return (
      <EditableCell
        value={cell}
        // updateMyData={updateMyData}
        index={index}
        id={id}
        isEditable={isEditable}
      />
    );
  }, []);
  return labels.map((label) => (
    <TableCell
      isEditable={true}
      value={""}
      cellProps={label}
      index={index}
      key={label.id + "-" + index}
      display={display[label.id]}
    />
  ));
}, isEqual);

const RenderRow = memo(
  ({ row, labels, index, updateMyData, display, isEditable }) => {
    const handleUpdate = useCallback(
      (props) => updateMyData({ ...props, row }),
      [row, updateMyData]
    );
    return labels.map((label) => (
      <TableCell
        row={row.id}
        isEditable={isEditable}
        value={row[label.id]}
        cellProps={label}
        index={index}
        key={label.id + "-" + index}
        display={display[label.id]}
        updateMyData={handleUpdate}
      />
    ));
  },
  isEqual
);

const TableCell = memo(
  ({ row, value, index, display, updateMyData, isEditable, cellProps }) => {
    return (
      <td style={{ display }} className="px-2 py-1">
        <div className="d-flex justify-content-center w-100">
          <EditableCell
            cellProps={cellProps}
            value={value}
            updateMyData={updateMyData}
            index={index}
            row={row}
            isEditable={isEditable}
          />
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
  }) => {
    const { id: label, idx, links, measurement, ...rest } = cellProps;
    const [value, setValue] = useState(initialValue);
    const handleUpdateData = useCallback(
      (v = value) => {
        updateMyData({
          rowIndex: index,
          value: v,
          labelId: label,
          rowId: row,
          links,
        });
      },
      [value, index, label, row, links, updateMyData]
    );
    const debouncedUpdate = _.debounce(handleUpdateData, 300);
    const onChange = useCallback(
      (value, type) => {
        switch (type) {
          case "date":
            const v = moment(value, "YYYY/MM/DD", true).isValid
              ? moment(value, "YYYY/MM/DD").format("DD.MM.YYYY")
              : value;
            setValue(v);
            debouncedUpdate(value);
            break;

          default:
            setValue(value);
            debouncedUpdate(value);
        }
      },
      [debouncedUpdate]
    );
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
        {columns.map(({ Header, id }, index) => {
          const display = hiddenColumns[id];
          const sorted = sortedColumn && id === sortedColumn.id;
          const order = sorted && sortedColumn.order;
          return (
            <TableColumn
              key={id}
              column={Header}
              id={id}
              display={display}
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
  const handleClick = useCallback((e) => onToggleSort(id), [onToggleSort, id]);
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
      <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
        {paginationEnabled && currentPageSize < maxRows && (
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
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
                    pagesCount <= 3
                      ? index + 1
                      : pagesCount <= parseInt(pageIndex) + 1
                      ? pagesCount - 4 + index
                      : pageIndex > 3
                      ? parseInt(pageIndex) - 2 + index
                      : index + 1,
                  gotoPage: onPageChange,
                  active:
                    pagesCount <= 3
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
          <small className="fw-bold">
            Showing <b>{currentPageSize}</b> out of <b>{maxRows}</b> entries
          </small>
        )}
      </Card.Footer>
    );
  }
);
export default TableCore;
