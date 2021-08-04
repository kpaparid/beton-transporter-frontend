import React, { Suspense } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { MyFormSelect } from "./MyFormSelect";
import { DateSelectorDropdown } from "./MyOwnCalendar";
const LazyComponent = React.memo((props) => {
  const {
    onBlur,
    onChange,
    data: { value, type },
  } = props;
  function handleTextAreaChange(e) {
    onChange(e.target.value);
  }

  switch (type) {
    case "date":
      return <DateSelectorDropdown {...props} value={value} />;
    case "constant":
      return (
        <MyFormSelect
          {...props.data}
          onChange={handleTextAreaChange}
          value={value}
          labelIsDisabled
        />
      );
    default:
      return (
        <TextareaAutosize
          onBlur={onBlur}
          value={value}
          onChange={handleTextAreaChange}
        />
      );
  }
});
export default LazyComponent;
