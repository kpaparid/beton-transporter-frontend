// import dependencies
import React, { useState, useCallback, useRef } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
// import react-testing methods
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  screen,
  getAllByTestId,
} from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";
import { TimeSelector } from "../DurationSelector";
import { MyTextArea } from "../../TextArea/MyTextArea";
function MyOuterComponent(props) {
  const {
    value,
    isUnlimited = false,
    disabledHours = false,
    disabledMinutes = false,
    disableReset = false,
  } = props;
  const [newValue, setNewValue] = useState(value);
  function handleOnChange(value) {
    setNewValue(value);
  }
  return (
    <>
      <MyTextArea>
        {{ value: newValue, id: "test", ariaLabel: "test" }}
      </MyTextArea>
      <TimeSelector>
        {{
          ariaLabel: "test",
          id: "test",
          time: newValue,
          isUnlimited: isUnlimited,
          disabledHours,
          disabledMinutes,
          disableReset,
          onChange: handleOnChange,
        }}
      </TimeSelector>
    </>
  );
}
test("increase minute on 59-unlimited", async () => {
  render(<MyOuterComponent value={"12:59"} isUnlimited />);
  fireEvent.click(screen.getByLabelText("test_minute_incr"));
  await expect(screen.getByLabelText("test_test")).toHaveValue("12:60");
});
test("increase minute on 59-limited", async () => {
  render(<MyOuterComponent value={"12:59"} />);
  fireEvent.click(screen.getByLabelText("test_minute_incr"));
  await expect(screen.getByLabelText("test_test")).toHaveValue("12:00");
});
test("increase hour on 23-unlimited", async () => {
  render(<MyOuterComponent value={"23:00"} isUnlimited />);
  fireEvent.click(screen.getByLabelText("test_hour_incr"));
  await expect(screen.getByLabelText("test_test")).toHaveValue("24:00");
});
test("increase hour on 23-limited", async () => {
  render(<MyOuterComponent value={"23:00"} />);
  fireEvent.click(screen.getByLabelText("test_hour_incr"));
  await expect(screen.getByLabelText("test_test")).toHaveValue("00:00");
});
test("increase minute on 150 disabled-unlimited", async () => {
  const { debug } = render(
    <MyOuterComponent value={"150"} disabledHours isUnlimited />
  );
  fireEvent.click(screen.getByLabelText("test_minute_incr"));
  await expect(screen.getByLabelText("test_test")).toHaveValue("00:151");
});
