import moment from "moment";
import {
  addValueToString,
  addValueToTimeUnit,
  calcInvalidation,
  calcValidation,
  clearThousandsSeparators,
  convertToThousands,
  formatTime,
  parseBigInt,
  removeLeadingZeroes,
  validateNumber,
} from "../utilities";
test("handleChangeTextArea", () => {
  const convertToTime = (value) =>
    formatTime({
      time: value,
      isUnlimited: true,
      // disableInitialization,
    });
  function handleChangeTextArea(value, text) {
    const vl = formatTime({
      time: value,
      disableInitialization: true,
    });
    console.log(vl);
    const valid = calcValidation(vl, "time");
    console.log(valid);
    return !valid ? vl : text !== convertToTime(value) && convertToTime(value);
  }

  expect(handleChangeTextArea("15d")).toBe("15d");
  expect(handleChangeTextArea("15d:23")).toBe("15d:23");
  expect(handleChangeTextArea(":15d")).toBe(":15d");
});

test("formatTime default", () => {
  expect(formatTime({ time: "15:23" })).toBe("15:23");
});
test("formatTime disabledInitialization", () => {
  expect(formatTime({ time: "15:2d3", disableInitialization: true })).toBe(
    "15:2d3"
  );
  expect(formatTime({ time: "152d3", disableInitialization: true })).toBe(
    "152d3"
  );
  expect(
    formatTime({
      time: "152d3",
      disableInitialization: true,
      disabledHours: true,
    })
  ).toBe("00:152d3");
  expect(
    formatTime({
      time: "152d3",
      disableInitialization: true,
      disabledMinutes: true,
    })
  ).toBe("152d3:00");
});
test("formatTime text", () => {
  expect(formatTime({ time: "15asd" })).toBe("15:00");
  expect(formatTime({ time: "15asd", disabledHours: true })).toBe("00:15");
  expect(formatTime({ time: "asd" })).toBe("00:00");
});
test("formatTime Empty Delimiter", () => {
  expect(formatTime({ time: "15" })).toBe("15:00");
  expect(formatTime({ time: "65" })).toBe("00:00");
});
test("formatTime Empty Value", () => {
  expect(formatTime({ time: "" })).toBe("00:00");
  expect(formatTime({ time: "    " })).toBe("00:00");
});
test("formatTime Disabled Unit", () => {
  expect(formatTime({ time: "15:23", disabledHours: true })).toBe("00:23");
  expect(formatTime({ time: "15:23", disabledMinutes: true })).toBe("15:00");
});
test("formatTime Unlimited", () => {
  expect(
    formatTime({ time: "65", disabledMinutes: true, isUnlimited: true })
  ).toBe("65:00");
  expect(
    formatTime({ time: "621231232112312321312321", isUnlimited: true })
  ).toBe("621231232112312321312321:00");
  expect(formatTime({ time: "600:655" })).toBe("00:00");
  expect(formatTime({ time: "65:655", isUnlimited: true })).toBe("65:655");
});
test("formatTime LeadingZeroes", () => {
  expect(formatTime({ time: "6:2", leadingZeros: false })).toBe("6:2");
  expect(formatTime({ time: "6:2" })).toBe("06:02");
});
test("formatTime reset", () => {
  console.log("-01".replace(/[^\d.-]/g, ""));
  expect(
    formatTime({ time: "06:-01", disableReset: true, isUnlimited: true })
  ).toBe("06:00");
  expect(formatTime({ time: "06:-01" })).toBe("06:59");
  expect(formatTime({ time: "-1:00" })).toBe("23:00");
  expect(formatTime({ time: "-1:00", disableReset: true })).toBe("00:00");
});
test("formatTime availableValues", () => {
  expect(
    formatTime({
      time: "23:65",
      isUnlimited: true,
      availableMinutes: [23],
      availableHours: [65],
    })
  ).toBe("23:65");
  expect(
    formatTime({ time: "12:25", availableMinutes: [], availableHours: [] })
  ).toBe("00:00");
});
test("validateNumber", () => {
  expect(validateNumber(20)).toBe(true);
  expect(validateNumber("20")).toBe(true);
  expect(validateNumber("20a")).toBe(false);
});
test("convertNumber", () => {
  expect(convertToThousands(2000)).toBe("2.000");
  expect(convertToThousands("2000")).toBe("2.000");
  expect(convertToThousands("2d00")).toBe("2d00");
  expect(convertToThousands("6211232333223232132131321321")).toBe(
    "6.211.232.333.223.232.132.131.321.321"
  );
});
test("parseBigNumber", () => {
  expect(parseBigInt("1111222233334444555566")).toBe("1111222233334444555566");
  expect(parseBigInt("-1")).toBe("-1");
  expect(parseBigInt("-00001")).toBe("-1");
  expect(parseBigInt("-    00001")).toBe("-1");
  expect(parseBigInt("6.211.232.333.223.232.132.131.321.321")).toBe(
    "6211232333223232132131321321"
  );
});
test("leadingZeroes", () => {
  expect(removeLeadingZeroes("1", 2)).toBe("01");
  expect(removeLeadingZeroes("1000", 2)).toBe("1000");
  expect(removeLeadingZeroes("0001")).toBe("1");
  expect(removeLeadingZeroes("-0001")).toBe("-1");
  expect(removeLeadingZeroes("-0001", 3)).toBe("-01");
  expect(removeLeadingZeroes("-0001", 10)).toBe("-000000001");
});
test("addValueToUnit", () => {
  expect(addValueToString("1", 1)).toBe("2");
  expect(addValueToString("999", 1)).toBe("1000");
  expect(addValueToString("999", "1")).toBe("1000");
  expect(addValueToString("1", 1)).toBe("2");
  expect(addValueToString(1, 1)).toBe("2");
  expect(addValueToString("1111222233334444555566", 1)).toBe(
    "1111222233334444555567"
  );
});
test("addValueToUnit", () => {
  expect(addValueToTimeUnit("01", 1)).toBe("02");
  expect(addValueToTimeUnit("1", 1)).toBe("02");
  expect(addValueToTimeUnit(1, 1)).toBe("02");
});
test("clearThousandsSeparators", () => {
  expect(clearThousandsSeparators("111.222,333")).toBe("111222333");
});
test("calcValidation", () => {
  expect(calcValidation("12/10/2021", "date")).toBe(true);
  expect(calcValidation("12/10/20255", "date")).toBe(false);

  expect(calcValidation("text", "text")).toBe(true);
  expect(calcValidation("")).toBe(true);

  expect(calcValidation("12:30", "time")).toBe(true);
  expect(calcValidation("12:3d0", "time")).toBe(false);
  expect(calcValidation("152:30", "time")).toBe(false);
  expect(calcValidation("152:30", "time", true, true)).toBe(true);
  expect(calcValidation("152:310", "time", true, true)).toBe(true);
  expect(calcValidation("152:3d10", "time", true, true)).toBe(false);

  expect(calcValidation("15210", "number")).toBe(true);
  expect(calcValidation("15.210", "number")).toBe(true);
  expect(calcValidation("15.2d10", "number")).toBe(false);
  expect(calcValidation("15.2.10", "number")).toBe(false);
  expect(calcValidation("152.10", "number")).toBe(false);
  expect(calcValidation("30", "number", true)).toBe(true);
  expect(calcInvalidation("30", "number", true)).toBe(false);

  expect(calcInvalidation("13/11/2021", "date", true)).toBe(false);
  expect(calcInvalidation("13/11/2d021", "date", true)).toBe(true);
});
