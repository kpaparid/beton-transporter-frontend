import { forwardRef, memo, useCallback, useRef, lazy } from "react";
import { MyFormSelect } from "../MyFormSelect";
// import { LazyLoad } from "react-observer-api";
import TextareaAutosize from "react-textarea-autosize";
import { isEqual } from "lodash";
import TimePicker from "./TimePicker";
import { DateSelectorDropdown } from "./DatePicker";
import moment from "moment";

export const LazyInput = memo(
  forwardRef(
    (
      {
        onChange,
        type,
        availableValues,
        disableMonthSwap,
        inputClassName = "",
        className = "",
        modal = false,
        minWidth,
        maxWidth,
        value,
        ...rest
      },
      ref
    ) => {
      const backupRef = useRef(null);
      const domRef = ref ? ref : backupRef;

      const handleTextAreaChange = useCallback(
        (e) => {
          onChange && onChange(e.target.value, "text");
        },
        [onChange]
      );
      const handleDateChange = useCallback(
        (value) => {
          onChange && onChange(value, "date");
        },
        [onChange]
      );
      const handleDefaultChange = useCallback(
        (value) => {
          onChange && onChange(value, "text");
        },
        [onChange]
      );
      const handleOutsideClick = useCallback(() => {
        domRef.current.focus();
      }, [domRef]);

      switch (type) {
        case "bigText":
          return (
            <TextareaAutosize
              className={inputClassName}
              value={value}
              onChange={handleTextAreaChange}
              ref={domRef}
              style={{ width: maxWidth }}
            />
          );

        case "bigNumber":
          return (
            <TextareaAutosize
              className={inputClassName}
              value={value}
              onChange={handleTextAreaChange}
              ref={domRef}
              style={{ width: maxWidth }}
            />
          );
        case "time":
          return (
            <TimePicker
              className={inputClassName}
              value={value}
              onChange={handleDefaultChange}
              style={{ width: maxWidth }}
            />
          );
        case "constant":
          return (
            <MyFormSelect
              className={className}
              onChange={handleDefaultChange}
              availableValues={availableValues}
              value={value}
              maxWidth={maxWidth}
              minWidth={minWidth}
              labelIsDisabled
            />
          );
        case "date":
          const v = moment(value, "DD.MM.YYYY").format("YYYY/MM/DD");
          return (
            <DateSelectorDropdown
              singleDate={true}
              className={className}
              onChange={handleDateChange}
              format="DD.MM.YYYY"
              disableMonthSwap={disableMonthSwap}
              value={v}
            />
          );
        case "nonEditable":
          return (
            <div className={"d-block text-center disabled" + className}>
              {value}
            </div>
          );
        default:
          return (
            <div
              onClick={handleOutsideClick}
              className={"d-block text-center w-100" + className}
            >
              <input
                className={"text-center"}
                type={type === "number" ? "number" : "text"}
                // {...rest}

                value={value}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ width: maxWidth }}
                autoFocus={false}
              />
            </div>
          );
      }
    }
  ),
  isEqual
);
export default LazyInput;
