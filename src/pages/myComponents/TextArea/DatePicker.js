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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    inputProps,
    Input,
    format = "YYYY/MM/DD",
    singleDate = false,
    disableMonthSwap = false,
  }) => {
    const ref = useRef(null);
    const handleSelectorChange = useCallback((value) => {
      onChange && onChange(value);
    }, []);
    const handleInputChange = useCallback((e) => {
      const v = e.target.value;
      onChange && onChange(v);
    }, []);
    const domInput = useCallback(
      ({ value, ...rest }) => {
        const v = moment(value, "YYYY/MM/DD", true).isValid
          ? moment(value, "YYYY/MM/DD").format(format)
          : value;
        return Input ? (
          <Input {...rest} value={v}></Input>
        ) : (
          <div className="d-flex w-100 justify-content-center">
            <input
              type="text"
              className="text-center"
              {...rest}
              value={v}
              style={inputStyle}
              autoFocus={false}
            />
          </div>
        );
      },
      [Input, inputStyle, format]
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
          domInput({ ...props, autoFocus: false })
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
                  // onBlur: onBlur,
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
                ...inputProps,
              })}
            >
              <DateSelector
                singleDate={singleDate}
                onChange={handleSelectorChange}
                values={singleDate ? [value] : value}
                maxWidth={maxWidth}
                minWidth={minWidth}
                disableMonthSwap={disableMonthSwap}
              />
            </CustomDropdown>
          </div>
        </div>
      </>
    );
  },
  isEqual
);

export const DateSelector = memo(
  ({ singleDate, from, to, onChange, ...rest }) => {
    const initialValue = useMemo(() => [from, to].filter((e) => e), [from, to]);
    const [values, setValues] = useState(initialValue);
    const [hoveredDay, setHoveredDay] = useState();
    const handleChange = useCallback(
      (value) => {
        singleDate ? onChange(value[0]) : value.length !== 1 && onChange(value);
      },
      [singleDate, onChange]
    );
    const handleClick = useCallback(
      (e) => {
        const name = e.target.name;
        const newValues = singleDate
          ? [name]
          : values.length === 0
          ? [name]
          : values.length === 1
          ? [...values, name].sort()
          : [];
        setValues(newValues);
        handleChange(newValues);
      },
      [values, handleChange, singleDate]
    );
    const handleMouseOver = useCallback((e) => {
      const name = e.target.name;
      setHoveredDay(name);
    }, []);
    const handleMouseLeave = useCallback((e) => {
      setHoveredDay(null);
    }, []);

    useEffect(() => {
      setValues(initialValue);
    }, [initialValue]);
    return (
      <DateSelectorComponent
        values={values}
        hoveredDay={hoveredDay}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        singleDate={singleDate}
        {...rest}
      ></DateSelectorComponent>
    );
  },
  isEqual
);

const DateSelectorComponent = memo(
  ({
    values,
    hoveredDay,
    onClick,
    onMouseOver,
    onMouseLeave,
    singleDate = false,
    disableMonthSwap = false,
    style,

    year: initialYear = moment().format("YYYY"),
    month: initialMonth = moment().format("M"),
  }) => {
    const [month, setMonth] = useState(initialMonth);
    const [year, setYear] = useState(initialYear);
    const labels = useMemo(() => rotateArray(moment.weekdays(), 1), []);
    const headers = useMemo(
      () => labels.map((day) => day.substr(0, 2) + "."),
      [labels]
    );
    const title = moment(month, "MM").format("MMMM") + " " + year;
    const tableDays = useMemo(
      () => calcIndexedCalendarDays(month + "/" + year, labels),
      [month, year, labels]
    );
    const handleIncreaseMonth = useCallback(
      (e) => {
        const newMonth = parseInt(month) + 1;
        setMonth(newMonth === 13 ? 1 : newMonth);
        newMonth === 13 && setYear((old) => parseInt(old) + 1);
      },
      [month]
    );
    const handleDecreaseMonth = useCallback(
      (e) => {
        const newMonth = parseInt(month) - 1;
        setMonth(newMonth === 0 ? 12 : newMonth);
        newMonth === 0 && setYear((old) => parseInt(old) - 1);
      },
      [month]
    );
    useEffect(() => {
      setMonth(initialMonth);
      setYear(initialYear);
    }, [initialMonth, initialYear]);
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
                  onClick={handleDecreaseMonth}
                  onMouseDown={(e) => e.preventDefault()}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                </Button>
              )}
              <h5 className="text-center m-0">{title}</h5>
              {!disableMonthSwap && (
                <Button
                  variant="inverse"
                  onClick={handleIncreaseMonth}
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
                        singleDate={singleDate}
                        data={row}
                        index={index}
                        name={year + "/" + month}
                        onClick={onClick}
                        onMouseOver={onMouseOver}
                        clickedId={values}
                        hoveredDay={hoveredDay}
                        onMouseLeave={onMouseLeave}
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
  },
  isEqual
);

const TableRow = (props) => {
  const {
    data,
    onClick,
    onMouseOver,
    onMouseLeave,
    clickedId = [],
    hoveredDay,
    index,
    name = "",
    singleDate,
  } = props;

  return data.map((e, i) => {
    if (e === null)
      return <td className="border-0 p-1" key={"empty" + index * 7 + i}></td>;
    else {
      const day = name + "/" + ("0" + e).substr(-2);
      const key = "Btn" + e;
      const from = clickedId[0];
      const to = clickedId[1];
      const variant =
        day === from
          ? "primary"
          : day === to
          ? "primary"
          : to && from && day < to && day > from
          ? "light-blue"
          : hoveredDay === day
          ? "very-light-tertiary"
          : !singleDate && !to && from && day < hoveredDay && day > from
          ? "very-light-tertiary"
          : !singleDate && !to && from && day > hoveredDay && day < from
          ? "very-light-tertiary"
          : "light";
      return (
        <td className="border-0 p-1 justify-content-center" key={key}>
          <DayButton
            variant={variant}
            onClick={onClick}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            value={e}
            name={name + "/" + ("0" + e).substr(-2)}
          />
        </td>
      );
    }
  });
};
export const DayButton = (props) => {
  const { value, variant, day, onClick, onMouseOver, onMouseLeave, name } =
    props;
  return (
    <>
      <Button
        style={{
          width: "30px",
          height: "30px",
          borderRadius: 0,
          border: 0,
        }}
        disabled={value === null}
        name={name}
        size="sm"
        value={day}
        variant={variant}
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        className="text-center p-0 day-btn"
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
