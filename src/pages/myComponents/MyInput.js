import React, { useState, useEffect, useRef } from "react";
import { DummyWrapperRef } from "./DummyWrappers";
import { TimeSelectorDropdown } from "./DurationSelector/DurationSelector";
import { HourSelectorDropdown } from "./HourSelector";
import { FormSelectArea, MyFormSelect } from "./MyFormSelect";
import { DateSelectorDropdown } from "./MyOwnCalendar";
import MyTextArea from "./TextArea/MyTextArea";

import { calcValidation, convertToThousands } from "./util/utilities";
const MyInput = (props) => {
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
    labelId = "",
  } = props;
  const ref = useRef(null);
  const [newValue, setNewValue] = useState(value);
  const [valid, setValid] = useState(false);
  function handleOnChange(value) {
    // setValid(calcValidation(value));
    // setNewValue(value);
    if (value !== newValue) {
      // console.log("value for DB: " + newValue + " ===> " + value);
      setNewValue(value);
      onChange && onChange(id, value, labelId);
    }
    // onChange(value);
  }
  if (type !== "date") {
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
            // disabled: !enabled,
            disabled: false,
          }}
        </MyTextArea>
      </>
    );
  }
  // if (type === "date") {
  //   return (
  //     <>
  //       <MyTextArea ref={ref}>
  //         {{
  //           label: title,
  //           id,
  //           maxRows: 5,
  //           onChange: handleOnChange,
  //           value: newValue,
  //           validation,
  //           invalidation,
  //           errorMessage,
  //           minWidth,
  //           disabled: !enabled,
  //         }}
  //       </MyTextArea>
  //     </>
  //   );
  // }
  // else if (type === "number" || type === "distance") {
  //   return (
  // <MyTextArea ref={ref}>
  //       {{
  //         label: title,
  //         id,
  //         maxRows: 3,
  //         type: "number",
  //         value: newValue,
  //         validation,
  //         invalidation,
  //         errorMessage,
  //         onChange: handleOnChange,
  //         minWidth,
  //         maxWidth,
  //         measurement,
  //         disabled: !enabled,
  //       }}
  //     </MyTextArea>
  //   );
  // } else if (type === "date") {
  //   return (
  //     <>
  //       <DateSelectorDropdown
  //         id={id}
  //         value={newValue}
  //         onChange={handleOnChange}
  //         validation={validation}
  //         invalidation={invalidation}
  //         minWidth={minWidth}
  //         maxWidth={maxWidth}
  //         maxRows={2}
  //         disabled={!enabled}
  //       ></DateSelectorDropdown>
  //     </>
  //   );
  // } else if (type === "constant") {
  //   return (
  //     <FormSelectArea
  //       label={title}
  //       id={id}
  //       values={values}
  //       onChange={handleOnChange}
  //       defaultValue={value}
  //       minWidth={minWidth}
  //       maxWidth={maxWidth}
  //       validation={validation}
  //       invalidation={invalidation}
  //       disabled={!enabled}
  //     />
  //   );
  // } else if (type === "time") {
  //   return (
  //     <TimeSelectorDropdown ref={ref}>
  //       {{
  //         id,
  //         value: newValue,
  //         type: "time",
  //         onChange: handleOnChange,
  //         validation: false,
  //         invalidation: true,
  //         minWidth,
  //         maxWidth,
  //         measurement,
  //         disabled: !enabled,
  //       }}
  //     </TimeSelectorDropdown>
  //   );
  // } else if (type === "duration") {
  //   return (
  //     <TimeSelectorDropdown ref={ref}>
  //       {{
  //         id,
  //         value: newValue,
  //         type: "duration",
  //         validation: false,
  //         invalidation: true,
  //         minWidth,
  //         maxWidth,
  //         onChange: handleOnChange,
  //         isUnlimited: true,
  //         disabledHours: true,
  //         dropdownMinWidth: "10px",
  //         dropdownMaxWidth: "250px",
  //         disabled: !enabled,
  //       }}
  //     </TimeSelectorDropdown>
  //   );
  // } else {
  //   <div>{newValue}</div>;
  // }
};

export default React.memo(MyInput);
