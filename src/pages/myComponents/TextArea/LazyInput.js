import React, {
  forwardRef,
  memo,
  useCallback,
  useRef,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
import { MyFormSelect } from "../MyFormSelect";
// import { LazyLoad } from "react-observer-api";
import TextareaAutosize from "react-textarea-autosize";
import { isEqual } from "lodash";
import TimePicker from "./TimePicker";
// import { DateSelectorDropdown } from "./DatePicker";
import moment from "moment";
import { ComponentPreLoader } from "../../../components/ComponentPreLoader";
import DateSelectorDropdown from "./DatePicker";

const Lazer = React.lazy(() => import("./DatePicker"));

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
                className={inputClassName}
                value={value}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ minWidth, maxWidth }}
              />
            );

          case "bigNumber":
            return (
              <TextareaAutosize
                className={inputClassName}
                value={value}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ minWidth, maxWidth }}
              />
            );
          case "time":
            return (
              <TimePicker
                className={inputClassName}
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
              ? moment(value, "DD.MM.YYYY").format("YYYY/MM/DD")
              : value;
            return (
              <DateSelectorDropdown
                singleDate={true}
                className={className}
                onChange={handleDateChange}
                format="DD.MM.YYYY"
                disableMonthSwap={disableMonthSwap}
                inputStyle={{ minWidth, maxWidth }}
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
        inputClassName,
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
