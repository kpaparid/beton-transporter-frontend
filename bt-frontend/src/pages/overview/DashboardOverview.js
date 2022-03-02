import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash";
import moment from "moment";
import React, { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoadData } from "../../api/apiMappers";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";
import { GridTableComponent } from "../../components/Table/GridComponent";
import {
  BarChartWidget,
  CounterWidget,
  SalesValueWidget,
} from "../../components/Widgets";
import { gridTableSlice } from "../reducers/redux";

const useLoader = (stateAPIStatus) => {
  const navigate = useNavigate();
  if (stateAPIStatus === "success") {
    return <DashBoardComponent />;
  } else if (stateAPIStatus === "error") {
    navigate("/500");
    return <ComponentPreLoader show={true} />;
  } else {
    return (
      <div className="d-flex h-100 align-items-center">
        <ComponentPreLoader show={true} />
      </div>
    );
  }
};
export const DashBoardOverview = () => {
  const { actions } = gridTableSlice;
  const stateAPIStatus = useLoadData("overviewTable", actions);
  return useLoader(stateAPIStatus);
};

const DashBoardComponent = memo(() => {
  const { actions, selectors } = gridTableSlice;
  const handleCbm = useCallback(
    (state) => selectors.metaSelector.selectById(state, "cbm") || {},
    [selectors.metaSelector]
  );

  const {
    currentMonth: cbmCurrentMonth = 0,
    lastMonth: cbmLastMonth = 0,
    byWorkPlant: cbmByWorkPlant,
    year: cbmYear,
  } = useSelector(handleCbm);
  const dateCurrentMonth = moment().format("YYYY/MM");
  const dateLastMonth = moment().subtract(1, "months").format("YYYY/MM");

  const { cbmLabels, cbmSeries } = useMemo(() => {
    return {
      cbmLabels: moment.monthsShort(),
      cbmSeries: moment.months().map((m) => {
        return cbmYear?.find(
          (c) => moment(c.date, "YYYY.MM").format("MMMM") === m
        )?.cbm;
      }),
    };
  }, [cbmYear]);

  const { workPlantLabels, workPlantSeries } = useMemo(() => {
    return {
      workPlantLabels: cbmByWorkPlant?.map((v) => v.workPlant),
      workPlantSeries: cbmByWorkPlant?.map((v) => parseInt(v.cbm)),
    };
  }, [cbmByWorkPlant]);

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
      <div className="w-100">
        <div className="w-100 d-flex flex-wrap justify-content-center">
          <div className="col-12 col-xxl-6 d-flex flex-wrap">
            <div className="p-2 col-12 col-sm-6">
              <CounterWidget
                category="Cbm current month"
                title={cbmCurrentMonth + " cbm"}
                period={moment(dateCurrentMonth, "YYYY/MM").format("MMM.")}
                icon={faChartLine}
                iconColor="shape-secondary"
              />
            </div>
            <div className="p-2 col-12 col-lg col-sm-6">
              <CounterWidget
                className="w-100"
                category="Cbm previous month"
                title={cbmLastMonth + " cbm"}
                period={moment(dateLastMonth, "YYYY/MM").format("MMM.")}
                icon={faChartLine}
                iconColor="shape-secondary"
              />
            </div>
            <div className="p-2 col-12 col-sm-12  col-xl-12">
              {renderComponent("pendingVacations")}
            </div>
            <div className="p-2 col-12 col-sm-12  col-xl-12">
              {renderComponent("upcomingAbsent")}
            </div>
          </div>
          <div className="p-2 col">{renderComponent("workHoursByDate")}</div>
          <div className="d-flex flex-wrap col-xl-8 col-xxl-12 col-xl-12 col-12">
            <div className="p-2 col-xxl-6 col-xl-6 col-12">
              <SalesValueWidget
                title="Year's Cbm"
                labels={cbmLabels}
                series={cbmSeries}
              />
            </div>
            <div className="p-2  col-xxl-6 col-xl-6 col-12">
              <BarChartWidget
                title="Workplant's Cbm"
                labels={workPlantLabels}
                series={workPlantSeries}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}, isEqual);

export default DashBoardOverview;
