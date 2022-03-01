import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faPlane, faTimes, faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  Button,
  Modal,
  Nav,
  Spinner,
} from "@themesberg/react-bootstrap";
import _ from "lodash";
import isEqual from "lodash.isequal";
import moment from "moment";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Tab } from "react-bootstrap";
import { DateSelector } from "../../components/DatePicker";
import {
  calcDurationAndFormat,
  durationFormat,
  getGridLabels,
  getGridPrimaryLabels,
} from "../myComponents/util/labels";
import { useServices } from "../myComponents/util/services";

const NavItem = ({ activeKey, onClick, value, name, icon }) => {
  const handleClick = () => onClick(name);
  const isActive = activeKey === name;
  return (
    <Nav.Item
      className={
        "col-4 d-flex align-items-center bg-senary rounded-top border-senary border-bottom " +
        (isActive ? "text-nonary bg-senary" : "text-senary bg-darker-nonary")
      }
    >
      <Nav.Link
        onClick={handleClick}
        eventKey={name}
        style={{ fontSize: "14px" }}
        className={
          " w-100 text-wrap text-truncate text-center fw-bolder px-1 m-0 " +
          (isActive ? "text-nonary bg-senary" : "text-senary bg-darker-nonary")
        }
      >
        {isActive ? value : <FontAwesomeIcon icon={icon} size="lg" />}
      </Nav.Link>
    </Nav.Item>
  );
};

const UserOverview = () => {
  const [activeKey, setActiveKey] = useState("tab1");
  return (
    <div
      className={` w-100 h-100 align-items-center justify-content-start d-flex flex-column bg-darker-nonary`}
    >
      <div
        className="w-100 h-100 d-flex flex-column pt-3"
        style={{ maxWidth: "400px" }}
      >
        <Tab.Container activeKey={activeKey}>
          <div className="w-100">
            <Nav className="nav-tabs d-flex flex-nowrap justify-content-around w-100 border-0 px-4">
              <NavItem
                name="tab1"
                activeKey={activeKey}
                onClick={setActiveKey}
                value={"Work Hours"}
                icon={faClock}
              />
              <NavItem
                name="tab2"
                activeKey={activeKey}
                onClick={setActiveKey}
                value="Tours"
                icon={faTruck}
              />
              <NavItem
                name="tab3"
                activeKey={activeKey}
                onClick={setActiveKey}
                value="Vacations"
                icon={faPlane}
              />
            </Nav>
          </div>
          <div className="w-100 h-100">
            <Tab.Content className="d-flex justify-content-center h-100">
              <Tab.Pane eventKey="tab1" className="py-1">
                <WorkHoursTab />
              </Tab.Pane>
              <Tab.Pane eventKey="tab2" className="py-1 w-100 h-100">
                <ToursTab />
              </Tab.Pane>
              <Tab.Pane eventKey="tab3" className="py-1 w-100 h-100">
                <VacationsTab />
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>
    </div>
  );
};

