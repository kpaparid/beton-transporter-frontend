import { formatTime } from "../utilities";
import { screen } from "@testing-library/react";

// formatTime(
//   time,
//   disabledHours,
//   disabledMinutes,
//   delimiter,
//   disableReset,
//   isUnlimited,
//   leadingZeros,
//   availableMinutes,
//   availableHours
// );

test("formatTime default", () => {
  expect(formatTime("15:23")).toBe("15:23");
});
test("formatTime text", () => {
  expect(formatTime("15asd")).toBe("15:00");
  expect(formatTime("15asd", true)).toBe("00:15");
  expect(formatTime("asd")).toBe("00:00");
});
test("formatTime Empty Delimiter", () => {
  expect(formatTime("15")).toBe("15:00");
  expect(formatTime("65")).toBe("00:00");
});
test("formatTime Empty Value", () => {
  expect(formatTime("")).toBe("00:00");
  expect(formatTime("    ")).toBe("00:00");
});
test("formatTime Disabled Unit", () => {
  expect(formatTime("15:23", true, false, ":", false, true, true)).toBe(
    "00:23"
  );
  expect(formatTime("15:23", false, true, ":", false, true, true)).toBe(
    "15:00"
  );
});
test("formatTime Unlimited", () => {
  expect(formatTime("65", false, false, ":", false, true, true)).toBe("65:00");
  expect(formatTime("600:655", true, false, ":", false, false, true)).toBe(
    "00:00"
  );
  expect(formatTime("65:655", false, false, ":", false, true, true)).toBe(
    "65:655"
  );
});
test("formatTime LeadingZeroes", () => {
  expect(formatTime("6:2", false, false, ":", false, true, false)).toBe("6:2");
  expect(formatTime("6:2", false, false, ":", false, true, true)).toBe("06:02");
});
test("formatTime reset", () => {
  expect(formatTime("06:-01", false, false, ":", true, true, true)).toBe(
    "06:00"
  );
  expect(formatTime("06:-01", false, false, ":", false, false, true)).toBe(
    "06:59"
  );
  expect(formatTime("-1:00", false, false, ":", false, false, true)).toBe(
    "23:00"
  );
  expect(formatTime("-1:00", false, false, ":", true, false, true)).toBe(
    "00:00"
  );
});
test("formatTime availableValues", () => {
  expect(
    formatTime("23:65", false, false, ":", false, true, false, [23], [65])
  ).toBe("23:65");
  expect(
    formatTime("12:25", false, false, ":", false, false, true, [], [])
  ).toBe("00:00");
});
