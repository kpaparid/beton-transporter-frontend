import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

// import "./styles.css";

import { useVirtual } from "react-virtual";
import { Form } from "@themesberg/react-bootstrap";
export function ReactWindow({
  selectData,
  selectShownColumns,
  onCellChange,
  pagination,
  counter,
  ...rest
}) {
  const data = useSelector(selectData);
  const headers = useSelector(selectShownColumns);
  const [columns, setColumns] = useState(headers);
  const [edit, setEdit] = useState(false);
  const data2 = new Array(100)
    .fill(true)
    .map(() => 25 + Math.round(Math.random() * 100));

  const columns2 = new Array(20)
    .fill(true)
    .map(() => 75 + Math.round(Math.random() * 100));
  return (
    <>
      <button
        onClick={() => setColumns((old) => old.filter((e) => e.idx !== "date"))}
      >
        click
      </button>
      <GridVirtualizerVariable rows={data} columns={columns} />
      {/* <GridVirtualizerVariable2 rows={data2} columns={columns2} /> */}
    </>
  );
}

function GridVirtualizerVariable({ rows, columns }) {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtual({
    size: rows.length,
    parentRef,
    estimateSize: React.useCallback((i) => 30, []),
    overscan: 5,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: columns.length,
    parentRef,
    estimateSize: React.useCallback(
      (i) => {
        return parseInt(columns[i].maxWidth);
        // return 120;
      },
      [columns]
    ),
    overscan: 5,
  });
  return (
    <>
      <div
        ref={parentRef}
        className="List d-flex justify-content-center"
        style={{
          //   height: `800px`,
          width: `100%`,
          overflow: "auto",
        }}
      >
        <div
          className="table-virtual"
          style={{
            height: `${rowVirtualizer.totalSize + 42}px`,
            width: `${columnVirtualizer.totalSize}px`,
            position: "relative",
          }}
        >
          <HeaderRow
            data={columns}
            columns={columnVirtualizer.virtualItems}
          ></HeaderRow>
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            return (
              <RenderRow
                vRow={virtualRow}
                row={rows[virtualRow.index]}
                labels={columnVirtualizer.virtualItems}
                columns={columns}
              ></RenderRow>
            );
          })}
        </div>
      </div>
    </>
  );
}

const RenderRow = React.memo(({ mode = true, vRow, labels, row, columns }) => {
  return (
    <>
      <div className="row" key={vRow.index}>
        <div
          key="checkbox-row"
          className={"cell p-0 d-flex justify-content-center"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${50}px`,
            height: `${vRow.size}px`,
            transform: `translateX(${0}px) translateY(${42 + vRow.start}px)`,
          }}
        >
          <div className="w-100 text-center  d-flex justify-content-center align-items-center">
            <IndeterminateCheckbox></IndeterminateCheckbox>
          </div>
        </div>
        {labels.map(({ size, index, height, start, end }) => (
          <div
            key={index}
            className={"cell p-0 d-flex justify-content-center "}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${size}px`,
              height: `${vRow.size}px`,
              transform: `translateX(${50 + start}px) translateY(${
                42 + vRow.start
              }px)`,
            }}
          >
            <span className="w-100 text-nowrap text-truncate d-flex justify-content-center align-items-center">
              {row[columns[index].id]}
            </span>
          </div>
        ))}
      </div>
    </>
  );
});

const HeaderRow = React.memo(({ data, columns }) => {
  return (
    <>
      <div className="header">
        <div
          key="checkbox-header"
          className={"cell p-0 d-flex justify-content-center"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${50}px`,
            height: `${42}px`,
            transform: `translateX(${0}px) translateY(${0}px)`,
          }}
        >
          <div className="w-100 text-center  d-flex justify-content-center align-items-center">
            <IndeterminateCheckbox></IndeterminateCheckbox>
          </div>
        </div>
        {columns.map(({ size, index, height, start }) => (
          <div
            key={index}
            className={"cell p-0 d-flex justify-content-center"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${size}px`,

              height: `${42}px`,
              transform: `translateX(${50 + start}px) translateY(${0}px)`,
            }}
          >
            <span className="w-100 text-center text-nowrap  d-flex justify-content-center align-items-center">
              {data[index].Header}
              {/* <span>{index}</span> */}
            </span>
          </div>
        ))}
      </div>
    </>
  );
});

const IndeterminateCheckbox = React.memo(
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
function GridVirtualizerVariable2({ rows, columns }) {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtual({
    size: rows.length,
    parentRef,
    estimateSize: React.useCallback((i) => rows[i], [rows]),
    overscan: 5,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: columns.length,
    parentRef,
    estimateSize: React.useCallback((i) => columns[i], [columns]),
    overscan: 5,
  });

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `400px`,
          width: `100%`,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: `${columnVirtualizer.totalSize}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <React.Fragment key={virtualRow.index}>
              {columnVirtualizer.virtualItems.map((virtualColumn) => (
                <div
                  key={virtualColumn.index}
                  className={
                    virtualColumn.index % 2
                      ? virtualRow.index % 2 === 0
                        ? "ListItemOdd"
                        : "ListItemEven"
                      : virtualRow.index % 2
                      ? "ListItemOdd"
                      : "ListItemEven"
                  }
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}
                >
                  Cell {virtualRow.index}, {virtualColumn.index}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
