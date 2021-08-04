import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Table, Dropdown } from "@themesberg/react-bootstrap";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { ACTIONS } from "../reducers/redux";
import { HeaderRow } from "./MyTableRow";
import {
  rotateArray,
  calcIndexedCalendarDays,
  convertArrayToObject,
} from "./util/utilities";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Portal } from "react-portal";
import { MyDropdown } from "./MyDropdown";
import MyTextArea from "./TextArea/MyTextArea";
import TextareaAutosize from "react-textarea-autosize";

export const MonthSelectorDropdown = (props) => {
  const { value } = props;
  const date = useSelector((state) => state.tourTable.tourDate);

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle split variant="light">
          <h5 className="m-0">{value}</h5>
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-0">
          <MonthSelector value={value} date={date}></MonthSelector>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
export const DateSelectorDropdown = React.memo((props) => {
  const {
    value,
    id = "dateSelector",
    onChange,
    maxWidth,
    minWidth,
    disabled = false,
  } = props;
  // console.log(props);
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);
  function handleChange(value) {
    console.log("ON CHANGE DROPDOWN setText: " + value);
    setText(value);
  }
  function handleInputChange(e) {
    setText(e.target.value);
  }
  useEffect(() => {
    onChange && onChange(text);
  }, [text]);
  const children = {
    id: id,
    type: "date",
    value: text,
    invalidation: true,
    onChange: handleChange,
    focus: focused,
    minWidth,
    maxWidth,
    digitsSeperator: "/",
    seperatorAt: [2, 4],
    disabled,
  };
  const ref = useRef(null);
  const data = {
    disabled,
    // ToggleComponent: <MyTextArea   ref={ref}>{children}</MyTextArea>,
    // ToggleComponent: <input onChange={handleInputChange} value={text}></input>,
    ToggleComponent: (
      <TextareaAutosize
        value={text}
        onChange={handleInputChange}
        // onBlur={onBlur}
      />
    ),
    MenuComponent: (
      <DateSelector
        id={id}
        singleDate
        onChange={handleChange}
        value={text}
        maxWidth={maxWidth}
        minWidth={minWidth}
      ></DateSelector>
    ),
    // ariaLabel,
  };
  //   return (
  // const ref = useRef(null);
  return (
    <>
      <div className="d-block w-100">
        <MyDropdown {...data}></MyDropdown>
      </div>
    </>
  );
});

