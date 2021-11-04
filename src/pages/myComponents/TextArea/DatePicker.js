import {
  faArrowLeft,
  faArrowRight,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { Card, Form, Button } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import moment from "moment";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ButtonGroup, Table } from "react-bootstrap";
import { CustomDropdown } from "../Filters/CustomDropdown";
import { calcIndexedCalendarDays, rotateArray } from "../util/utilities";

export const DateSelectorDropdown = memo(
  ({
    value,
    onChange,
    maxWidth,
    minWidth,
    inputStyle,
    disabled = false,
    portal = true,
    withButton = false,
    onBlur,
    // inputProps,
    Input,
  }) => {
    const ref = useRef(null);
    const handleSelectorChange = useCallback((value) => {
      moment(value, "D/M/YYYY", true).isValid() && onChange(value);
    }, []);
    const handleInputChange = useCallback((e) => {
      const v = e.target.value;
      onChange && onChange(v);
    }, []);
    const domInput = useCallback(
      (props) =>
        Input ? (
          <Input {...props} autoFocus></Input>
        ) : (
          <input
            type="text"
            className="text-center"
            {...props}
            style={inputStyle}
          />
        ),
      [Input, inputStyle]
    );

    const toggleComponent = useCallback(
      ({ withButton, ...props }) =>
        withButton ? (
          <div style={{ width: "0px" }}>
            <IconButton
              aria-label="datepicker"
              style={{ padding: 8, left: "-30px", bottom: "-10px" }}
            >
              <FontAwesomeIcon
                style={{ width: "24px", height: "24px" }}
                icon={faCalendar}
              />
            </IconButton>
          </div>
        ) : (
          domInput({ ...props, autoFocus: true })
        ),
      [domInput]
    );

    return (
      <>
        <div className="d-block w-100">
          <div className="d-flex flex-nowrap w-100 align-items-center">
            {withButton && (
              <div className="d-block w-100">
                {domInput({
                  value: value,
                  onChange: handleInputChange,
                  onBlur: onBlur,
                })}
              </div>
            )}

            <CustomDropdown
              id={"TourFilter"}
              as={ButtonGroup}
              disabled={disabled}
              ref={{ ref: ref }}
              toggleAs="custom"
              className={!withButton ? "w-100" : null}
              portal={portal}
              value={toggleComponent({
                value: value,
                onChange: handleInputChange,
                onBlur: onBlur,
                withButton: withButton,
              })}
            >
              <DateSelector
                singleDate
                onChange={handleSelectorChange}
                date={value}
                maxWidth={maxWidth}
                minWidth={minWidth}
              />
            </CustomDropdown>
          </div>
        </div>
      </>
    );
  },
  isEqual
);

export const DateSelector = memo((props) => {
  const {
    day = null,
    month = null,
    year = null,
    date = null,
    singleDate = false,
    onChange,
    disableMonthSwap = false,
    style,
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
    console.log("sending outside", days, mY);
    const change =
      days && mY
        ? days.map((day) =>
            moment(
              day + "/" + moment(mY, "MMMM YYYY").format("MM/YYYY"),
              "D/MM/YYYY"
            ).format("DD/MM/YYYY")
          )
        : [];
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
      singleDate && sendOutside([id]);
    } else if (!singleDate && clickedId.length === 2) {
      setClickedId([]);
      setHoveredId();
      sendOutside();
    } else if (!singleDate && clickedId.length === 1 && clickedId[0] === id) {
      setClickedId([]);
      setHoveredId();
      sendOutside();
    } else {
      const newClicked = [...clickedId, id].sort((a, b) => a - b);
      setClickedId(newClicked);
      switch (newClicked.length) {
        case 0:
          sendOutside();
          break;
        case 1:
          singleDate && sendOutside(newClicked);
          break;
        case 2:
          !singleDate && sendOutside(newClicked);
          break;
        default:
          break;
      }
    }
  }

  function handleMouseOver(event) {
    const id = parseInt(event.target.id.replace("Btn", ""));
    !singleDate && clickedId.length === 1 && setHoveredId(id);
  }

  return (
    <DateSelectorComponent data={data} style={style}></DateSelectorComponent>
  );
}, isEqual);

const DateSelectorComponent = memo(({ data, style }) => {
  const {
    handleClick,
    handleMouseOver,
    clickedId,
    hoveredId,
    newDate,
    headers,
    tableDays,
    disableMonthSwap = false,
    handleIncrementMonth,
    handleDecrementMonth,
  } = data;

  return (
    <>
      <Card
        className="shadow-sm flex-fill date-selector my-card"
        style={{ cursor: "default", ...style }}
      >
        <Card.Header>
          <div
            className={
              disableMonthSwap
                ? "w-100 d-flex  justify-content-center"
                : "w-100 d-flex  justify-content-between"
            }
          >
            {!disableMonthSwap && (
              <Button
                variant="inverse"
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
                variant="inverse"
                onClick={handleIncrementMonth}
                onMouseDown={(e) => e.preventDefault()}
                size="sm"
              >
                <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body className="px-3">
          <Table className="user-table align-items-center">
            <thead className="rounded-bottom">
              <HeaderRow headers={headers} />
            </thead>
            <tbody className="border-0">
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
          ? "light-blue"
          : toHover && from && day >= toHover && day < from
          ? "danger"
          : toHover && from && day <= toHover && day > from
          ? "very-light-tertiary"
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
          border: 0,
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
export const CalendarButton = (props) => {
  const { value } = props;

  return (
    <Button variant="white" style={{ padding: "0.25rem" }}>
      <h6 className="m-0">{value}</h6>
    </Button>
  );
};
