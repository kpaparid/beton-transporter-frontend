import React, { memo, useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Form } from "@themesberg/react-bootstrap";

import { isEqual } from "lodash";
import {
  useLoadData,
  grids,
  loadWorkHoursPageGrids,
} from "./myComponents/MyConsts";

import { workHoursSlice } from "./reducers/redux2";
import { useDispatch, useSelector } from "react-redux";
import {
  GridCardComponent,
  GridTableComponent,
  Loader,
} from "./myComponents/Table/GridComponent";
import { OutlinedSelect } from "./myComponents/MuiSelect";

export const ArbeitsZeiten = memo(() => {
  const { actions, selectors } = workHoursSlice;
  const [driver, setDriver] = useState();
  const stateAPIStatus = useLoadData("workHoursTable", actions, driver);
  const selectCurrentDriver = useCallback(
    (state) =>
      selectors.metaSelector.selectById(state, "driver") &&
      selectors.metaSelector.selectById(state, "driver").value,
    [selectors]
  );
  const selectDrivers = useCallback(
    (state) =>
      selectors.metaSelector.selectById(state, "constants") &&
      selectors.metaSelector.selectById(state, "constants").driver,
    [selectors]
  );

  const currentDriver = useSelector(selectCurrentDriver);
  const drivers = useSelector(selectDrivers);

  const currentSelectLabel = useMemo(
    () => ({ value: currentDriver, label: currentDriver }),
    [currentDriver]
  );
  const inputSelectLabels = useMemo(
    () => drivers && drivers.map((d) => ({ value: d, label: d })),
    [drivers]
  );

  const renderComponent = useCallback(
    (entityId) => {
      return (
        <>
          <Loader stateAPIStatus={stateAPIStatus}>
            <GridTableComponent
              {...{
                stateAPIStatus,
                actions,
                selectors,
                entityId,
              }}
            />
          </Loader>
        </>
      );
    },
    [selectors, actions, stateAPIStatus]
  );

  return (
    <>
      <div className="d-block pt-4 mb-4 mb-md-0">
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
        >
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>WorkHours</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="d-flex pb-3">
        <OutlinedSelect
          onChange={setDriver}
          value={currentSelectLabel}
          values={inputSelectLabels}
        ></OutlinedSelect>
      </div>
      <div className="col-12 pb-2 d-flex flex-wrap">
        <div className="col-12 col-xxl-7 px-2 pt-0">
          {renderComponent("workHours")}
        </div>
        <div className="col-12 col-xxl-5 px-2 py-0">
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

ArbeitsZeiten.displayName = "ArbeitsZeiten";

export default ArbeitsZeiten;
