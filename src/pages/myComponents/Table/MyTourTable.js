import React, { memo, useRef, forwardRef } from "react";
import { TableLabel } from "./TableHeader";

import { Card } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import TableCore from "./TableCore";
export const EntityTable = memo(({ tableProps, ...rest }) => {
  return (
    <Card className="card-dark h-100">
      <Card.Header className="border-0">
        <TableLabel {...rest}></TableLabel>
      </Card.Header>
      <Card.Body>
        <TableCore {...tableProps}></TableCore>
      </Card.Body>
    </Card>
  );
}, isEqual);

EntityTable.displayName = "EntityTable";
