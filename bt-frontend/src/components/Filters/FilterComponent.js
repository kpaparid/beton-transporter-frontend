import { debounce, isEqual } from "lodash";
import { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { MyRangeSlider } from "../MyRangeSlider";
import { MyCheckboxFilter } from "..//MyCheckbox";
import { DateSelector } from "../DatePicker";
import { TimeSelectorRange } from "../TimePicker";

const FilterComponent = memo((props) => {
  const { type, selectData, label, idx, ...rest } = props;
  const selector = useCallback(
    (state) => selectData(state, { label, idx }),
    [label, idx, selectData]
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
      [label, onToggleCheckbox]
    );
    const toggleAll = useCallback(() => {
      onToggleAllCheckbox({ label });
    }, [label, onToggleAllCheckbox]);

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
  const handleChangeRangeSlider = useCallback(
    (values) => {
      onChangeRange({ label, gte: values[0], lte: values[1] });
    },
    [onChangeRange, label]
  );
  const debouncedChangeRangeSlider = debounce(handleChangeRangeSlider, 800);

  return (
    <MyRangeSlider {...rest} {...data} onChange={debouncedChangeRangeSlider} />
  );
}, isEqual);

const TimeWrapper = memo(({ onChangeRange, label, data }) => {
  const handleChangeTimePicker = useCallback(
    ({ gte, lte }) => {
      onChangeRange({ label, gte, lte });
    },
    [label, onChangeRange]
  );
  return <TimeSelectorRange onChange={handleChangeTimePicker} {...data} />;
}, isEqual);
const DateWrapper = memo(({ onChangeRange, onReset, data, label, ...rest }) => {
  const dateChange = useCallback(
    (dates) => {
      dates.length === 2 &&
        onChangeRange({ label, gte: dates[0], lte: dates[1] });
      dates.length === 0 && onReset({ label });
    },
    [label, onChangeRange, onReset]
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