const VacationsTab = memo(() => {
  const [vacations, setVacations] = useState();
  const { fetchUserConfirmedVacations } = useServices();
  useEffect(() => {
    fetchUserConfirmedVacations().then(({ data }) => {
      setVacations(data.content);
      // setTotalPages(data.totalPages);
    });
  }, [fetchUserConfirmedVacations]);
  return (
    <div className="date-picker-overview w-100 d-flex flex-column h-100 pt-2">
      <div style={{ overflow: "hidden", position: "relative", flexGrow: 1 }}>
        <div
          className="d-flex flex-column w-100 px-3"
          style={{ position: "absolute", top: 0, bottom: 0, overflow: "auto" }}
        >
          {vacations?.map((v) => (
            <div
              key={v.id}
              className="d-flex justify-content-center py-2 fw-bold w-100"
            >
              <Button variant="nonary" className="w-100 d-flex flex-wrap">
                <div className="col-6 pe-3 flex-fill d-flex flex-column align-items-center">
                  <div className="fw-bolder">{v.dateFrom}</div>
                </div>
                <div className="col-6 ps-3 flex-fill d-flex flex-column align-items-center">
                  <span className="fw-bolder">{v.dateTo}</span>
                </div>
                <div
                  className={"col-12 fw-bolder text-center "}
                  style={{ fontSize: "18px" }}
                >
                  {v.days} days
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}, isEqual);

const ToursTab = () => {
  const [tours, setTours] = useState();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const loadEnabled = page + 1 < totalPages;
  const { fetchUserTours } = useServices();
  useEffect(() => {
    fetchUserTours().then(({ data }) => {
      setTours(data.content);
      setTotalPages(data.totalPages);
    });
  }, [fetchUserTours]);

  const loadNextPage = useCallback(() => {
    loadEnabled &&
      fetchUserTours(page + 1).then(({ data }) => {
        setPage(page + 1);
        setTours((old) => [...old, ...data.content]);
        setTotalPages(data.totalPages);
      });
  }, [page, fetchUserTours, loadEnabled]);

  return (
    <div className="date-picker-overview w-100 d-flex flex-column h-100 pt-2">
      <div style={{ overflow: "hidden", position: "relative", flexGrow: 1 }}>
        {tours && (
          <TourList
            tours={tours}
            spinner={loadEnabled}
            onScroll={loadNextPage}
          />
        )}
      </div>
    </div>
  );
};

const TourList = ({ tours, spinner = false, onScroll }) => {
  const [modalProps, setModalProps] = useState(false);
  const handleClose = () => setModalProps({ show: false });
  const handleShow = useCallback((tour) => {
    return setModalProps({ ...tour, show: true });
  }, []);

  const dates = [...new Set(tours.map((c) => c.date))];
  const mObject = dates.reduce(
    (a, b) => ({ ...a, [b]: tours.filter((t) => t.date === b) }),
    {}
  );
  const handleScroll = useCallback(
    (e) => {
      const cc =
        e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight);
      if (cc < 50) {
        onScroll && onScroll();
      }
    },
    [onScroll]
  );
  const handleEndScroll = useMemo(
    () => _.debounce(handleScroll, 1000),
    [handleScroll]
  );

  return (
    <div
      className="d-flex flex-column w-100 px-3"
      style={{ position: "absolute", top: 0, bottom: 0, overflow: "auto" }}
      onScroll={handleEndScroll}
    >
      <TourModal onClose={handleClose} {...modalProps} />
      {dates?.map((date) => (
        <React.Fragment key={date}>
          <div className="d-flex justify-content-center py-2 fw-bold">
            <span
              className="border-senary border-bottom flex-grow-1"
              style={{ marginBottom: "12px" }}
            />
            <span className="text-center text-senary px-2">{form(date)}</span>
            <span
              className="border-senary border-bottom flex-grow-1"
              style={{ marginBottom: "12px" }}
            />
          </div>
          {mObject[date].map((t) => (
            <Tour tour={t} key={t.id} onClick={handleShow} />
          ))}
          <div className="pt-4"></div>
        </React.Fragment>
      ))}
      {spinner && (
        <div className="text-center">
          <Spinner animation="border" variant="senary" />
        </div>
      )}
    </div>
  );
};
const Tour = ({ tour, onClick }) => {
  const handleClick = useCallback(() => {
    onClick && onClick(tour);
  }, [tour, onClick]);

  return (
    <div>
      <div className="p-1 w-100 h-100 d-flex">
        <Button
          onClick={handleClick}
          variant="nonary"
          className="w-100  d-flex justify-content-between"
        >
          <span className="ps-3 pe-3 text-truncate text-break">
            {tour.buildingSite}
          </span>
          <span className="pe-3">{tour.arrival}</span>
        </Button>
      </div>
    </div>
  );
};

const TourModal = ({ show, onClose, ...tour }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className={"dark-modal"}
      scrollable
    >
      <Modal.Header className="p-0 d-flex justify-content-end">
        <div className="p-2">
          <Button
            variant="transparent"
            className="p-0 text-senary d-flex justify-content-center align-items-center"
            style={{ height: "30px", width: "30px" }}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body className="pt-1">
        {getGridPrimaryLabels("tours").map((key) => (
          <div
            key={key}
            className="d-flex flex-wrap justify-content-between border-bottom border-senary text-senary fw-bolder"
          >
            <div
              className="text-start text-break text-wrap pe-2"
              style={{ minWidth: "60px" }}
            >
              {getGridLabels("tours")[key]?.text}
            </div>
            <div className="flex-fill text-end text-break text-wrap ps-2 fw-bold">
              {tour &&
                (tour[key] || "") +
                  (getGridLabels("tours")[key]?.measurement || "")}
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

function form(date) {
  const d = moment(date, "YYYY.MM.DD");
  const today = moment();
  return d === today
    ? "Today"
    : d === today.subtract(1, "day")
    ? "Yesterday"
    : d.format("YYYY") === today.format("YYYY")
    ? d.format("DD MMMM")
    : date;
}

const WorkHoursTab = () => {
  const [date, setDate] = useState(moment());
  const [workHours, setWorkHours] = useState();
  const [day, setDay] = useState();
  const workDays = workHours && Object.keys(workHours);

  const to = useMemo(() => date.format("YYYY.MM") + ".31", [date]);
  const from = useMemo(
    () => date.subtract(1, "y").format("YYYY.MM") + ".01",
    [date]
  );
  const workHour = day && workHours[day];
  const { fetchUserWorkHours } = useServices();
  useEffect(() => {
    fetchUserWorkHours(from, to).then(({ data }) => {
      const workHours = data?.content?.reduce(
        (a, { date, begin, end, pause }) => ({
          ...a,
          [date]: { begin, end, pause, date },
        }),
        {}
      );
      setWorkHours(workHours);
    });
  }, [fetchUserWorkHours, from, to]);

  const handleMonthYearChange = (v) => {
    setDay();
  };

  const handleClick = (day) => setDay(day);
  return (
    <div className="date-picker-overview">
      <div>
        <DateSelector
          variant="darker"
          carousel
          disableMonthSwap
          onMonthChange={handleMonthYearChange}
          from={"2022.02.01"}
          max={moment().add(1, "day").format("YYYY.MM.DD")}
          highlightedDays={workDays}
          onChange={handleClick}
          singleDate
        />
      </div>

      {workHour && <WorkHour {...workHour} />}
    </div>
  );
};
const WorkHour = ({ begin, end, pause, date }) => {
  return (
    <>
      <Accordion defaultActiveKey="0" className="px-2 accordion-dark">
        <Accordion.Item className="w-100" eventKey="0">
          <Accordion.Header>
            <div className="w-100 d-flex flex-nowrap justify-content-center fw-bold">
              <span>{moment(date, "YYYY.MM.DD").format("dddd")}</span>
              <span className="ps-2">
                {durationFormat(calcDurationAndFormat([begin, end]))}
              </span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="d-flex flex-column">
            <div className="d-flex flex-nowrap  justify-content-between">
              <span>Begin</span>
              <span>{begin}</span>
            </div>
            <div className="d-flex flex-nowrap  justify-content-between py-1">
              <span>End</span>
              <span>{end}</span>
            </div>
            <div className="d-flex flex-nowrap  justify-content-between">
              <span>Pause</span>
              <span>{pause}</span>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
export default UserOverview;
