import { durationFormat, calcDurationAndFormat } from "../labels";
test("durationFormat default", () => {
  expect(durationFormat("03:30")).toBe("3h 30min");
  expect(durationFormat("5:1")).toBe("5h 1min");
  expect(durationFormat("")).toBe("");
  expect(durationFormat()).toBe("");
  expect(durationFormat("0:0")).toBe("");
  expect(durationFormat("2")).toBe("2h");
});
test("revertDurationFormat default", () => {
  expect(calcDurationAndFormat(["12:30", "22:34"])).toBe("10:4");
  expect(calcDurationAndFormat("")).toBe("0:0");
  expect(calcDurationAndFormat()).toBe("");
});
