import React, { useEffect, useState, memo, useCallback } from "react";
import { Button, Card } from "@themesberg/react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";

export const MonthSelectorDropdown = ({
  date,
  title,
  format = "YYYY.MM.DD",
  ...rest
}) => {
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="transparent" className="btn-title">
          <h5 className="text-wrap text-start">
            {title} {moment(date, format).format("MMMM YYYY")}
          </h5>
        </Dropdown.Toggle>

        <Dropdown.Menu className="m-0 p-0">
          <MonthSelector {...rest} date={date}></MonthSelector>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
export const MonthButton = (props) => {
  const { value, onClick, variant } = props;
  return (
    <>
      <div className="fluid-container p-1">
        <Button
          className="w-100 btn-month"
          variant={variant}
          onClick={onClick}
          onMouseDown={(e) => e.preventDefault()}
        >
          {value}
        </Button>
      </div>
    </>
  );
};
export const MonthSelector = (props) => {
  const { date, onChange } = props;

  // const newDate = moment(date, "MM/YYYY").format("YYYY");
  const [year, setYear] = useState(moment(date, "YYYY.MM").format("YYYY"));
  const [month, setMonth] = useState(moment(date, "YYYY.MM").format("MMM"));

  useEffect(() => {
    setYear(moment(date, "YYYY.MM").format("YYYY"));
    setMonth(moment(date, "YYYY.MM").format("MMM"));
  }, [date]);

  const handlerMonthChange = useCallback(
    (m) => {
      const change = moment(m + "." + year, "MMM.YYYY").toISOString();
      onChange && onChange(change);
    },
    [year, onChange]
  );
  const handlerYearChange = useCallback(
    (y) => {
      onChange && y === 1
        ? onChange(
            moment(month + "." + year, "MMM.YYYY")
              .add(1, "years")
              .toISOString()
          )
        : onChange(
            moment(month + "." + year, "MMM.YYYY")
              .subtract(1, "years")
              .toISOString()
          );
    },
    [month, year, onChange]
  );

  const data = { handlerYearChange, handlerMonthChange, month, year };
  return (
    <>
      <MonthSelectorComponent data={data}></MonthSelectorComponent>
    </>
  );
};
const MonthSelectorComponent = memo((props) => {
  const { handlerYearChange, handlerMonthChange, year, month } = props.data;

  const [activeMonth, setActiveMonth] = useState(month);
  const handleClick = useCallback(
    (value) => {
      setActiveMonth(value);
      handlerMonthChange(value);
    },
    [handlerMonthChange]
  );

  const colorize = useCallback(
    (m) => {
      return m === activeMonth ? "primary" : "light ";
    },
    [activeMonth]
  );
  return (
    <>
      <Card
        border="light"
        className="shadow-sm flex-fill month-selector my-card"
        style={{ width: "250px", minWidth: "250px" }}
      >
        <Card.Header>
          <div className="w-100 d-flex justify-content-between">
            <Button
              className="btn-arrow-left"
              variant="primary"
              onClick={() => handlerYearChange(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </Button>
            <h5 className="text-center m-0">{year}</h5>
            <Button
              className="btn-arrow-right"
              variant="primary"
              onClick={() => handlerYearChange(1)}
            >
              <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap">
            {moment.monthsShort().map((month, index) => {
              return (
                <div
                  className="col-4 text-center text-nowrap"
                  key={"month-Short" + index}
                >
                  <MonthButton
                    value={month}
                    onClick={() => handleClick(month)}
                    variant={colorize(month)}
                  ></MonthButton>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    </>
  );
}, isEqual);
