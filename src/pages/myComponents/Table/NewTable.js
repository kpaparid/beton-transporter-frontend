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
// import { LazyLoad } from "react-observer-api";

const Lazer = React.lazy(() => import("../TextArea/LazyInput"));
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
    selectLoading,
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
            size={size}
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
                  <td className="px-2 py-1">
                    <div className="d-flex justify-content-center w-100">
                      <div>
                        <IndeterminateCheckbox
                          onChange={() => onSelectRow(row.id)}
                          isSelected={isSelected}
                        ></IndeterminateCheckbox>
                      </div>
                    </div>
                  </td>
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
    value: { value: initialValue, label, idx, links, ...rest },
  }) => {
    const [value, setValue] = useState(initialValue);
    const handleUpdateData = useCallback(
      (v = value) => {
        updateMyData(index, v, label, id, links);
      },
      [value, index, label, id, links]
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
        <div className={isEditable ? "d-none" : "d-block"}>{value}</div>
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
// const EditableCell2 = React.memo(
//   ({
//     value: {
//       value: initialValue = "error",
//       label,
//       idx,
//       id: cellId,
//       links,
//       format,
//       ...rest
//     },
//     index,
//     isSelected,
//     id,
//     updateMyData,
//     editModeSelector,
//   }) => {
//     // console.log({ connections });
//     const [value, setValue] = useState(initialValue);
//     const handleUpdateData = useCallback(
//       (v = value) => {
//         console.log("UPDATING DATA");
//         updateMyData(index, id, v, label, idx, cellId, links);
//       },
//       [value, initialValue]
//     );
//     const debouncedUpdate = _.debounce(handleUpdateData, 300);
//     const onChange = useCallback((value, type) => {
//       setValue(value);
//       debouncedUpdate(value);
//     }, []);
//     useEffect(() => {
//       setValue(initialValue);
//     }, [initialValue]);
//     const onBlur = useCallback(() => console.log("blur"), []);

//     const editMode = useSelector(editModeSelector);

//     const editable = useMemo(
//       () => isSelected && editMode,
//       [editMode, isSelected]
//     );
//     return (
//       <LazyLoad className="w-100" placeholder={<div>hi</div>}>
//         <Input
//           extendable
//           {...{
//             value,
//             onChange,
//             onBlur,
//             editable,
//             ...rest,
//           }}
//         />
//       </LazyLoad>
//     );
//   },
//   isEqual
// );

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
