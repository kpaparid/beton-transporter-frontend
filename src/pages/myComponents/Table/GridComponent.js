import { memo } from "react";
import isequal from "lodash.isequal";

import { CardTable } from "./MyTourTable";
import _ from "lodash";
import { useGridTableProps } from "../../reducers/selectors";
import { Card } from "@themesberg/react-bootstrap";
import { ComponentPreLoader } from "../../../components/ComponentPreLoader";

export const GridTableComponent = memo(
  ({ stateAPIStatus, actions, selectors, entityId }) => {
    const props = useGridTableProps({
      actions,
      selectors,
      entityId,
    });

    return <CardTable stateAPIStatus={stateAPIStatus} {...props} />;
  },
  isequal
);
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
        // return fallbackLoading;
        return children;
      // return <div>hi</div>;
      case "error":
        return fallbackError;

      default:
        return <div>loading</div>;
    }
  },
  isequal
);
