import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "@themesberg/react-bootstrap";

import {
  CounterWidget,
  BarChartWidget,
  TeamMembersWidget,
  ProgressTrackWidget,
  RankingWidget,
  SalesValueWidget,
  SalesValueWidgetPhone,
  AcquisitionWidget,
} from "../components/Widgets";
import {
  WorkerHoursTable,
  VacationsTable,
  PageVisitsTable,
} from "../components/Tables";
import { totalOrders, monthlySales, workplantSales } from "../data/charts";

import React, { memo, useCallback, useMemo } from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from "@themesberg/react-bootstrap";

import { isEqual } from "lodash";
import { useLoadData } from "./myComponents/MyConsts";
import { workHoursSlice } from "./reducers/redux2";
import { GridTableComponent, Loader } from "./myComponents/Table/GridComponent";
import moment from "moment";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

export const DashBoardOverview = memo(() => {
  const { actions, selectors } = workHoursSlice;
  const stateAPIStatus = useLoadData("overviewTable", actions);

  const handleSales = useCallback(
    (state) => selectors.metaSelector.selectById(state, "sales"),
    [selectors]
  );
  const handleCbm = useCallback(
    (state) => selectors.metaSelector.selectById(state, "cbm"),
    [selectors]
  );
  const handleSalesByWorkPlant = useCallback(
    (state) =>
      stateAPIStatus !== "loading" &&
      selectors.metaSelector.selectById(state, "salesByWorkPlant").value[0],
    [selectors, stateAPIStatus]
  );

  const sales = useSelector(handleSales);
  const cbm = useSelector(handleCbm);
  const salesByWorkPlant = useSelector(handleSalesByWorkPlant);
  const dateCurrentMonth = moment().format("YYYY/MM");
  const dateLastMonth = moment().subtract(1, "months").format("YYYY/MM");
  const dateTwoMonthsAgo = moment().subtract(2, "months").format("YYYY/MM");
  const salesCurrentMonth = useMemo(
    () => sales && sales.value.find((e) => e.date === dateCurrentMonth).sales,
    [dateCurrentMonth, sales]
  );
  const salesLastMonth = useMemo(
    () => sales && sales.value.find((e) => e.date === dateLastMonth).sales,
    [dateLastMonth, sales]
  );
  const cbmCurrentMonth = useMemo(
    () => cbm && cbm.value.find((e) => e.date === dateCurrentMonth).cbm,
    [dateCurrentMonth, cbm]
  );

  const cbmLastMonth = useMemo(
    () => cbm && cbm.value.find((e) => e.date === dateLastMonth).cbm,
    [dateLastMonth, cbm]
  );
  const salesTwoMonthsAgo = useMemo(
    () => sales && sales.value.find((e) => e.date === dateTwoMonthsAgo).sales,
    [dateTwoMonthsAgo, sales]
  );
  const cbmTwoMonthsAgo = useMemo(
    () => cbm && cbm.value.find((e) => e.date === dateTwoMonthsAgo).cbm,
    [dateTwoMonthsAgo, cbm]
  );
  const percentageFn = useCallback(
    (start, final) =>
      (
        ((parseFloat(final) - parseFloat(start)) * 100) /
        Math.abs(parseFloat(start))
      ).toFixed(2),
    []
  );
  const cbmPercentageCurrentMonth = percentageFn(cbmCurrentMonth, cbmLastMonth);
  const salesPercentageCurrentMonth = percentageFn(
    salesCurrentMonth,
    salesLastMonth
  );
  const cbmPercentageLastMonth = percentageFn(cbmLastMonth, cbmTwoMonthsAgo);
  const salesPercentageLastMonth = percentageFn(
    salesLastMonth,
    salesTwoMonthsAgo
  );

  const salesLabels = useMemo(() => moment.monthsShort(), []);
  const salesSeries = useMemo(
    () => sales && sales.value.map((s) => parseInt(s.sales)),
    [sales]
  );
  const { workPlantLabels, workPlantSeries } = useMemo(() => {
    const { id, date, ...rest } = salesByWorkPlant;
    const workPlantSales = Object.entries(rest);
    return {
      workPlantLabels: workPlantSales.map((v) => v[0]),
      workPlantSeries: workPlantSales.map((v) => parseInt(v[1])),
    };
  }, [salesByWorkPlant]);

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
      {/* <div className="d-block pt-4 mb-4 mb-md-0">
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
        >
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Tours</Breadcrumb.Item>
        </Breadcrumb>
      </div> */}

      <div className="d-flex flex-wrap w-100">
        <div className="d-flex w-100 flex-wrap">
          <div className="d-flex flex-wrap col-12 col-xl-6">
            <div className="col-12 col-sm-6 col-xl-12 col-xxl-6 mb-2">
              <div className="w-100 h-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Cbm akt. Monat"
                  title={cbmCurrentMonth + " cbm"}
                  period={moment(dateCurrentMonth, "YYYY/MM").format("MMM.")}
                  percentage={cbmPercentageCurrentMonth}
                  icon={faChartLine}
                  iconColor="shape-secondary"
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-12 col-xxl-6 mb-2">
              <div className="w-100 h-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Cbm letz. Monat"
                  title={cbmLastMonth + " cbm"}
                  period={moment(dateLastMonth, "YYYY/MM").format("MMM.")}
                  percentage={cbmPercentageLastMonth}
                  icon={faChartLine}
                  iconColor="shape-tertiary"
                  previousPeriod={moment(dateLastMonth, "YYYY/MM")
                    .subtract(1, "months")
                    .format("MMM.")}
                />
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-12 col-xxl-6 mb-2">
              <div className="w-100 h-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Umsatz akt. Monat"
                  title={salesCurrentMonth}
                  period={moment(dateCurrentMonth, "YYYY/MM").format("MMM.")}
                  percentage={salesPercentageCurrentMonth}
                  icon={faCashRegister}
                  iconColor="shape-tertiary"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-12 col-xxl-6 mb-2">
              <div className="w-100 h-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Umsatz letz. Monat"
                  title={salesLastMonth}
                  period={moment(dateLastMonth, "YYYY/MM").format("MMM.")}
                  percentage={salesPercentageLastMonth}
                  icon={faCashRegister}
                  iconColor="shape-secondary"
                  previousPeriod={moment(dateLastMonth, "YYYY/MM")
                    .subtract(1, "months")
                    .format("MMM.")}
                />
              </div>
            </div>
            <div className="col-12 p-0">
              <div className="w-100 h-100 p-2">
                {renderComponent("currentVacations")}
              </div>
            </div>
          </div>

          <div className="d-flex col-12 col-xl-6">
            <div className="w-100 p-2">
              {renderComponent("workHoursByDate")}
            </div>
          </div>
        </div>
        <div className="d-flex w-100 flex-wrap">
          <div className="col-xl-6 col-sm-12 col-12 mb-4 p-0">
            <div className="p-2">
              <SalesValueWidget
                title="Sales Value"
                labels={salesLabels}
                series={salesSeries}
              />
            </div>
          </div>

          <div className="col-xl-6 col-sm-12 col-12 mb-4 p-0">
            <div className="p-2">
              <BarChartWidget
                title="Workplant's Sales"
                labels={workPlantLabels}
                series={workPlantSeries}
              ></BarChartWidget>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}, isEqual);

export default DashBoardOverview;
