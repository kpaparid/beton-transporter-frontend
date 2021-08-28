import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";

import { useDispatch, useSelector } from "react-redux";
import { editMode, hiddenColumnsReselect } from "./MySelectors";
import {
  Card,
  Form,
  Nav,
  Pagination,
  Table,
} from "@themesberg/react-bootstrap";
import Input from "./TextArea/MyNewInput";
import { isEqual } from "lodash";
import { ACTIONS } from "../reducers/redux";
import "./MyForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

function useCellComponent({ cellType, ...rest }) {
  switch (cellType) {
    case "input":
      return <Input {...rest} />;

    default:
      return <Input {...rest} />;
  }
}
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
      setValue(e);
    }, []);
    const handleUpdateData = useCallback(() => {
      if (!isEqual(value, initialValue))
        updateMyData(index, id, value, label, tourId);
    }, [value, initialValue]);
    const onBlur = useCallback(() => handleUpdateData(), [handleUpdateData]);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const component = useCellComponent({
      ...rest,
      label,
      value,
      onChange,
      onBlur,
      editSelector,
      isSelected,
    });
    return component;
  },
  isEqual
);
const RTable = memo(
  ({
    columns,
    data,
    updateMyData,
    hiddenColumnsSelector,
    editSelector,
    skipReset,
    maxPageSize = 20,
  }) => {
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
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      getTableBodyProps,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        updateMyData,
        initialState: { pageSize: maxPageSize },
        autoResetPage: !skipReset,
        autoResetSelectedRows: !skipReset,
        autoResetSortBy: !skipReset,
        autoResetExpanded: !skipReset,
        autoResetGroupBy: !skipReset,
        autoResetFilters: !skipReset,
        autoResetRowState: !skipReset,
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
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <div>
                  <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                </div>
              ),
              Cell: ({ row }) => (
                <div>
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              ),
            },
            ...columns,
          ];
        });
      }
    );

    return (
      <>
        <Table
          hover
          responsive
          className="align-items-center table-flush align-items-center table"
          {...getTableBodyProps()}
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
  const display = hiddenColumns.includes(cell.column.label)
    ? "none"
    : "table-cell";
  return (
    <td
      style={{
        display: display,
      }}
      className="px-2 py-0"
    >
      {cell.render("Cell")}
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
  console.log(pageCount);
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

const ReactTable = forwardRef(
  ({ children: { dataSelector, headersSelector, ...rest } }, skipResetRef) => {
    const tours = useSelector(dataSelector);
    const columns = useSelector(headersSelector);
    const [data, setData] = useState(tours);
    const dispatch = useDispatch();
    const addChanges = useCallback((id, label, value) => {
      dispatch({
        type: ACTIONS.ADD_CHANGE,
        payload: {
          id: id,
          key: label,
          change: value,
        },
      });
    }, []);

    const updateMyData = useCallback((rowIndex, columnId, value, label, id) => {
      skipResetRef.current = true;
      addChanges(id, label, value);
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
        console.log("new Tours", tours);
        skipResetRef.current = true;
        setData(tours);
      }
    }, [tours]);
    useEffect(() => {
      if (!isEqual(data, tours)) {
        console.log("new columns", columns);
      }
    }, [columns]);

    useEffect(() => {
      skipResetRef.current = false;
    }, [data]);
    return (
      <>
        <RTable
          columns={columns}
          data={data}
          updateMyData={updateMyData}
          skipReset={skipResetRef.current}
          {...rest}
        />
      </>
    );
  }
);

export default React.memo(ReactTable);
