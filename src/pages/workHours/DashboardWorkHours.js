import { isEqual } from "lodash";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoadData } from "../../api/apiMappers";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";
import { OutlinedSelect } from "../../components/MuiSelect";
import { GridTableComponent } from "../../components/Table/GridComponent";
import { gridTableSlice } from "../reducers/redux";

const useLoader = (stateAPIStatus, setDriver, slice) => {
  const navigate = useNavigate();
  if (stateAPIStatus === "success") {
    return (
      <div className="col-12">
        <DriverPicker setDriver={setDriver} selectors={slice.selectors} />
        <DashBoardComponent {...slice} />
      </div>
    );
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
export const DashboardWorkHours = () => {
  const slice = gridTableSlice;
  const [driver, setDriver] = useState();
  const stateAPIStatus = useLoadData("workHoursTable", slice.actions, driver);
  return useLoader(stateAPIStatus, setDriver, slice);
};

const DriverPicker = memo(({ setDriver, selectors }) => {
  const selectCurrentDriver = useCallback(
    (state) => selectors.metaSelector.selectById(state, "driver")?.value,
    [selectors]
  );
  const selectDrivers = useCallback(
    (state) => selectors.metaSelector.selectById(state, "drivers")?.drivers,
    [selectors]
  );

  const currentDriver = useSelector(selectCurrentDriver);
  const drivers = useSelector(selectDrivers);

  const currentSelectLabel = useMemo(
    () => ({
      value: currentDriver?.uid,
      label: currentDriver?.name || currentDriver?.email,
    }),
    [currentDriver]
  );
  const inputSelectLabels = useMemo(
    () => drivers?.map((d) => ({ value: d.uid, label: d.name || d.email })),
    [drivers]
  );
  return (
    <div className="d-flex px-sm-0 px-2 py-3">
      <OutlinedSelect
        onChange={setDriver}
        value={currentSelectLabel}
        values={inputSelectLabels}
      ></OutlinedSelect>
    </div>
  );
}, isEqual);

const DashBoardComponent = memo(({ actions, selectors }) => {
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

  return (
    <>
      <div className="col-12 pb-2 d-flex flex-wrap">
        <div className="col-12 col-xxl-7 px-sm-0 px-2 pt-0 pe-sm-2">
          {renderComponent("workHours")}
        </div>
        <div className="col-12 col-xxl-5 px-sm-0 px-2 py-0">
          <div className="col-12 pt-3 pt-xxl-0">
            {renderComponent("vacationsOverview")}
          </div>
          <div className="col-12  pt-3">{renderComponent("vacations")}</div>
          <div className="col-12  pt-3">{renderComponent("workHoursBank")}</div>
          <div className="col-12  pt-3 ">{renderComponent("absent")}</div>
        </div>
      </div>
    </>
  );
}, isEqual);

DashboardWorkHours.displayName = "DashboardWorkHours";

export default DashboardWorkHours;
