import React, { memo, useRef, forwardRef } from "react";
import { TableLabel } from "./TableLabel";

import { Card } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import "../MyForm.css";
import { ReactTable } from "./ReactTable";
import LazyLoad from "react-lazyload";
export const CardTable = memo(({ tableProps, stateAPIStatus, ...rest }) => {
  const skipResetRef = useRef(false);
  return (
    <Card className="card-dark">
      <Card.Header className="border-0">
        <TableLabel ref={skipResetRef} {...rest}></TableLabel>
      </Card.Header>
      <Card.Body>
        <ReactTable ref={skipResetRef}>{{ ...tableProps }}</ReactTable>
      </Card.Body>
    </Card>
  );
}, isEqual);

CardTable.displayName = "CardTable";
