import { Card } from "@themesberg/react-bootstrap";
import moment from "moment";
import React, { useState, useEffect, forwardRef, useRef } from "react";

import { MyDropdown } from "./MyDropdown";
import { Button } from "@themesberg/react-bootstrap";
import { MyTextArea } from "./TextArea/MyTextArea";

import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addValueToString, formatTime } from "./util/utilities";
export const HourSelectorDropdown = (props) => {
  const {
    format = "HH:mm",
    delimiter = ":",
    value = moment("00:00", format).format(format),
    id = "1",
    onChange,
    minWidth,
  } = props;
  const [text, setText] = useState(value);
  function handleChange(value) {
    console.log("Click " + value);
    setText(value);
  }
  useEffect(() => {
    onChange && onChange(text);
  }, [onChange, text]);
  const children = {
    id: "hour_selectorArea_" + id,
    type: "time",
    value: value,
    invalidation: true,
    minWidth: minWidth,
    delimiter: delimiter,
    onChange: handleChange,
  };
  const ref = useRef(null);
  const TextArea = <MyTextArea ref={ref}>{children}</MyTextArea>;
  const HourSelect = (
    <HourSelector
      id={"hour_selector_" + id}
      time={value}
      delimiter={delimiter}
      onChange={handleChange}
    />
  );

  const data = {
    ToggleComponent: TextArea,
    MenuComponent: HourSelect,
  };
  return (
    <>
      <MyDropdown {...data}></MyDropdown>
    </>
  );
};

