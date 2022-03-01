import {
  faArrowLeft,
  faArrowRight,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { Button, Card, Form } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import moment from "moment";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ButtonGroup, Modal, Table } from "react-bootstrap";
import { Virtual } from "swiper";
import "swiper/modules/navigation/navigation.scss";
import "swiper/modules/pagination/pagination.scss";
import "swiper/modules/virtual/virtual.scss";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import "swiper/swiper.scss";
import {
  rotateArray,
  calcIndexedCalendarDays,
} from "../pages/myComponents/util/utilities";
import { CustomDropdown } from "./Filters/CustomDropdown";

const DateSelectorDropdown = memo(
  ({
    value,
    onChange,
    inputStyle,
    disabled = false,
    portal = true,
    withButton = false,
    onBlur,
    inputProps,
    Input,
    format = "YYYY.MM.DD",
    singleDate = false,
    disableMonthSwap = false,
    className = "",
    dropdownClassName = "",
  }) => {
    const ref = useRef(null);
    const handleSelectorChange = useCallback(
      (value) => {
        onChange && onChange(value);
      },
      [onChange]
    );
    const handleInputChange = useCallback(
      (e) => {
        const v = moment(e.target.value, format, true).isValid()
          ? moment(e.target.value, format).format("YYYY.MM.DD")
          : e.target.value;
        onChange && onChange(v);
      },
      [onChange, format]
    );
    const domInput = useCallback(
      ({ value, ...rest }) => {
        const v = moment(value, "YYYY.MM.DD", true).isValid()
          ? moment(value, "YYYY.MM.DD").format(format)
          : value;
        return Input ? (
          <Input {...rest} value={v}></Input>
        ) : (
          <div className="d-flex justify-content-center">
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
        <div className={`d-block w-100 date-picker-dropdown ${className}`}>
          <div className="d-flex flex-nowrap w-100 align-items-center justify-content-center">
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
              // className={!withButton ? "d-flex" : null}
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
                from={singleDate ? value : value[0]}
                to={!singleDate && value[1]}
                disableMonthSwap={disableMonthSwap}
                className={dropdownClassName}
              />
            </CustomDropdown>
          </div>
        </div>
      </>
    );
  },
  isEqual
);
export const DatePickerModal = memo(
  ({
    size,
    value: initialValue,
    buttonText,
    buttonVariant = "primary",
    closeVariant = "nonary",
    saveVariant = "senary",
    timeVariant = "primary",
    timeActiveVariant = "primary",
    buttonClassName = "",
    modalClassName = "",
    modalContentClassName = "",
    onChange,
    disableMonthSwap = true,
    ...rest
  }) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(initialValue);
    const handleDateChange = useCallback((v) => {
      setValue(v);
    }, []);

    const handleClose = useCallback(() => {
      setShow(false);
      setValue(initialValue);
    }, [initialValue]);
    const handleShow = () => setShow(true);
    const handleSave = useCallback(() => {
      onChange(value);
      handleClose();
    }, [value, handleClose, onChange]);

    useEffect(() => {
      !isEqual(value, initialValue) && setValue(initialValue);
    }, [initialValue]);

    return (
      <>
        <Button
          size={size}
          variant={buttonVariant}
          onClick={handleShow}
          className={"date-picker-modal-btn w-100" + buttonClassName}
        >
          {buttonText}
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          centered
          className={modalClassName + " date-picker-modal"}
          contentClassName={
            "date-picker-modal-content dark-modal " + modalContentClassName
          }
          // scrollable
        >
          <Modal.Body>
            <DateSelector
              onChange={handleDateChange}
              disableMonthSwap={disableMonthSwap}
              {...rest}
            />
          </Modal.Body>
          <Modal.Footer className="">
            <div className="w-100 btn-group-wrapper d-flex justify-content-around">
              <Button
                variant={closeVariant}
                className="col-5"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant={saveVariant}
                className="col-5 fw-bolder"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  isEqual
);
export const DateSelector = memo(
  ({
    singleDate,
    carousel,
    from,
    to,
    onChange,
    variant = "light",
    className: initialClassName = "",
    ...rest
  }) => {
    const className = `date-picker date-picker-${variant} ${initialClassName}`;
    const initialValue = useMemo(() => [from, to].filter((e) => e), [from, to]);
    const [values, setValues] = useState(initialValue);
    const handleChange = useCallback(
      (value) => {
        singleDate
          ? onChange && onChange(value[0])
          : value.length !== 1 && onChange && onChange(value);
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

    useEffect(() => {
      setValues(initialValue);
    }, [initialValue]);

    return (
      <div className={className}>
        {carousel ? (
          <DateCarousel
            values={values}
            onClick={handleClick}
            singleDate={singleDate}
            {...rest}
          />
        ) : (
          <DateSelectorComponent
            values={values}
            onClick={handleClick}
            singleDate={singleDate}
            {...rest}
          />
        )}
      </div>
    );
  },
  isEqual
);

const DateSelectorComponent = memo(
  ({
    values,
    year: initialYear = moment(values[0], "YYYY.MM.DD", true).isValid()
      ? moment(values[0], "YYYY.MM.DD").format("YYYY")
      : moment().format("YYYY"),
    month: initialMonth = moment(values[0], "YYYY.MM.DD", true).isValid()
      ? moment(values[0], "YYYY.MM.DD").format("MM")
      : moment().format("MM"),
    onMonthChange,
    ...rest
  }) => {
    const [month, setMonth] = useState(initialMonth);
    const [year, setYear] = useState(initialYear);
    const handleIncreaseMonth = useCallback(
      (e) => {
        const calc = parseInt(month) + 1;
        const newMonth = calc === 13 ? "01" : ("0" + calc).slice(-2);
        setMonth(newMonth);
        calc === 13
          ? setYear((old) => {
              const newYear = parseInt(old) - 1;
              onMonthChange && onMonthChange(newYear + "." + newMonth);
              return parseInt(old) + 1;
            })
          : onMonthChange && onMonthChange(year + "." + newMonth);
      },
      [month, year, onMonthChange]
    );
    const handleDecreaseMonth = useCallback(
      (e) => {
        const decr = parseInt(month) - 1;
        const newMonth = decr === 0 ? "12" : ("0" + decr).slice(-2);
        setMonth(newMonth);
        decr === 0
          ? setYear((old) => {
              const newYear = parseInt(old) - 1;
              onMonthChange && onMonthChange(newYear + "." + newMonth);
              return newYear;
            })
          : onMonthChange && onMonthChange(year + "." + newMonth);
      },
      [month, year, onMonthChange]
    );
    useEffect(() => {
      setMonth(initialMonth);
      setYear(initialYear);
    }, [initialMonth, initialYear]);
    return (
      <>
        <DateSelectorPureComponent
          month={month}
          year={year}
          values={values}
          handleIncreaseMonth={handleIncreaseMonth}
          handleDecreaseMonth={handleDecreaseMonth}
          {...rest}
        />
      </>
    );
  },
  isEqual
);
export const DateCarousel = ({ length = 100, onMonthChange, ...rest }) => {
  const date = moment().subtract(length / 2, "M");
  const slides = useMemo(
    () =>
      Array.from({ length }).map((el, index) => {
        const d = moment(date).add(index, "M");
        const month = d.format("MM");
        const year = d.format("YYYY");

        return (
          <DateSelectorPureComponent
            key={month + "." + year}
            month={month}
            year={year}
            {...rest}
          />
        );
      }),
    [length, date, rest]
  );
  return (
    <div className="bg-transparent" style={{ width: "320px" }}>
      <Swiper
        spaceBetween={50}
        modules={[Virtual]}
        slidesPerView={1}
        centeredSlides
        initialSlide={length / 2}
        virtual
        onSlideChange={({ activeIndex }) =>
          onMonthChange &&
          onMonthChange(date.add(activeIndex, "M").format("YYYY.MM"))
        }
      >
        {slides.map((slideContent, index) => (
          <SwiperSlide key={slideContent.key} virtualIndex={index}>
            {slideContent}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
const DateSelectorPureComponent = memo(
  ({
    renderHeader = ({ month, year }) => {
      const title = moment(month, "MM").format("MMMM") + " " + year;
      return <h5 className="text-center m-0">{title}</h5>;
    },
    month,
    year,
    style,
    values,
    disableMonthSwap = false,
    handleDecreaseMonth,
    handleIncreaseMonth,
    id,
    ...rest
  }) => {
    const [hoveredDay, setHoveredDay] = useState();
    const handleMouseOver = useCallback((e) => {
      const name = e.target.name;
      setHoveredDay(name);
    }, []);
    const handleMouseLeave = useCallback((e) => {
      setHoveredDay(null);
    }, []);
    const labels = useMemo(() => rotateArray(moment.weekdays(), 1), []);
    const headers = useMemo(
      () => labels.map((day) => day.substr(0, 2) + "."),
      [labels]
    );
    // const title = moment(month, "MM").format("MMMM") + " " + year;
    const tableDays = useMemo(
      () => calcIndexedCalendarDays(month + "." + year, labels),
      [month, year, labels]
    );
    const header = {
      month,
      year,
      from: values[0],
      to: values[1],
    };
    return (
      <Card
        className="shadow-sm flex-fill date-picker-card my-card"
        // style={{
        //   cursor: "default",
        //   maxWidth: "320px",
        //   height: "360px",
        //   ...style,
        // }}
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
                variant="primary"
                onClick={handleDecreaseMonth}
                onMouseDown={(e) => e.preventDefault()}
                size="sm"
              >
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </Button>
            )}
            {renderHeader(header)}
            {!disableMonthSwap && (
              <Button
                variant="primary"
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
                  <tr
                    className="p-0 align-items-center date-rows"
                    key={row + index}
                  >
                    <TableRow
                      data={row}
                      index={index}
                      name={year + "." + month}
                      onMouseOver={handleMouseOver}
                      clickedId={values}
                      hoveredDay={hoveredDay}
                      onMouseLeave={handleMouseLeave}
                      {...rest}
                    ></TableRow>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  },
  isEqual
);
const TableRow = ({
  data,
  clickedId = [],
  hoveredDay,
  index,
  name = "",
  singleDate,
  highlightedDays,
  disabledDays,
  min,
  max,
  ...rest
}) => {
  return data.map((value, i) => {
    if (value === null)
      return <td className="border-0 p-1" key={"empty" + index * 7 + i}></td>;
    else {
      const day =
        name + "." + ("0" + value).substring(("0" + value).length - 2);
      const key = "Btn" + value;
      const from = clickedId[0];
      const to = clickedId[1];

      const disabled =
        value === null ||
        disabledDays?.includes(day) ||
        (min && moment(min, "YYYY.MM.DD").isAfter(moment(day, "YYYY.MM.DD"))) ||
        (max && moment(max, "YYYY.MM.DD").isBefore(moment(day, "YYYY.MM.DD")));
      const variant =
        day === from
          ? "primary"
          : day === to
          ? "secondary"
          : to && from && day < to && day > from
          ? "light-blue"
          : hoveredDay === day
          ? "quinary"
          : highlightedDays?.includes(day)
          ? "tertiary"
          : !singleDate && !to && from && day < hoveredDay && day > from
          ? "septenary"
          : !singleDate && !to && from && day > hoveredDay && day < from
          ? "octonary"
          : "light";
      return (
        <td className="border-0 p-1 text-center" key={"empty" + index * 7 + i}>
          <DayButton
            disabled={disabled}
            variant={variant}
            value={value}
            name={name + "." + ("0" + value).substr(-2)}
            {...rest}
          />
        </td>
      );
    }
  });
};
export const DayButton = (props) => {
  const { disabled, value, name, variant, onClick, onMouseOver, onMouseLeave } =
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
        disabled={disabled}
        name={name}
        size="sm"
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
    <tr className="align-middle days-label">
      {checkbox && (
        <th
          className="border-bottom px-2 text-left table-days"
          style={{ width: "30px" }}
        >
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
export default DateSelectorDropdown;
