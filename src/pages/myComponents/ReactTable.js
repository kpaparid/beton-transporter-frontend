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
import { RTables2 } from "./NewTable";
import { nanoid } from "@reduxjs/toolkit";
export const ReactTable = memo(
  forwardRef(({ children }, skipResetRef) => {
    const {
      selectData,
      selectShownColumns,
      onCellChange,
      pagination,
      // counter,
      ...rest
    } = children;
    const data = useSelector(selectData);
    const headers = useSelector(selectShownColumns);
    const [cells, setCells] = useState(data);
    const [columns, setColumns] = useState(headers);
    // updateMyData(index, id, v, label, idx, cellId);

    const updateMyData = useCallback(
      (rowIndex, columnId, value, labelId, labelIdx, cellId, links) => {
        console.log("updating data", value);
        skipResetRef.current = true;
        const oldRow = cells[rowIndex];

        if (oldRow[labelId].value !== value) {
          console.log("yikes", value, oldRow[labelId].value);
          const changesById = {
            [labelId]: value,
            ...links.reduce(
              (a, { connection, dependencies, format }) => ({
                ...a,
                [connection]: format(
                  dependencies.map((d) =>
                    d === labelId ? value : oldRow[d].value
                  )
                ),
              }),
              {}
            ),
          };
          onCellChange({ rowId: cellId, changes: changesById });
          const changesIds = Object.keys(changesById);
          const mappedChanges = changesIds.reduce(
            (a, id) => ({
              ...a,
              [id]: { ...oldRow[id], value: changesById[id] },
            }),
            { ...oldRow }
          );
          const newRow = { ...oldRow, ...mappedChanges };
          setCells((old) =>
            old.map((row, index) => {
              if (rowIndex === index) {
                return newRow;
              }
              return row;
            })
          );
        }
      },
      [cells]
    );

    useEffect(() => {
      if (!isEqual(cells, data)) {
        skipResetRef.current = true;
        console.log("new data", data, cells);
        setCells(data);
      }
    }, [data, cells]);
    useEffect(() => {
      if (!isEqual(headers, columns)) {
        setColumns(headers);
      }
    }, [headers, columns]);

    useEffect(() => {
      skipResetRef.current = false;
    }, [cells]);
    return (
      <>
        {/* <RTables
          ref={skipResetRef}
          {...rest}
          columns={columns}
          data={cells}
          updateMyData={updateMyData}
        /> */}

        <RTables2
          // ref={skipResetRef}
          {...rest}
          columns={columns}
          data={cells}
          updateMyData={updateMyData}
        />

        {/* {/* {(pagination || counter) && ( */}
        <TableFooter {...pagination} currentPageSize={data.length} />
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
        selectHiddenColumns,
        editModeSelector,
        // pageSize = 5,
        setSelectedRows,
        massEdit,
        // pagination = true,
        // counter,
        // pageCount: controlledPageCount,
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
          }) => {
            // console.log(value);
            return (
              <EditableCell
                {...{
                  value,
                  index,
                  id,
                  updateMyData,
                  editModeSelector,
                  isSelected: massEdit || isSelected,
                }}
              />
            );
          },
        }),
        []
      );
      const {
        headerGroups,
        prepareRow,
        page,
        // canPreviousPage,
        // canNextPage,
        // pageCount,
        // gotoPage,
        // nextPage,
        // previousPage,
        selectedFlatRows,
        state: { pageIndex },
      } = useTable(
        {
          columns,
          data,
          defaultColumn,
          updateMyData,
          initialState: { hiddenColumns: ["id"] },
          // initialState: { pageIndex: 0, pageSize, hiddenColumns: ["id"] },
          autoResetPage: !ref.current,
          autoResetSelectedRows: !ref.current,
          autoResetSortBy: !ref.current,
          autoResetExpanded: !ref.current,
          autoResetGroupBy: !ref.current,
          autoResetFilters: !ref.current,
          autoResetRowState: !ref.current,
          disableMultiSort: true,
          manualPagination: true,
          // pageCount: controlledPageCount,
        },
        useSortBy,
        usePagination,
        !massEdit && useRowSelect,
        (hooks) => {
          !massEdit &&
            hooks.visibleColumns.push((columns) => {
              return [
                {
                  id: "checkbox",
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
        !massEdit &&
          setSelectedRows(selectedFlatRows.map((_) => _.original.id));
      }, [selectedFlatRows]);
      return (
        <>
          <Table
            responsive
            className="align-items-center table-flush align-items-center user-table"
          >
            <TableHead
              headerGroups={headerGroups}
              selectHiddenColumns={selectHiddenColumns}
            ></TableHead>
            <TableBody
              page={page}
              prepareRow={prepareRow}
              selectHiddenColumns={selectHiddenColumns}
            ></TableBody>
          </Table>
        </>
      );
    }
  ),
  isEqual
);

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

const TableBody = ({ page, prepareRow, selectHiddenColumns }) => {
  // const hiddenColumns = useSelector(selectHiddenColumns);

  return (
    <tbody>
      {page.map((row, index) => {
        prepareRow(row);
        return (
          <RenderRow
            cells={row.cells}
            key={"row" + index}
            index={index}
            // hiddenColumns={hiddenColumns}
            selectHiddenColumns={selectHiddenColumns}
          ></RenderRow>
        );
      })}
    </tbody>
  );
};
const RenderRow = memo(({ cells, index, selectHiddenColumns }) => {
  const hiddenColumns = useSelector(selectHiddenColumns);
  return (
    <tr key={"row" + index}>
      {cells.map((cell) => (
        <TableCell
          cell={cell}
          index={index}
          key={cell.column.id + index}
          hiddenColumns={hiddenColumns}
          // selectHiddenColumns={selectHiddenColumns}
        />
      ))}
    </tr>
  );
}, isEqual);

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
        <LazyLoad
          offset={300}
          placeholder={
            <ComponentPreLoader show logo={false}></ComponentPreLoader>
          }
        >
          {cell.render("Cell")}
        </LazyLoad>
      </div>
    </td>
  );
}, isEqual);

const TableColumn = ({ column, sortedComponent, display }) => {
  return (
    <th
      className="border-0"
      style={{
        display,
        width: column.id === "checkbox" ? "20px" : "inherit",
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

const TableHead = ({ headerGroups, selectHiddenColumns }) => {
  const hiddenColumns = useSelector(selectHiddenColumns);
  return (
    <thead>
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
    <Pagination.Item active={active} onClick={() => gotoPage(page)}>
      {page}
    </Pagination.Item>
  );
};
const TableFooter = React.memo((props) => {
  const {
    paginationEnabled = true,
    counterEnabled = true,
    currentPageSize = 0,
    onPageChange,
    selectPaginationData,
  } = props;
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
                  pagesCount < 3
                    ? parseInt(pageIndex) - 2 + index
                    : pagesCount <= parseInt(pageIndex) + 1
                    ? pagesCount - 4 + index
                    : pageIndex > 3
                    ? parseInt(pageIndex) - 2 + index
                    : index + 1,
                gotoPage: onPageChange,
                active:
                  pagesCount < 3
                    ? pageIndex - 2 + index === parseInt(pageIndex)
                    : pagesCount <= parseInt(pageIndex) + 1
                    ? pagesCount - 4 + index === parseInt(pageIndex)
                    : pageIndex > 3
                    ? pageIndex - 2 + index === parseInt(pageIndex)
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