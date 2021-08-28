import React, { memo, useRef, forwardRef } from "react";
import { Card } from "@themesberg/react-bootstrap";
import ReactTable from "./ReactTable";
import { TableLabel } from "./Table/TableLabel";

export const MyTourTable = memo(({ title, filterDataSelector, ...rest }) => {
  const skipResetRef = useRef(false);
  return (
    <Card border="light">
      <Card.Header className="border-0">
        <TableLabel ref={skipResetRef}>
          {{ title, filterDataSelector }}
        </TableLabel>
      </Card.Header>
      <Card.Body className="px-1">
        <CardBody ref={skipResetRef}>{{ ...rest }}</CardBody>
      </Card.Body>
    </Card>
  );
});
const CardBody = forwardRef(
  ({ children: { stateAPIStatus, ...rest } }, ref) => {
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
  }
);
