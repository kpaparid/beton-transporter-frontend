import React, { memo, useRef, forwardRef } from "react";
import { TableLabel } from "./Table/TableLabel";

import { Card } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import "./MyForm.css";
import { ReactTable } from "./ReactTable";
import DataTable from "./NewTable";
export const MyTable = memo(({ tableProps, stateAPIStatus, ...rest }) => {
  const skipResetRef = useRef(false);
  return (
    <Card border="light">
      <Card.Header className="border-0">
        <TableLabel ref={skipResetRef} {...rest}></TableLabel>
      </Card.Header>
      <Card.Body className="px-1">
        <CardBody ref={skipResetRef}>
          {{ ...tableProps, stateAPIStatus }}
        </CardBody>
      </Card.Body>
    </Card>
  );
}, isEqual);

const CardBody = memo(
  forwardRef(({ children: { stateAPIStatus, ...rest } }, ref) => {
    console.log(stateAPIStatus);

    switch (stateAPIStatus) {
      case "loading":
        return (
          <div className="w-100 h-100 text-center">
            <h2>LOADING</h2>
          </div>
        );
      case "success":
        return <ReactTable ref={ref}>{{ ...rest }}</ReactTable>;
      case "error":
        return (
          <div className="w-100 h-100 text-center">
            <h2>ERROR</h2>
          </div>
        );

      default:
        return <div>loading</div>;
    }
  }),
  isEqual
);
MyTable.displayName = "MyTable";
