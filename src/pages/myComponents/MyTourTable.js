import React, { memo, useRef, forwardRef } from "react";
import { TableLabel } from "./Table/TableLabel";

import { Card } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import "./MyForm.css";
import { ReactTable } from "./ReactTable";
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
    if (stateAPIStatus === "loading")
      return (
        <div className="w-100 h-100 text-center">
          <h2>LOADING</h2>
        </div>
      );
    else if (stateAPIStatus === "success")
      return <ReactTable ref={ref}>{{ ...rest }}</ReactTable>;
    else if (stateAPIStatus === "error")
      return (
        <div className="w-100 h-100 text-center">
          <h2>ERROR</h2>
        </div>
      );
  }),
  isEqual
);
MyTable.displayName = "MyTable";
