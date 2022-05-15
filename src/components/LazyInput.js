import { isEqual } from "lodash";
import moment from "moment";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import { AddressPicker } from "./AddressPicker";
import { ComponentPreLoader } from "./ComponentPreLoader";
import DateSelectorDropdown, { DateResponsivePicker } from "./DatePicker";
import { MyFormSelect } from "./MyFormSelect";
import TimePicker, { TimeResponsivePicker } from "./TimePicker";

export const LazyInput = memo(
  forwardRef(
    (
      {
        onChange,
        type,
        availableValues,
        disableMonthSwap,
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
          return onChange && onChange(e.target.value, "text");
        },
        [onChange]
      );
      const handleDateChange = useCallback(
        (value) => {
          return onChange && onChange(value, "date");
        },
        [onChange]
      );
      const handleDefaultChange = useCallback(
        (value) => {
          return onChange && onChange(value, "text");
        },
        [onChange]
      );
      const handleOutsideClick = useCallback(() => {
        domRef.current.focus();
      }, [domRef]);
      const [show, setShow] = useState(true);
      useEffect(() => {
        setShow(false);
      }, []);
      const renderComponent = useCallback(() => {
        switch (type) {
          case "bigText":
            return (
              <TextareaAutosize
                // className={inputClassName}
                value={value}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ minWidth, maxWidth }}
              />
            );

          case "bigNumber":
            return (
              <TextareaAutosize
                // className={inputClassName}
                value={value}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ minWidth, maxWidth }}
              />
            );
          case "time":
            return (
              <TimeResponsivePicker
                className={"time-picker-grid-table " + className}
                dropdownClassName={"time-picker-grid-table-dropdown"}
                value={value}
                onChange={handleDefaultChange}
                inputStyle={{ minWidth, maxWidth }}
              />
            );
          case "constant":
            return (
              <MyFormSelect
                className={className}
                onChange={handleDefaultChange}
                availableValues={availableValues}
                value={value}
                minWidth={minWidth}
                maxWidth={maxWidth}
                labelIsDisabled
              />
            );

          case "date":
            const v = moment(value, "DD.MM.YYYY", true).isValid()
              ? moment(value, "DD.MM.YYYY").format("YYYY.MM.DD")
              : value;
            return (
              <DateResponsivePicker
                singleDate={true}
                className={"date-picker-grid-table " + className}
                dropdownClassName={"date-picker-grid-table-dropdown"}
                onChange={handleDateChange}
                format="DD.MM.YYYY"
                disableMonthSwap={disableMonthSwap}
                inputStyle={{ minWidth, maxWidth }}
                value={v}
              />
            );
          case "navi":
            return (
              <AddressPicker
                value={value}
                onChange={handleDefaultChange}
                inputStyle={{ minWidth, maxWidth }}
              />
            );
          case "customComponent":
            return value;
          case "nonEditable":
            return (
              <div className={"d-block text-center disabled" + className}>
                {value || ""}
              </div>
            );
          default:
            return (
              <div
                onClick={handleOutsideClick}
                className={"d-block text-center w-100" + className}
              >
                <input
                  className={"px-2 text-center"}
                  type={type === "number" ? "number" : "text"}
                  value={value || ""}
                  onChange={handleTextAreaChange}
                  ref={domRef}
                  style={{ minWidth, maxWidth }}
                  autoFocus={false}
                />
              </div>
            );
        }
      }, [
        className,
        disableMonthSwap,
        domRef,
        handleDateChange,
        handleOutsideClick,
        maxWidth,
        minWidth,
        type,
        value,
        handleTextAreaChange,
        handleDefaultChange,
        availableValues,
      ]);
      return (
        <>
          {show && (
            <div style={{ width: maxWidth }}>
              <ComponentPreLoader show={show} logo={false}></ComponentPreLoader>
            </div>
          )}
          {!show && renderComponent()}
        </>
      );
    }
  ),
  isEqual
);
export default LazyInput;
