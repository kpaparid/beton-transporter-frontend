
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Col, Row  } from '@themesberg/react-bootstrap';

import { CounterWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { WorkerHoursTable, VacationsTable } from "../../components/Tables";
import {  totalOrders, monthlySales, workplantSales} from "../../data/charts";

import moment, { months } from "moment-timezone";

export default () => {
  return (
    <>
      <Row><Col xs={6}  className="mb-4">
        
        <Row>
        <Col xs={6}  className="mb-4">
              <CounterWidget
                category="cbm akt. Monat"
                title="7000.5 cbm"
                period={moment().format("MMM")}
                percentage={18.2}
                icon={faChartLine}
                iconColor="shape-secondary"
              />
            </Col>

          <Col xs={6} className="mb-4">
            <CounterWidget
              category="cbm letz. Monat"
              title="6856.5 cbm"
              period={moment().subtract(1,"months").format("MMM")}
              percentage={-28.4}
              icon={faChartLine}
              iconColor="shape-tertiary"
            />
          </Col>
          <Col xs={6} className="mb-4">
            <CounterWidget
              category="Umsatz akt. Monat"
              title="6856.5 cbm"
              period={moment().format("MMM")}
              percentage={-28.4}
              icon={faCashRegister}
              iconColor="shape-tertiary"
            />
          </Col>
          <Col xs={6}  className="mb-4">
              <CounterWidget
                category="Umsatz letzte. Monat"
                title="7000.5 cbm"
                period={moment().subtract(1,"months").format("MMM")}
                percentage={18.2}
                icon={faCashRegister}
                iconColor="shape-secondary"
              />
            </Col>
        </Row>
        <Col xs={12}  className="mb-4">
          <VacationsTable />
        </Col>
      </Col>
      
      <Col xs={6}  className="mb-4">
        <WorkerHoursTable />
      </Col>
      </Row>

      {/* <Row className="justify-content-md-center"> */}
    <Row>
      <Col xs={6} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Sales Value"
            value="9,500"
            percentage={10.57}
            data = {monthlySales}
          />
        </Col>
        <Col xs={6} className="mb-4 d-none d-sm-block">
          <BarChartWidget
            title="Workplant's Sales"
            value="9,500"
            percentage={10.57}
            data = {totalOrders}
          />
        </Col>
      </Row>

     
      
      


























      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
              {/* <Col xs={12} className="mb-4">
                  <PageVisitsTable />
                </Col> */}
                

                <Col xs={12} lg={6} className="mb-4">
                  <TeamMembersWidget />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <ProgressTrackWidget />
                </Col>
              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="px-0 mb-4">
                  <RankingWidget />
                </Col>

                <Col xs={12} className="px-0">
                  <AcquisitionWidget />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
