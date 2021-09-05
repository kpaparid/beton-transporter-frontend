import React, { useEffect, useState, memo, useCallback, useRef } from "react";
import {
  Button,
  Card,
  Table,
  Form,
  ButtonGroup,
} from "@themesberg/react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { rotateArray, calcIndexedCalendarDays } from "./util/utilities";
import {
  faArrowLeft,
  faArrowRight,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextareaAutosize from "react-textarea-autosize";
import { isEqual } from "lodash";
import { CustomDropdown } from "./CustomDropdown";

export const DateSelectorDropdown = ({
  value,
  onChange,
  maxWidth,
  minWidth,
  disabled = false,
  portal = true,
  withButton = false,
}) => {
  const ref = useRef(null);

  const [text, setText] = useState(value);
  const handleChange = useCallback((value) => {
    moment(value, "D/M/YYYY", true).isValid() && setText(value);
  }, []);
  const handleInputChange = useCallback((e) => {
    setText(e.target.value);
  }, []);
  useEffect(() => {
    onChange && onChange(text);
  }, [text]);
  useEffect(() => {
    setText(value);
  }, [value]);

  const toggleComponent = withButton ? (
    <div
      size="sm"
      variant="primary"
      className="p-0 px-2 d-flex justify-content-center align-items-center h-100"
      style={{ width: "40px" }}
    >
      <FontAwesomeIcon icon={faCalendar} />
    </div>
  ) : (
    <div className="d-block w-100">
      <TextareaAutosize value={text} onChange={handleInputChange} />
    </div>
  );

  return (
    <>
      <div className="d-block w-100">
        <div className="d-flex flex-nowrap w-100">
          {withButton && (
            <TextareaAutosize
              style={{ paddingLeft: "40px" }}
              className="w-100"
              value={text}
              onChange={handleInputChange}
            />
          )}
          <CustomDropdown
            id={"TourFilter"}
            as={ButtonGroup}
            disabled={disabled}
            ref={{ ref: ref }}
            toggleAs="custom"
            // className="w-100"
            portal={portal}
            value={toggleComponent}
          >
            <DateSelector
              singleDate
              onChange={handleChange}
              date={text}
              maxWidth={maxWidth}
              minWidth={minWidth}
            />
          </CustomDropdown>
        </div>
      </div>
    </>
  );
};

export const DateSelector = memo((props) => {
  const {
    day = null,
    month = null,
    year = null,
    date = null,
    singleDate = false,
    onChange,
    disableMonthSwap = false,
    // maxWidth,
    // minWidth,
    ...rest
  } = props;
  const [clickedId, setClickedId] = useState(
    date && moment(date, "DD/MM/YYYY", true).isValid()
      ? [moment(date, "DD/MM/YYYY").format("DD")]
      : []
  );
  const [hoveredId, setHoveredId] = useState();
  const labels = rotateArray(moment.weekdays(), 1);
  const headers = labels.map((day) => day.substr(0, 2) + ".");
  const [tableDays, setTableDays] = useState([]);
  const [monthYear, setMonthYear] = useState(
    date && moment(date, "DD/MM/YYYY", true).isValid()
      ? [moment(date, "DD/MM/YYYY").format("MMMM YYYY")]
      : date && moment(date, "MM/YYYY", true).isValid()
      ? [moment(date, "MM/YYYY").format("MMMM YYYY")]
      : month && year && moment(month + "/" + year, "MM/YYYY", true).isValid()
      ? [moment(month + "/" + year, "MM/YYYY").format("MMMM YYYY")]
      : [moment().format("MMMM YYYY")]
  );
  useEffect(() => {
    day && Array.isArray(day) && setClickedId(day);
    day && !Array.isArray(day) && setClickedId([day]);
  }, [day]);
  useEffect(() => {
    month &&
      year &&
      setMonthYear(moment(month + "/" + year, "MM/YYYY").format("MMMM YYYY"));
  }, [month, year]);
  useEffect(() => {
    if (date !== null) {
      const newDate = !Array.isArray(date)
        ? moment(date, "DD/MM/YYYY", true).isValid()
          ? moment(date, "DD/MM/YYYY").format("MMMM YYYY")
          : monthYear
        : moment(date[0], "DD/MM/YYYY", true).isValid()
        ? moment(date[0], "DD/MM/YYYY").format("MMMM YYYY")
        : moment(date[1], "DD/MM/YYYY", true).isValid()
        ? moment(date[1], "DD/MM/YYYY").format("MMMM YYYY")
        : monthYear;
      setMonthYear(newDate);
      const newClickedId = !Array.isArray(date)
        ? moment(date, "DD/MM/YYYY", true).isValid()
          ? [moment(date, "DD/MM/YYYY").format("DD")]
          : []
        : moment(date[0], "DD/MM/YYYY", true).isValid()
        ? [moment(date[0], "DD/MM/YYYY").format("DD")]
        : moment(date[1], "DD/MM/YYYY", true).isValid()
        ? [moment(date[1], "DD/MM/YYYY").format("DD")]
        : [];
      setClickedId(newClickedId);
    }
  }, [date]);
  useEffect(() => {
    monthYear &&
      monthYear.length !== 0 &&
      setTableDays(
        calcIndexedCalendarDays(
          moment(monthYear, "MMMM YYYY").format("MM/YYYY"),
          labels
        )
      );
  }, [monthYear]);

  const data = {
    handleClick,
    handleMouseOver,
    clickedId,
    hoveredId,
    newDate: monthYear,
    headers,
    tableDays,
    disableMonthSwap,
    handleIncrementMonth,
    handleDecrementMonth,
    ...rest,
  };

  function sendOutside(days, mY = monthYear) {
    const change =
      days && mY
        ? days.map((day) =>
            moment(
              day + "/" + moment(mY, "MMMM YYYY").format("MM/YYYY"),
              "D/MM/YYYY"
            ).format("DD/MM/YYYY")
          )
        : moment(mY, "MMMM YYYY").format("MM/YYYY");
    onChange && change.length === 1 ? onChange(change[0]) : onChange(change);
  }

  function handleIncrementMonth() {
    const newMonthYear = moment(monthYear, "MMMM YYYY")
      .add(1, "months")
      .format("MMMM YYYY");
    setMonthYear(newMonthYear);
    sendOutside(clickedId, newMonthYear);
  }

  function handleDecrementMonth() {
    const newMonthYear = moment(monthYear, "MMMM YYYY")
      .subtract(1, "months")
      .format("MMMM YYYY");
    setMonthYear(newMonthYear);
    sendOutside(clickedId, newMonthYear);
  }
  function handleClick(event) {
    const id = parseInt(event.target.id.replace("Btn", ""));
    if (singleDate && clickedId.length === 1) {
      setClickedId([id]);
    } else if (!singleDate && clickedId.length === 2) {
      setClickedId([]);
      setHoveredId();
    } else if (!singleDate && clickedId.length === 1 && clickedId[0] === id) {
      setClickedId([]);
      setHoveredId();
    } else {
      setClickedId([...clickedId, id].sort((a, b) => a - b));
    }
  }

  function handleMouseOver(event) {
    const id = parseInt(event.target.id.replace("Btn", ""));
    !singleDate && clickedId.length === 1 && setHoveredId(id);
  }
  useEffect(() => {
    const size = clickedId.length;
    switch (size) {
      case 0:
        sendOutside();
        break;
      case 1:
        singleDate && sendOutside(clickedId);
        break;
      case 2:
        !singleDate && sendOutside(clickedId);
        break;
      default:
        break;
    }
  }, [clickedId]);

  return <DateSelectorComponent data={data}></DateSelectorComponent>;
}, isEqual);

const DateSelectorComponent = memo((props) => {
  const {
    handleClick,
    handleMouseOver,
    clickedId,
    hoveredId,
    newDate,
    headers,
    tableDays,
    disableMonthSwap,
    handleIncrementMonth,
    handleDecrementMonth,
    maxWidth = "300px",
    minWidth = "20px",
  } = props.data;

  return (
    <>
      <Card
        border="light"
        className="shadow-sm flex-fill"
        style={{ width: "300px", minWidth: "300px", cursor: "default" }}
      >
        <Card.Body className="px-3">
          <div className="container-fluid d-flex py-3 px-1 justify-content-around align-items-center">
            {!disableMonthSwap && (
              <Button
                onClick={handleDecrementMonth}
                onMouseDown={(e) => e.preventDefault()}
                size="sm"
              >
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </Button>
            )}
            <h5 className="text-center m-0">{newDate}</h5>
            {!disableMonthSwap && (
              <Button
                onClick={handleIncrementMonth}
                onMouseDown={(e) => e.preventDefault()}
                size="sm"
              >
                <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
              </Button>
            )}
          </div>
          <Table className="user-table align-items-center">
            <thead className="thead-light rounded-bottom">
              <HeaderRow headers={headers} />
            </thead>
            <tbody>
              {tableDays.map((row, index) => {
                return (
                  <tr className="p-0 align-items-center" key={row + index}>
                    <TableRow
                      data={row}
                      index={index}
                      onClick={handleClick}
                      onMouseOver={handleMouseOver}
                      clickedId={clickedId}
                      hoveredId={hoveredId}
                    ></TableRow>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}, isEqual);

const TableRow = (props) => {
  const { data, onClick, onMouseOver, clickedId, hoveredId, index } = props;
  return data.map((day, i) => {
    if (day === " ")
      return <td className="border-0 p-1" key={"empty" + index * 7 + i}></td>;
    else {
      const id = "Btn" + day;
      const from = parseInt(clickedId[0]);
      const toClick = parseInt(clickedId[1]);
      const toHover = hoveredId;
      const variant =
        day === from
          ? "primary"
          : day === toClick
          ? "primary"
          : toClick && from && day < toClick && day > from
          ? "success"
          : toHover && from && day >= toHover && day < from
          ? "danger"
          : toHover && from && day <= toHover && day > from
          ? "danger"
          : "light";
      return (
        <td className="border-0 p-1 justify-content-center" key={id}>
          <DayButton
            id={id}
            variant={variant}
            onClick={onClick}
            onMouseOver={onMouseOver}
            value={day}
          />
        </td>
      );
    }
  });
};
export const DayButton = (props) => {
  const { value, variant, day, onClick, onMouseOver, id } = props;
  return (
    <>
      <Button
        disabled={day === " "}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: 0,
        }}
        size="sm"
        value={day}
        id={id}
        variant={variant}
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()}
        onMouseOver={onMouseOver}
        className="text-center p-0"
      >
        {value}
      </Button>
    </>
  );
};
export const MonthButton = (props) => {
  const { value, onClick, variant } = props;
  return (
    <>
      <div className="fluid-container p-1">
        <Button
          className="w-100"
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
export const CalendarButton = (props) => {
  const { value } = props;

  return (
    <Button variant="white" style={{ padding: "0.25rem" }}>
      <h5 className="m-0">{value}</h5>
    </Button>
  );
};
const HeaderRow = (props) => {
  const { headers, checked, handleAllClick, checkbox = false } = props;
  return (
    <tr className="align-middle">
      {checkbox && (
        <th className="border-bottom px-2 text-left" style={{ width: "30px" }}>
          <Form.Check
            id="checkboxAll"
            htmlFor="checkboxAll"
            checked={checked}
            onChange={handleAllClick}
          />
        </th>
      )}

      {headers.map((header) => (
        <th
          key={`$s-${header}`}
          className="border-bottom  px-2 text-nowrap text-center "
        >
          {header}
        </th>
      ))}
    </tr>
  );
};
export const MonthSelectorDropdown = ({ date, title, ...rest }) => {
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          split
          variant="light"
          className="rounded-0 rounded-end light"
          // style={{ backgroundColor: "#f5f8fb" }}
        >
          <h5 className="m-0 py-0 px-2">
            {title} {moment(date, "MM/YYYY").format("MMMM YYYY")}
          </h5>
        </Dropdown.Toggle>

        <Dropdown.Menu className="m-0 p-0">
          <MonthSelector {...rest} date={date}></MonthSelector>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
export const MonthSelector = (props) => {
  const { date, onChange } = props;

  // const newDate = moment(date, "MM/YYYY").format("YYYY");
  const [year, setYear] = useState(moment(date, "MM/YYYY").format("YYYY"));
  const [month, setMonth] = useState(moment(date, "MM/YYYY").format("MMM"));

  useEffect(() => {
    setYear(moment(date, "MM/YYYY").format("YYYY"));
    setMonth(moment(date, "MM/YYYY").format("MMM"));
  }, [date]);

  function handlerMonthChange(m) {
    console.log("new month", m);
    const change = moment(m + "/" + year, "MMM/YYYY").format("MM/YYYY");
    console.log(change);
    onChange && onChange(change);
  }
  function handlerYearChange(y) {
    onChange && y === 1
      ? onChange(
          moment(month + "/" + year, "MMM/YYYY")
            .add(1, "years")
            .format("MM/YYYY")
        )
      : onChange(
          moment(month + "/" + year, "MMM/YYYY")
            .subtract(1, "years")
            .format("MM/YYYY")
        );
  }

  const data = { handlerYearChange, handlerMonthChange, month, year };
  return (
    <>
      <MonthSelectorComponent data={data}></MonthSelectorComponent>
    </>
  );
};
const MonthSelectorComponent = memo((props) => {
  const {
    handlerYearChange,
    handlerMonthChange,
    onFocus,
    onBlur,
    year,
    month,
  } = props.data;

  const [activeMonth, setActiveMonth] = useState(month);
  function handleClick(value) {
    console.log("active before month", activeMonth);
    console.log("active month", value);
    setActiveMonth(value);
  }

  const colorize = useCallback(
    (m) => {
      return m === activeMonth ? "primary" : "light";
    },
    [activeMonth]
  );
  useEffect(() => {
    handlerMonthChange(activeMonth);
  }, [activeMonth]);
  return (
    <>
      <Card
        border="light"
        className="shadow-sm flex-fill"
        style={{ width: "250px", minWidth: "250px" }}
      >
        <Card.Body>
          <div className="container-fluid d-flex p-1 pb-3 justify-content-between align-items-center">
            <Button
              variant="light"
              onClick={() => handlerYearChange(-1)}
            >{`<`}</Button>
            <h5 className="text-center m-0">{year}</h5>
            <Button
              variant="light"
              onClick={() => handlerYearChange(1)}
            >{`>`}</Button>
          </div>
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
