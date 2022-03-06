import React, { useEffect, useState, memo, useCallback } from "react";
import { Button, Card } from "@themesberg/react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";

export const YearSelectorDropdown = ({
  date,
  title,
  format = "YYYY.MM.DD",
  ...rest
}) => {
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          // split
          variant="transparent"
          className="btn-title w-100"
          // style={{ backgroundColor: "#f5f8fb" }}
        >
          <h5 className="text-wrap text-start">
            {title} {date}
          </h5>
        </Dropdown.Toggle>

        <Dropdown.Menu className="m-0 p-0">
          <YearSelector {...rest} date={date}></YearSelector>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
export const YearSelector = (props) => {
  const { date, onChange } = props;

  const [year, setYear] = useState(date);

  useEffect(() => {
    setYear(date);
  }, [date]);

  const handlerYearChange = useCallback(
    (y) => {
      onChange && y === 1
        ? onChange(moment(year, "YYYY").add(1, "years").format("YYYY"))
        : onChange(moment(year, "YYYY").subtract(1, "years").format("YYYY"));
    },
    [year, onChange]
  );

  const data = { handlerYearChange, year };
  return (
    <>
      <YearSelectorComponent data={data}></YearSelectorComponent>
    </>
  );
};
const YearSelectorComponent = memo((props) => {
  const { handlerYearChange, year } = props.data;

  return (
    <>
      <Card
        border="light"
        className="shadow-sm flex-fill year-selector my-card"
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
      </Card>
    </>
  );
}, isEqual);
