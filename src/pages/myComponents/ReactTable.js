import React, {
  memo,
  useRef,
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { TableLabel } from "./Table/TableLabel";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";

import { useDispatch, useSelector } from "react-redux";
import { hiddenColumnsReselect } from "./MySelectors";
import {
  Card,
  Form,
  Nav,
  Pagination,
  Table,
} from "@themesberg/react-bootstrap";
import Input from "./TextArea/MyNewInput";
import { isEqual } from "lodash";
import "./MyForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";

export const ReactTable = memo(
  forwardRef(({ children }, skipResetRef) => {
    const { dataSelector, headersSelector, onCellChange, ...rest } = children;
    const tours = useSelector(dataSelector);
    const columns = useSelector(headersSelector);
    const [data, setData] = useState(tours);
    const updateMyData = useCallback((rowIndex, columnId, value, label, id) => {
      skipResetRef.current = true;
      onCellChange(id, label, value);
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [columnId]: { ...row[columnId], value: value },
            };
          }
          return row;
        })
      );
    }, []);

    useEffect(() => {
      if (!isEqual(data, tours)) {
        skipResetRef.current = true;
        setData(tours);
      }
    }, [tours]);
    useEffect(() => {
      if (!isEqual(data, tours)) {
      }
    }, [columns]);

    useEffect(() => {
      skipResetRef.current = false;
    }, [data]);
    console.log(data);
    return (
      <>
        <RTables
          ref={skipResetRef}
          {...rest}
          columns={columns}
          data={data}
          updateMyData={updateMyData}
        />
      </>
    );
  }),
  isEqual
);
const RTables = memo(
  forwardRef(
    (
      {
        columns,
        data,
        updateMyData,
        hiddenColumnsSelector,
        editSelector,
        maxPageSize = 20,
        setSelectedRows,
      },
      ref
    ) => {
      const defaultColumn = React.useMemo(
        () => ({
          Cell: ({
            value,
            row: { index, isSelected },
            column: { id },
            updateMyData,
          }) => (
            <EditableCell
              {...{ value, index, id, updateMyData, editSelector, isSelected }}
            />
          ),
        }),
        []
      );
      const {
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        getTableBodyProps,
        selectedFlatRows,
        state: { pageIndex },
      } = useTable(
        {
          columns,
          data,
          defaultColumn,
          updateMyData,
          initialState: { pageSize: 20, hiddenColumns: ["id"] },
          autoResetPage: !ref.current,
          autoResetSelectedRows: !ref.current,
          autoResetSortBy: !ref.current,
          autoResetExpanded: !ref.current,
          autoResetGroupBy: !ref.current,
          autoResetFilters: !ref.current,
          autoResetRowState: !ref.current,
          disableMultiSort: true,
        },
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
          hooks.visibleColumns.push((columns) => {
            return [
              {
                id: "selection",
                Header: ({ getToggleAllPageRowsSelectedProps }) => (
                  <div>
                    <IndeterminateCheckbox
                      {...getToggleAllPageRowsSelectedProps()}
                    />
                  </div>
                ),
                Cell: ({ row }) => (
                  <div className="d-flex justify-content-center">
                    <IndeterminateCheckbox
                      {...row.getToggleRowSelectedProps()}
                    />
                  </div>
                ),
              },
              ...columns,
            ];
          });
        }
      );
      useEffect(() => {
        console.log(selectedFlatRows);
        setSelectedRows(selectedFlatRows.map((_) => _.original.id));
      }, [selectedFlatRows]);
      // console.log(getTableBodyProps());
      return (
        <>
          <Table
            hover
            responsive
            className="align-items-center table-flush align-items-center user-table"
          >
            <TableHead headerGroups={headerGroups}></TableHead>
            <TableBody
              page={page}
              prepareRow={prepareRow}
              hiddenColumnsSelector={hiddenColumnsSelector}
            ></TableBody>
          </Table>
          {maxPageSize < data.length && (
            <TableFooter
              maxRows={data.length}
              {...{
                pageCount,
                nextPage,
                previousPage,
                canPreviousPage,
                canNextPage,
                gotoPage,
                pageIndex,
                currentPageSize: page.length,
              }}
            ></TableFooter>
          )}
        </>
      );
    }
  ),
  isEqual
);

