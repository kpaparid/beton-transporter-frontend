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

import React, { memo, useCallback } from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from "@themesberg/react-bootstrap";

import { isEqual } from "lodash";
import { useLoadData } from "./myComponents/MyConsts";
import { workHoursSlice } from "./reducers/redux2";
import { GridTableComponent, Loader } from "./myComponents/Table/GridComponent";
import moment from "moment";

export const DashBoardOverview = memo(() => {
  const { actions, selectors } = workHoursSlice;
  const stateAPIStatus = useLoadData("overviewTable", actions);

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

      <div className="d-flex flex-wrap">
        <div className="d-flex w-100 flex-wrap">
          <Col lg={12} xl={6} className="mb-4 d-flex flex-wrap">
            <Col xs={12} sm={6} className="mb-2 pe-2">
              <div className="w-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="cbm akt. Monat"
                  title="7000.5 cbm"
                  period={moment().format("MMM")}
                  percentage={18.2}
                  icon={faChartLine}
                  iconColor="shape-secondary"
                />
              </div>
            </Col>

            <Col xs={12} sm={6} className="mb-2 ps-2">
              <div className="w-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="cbm letz. Monat"
                  title="6856.5 cbm"
                  period={moment().subtract(1, "months").format("MMM")}
                  percentage={-28.4}
                  icon={faChartLine}
                  iconColor="shape-tertiary"
                />
              </div>
            </Col>
            <Col xs={12} sm={6} className="mb-2 pe-2">
              <div className="w-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Umsatz akt. Monat"
                  title="6856.5 cbm"
                  period={moment().format("MMM")}
                  percentage={-28.4}
                  icon={faCashRegister}
                  iconColor="shape-tertiary"
                />
              </div>
            </Col>
            <Col xs={12} sm={6} className="mb-2 ps-2">
              <div className="w-100 p-2">
                <CounterWidget
                  className="h-100"
                  category="Umsatz letzte. Monat"
                  title="7000.5 cbm"
                  period={moment().subtract(1, "months").format("MMM")}
                  percentage={18.2}
                  icon={faCashRegister}
                  iconColor="shape-secondary"
                />
              </div>
            </Col>
            <Col xs={12} className="p-0">
              <div className="w-100 h-100 p-2">
                {renderComponent("currentVacations")}
              </div>
            </Col>
          </Col>

          <Col lg={12} xl={6} className="mb-4">
            <div className="w-100 p-2">
              {renderComponent("workHoursByDate")}
            </div>
          </Col>
        </div>
        <div className="d-flex w-100">
          <Col lg={12} xl={6} className="mb-4 p-0">
            <div className="p-2">
              <SalesValueWidget
                title="Sales Value"
                value="9,500"
                percentage={10.57}
                data={monthlySales}
              />
            </div>
          </Col>

          <Col lg={12} xl={6} className="mb-4">
            <div className="p-2">
              <BarChartWidget
                title="Workplant's Sales"
                value="9,500"
                percentage={10.57}
                data={totalOrders}
              ></BarChartWidget>
            </div>
          </Col>
        </div>
      </div>
    </>
  );
}, isEqual);

export default DashBoardOverview;
