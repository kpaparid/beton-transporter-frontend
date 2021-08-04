import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Nav,
  Card,
  Table,
  Pagination,
  Form,
} from "@themesberg/react-bootstrap";
import { HeaderRow } from "./MyTableRow";
import {
  inputLabelsWidths,
  store,
  useCheckedAll,
  useGetVisibleLabels,
} from "./MyConsts";
import { shallowEqual, useDispatch, useSelector, useStore } from "react-redux";
import {
  shownToursSelector2,
  shownToursSelector3,
  visibleLabelsSelector,
  visibleLabelsSelector2,
  tableReactData,
  tableDataReselect,
  tourTableDataReselect,
  tableReactData3,
  visibleHeaders,
  checkedId,
  editMode,
  changesById,
} from "./MySelectors";
import { ACTIONS } from "../reducers/redux";
import MyInput from "./MyInput";

import { useTable, useSortBy, useRowSelect } from "react-table";
import { convertArrayToObject } from "./util/utilities";
import Input2 from "./TextArea/MyNewInput";
import styled from "styled-components";

export const TourTable5 = React.memo((props) => {
  const shownTours = tableReactData3(store.getState());
  const headers = visibleHeaders(store.getState());
  const edi = useSelector(editMode);

  const [data, setData] = useState(shownTours);
  useEffect(() => {
    console.log("shownTours change: ");
  }, [shownTours]);
  useEffect(() => {
    console.log("headers change: ");
  }, [headers]);

  useEffect(() => {
    console.log("editmode change: " + edi);
    // if (!edi) {
    if (!edi && JSON.stringify(data) !== JSON.stringify(shownTours)) {
      setData(shownTours);
      console.log("updateMyTable");
    } else console.log("TABLE NOT UPDATED");
  }, [edi]);
  return <TourTable4 {...{ shownTours: data, headers }}></TourTable4>;
});

export const TourTable4 = React.memo(({ shownTours, headers }) => {
  // const data = React.useMemo(() => shownTours, [shownTours]);

  const [data, setData] = useState(() => shownTours);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const columns = React.useMemo(() => headers, []);
  const defaultColumn = React.memo((props) => {
    const {
      value,
      row: { index, isSelected },
      column: { id },
    } = props;
    const edi = useSelector(editMode);
    const editable = isSelected && edi;
    return (
      <EditableCell
        {...{ value, index, id, updateMyData, editable }}
      ></EditableCell>
    );
  });
  const updateMyData = useCallback((rowIndex, columnId, value) => {
    setSkipPageReset(true);
    console.log("send to DB", { rowIndex, columnId, value });
    setData((old) => {
      return old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      });
    });
  }, []);
  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn: {
        Cell: defaultColumn,
      },
      updateMyData,
      autoResetPage: !skipPageReset,
      autoResetSelectedRows: !skipPageReset,
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
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
      ]);
    }
  );
  const updateMyTable = useCallback(
    (newData) => {
      setData(newData);
    },
    [data]
  );
  useEffect(() => {
    console.log("data updated", data);
    setSkipPageReset(false);
  }, [data]);
  useEffect(() => {
    console.log("shownTours", shownTours);
    updateMyTable(shownTours);
  }, [shownTours]);

  useEffect(() => {
    console.log("new headers", headers);
  }, [headers]);
  return (
    <>
      <TablePureComponent {...{ headerGroups, rows, prepareRow }} />
      <TableFooter></TableFooter>
    </>
  );
});

const TableFooter = React.memo((props) => {
  const { maxRows = 25, rows = maxRows } = props;
  return (
    <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
      <Nav>
        <Pagination className="mb-2 mb-lg-0">
          <Pagination.Prev>Previous</Pagination.Prev>
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Next>Next</Pagination.Next>
        </Pagination>
      </Nav>
      {true && (
        <small className="fw-bold">
          Showing <b>{rows}</b> out of <b>{maxRows}</b> entries
        </small>
      )}
    </Card.Footer>
  );
});
const TablePureComponent = React.memo((props) => {
  const { headerGroups, rows, prepareRow } = props;
  return (
    <Table
      hover
      responsive
      className="align-items-center table-flush align-items-center table"
    >
      <thead className="thead-light">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="text-center">
            {headerGroup.headers.map((column) => {
              return (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="border-bottom"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} className="p-2">
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
});

const EditableCell = React.memo(
  ({ value: initialValue, index, id, updateMyData, editable }) => {
    // const edi = useSelector(editMode);
    // const edit = true && editable;
    // console.log(editable);
    const [value, setValue] = React.useState(initialValue);
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const onChange = useCallback((newValue) => {
      setValue({ ...initialValue, value: newValue });
    }, []);
    const dispatch = useDispatch();
    const onBlur = useCallback(() => {
      // updateMyData(index, id, value);
      // console.log(value);
      // console.log(value.value);
      // console.log(value["value"]);
      if (value !== initialValue) {
        dispatch({
          type: ACTIONS.ADD_CHANGE,
          payload: {
            id: value.id,
            key: value.label,
            change: value.value,
          },
        });
      }
    }, [value]);
    return (
      <Input2
        onChange={onChange}
        onBlur={onBlur}
        data={value}
        editable={editable}
      />
    );
  }
);

const StyledCheckbox = styled.div`
  justify-content: center;
  cursor: unset;
  div {
    display: flex;
    justify-content: center;
  }
  input {
    cursor: pointer;
    margin: 0;
  }
`;
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
      // console.log(resolvedRef.current);
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <StyledCheckbox>
          <Form.Check ref={resolvedRef} {...rest} />
        </StyledCheckbox>
      </>
    );
  }
);
