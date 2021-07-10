import react, { useState, useEffect, useRef } from "react";
import { DummyWrapperRef } from "./DummyWrappers";
import { TimeSelectorDropdown } from "./DurationSelector/DurationSelector";
import { HourSelectorDropdown } from "./HourSelector";
import MyFormSelect from "./MyFormSelect";
import { DateSelectorDropdown } from "./MyOwnCalendar";
import { MyTextArea } from "./TextArea/MyTextArea";
import { convertToThousands } from "./util/utilities";
export const MyInput = (props) => {
  const {
    title,
    onChange,
    type,
    value,
    enabled,
    rows = 1,
    minWidth = "20px",
    maxWidth = "150px",
    values = [],
    defaultValue = "Select " + value,
    validation = false,
    invalidation = false,
    errorMessage,
    measurement = "",
    id = "inputModal-",
  } = props;
  const ref = useRef(null);
  const [newValue, setNewValue] = useState(value);
  function handleOnChange(change) {
    // console.log('ready to update db')
    console.log("value for DB: " + newValue + " ===> " + change);
    setNewValue(change);
  }
  // const data = {
  //   minWidth,
  //   maxWidth,
  //   isValid,
  //   isInvalid,
  //   dummyWrapperRef,
  //   imgInvalid,
  //   imgValid,
  //   dummyTextRef,
  //   measurement,
  //   change,
  //   outsideBorder,
  //   measurementClassName,
  // };

  if (!enabled) {
    return (
      <DummyWrapperRef
        data={{
          minWidth,
          maxWidth,
          isValid: false,
          isInvalid: false,
          measurement,
          change:
            type === "number" || type === "distance"
              ? convertToThousands(value)
              : value,
          hidden: false,
          outsideBorder: "border-0",
          textWrap: true,
        }}
      ></DummyWrapperRef>
    );
  } else if (type === "text") {
    return (
      <>
        <MyTextArea ref={ref}>
          {{
            label: title,
            id,
            maxRows: 5,
            onChange: handleOnChange,
            value: newValue,
            validation,
            invalidation,
            errorMessage,
            minWidth,
          }}
        </MyTextArea>
      </>
    );
  } else if (type === "number" || type === "distance") {
    return (
      <MyTextArea ref={ref}>
        {{
          label: title,
          id,
          maxRows: 3,
          type: "number",
          value: newValue,
          validation,
          invalidation,
          errorMessage,
          onChange: handleOnChange,
          minWidth,
          maxWidth,
          measurement,
        }}
      </MyTextArea>
    );
  } else if (type === "date") {
    return (
      <>
        <DateSelectorDropdown
          id={id}
          value={newValue}
          onChange={handleOnChange}
          validation={validation}
          invalidation={invalidation}
          minWidth={minWidth}
          maxWidth={maxWidth}
          maxRows={2}
        ></DateSelectorDropdown>
      </>
    );
  } else if (type === "constant") {
    return (
      <MyFormSelect
        label={title}
        id={id}
        values={values}
        onChange={handleOnChange}
        defaultValue={value}
        minWidth={minWidth}
        maxWidth={maxWidth}
        validation={validation}
        invalidation={invalidation}
      />
    );
  } else if (type === "time") {
    return (
      <TimeSelectorDropdown ref={ref}>
        {{
          id,
          value: newValue,
          type: "time",
          onChange: handleOnChange,
          validation: false,
          invalidation: true,
          minWidth,
          maxWidth,
          measurement,
        }}
      </TimeSelectorDropdown>
    );
  } else if (type === "duration") {
    return (
      <TimeSelectorDropdown ref={ref}>
        {{
          id,
          value: newValue,
          type: "duration",
          validation: false,
          invalidation: true,
          minWidth,
          maxWidth,
          onChange: handleOnChange,
          isUnlimited: true,
          disabledMinutes: true,
        }}
      </TimeSelectorDropdown>
    );
  } else {
    <div>{newValue}</div>;
  }
};
