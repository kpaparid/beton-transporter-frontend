import { isEqual } from "lodash";
import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadData } from "../../api/apiMappers";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";
import { GridTableComponent } from "../../components/Table/GridComponent";
import { gridTableSlice } from "../reducers/redux";

const useLoader = (stateAPIStatus) => {
  const navigate = useNavigate();
  if (stateAPIStatus === "success") {
    return <DashBoardComponent />;
  } else if (stateAPIStatus === "error") {
    return navigate("/500");
  } else {
    return (
      <div className="d-flex h-100 align-items-center">
        <ComponentPreLoader show={true} />
      </div>
    );
  }
};
export const DashboardTours = () => {
  const { actions } = gridTableSlice;
  const stateAPIStatus = useLoadData("toursTable", actions);
  return useLoader(stateAPIStatus);
};

const DashBoardComponent = memo(() => {
  const { actions, selectors } = gridTableSlice;
  const renderComponent = useCallback(
    (entityId) => (
      <GridTableComponent
        {...{
          stateAPIStatus: "success",
          actions,
          selectors,
          entityId,
        }}
      />
    ),
    [selectors, actions]
  );

  return <div className="col-12">{renderComponent("tours")}</div>;
}, isEqual);

DashboardTours.displayName = "Tours";
export default DashboardTours;