export const HourSelector = (props) => {
  const {
    id,
    onFocus,
    onBlur,
    delimiter = ":",
    time = "00" + delimiter + "00",
    onChange,
    availableMinutes = [...Array(60).keys()],
    availableHours = [...Array(24).keys()],
  } = props;

  const currentHour =
    time.trim() === ""
      ? "00"
      : time.includes(":")
      ? time.split(delimiter)[0]
      : time.length === 1
      ? "0" + time
      : time;
  const currentMinute = !time.includes(":")
    ? "00"
    : time.split(delimiter)[1].length === 1
    ? "0" + time.split(delimiter)[1]
    : time.split(delimiter)[1];

  const [newTime, setNewTime] = useState(
    currentHour + delimiter + currentMinute
  );

  useEffect(() => {
    console.log("time changed: " + time);
    setNewTime(formatTime(time));
  }, [time]);

  useEffect(() => {
    onChange && onChange(newTime);
  }, [newTime, onChange]);

  function handleButtonClicks(event) {
    const id = event.currentTarget.id;
    console.log(currentHour + "\t" + id);
    switch (id) {
      case "incr_hour": {
        return currentHour === 23
          ? setNewTime(formatTime("00" + delimiter + currentMinute))
          : setNewTime(
              formatTime(
                addValueToString(currentHour, 1) + delimiter + currentMinute
              )
            );
      }
      case "decr_hour": {
        return currentHour === 0
          ? setNewTime(formatTime("23" + delimiter + currentMinute))
          : setNewTime(
              formatTime(
                addValueToString(currentHour, -1) + delimiter + currentMinute
              )
            );
      }
      case "incr_minute": {
        console.log("incr minute");
        return currentMinute === 59
          ? setNewTime(formatTime(currentHour + delimiter + "00"))
          : setNewTime(
              formatTime(
                currentHour + delimiter + addValueToString(currentMinute, 1)
              )
            );
      }
      case "decr_minute": {
        return currentMinute === 0
          ? setNewTime(formatTime(currentHour + delimiter + "59"))
          : setNewTime(
              formatTime(
                currentHour + delimiter + addValueToString(currentMinute, -1)
              )
            );
      }
      default:
        return "error";
    }
  }
  function handleHourTextAreaChange(value) {
    setNewTime(formatTime(value + delimiter + currentMinute));
  }
  function handleMinTextAreaChange(value) {
    setNewTime(formatTime(currentHour + delimiter + value));
  }

  const data = {
    onFocus,
    onBlur,
    id,
    currentHour,
    currentMinute,
    handleButtonClicks,
    handleHourTextAreaChange,
    handleMinTextAreaChange,
    availableMinutes,
    availableHours,
    delimiter,
  };
  return <HourSelectorComponent data={data}></HourSelectorComponent>;
};
export const HourSelectorComponent = (props) => {
  const {
    id,
    onFocus,
    onBlur,
    currentHour,
    currentMinute,
    delimiter,
    handleButtonClicks,
    disabledHours = false,
    disabledMinutes = false,
    handleHourTextAreaChange,
    handleMinTextAreaChange,
    maxWidth = "250px",
    minWidth = "80px",
  } = props.data;
  const { availableMinutes, availableHours } = props.data;
  return (
    <>
      <Card
        border="light"
        className="shadow-sm flex-fill"
        style={{ maxWidth: maxWidth, minWidth: minWidth }}
      >
        <Card.Body className="px-2 py-0">
          <div className="container p-0 d-flex">
            {!disabledHours && (
              <SelectorComponent
                className="pe-1"
                value={currentHour}
                type={"hour"}
                id={id + "_hour"}
                availableValues={availableHours}
                onChange={handleHourTextAreaChange}
                onClick={handleButtonClicks}
                disabled
                onFocus={onFocus}
                onBlur={onBlur}
                maxWidth={
                  disabledMinutes
                    ? maxWidth
                    : parseInt(maxWidth) / 2 - 30 + "px"
                }
              ></SelectorComponent>
            )}
            {!disabledHours && !disabledMinutes && (
              <Delimiter value={delimiter}></Delimiter>
            )}
            {!disabledMinutes && (
              <SelectorComponent
                className="ps-1"
                id={id + "_min"}
                type={"min"}
                value={currentMinute}
                availableValues={availableMinutes}
                onChange={handleMinTextAreaChange}
                onClick={handleButtonClicks}
                disabled
                onFocus={onFocus}
                onBlur={onBlur}
                maxWidth={
                  disabledMinutes
                    ? maxWidth
                    : parseInt(maxWidth) / 2 - 30 + "px"
                }
              ></SelectorComponent>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
function Delimiter(props) {
  const value = props.value;
  if (value)
    return (
      <>
        <div className="container-fluid px-2 py-0 justify-content-center d-flex">
          <h5 className="text-center m-0  d-flex justify-content-center align-self-center">
            {value}
          </h5>
        </div>
      </>
    );
  return <></>;
}
// export function HourComponent(props) {
//   const { onChange, value, onClick, availableValues, id, onFocus, onBlur } =
//     props;
//   const [focus, setFocus] = useState(false);

//   if (!isNaN(value))
//     return (
//       <>
//         <div
//           onClick={() => setFocus(!focus)}
//           className="container-fluid px-2 justify-content-center"
//         >
//           <div onClick={() => setFocus(!focus)} className="d-flex py-1">
//             <span className="flex-fill"></span>
//             <Button
//               id="incr_hour"
//               style={{ width: "30px" }}
//               onClick={onClick}
//               className="text-center  flex-fill text-nowrap noboxshadow p-0"
//               variant="white"
//             >
//               <FontAwesomeIcon
//                 className="mt-2"
//                 icon={faSortUp}
//               ></FontAwesomeIcon>
//             </Button>
//             <span className=" flex-fill"></span>
//           </div>
//           <div
//             onClick={() => setFocus(!focus)}
//             className="d-flex py-1 justify-content-center"
//           >
//             <MyTextArea
//               id={id + "_hourcomponent"}
//               type="hour"
//               value={value}
//               minWidth="60px"
//               onChange={onChange}
//               className="text-end m-0 text-nowrap pe-1 "
//               measurement="hour"
//               availableValues={availableValues}
//             />
//             {/* <MyTextArea measurement="hour"
//                             onFocus={()=>handleFocus('hour_textarea')}
//                             onBlur={()=>handleBlur('hour_textarea')}
//                             id={id + '_hourcomponent'}
//                             measurement="hour"
//                             minWidth='50px'
//                             maxWidth='100px'
//                             value={value}
//                             availableValues={availableValues}
//                             type="minute"
//                             onChange={onChange}
//                             rows={1}
//                             className="text-end m-0 text-nowrap pe-1 "
//                             type='hour' /> */}
//           </div>
//           <div onClick={() => setFocus(!focus)} className="d-flex py-1">
//             <span className="flex-fill"></span>
//             <Button
//               id="decr_hour"
//               style={{ width: "30px" }}
//               onClick={onClick}
//               className="text-center  flex-fill text-nowrap noboxshadow p-0"
//               variant="white"
//             >
//               <FontAwesomeIcon
//                 className="mt-2"
//                 icon={faSortDown}
//               ></FontAwesomeIcon>
//             </Button>
//             <span className=" flex-fill"></span>
//           </div>
//         </div>
//       </>
//     );
//   return <></>;
// }

// function MinuteComponent(props) {
//   if (!isNaN(props.value))
//     return (
//       <>
//         <SelectorComponent {...props}></SelectorComponent>
//       </>
//     );
//   return <></>;
// }
const SelectorComponent = (props) => {
  const {
    className = "",
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
  } = props;
  return (
    <div
      className={
        "container-fluid px-0 py-0 justify-content-center " + className
      }
    >
      <div className="d-flex px-0 py-1">
        <span className="flex-fill"></span>
        <Button
          id={"incr_" + type}
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
        <MyTextArea
          id={id + "_selectorComponent_" + type}
          type={type}
          value={value}
          minWidth={minWidth}
          maxWidth={maxWidth}
          onChange={onChange}
          className="text-end m-0 text-nowrap pe-1 "
          availableValues={availableValues}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          maxRows={1}
        />
      </div>

      <div className="d-flex px-0 py-1">
        <span className="flex-fill"></span>
        <Button
          id={"decr_" + type}
          style={{ width: "30px" }}
          onClick={onClick}
          onMouseDown={(e) => e.preventDefault()}
          className="text-center  flex-fill text-nowrap noboxshadow p-0"
          variant="white"
        >
          <FontAwesomeIcon className="mt-2" icon={faSortDown}></FontAwesomeIcon>
        </Button>
        <span className=" flex-fill"></span>
      </div>
    </div>
  );
};
