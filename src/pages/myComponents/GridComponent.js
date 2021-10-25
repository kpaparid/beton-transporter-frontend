import { memo, useCallback, useEffect, useMemo } from "react";
import isequal from "lodash.isequal";
import {
  useButtonGroupProps,
  useFilterProps,
  useLoadData,
  useTableLabelProps,
  useTableProps,
} from "./MyConsts";
import { CardTable } from "./MyTourTable";
import { Mycard } from "./MyTables";
import { useSelector } from "react-redux";
import { editMode, visibleHeaders, visibleHeaders2 } from "./MySelectors";
import _ from "lodash";
import { useGridTableProps, useTable } from "../reducers/selectors";
import { Card } from "@themesberg/react-bootstrap";
import { TableLabel } from "./Table/TableLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Preloader from "../../components/Preloader";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";

export const GridCardComponent = memo(
  ({
    stateAPIStatus,
    actions,
    statePath,
    stateOffset,
    title = stateOffset,
  }) => {
    // const buttonGroupProps = useButtonGroupProps(
    //   statePath,
    //   stateOffset,
    //   actions
    // );
    // const tableProps = useTableProps(statePath, stateOffset, actions);
    // console.log("render", { statePath });
    // const { dataSelector } = useTableProps(statePath, stateOffset, actions);
    // const table = useSelector(dataSelector, isequal);
    const headersSelector2 = useCallback(
      (state) => visibleHeaders(state.workHoursTable.Arbeitszeitkonto),
      [statePath]
    );

    const table = useSelector(headersSelector2, isequal);
    return (
      <Mycard
        className="ms-xxl-2 mt-xxl-0 mt-3"
        footer={["GESAMT", "5", "10"]}
        headers={["hi"]}
        title={title}
        table={[]}
      />
    );
  },
  isequal
);

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