const EditableCell = React.memo(
  ({
    value: { value: initialValue, label, id: tourId, ...rest },
    index,
    isSelected,
    id,
    updateMyData,
    editSelector,
  }) => {
    const [value, setValue] = useState(initialValue);
    const onChange = useCallback((e) => {
      console.log("editable", e);
      setValue(e);
    }, []);
    const handleUpdateData = useCallback(() => {
      if (!isEqual(value, initialValue))
        updateMyData(index, id, value, label, tourId);
    }, [value, initialValue]);
    const onBlur = useCallback(() => handleUpdateData(), [handleUpdateData]);

    const editMode = useSelector(editSelector);
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
          label,
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

const TableBody = ({ page, prepareRow, hiddenColumnsSelector }) => {
  const hiddenColumns = useSelector(hiddenColumnsSelector);
  return (
    <tbody>
      {page.map((row, index) => {
        prepareRow(row);
        return (
          <tr key={"row" + index}>
            {row.cells.map((cell) => (
              <TableCell
                cell={cell}
                index={index}
                key={cell.column.id + index}
                hiddenColumns={hiddenColumns}
              />
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

const TableCell = memo(({ cell, hiddenColumns }) => {
  const display = hiddenColumns.includes(cell.column.id)
    ? "none"
    : "table-cell";
  return (
    <td
      style={{
        display: display,
      }}
      className="px-2 py-1"
    >
      <div className="d-flex justify-content-center w-100">
        {cell.render("Cell")}
      </div>
    </td>
  );
}, isEqual);

const TableColumn = ({ column, sortedComponent, display }) => {
  return (
    <th
      // {...column.getHeaderProps()}
      className="border-bottom px-3"
      style={{
        display,
      }}
    >
      <div>
        <span {...column.getSortByToggleProps()}>
          {column.render("Header")}
          {sortedComponent}
        </span>
      </div>
    </th>
  );
};

const TableHead = ({ headerGroups }) => {
  const hiddenColumns = useSelector(hiddenColumnsReselect);
  return (
    <thead className="thead-light">
      {headerGroups.map((headerGroup, index) => (
        <tr
          // {...headerGroup.getHeaderGroupProps()}
          className="text-center"
          key={"th-" + index}
        >
          {headerGroup.headers.map((column) => {
            const display = hiddenColumns.includes(column.id)
              ? "none"
              : "table-cell";
            const sortedComponent = column.isSorted ? (
              column.isSortedDesc ? (
                <FontAwesomeIcon
                  className="ps-1"
                  style={{ width: "15px", top: "-1px", position: "relative" }}
                  icon={faSortDown}
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  className="ps-1"
                  style={{ width: "15px", top: "3px", position: "relative" }}
                  icon={faSortUp}
                ></FontAwesomeIcon>
              )
            ) : (
              ""
            );
            return (
              <TableColumn
                key={column.id}
                column={column}
                display={display}
                sortedComponent={sortedComponent}
              />
            );
          })}
        </tr>
      ))}
    </thead>
  );
};
const PaginationItem = ({ page, gotoPage, active = false }) => {
  return (
    <Pagination.Item active={active} onClick={() => gotoPage(page - 1)}>
      {page}
    </Pagination.Item>
  );
};
const TableFooter = React.memo((props) => {
  const {
    maxRows = 25,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    gotoPage,
    pageCount,
    pageIndex,
    currentPageSize = 0,
  } = props;
  return (
    <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
      <Nav>
        <Pagination className="mb-2 mb-lg-0">
          <Pagination.Prev
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </Pagination.Prev>
          {[...Array(pageCount)].map((_, index) => {
            const itemProps = {
              page: index + 1,
              gotoPage,
              active: index === pageIndex ? true : false,
            };
            return (
              <PaginationItem {...itemProps} key={"pagination-item-" + index} />
            );
          })}
          <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Pagination.Next>
        </Pagination>
      </Nav>

      {true && (
        <small className="fw-bold">
          Showing <b>{currentPageSize}</b> out of <b>{maxRows}</b> entries
        </small>
      )}
    </Card.Footer>
  );
});
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
    return <Form.Check ref={resolvedRef} {...rest} className="checkbox" />;
  }
);
ReactTable.displayName = "ReactTable";

RTables.displayName = "RTables";
