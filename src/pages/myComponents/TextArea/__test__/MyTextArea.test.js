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
} from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";
import { MyTextArea } from "../MyTextArea";

function MyOuterComponent(props) {
  const [newValue, setNewValue] = useState(props.value);
  function handleOnChange(change) {
    setNewValue(change);
  }
  const ref = useRef(null);
  return (
    <MyTextArea ref={ref}>
      {{
        onChange: handleOnChange,
        value: newValue,
        type: props.type,
        id: "test",
        ariaLabel: "test",
      }}
    </MyTextArea>
  );
}
test("change number values via the fireEvent.keyDown method", async () => {
  render(<MyOuterComponent type="number" value={1500} />);
  fireEvent.keyDown(screen.getByLabelText("test_test"), {
    key: "2",
    target: { selectionStart: 5 },
  });
  await expect(screen.getByLabelText("test_test")).toHaveValue("15.002");
});
test("number entry 0 at the start", async () => {
  render(<MyOuterComponent type="number" value={1500} />);
  fireEvent.keyDown(screen.getByLabelText("test_test"), {
    key: "0",
    target: { selectionStart: 0 },
  });
  await expect(screen.getByLabelText("test_test")).toHaveValue("1.500");
});
test("form numbers with thousands separators", async () => {
  render(<MyOuterComponent type="number" value={1500} />);
  await expect(screen.getByLabelText("test_test")).toHaveValue("1.500");
});
test("form empty number with comma entry", async () => {
  render(<MyOuterComponent type="number" value={""} />);
  fireEvent.keyDown(screen.getByLabelText("test_test"), {
    key: ",",
    target: { selectionStart: 1 },
  });
  await expect(screen.getByLabelText("test_test")).toHaveValue("0,");
});
test("Backspace number from 3", async () => {
  render(<MyOuterComponent type="number" value={123456789} />);
  fireEvent.keyDown(screen.getByLabelText("test_test"), {
    key: "Backspace",
    target: { selectionStart: 3, selectionEnd: 3 },
  });
  await expect(screen.getByLabelText("test_test")).toHaveValue("12.456.789");
  await expect(screen.getByLabelText("test_test").selectionStart).toBe(2);
});
test("Backspace text from 3 to 5", async () => {
  render(<MyOuterComponent type="text" value={"123456789"} />);
  fireEvent.keyDown(screen.getByLabelText("test_test"), {
    key: "Backspace",
    target: { selectionStart: 2, selectionEnd: 5 },
  });
  await expect(screen.getByLabelText("test_test")).toHaveValue("126789");
  await expect(screen.getByLabelText("test_test").selectionStart).toBe(2);
});
test("Delete text from 3 to 5", async () => {
  render(<MyOuterComponent type="number" value={"123456789"} />);
  fireEvent.keyDown(screen.getByLabelText("test_test"), {
    key: "Delete",
    target: { selectionStart: 2, selectionEnd: 5 },
  });
  await expect(screen.getByLabelText("test_test")).toHaveValue("1.256.789");
  await expect(screen.getByLabelText("test_test").selectionStart).toBe(3);
});
test("Delete Number text from 3", async () => {
  render(<MyOuterComponent type="number" value={123456789} />);
  fireEvent.keyDown(screen.getByLabelText("test_test"), {
    key: "Delete",
    target: { selectionStart: 3, selectionEnd: 3 },
  });
  await expect(screen.getByLabelText("test_test")).toHaveValue("12.356.789");
  await expect(screen.getByLabelText("test_test").selectionStart).toBe(4);
});
