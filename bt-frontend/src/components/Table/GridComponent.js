import { memo } from "react";
import isequal from "lodash.isequal";
import TableCore from "./TableCore";
import { TableLabel } from "./TableHeader";

import _ from "lodash";
import { useGridTableProps } from "../../pages/reducers/selectors";
import { Card } from "@themesberg/react-bootstrap";
import { ComponentPreLoader } from "../ComponentPreLoader";

export const GridTableComponent = memo(({ actions, selectors, entityId }) => {
  const { tableProps, ...rest } = useGridTableProps({
    actions,
    selectors,
    entityId,
  });
  return (
    <Card className="card-dark grid-table">
      <Card.Header className="border-0">
        <TableLabel {...rest}></TableLabel>
      </Card.Header>
      <Card.Body>
        <TableCore {...tableProps}></TableCore>
      </Card.Body>
    </Card>
  );
  // return <EntityTable {...props} />;
}, isequal);
export const Loader = memo(
  ({
    stateAPIStatus = "loading",
    fallbackLoading = (
      <Card>
        <Card.Body>
          <ComponentPreLoader show={true}></ComponentPreLoader>
        </Card.Body>
      </Card>
    ),
    fallbackError = (
      <div className="w-100 h-100 text-center">
        <h2>ERROR</h2>
      </div>
    ),
    children,
  }) => {
    switch (stateAPIStatus) {
      case "loading":
        return fallbackLoading;
      case "success":
        return children;
      case "error":
        return fallbackError;
      default:
        return <div>loading</div>;
    }
  },
  isequal
);
