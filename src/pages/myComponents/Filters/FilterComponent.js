import { memo, useCallback, useMemo } from "react";

import { debounce, isEqual } from "lodash";
import { MyCheckboxFilter } from "../MyCheckbox";
import { TimeSelectorRange } from "../TextArea/TimePicker";
import { MyRangeSlider } from "../MyRangeSlider";
import { DateSelector } from "../TextArea/DatePicker";
import { useSelector } from "react-redux";
const FilterComponent = memo((props) => {
  const { type, selectData, label, idx, ...rest } = props;
  const selector = useCallback(
    (state) => selectData(state, { label, idx }),
    [label, idx]
  );
  const data = useSelector(selector);
  switch (type) {
    case "checkbox":
      return <CheckboxWrapper {...rest} data={data} label={label} />;
    case "time":
      return <TimeWrapper {...rest} data={data} label={label}></TimeWrapper>;
    case "range":
      return <RangeWrapper {...rest} data={data} label={label} />;
    case "date":
      return <DateWrapper {...rest} data={data} label={label} />;
    default:
      return <div>error</div>;
  }
}, isEqual);

const CheckboxWrapper = memo(
  ({ onToggleCheckbox, onToggleAllCheckbox, label, data, ...rest }) => {
    const toggleOne = useCallback(
      (value) => {
        onToggleCheckbox({ label, value });
      },
      [label]
    );
    const toggleAll = useCallback(() => {
      onToggleAllCheckbox({ label });
    }, [label]);

    const rows = useMemo(() => data.rows, [data]);
    const checkedAll = useMemo(() => data.checkedAll, [data]);
    return (
      <MyCheckboxFilter
        {...rest}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        checkedAll={checkedAll}
        rows={rows}
      />
    );
  },
  isEqual
);
const RangeWrapper = memo(({ onChangeRange, label, data, ...rest }) => {
  const handleChangeRangeSlider = useCallback((values) => {
    onChangeRange({ label, gte: values[0], lte: values[1] });
  }, []);
  const debouncedChangeRangeSlider = debounce(handleChangeRangeSlider, 800);

  return (
    <MyRangeSlider {...rest} {...data} onChange={debouncedChangeRangeSlider} />
  );
}, isEqual);

const TimeWrapper = memo(({ onChangeRange, label, data }) => {
  const handleChangeTimePicker = useCallback(({ gte, lte }) => {
    onChangeRange({ label, gte, lte });
  }, []);
  return <TimeSelectorRange onChange={handleChangeTimePicker} {...data} />;
}, isEqual);
const DateWrapper = memo(({ onChangeRange, onReset, data, label, ...rest }) => {
  const dateChange = useCallback(
    (dates) => {
      dates.length === 2 &&
        onChangeRange({ label, gte: dates[0], lte: dates[1] });
      dates.length === 0 && onReset({ label });
    },
    [label]
  );
  return (
    <DateSelector
      {...data}
      style={{ width: "100%" }}
      disableMonthSwap
      onChange={dateChange}
    />
  );
}, isEqual);

export default FilterComponent;
