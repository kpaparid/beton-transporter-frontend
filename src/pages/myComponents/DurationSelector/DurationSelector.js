import { Card } from "@themesberg/react-bootstrap";
import moment from "moment";
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useReducer,
} from "react";
import { Button } from "@themesberg/react-bootstrap";
import { MyTextArea, TextAreaGroup } from "../TextArea/MyTextArea";

import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatTime, addToTime, removeLeadingZeroes } from "../util/utilities";
import { MyDropdown } from "../MyDropdown";
import { calcInvalidation, calcValidation } from "../MyConsts";

export const TimeSelectorDropdown = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const fallbackRef = useRef(null);
    const domRef = ref || fallbackRef;

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const refGroup = [ref1, ref2];
    const {
      ariaLabel = "TimeSelector",
      type = "time",
      delimiter = ":",
      value,
      id = "1",
      onChange,
      validation = false,
      invalidation = false,
      disabledHours = false,
      disabledMinutes = false,
      disableReset = false,
      isUnlimited = false,
      availableMinutes,
      availableHours,
      maxWidth,
    } = children;
    const [isValid, setIsValid] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

    const [text, setText] = useState(value);
    const validationType =
      !disabledHours && !disabledMinutes
        ? "time"
        : disabledMinutes
        ? "hour"
        : "minute";
    console.log(value);
    console.log(validationType);
    function handleChangeDropdown(value) {
      console.log("handleChangeDropdown: " + value);
      setText(value);
      onChange(value);
    }
    useEffect(() => {
      console.log("sending inside onChange " + text);
      setIsValid(calcValidation(text, validationType, validation, isUnlimited));
      setIsInvalid(calcInvalidation(text, "time", invalidation, isUnlimited));
      onChange && onChange(text);
    }, [invalidation, isUnlimited, onChange, text, validation, validationType]);

    function handleChangeTextareaGroup(value, index) {
      console.log(value, index);
      const newValue =
        index === 0
          ? value + delimiter + text.split(delimiter)[1]
          : text.split(delimiter)[0] + delimiter + value;
      setText(newValue);
    }
    function handleChangeTextArea(value) {
      setText(value);
      console.log("WTFFFFFFFFFFFFFFF");
    }
    const children2 = {
      ariaLabel,
      value:
        validationType === "minute"
          ? text.split(delimiter)[1]
          : validationType === "hour"
          ? text.split(delimiter)[0]
          : text,
      measurement:
        validationType === "minute"
          ? "min"
          : validationType === "hour"
          ? "h"
          : "",
      isValid,
      isInvalid,
      type,
      id,
      maxWidth: maxWidth,
      data: text.split(delimiter).map((item, index) => {
        const type = index === 0 ? "h" : "min";
        return {
          id: id + "_" + type,
          value: item,
          measurement: type,
          ref: refGroup[index],
        };
      }),
    };
    const TextArea =
      type === "duration" && !disabledHours && !disabledMinutes ? (
        <TextAreaGroup {...children2} onChange={handleChangeTextareaGroup} />
      ) : (
        <MyTextArea ref={domRef}>
          {{ ...children2, onChange: handleChangeTextArea }}
        </MyTextArea>
      );
    const TimeSelect = (
      <TimeSelector>
        {{
          ariaLabel,
          id,
          time: text,
          isUnlimited: isUnlimited,
          disabledHours,
          disabledMinutes,
          disableReset,
          availableMinutes,
          availableHours,
          onChange: handleChangeDropdown,
        }}
      </TimeSelector>
    );
    const data = {
      ToggleComponent: TextArea,
      MenuComponent: TimeSelect,
      ariaLabel,
    };
    return (
      <>
        <div className="d-block w-100">
          <MyDropdown {...data}></MyDropdown>
        </div>
      </>
    );
  }
);
export const TimeSelector = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      id,
      onFocus,
      onBlur,
      delimiter = ":",
      time = "00" + delimiter + "00",
      onChange,
      availableMinutes,
      availableHours,
      isUnlimited = false,
      disableReset = false,
      hideDelimiter = false,
      disabledHours = false,
      disabledMinutes = false,
      ariaLabel = "timeselector",
    } = children;

    const [newTime, setNewTime] = useState(
      formatTime(
        time,
        disabledHours,
        disabledMinutes,
        delimiter,
        disableReset,
        isUnlimited
      )
    );

    const currentHour = newTime.split(delimiter)[0];
    const currentMinute = newTime.split(delimiter)[1];

    useEffect(() => {
      console.log("new time: " + time);
      setNewTime(
        formatTime(
          time,
          disabledHours,
          disabledMinutes,
          delimiter,
          disableReset,
          isUnlimited
        )
      );
    }, [delimiter, disableReset, isUnlimited, time]);
    function handleButtonClicks(event) {
      const id = event.currentTarget.id;
      console.log(newTime);
      switch (id) {
        case "Btn_hour_incr": {
          const t = addToTime(
            newTime,
            1,
            disabledHours,
            disabledMinutes,
            "hour",
            delimiter,
            disableReset,
            isUnlimited,
            availableHours,
            availableMinutes
          );
          return onChange && onChange(t);
        }
        case "Btn_hour_decr": {
          const t = addToTime(
            newTime,
            -1,
            disabledHours,
            disabledMinutes,
            "hour",
            delimiter,
            disableReset,
            isUnlimited,
            availableHours,
            availableMinutes
          );
          return onChange && onChange(t);
        }
        case "Btn_minute_incr": {
          const t = addToTime(
            newTime,
            1,
            disabledHours,
            disabledMinutes,
            "minute",
            delimiter,
            disableReset,
            isUnlimited,
            availableHours,
            availableMinutes
          );
          return onChange && onChange(t);
        }
        case "Btn_minute_decr": {
          const t = addToTime(
            newTime,
            -1,
            disabledHours,
            disabledMinutes,
            "minute",
            delimiter,
            disableReset,
            isUnlimited,
            availableHours,
            availableMinutes
          );
          return onChange && onChange(t);
        }
        default:
          return "error";
      }
    }
    const fallbackRef1 = useRef(null);
    const fallbackRef2 = useRef(null);
    const domRef = ref || { fallbackRef1, fallbackRef2 };
    const data = {
      onFocus,
      onBlur,
      id,
      currentHour,
      currentMinute,
      handleButtonClicks,
      availableMinutes,
      availableHours,
      delimiter,
      hideDelimiter,
      disabledHours,
      disabledMinutes,
      ariaLabel,
    };
    return <TimeSelectorComponent ref={domRef}>{data}</TimeSelectorComponent>;
  }
);
const TimeSelectorComponent = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      ariaLabel,
      id,
      onFocus,
      onBlur,
      currentHour,
      currentMinute,
      delimiter,
      handleButtonClicks,
      disabledHours = false,
      disabledMinutes = false,
      maxWidth = "250px",
      minWidth = "80px",
      availableMinutes,
      availableHours,
      hideDelimiter,
    } = children;
    console.log(currentHour);
    console.log(currentMinute);

    return (
      <Card
        border="light"
        className="shadow-sm flex-fill"
        style={{ maxWidth: maxWidth, minWidth: minWidth }}
      >
        <Card.Body className="px-2 py-0">
          <div className="container p-0 d-flex">
            {!disabledHours && (
              <SelectorComponent ref={ref.ref1}>
                {{
                  // className:"pe-1",
                  ariaLabel: ariaLabel + "_hour",
                  value: currentHour,
                  type: "time",
                  id: "hour",
                  availableValues: availableHours,
                  onClick: handleButtonClicks,
                  disabled: true,
                  onFocus: onFocus,
                  onBlur: onBlur,
                  maxWidth: disabledMinutes
                    ? maxWidth
                    : parseInt(maxWidth) / 2 - 30 + "px",
                }}
              </SelectorComponent>
            )}
            {!disabledHours && !disabledMinutes && !hideDelimiter && (
              <Delimiter value={delimiter}></Delimiter>
            )}
            {!disabledMinutes && (
              <SelectorComponent ref={ref.ref2}>
                {{
                  // className="ps-1"
                  ariaLabel: ariaLabel + "_minute",
                  id: "minute",
                  type: "time",
                  value: currentMinute,
                  availableValues: availableMinutes,
                  onClick: handleButtonClicks,
                  disabled: true,
                  onFocus: onFocus,
                  onBlur: onBlur,
                  maxWidth: disabledHours
                    ? maxWidth
                    : parseInt(maxWidth) / 2 - 30 + "px",
                }}
              </SelectorComponent>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  }
);
function Delimiter(props) {
  if (props.value)
    return (
      <>
        <div className="container-fluid px-2 py-0 justify-content-center d-flex">
          <h5 className="text-center m-0  d-flex justify-content-center align-self-center">
            {props.value}
          </h5>
        </div>
      </>
    );
  return <></>;
}

const SelectorComponent = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      ariaLabel,
      id,
      disabled = false,
      onChange,
      value,
      onClick,
      availableValues,
      type,
      minWidth = "30px",
      maxWidth = "60px",
      onFocus,
      onBlur,
    } = children;
    const children2 = {
      id: id + "_selectorComponent",
      type,
      value,
      minWidth,
      maxWidth,
      onChange,
      className: "text-end m-0 text-nowrap pe-1 ",
      availableValues,
      onFocus,
      onBlur,
      disabled,
      maxRows: 1,
    };
    return (
      <div
        className={
          "container-fluid px-0 py-0 justify-content-center " + className
        }
      >
        <div className="d-flex px-0 py-1">
          <span className="flex-fill"></span>
          <Button
            data-testid="incr"
            aria-label={ariaLabel + "_incr"}
            id={"Btn_" + id + "_incr"}
            style={{ width: "30px" }}
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            className="text-center  flex-fill text-nowrap noboxshadow p-0"
            variant="white"
          >
            <FontAwesomeIcon className="mt-2" icon={faSortUp}></FontAwesomeIcon>
          </Button>
          <span className=" flex-fill"></span>
        </div>
        <div className="d-flex px-0 py-1 justify-content-center">
          <MyTextArea ref={ref}>{children2}</MyTextArea>
        </div>

        <div className="d-flex px-0 py-1">
          <span className="flex-fill"></span>
          <Button
            data-testid="decr"
            aria-label={ariaLabel + "_decr"}
            id={"Btn_" + id + "_decr"}
            style={{ width: "30px" }}
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            className="text-center  flex-fill text-nowrap noboxshadow p-0"
            variant="white"
          >
            <FontAwesomeIcon
              className="mt-2"
              icon={faSortDown}
            ></FontAwesomeIcon>
          </Button>
          <span className=" flex-fill"></span>
        </div>
      </div>
    );
  }
);