export const MonthSelector = (props) => {
  const { value, date } = props;
  const newDate = moment(date, "MM/YYYY").format("YYYY");

  const dispatch = useDispatch();
  function handlerMonthChange(month) {
    dispatch({
      type: ACTIONS.TOURTABLE_CHANGE_TOURDATE,
      payload: {
        month: month,
      },
    });
  }
  function handlerYearChange(yearIncrement) {
    dispatch({
      type: ACTIONS.TOURTABLE_CHANGE_TOURDATE,
      payload: {
        yearIncrement: yearIncrement,
      },
    });
  }
  function colorize(month) {
    return moment().month(month).format("MM") ===
      moment(date, "MM/YYYY").format("MM")
      ? "primary"
      : "light";
  }
  const data = { handlerYearChange, handlerMonthChange, colorize, newDate };
  return (
    <>
      <MonthSelectorComponent data={data}></MonthSelectorComponent>
    </>
  );
};
export const DateSelector = (props) => {
  const {
    monthi = moment().format("MM/YYYY"),
    id,
    singleDate = false,
    onChange,
    value,
    disableMonthSwap = false,
    maxWidth,
    minWidth,
  } = props;
  const [clickedId, setClickedId] = useState(
    moment(value, "DD/MM/YYYY", true).isValid()
      ? [parseInt(moment(value, "DD/MM/YYYY").format("DD"))]
      : []
  );
  const [hoveredId, setHoveredId] = useState();
  const labels = rotateArray(moment.weekdays(), 1);
  const headers = labels.map((day) => day.substr(0, 2) + ".");

  const [date, setDate] = useState(value);

  const splitDate = date.split("/");
  const days =
    date === "" ? "01" : date.indexOf("/") === 2 ? splitDate[0] : date;
  const month =
    date.indexOf("/") === 2
      ? splitDate[1]
      : moment(monthi, "MM/YYYY").format("MM");
  const year =
    date.indexOf("/", 3) === 5
      ? splitDate[2]
      : moment(monthi, "MM/YYYY").format("YYYY");
  const newDate = moment(month + "/" + year, "MM/YYYY").format("MMMM YYYY");

  const [tableDays, setTableDays] = useState(
    calcIndexedCalendarDays(moment().format("MM/YYYY"), labels)
  );

  useEffect(() => {
    moment(value, "DD/MM/YYYY", true).isValid()
      ? setDate(moment(value, "DD/MM/YYYY").format("DD/MM/YYYY"))
      : moment(value, "DD/MM/Y", true).isValid()
      ? setDate(moment(value, "DD/MM/Y").format("DD/MM/YYYY"))
      : moment(value, "DD/M", true).isValid()
      ? setDate(
          moment(value, "DD/M").format("DD/MM") +
            "/" +
            moment(value, "DD/MM/YYYY").format("YYYY")
        )
      : moment(value, "D", true).isValid()
      ? setDate(
          moment(value, "D").format("DD") +
            "/" +
            moment(value, "DD/MM/YYYY").format("MM/YY")
        )
      : console.log("seperator");
  }, [value]);

  useEffect(() => {
    console.log("=======DATE: " + date);
    console.log("days: " + days);
    console.log("month: " + month);
    console.log("year: " + year);
    console.log("===========/");
    const newD = moment(date, "DD/MM/YYYY").format("MM/YYYY");
    const newTableDays = calcIndexedCalendarDays(newD, labels);
    setTableDays(newTableDays);
  }, [date]);
  useEffect(() => {
    moment(days, "DD", true).isValid
      ? setClickedId([parseInt(days)])
      : setClickedId([]);
  }, [days]);

  const data = {
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
    maxWidth,
    minWidth,
  };

  function sendOutside(date) {
    if (singleDate) {
      console.log("sending Outside " + date);
      onChange && onChange(date);
    }
  }

  function handleIncrementMonth() {
    sendOutside(
      moment(date, "DD/MM/YYYY").add(1, "months").format("DD/MM/YYYY")
    );
  }
  function handleDecrementMonth() {
    sendOutside(
      moment(date, "DD/MM/YYYY").subtract(1, "months").format("DD/MM/YYYY")
    );
  }
  function handleClick(event) {
    const id = parseInt(event.target.id.replace("Btn", ""));
    if (singleDate && clickedId.length === 1) {
      setClickedId([id]);

      if (singleDate) {
        const newDay = moment(id, "D").format("DD");
        const newDate = moment(
          newDay + "/" + moment(date, "DD/MM/YYYY").format("MM/YYYY"),
          "DD/MM/YYYY"
        ).format("DD/MM/YYYY");
        sendOutside(newDate);
      }
    } else if (!singleDate && clickedId.length === 2) {
      setClickedId([]);
      setHoveredId();
    } else if (!singleDate && clickedId.length === 1 && clickedId[0] === id) {
      setClickedId([]);
      setHoveredId();
    } else setClickedId([...clickedId, id].sort((a, b) => a - b));
  }
  function handleMouseOver(event) {
    const id = parseInt(event.target.id.replace("Btn", ""));
    !singleDate && clickedId.length === 1 && setHoveredId(id);
  }

  return <DateSelectorComponent data={data}></DateSelectorComponent>;
};

const MonthSelectorComponent = (props) => {
  const {
    handlerYearChange,
    handlerMonthChange,
    onFocus,
    onBlur,
    colorize,
    newDate,
  } = props.data;
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
            <h5 className="text-center m-0">{newDate}</h5>
            <Button
              variant="light"
              onClick={() => handlerYearChange(1)}
            >{`>`}</Button>
          </div>
          <div className="d-flex flex-wrap">
            {moment.monthsShort().map((month, index) => {
              return (
                <div className="col-4 text-center text-nowrap" key={index}>
                  <MonthButton
                    value={month}
                    onClick={() => handlerMonthChange(month)}
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
};

const DateSelectorComponent = (props) => {
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
        style={{ width: "300px", minWidth: "300px" }}
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
};

const TableRow = (props) => {
  const { data, onClick, onMouseOver, clickedId, hoveredId, index } = props;
  return data.map((day, i) => {
    const c = index * 7 + i;
    if (day === " ")
      return <td className="border-0 p-1" key={"empty" + index * 7 + i}></td>;
    else {
      const id = "Btn" + day;
      const from = clickedId[0];
      const toClick = clickedId[1];
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
