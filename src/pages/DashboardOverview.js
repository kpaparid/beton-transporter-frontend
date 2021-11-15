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
  const sales = useSelector(handleSales);
  const cbm = useSelector(handleCbm);
  const currentMonthDate = moment().format("YYYY/MM");
  const lastMonthDate = moment().subtract(1, "months").format("YYYY/MM");
  const currentMonthSales = useMemo(
    () => sales && sales.value.find((e) => e.date === currentMonthDate).sales,
    [currentMonthDate, sales]
  );
  const currentMonthCbm = useMemo(
    () => cbm && cbm.value.find((e) => e.date === currentMonthDate).cbm,
    [currentMonthDate, cbm]
  );
  const lastMonthSales = useMemo(
    () => sales && sales.value.find((e) => e.date === lastMonthDate).sales,
    [lastMonthDate, sales]
  );
  const lastMonthCbm = useMemo(
    () => cbm && cbm.value.find((e) => e.date === lastMonthDate).cbm,
    [lastMonthDate, cbm]
  );

  const chartLabels = moment.monthsShort();
  const chartSeries = useMemo(() => sales && [], [sales]);

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
          <Breadcrumb.Item active>Tours</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-wrap w-100">
        <div className="d-flex w-100 flex-wrap">
          <div className="d-flex flex-wrap col-12 col-xl-6">
            <div className="col-12 col-sm-6 col-xl-12 col-xxl-6 mb-2">
              <div className="w-100 h-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Cbm akt. Monat"
                  title={currentMonthCbm + " cbm"}
                  period={moment(currentMonthDate, "YYYY/MM").format("MMM")}
                  percentage={18}
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
                  title={lastMonthCbm + " cbm"}
                  period={moment(lastMonthDate, "YYYY/MM").format("MMM")}
                  percentage={-28.4}
                  icon={faChartLine}
                  iconColor="shape-tertiary"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-12 col-xxl-6 mb-2">
              <div className="w-100 h-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Umsatz akt. Monat"
                  title={currentMonthSales + " €"}
                  period={moment(currentMonthDate, "YYYY/MM").format("MMM")}
                  percentage={-28.4}
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
                  title={lastMonthSales + " €"}
                  period={moment(lastMonthDate, "YYYY/MM").format("MMM")}
                  percentage={18.2}
                  icon={faCashRegister}
                  iconColor="shape-secondary"
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
          <div className="col-lg-6 col-sm-12 col-12 mb-4 p-0">
            <div className="p-2">
              <SalesValueWidget
                title="Sales Value"
                value={currentMonthSales}
                percentage={10.57}
                labels={chartLabels}
                series={chartSeries}
              />
            </div>
          </div>

          <div className="col-lg-6 col-sm-12 col-12 mb-4 p-0">
            <div className="p-2">
              <BarChartWidget
                title="Workplant's Sales"
                value="9,500"
                percentage={10.57}
                data={totalOrders}
              ></BarChartWidget>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}, isEqual);

export default DashBoardOverview;
