import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  memo,
  useRef,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import "../MyForm.css";
import { imgInvalid, imgValid, validationType } from "../MyConsts";
import { MyFormSelect } from "../MyFormSelect";
import { DateSelectorDropdown } from "../MyOwnCalendar";
import {
  calcInvalidation,
  calcValidation,
  formatInput,
} from "../util/utilities";
import { isEqual } from "lodash";
import LazyLoad from "react-lazyload";
// import DatePicker from "@mui/lab/DatePicker";

export const Input = memo((props) => {
  const {
    value = "",
    type = "text",
    extendable = false,
    editable = false,
    maxWidth = "150px",
    minWidth = "10px",
    style: inputStyle = {},
    lazyLoad = false,
    ...rest
  } = props;
  const isValid = useMemo(
    () => calcValidation(value + "", validationType(type), false),
    [value, type]
  );
  const isInvalid = useMemo(
    () => calcInvalidation(value + "", validationType(type), true),
    [value, type]
  );

  const img = useMemo(
    () => (isInvalid ? imgInvalid : isValid ? imgValid : "none"),
    [isInvalid, isValid]
  );
  const className = useMemo(
    () =>
      "wrapper" +
      (editable ? " wrapper-editable" : "") +
      (isInvalid ? " invalid" : isValid ? " valid" : "") +
      (type === "constant" ? " selection" : ""),
    [editable, isValid, isInvalid, type]
  );
  const style = extendable
    ? { maxWidth, minWidth, ...inputStyle }
    : { width: "100%", ...inputStyle };
  return (
    <div className={className} style={style}>
      <Container
        {...{
          ...rest,
          type,
          value,
          img,
        }}
        lazyLoad={lazyLoad}
        extendable={extendable}
      />
    </div>
  );
}, isEqual);

export const Container = memo(
  ({ img, value, type, extendable, lazyLoad = true, measurement, ...rest }) => {
    return (
      <>
        <div className="text-container">
          {extendable && (
            <div className="dummy">
              <div
                className="img-container"
                style={{ backgroundImage: img }}
              ></div>
              <div className="text-flex">
                <span
                  className="text-span"
                  onMouseLeave={(e) => (e.currentTarget.scrollLeft = 0)}
                >
                  {formatInput(value, type)}
                </span>
              </div>
              {measurement !== "" && (
                <span className="measurement">{measurement}</span>
              )}
            </div>
          )}
          <div className="editable-container">
            {lazyLoad ? (
              <LazyContainer {...{ value, type, ...rest }} />
            ) : (
              <TextInput {...{ value, type, ...rest }} />
            )}
          </div>
        </div>
      </>
    );
  },
  isEqual
);

const LazyContainer = memo((props) => {
  return (
    <LazyLoad>
      <TextInput {...props} />
    </LazyLoad>
  );
}, isEqual);

export const TextInput = memo(
  forwardRef(
    (
      {
        onChange,
        type,
        availableValues,
        inputClassName = "",
        className = "",
        ...rest
      },
      ref
    ) => {
      const backupRef = useRef(null);
      const domRef = ref ? ref : backupRef;

      function handleTextAreaChange(e) {
        onChange(e.target.value);
      }
      const [selectedDate, handleDateChange] = useState(
        "2018-01-01T00:00:00.000Z"
      );
      switch (type) {
        case "date":
          return (
            <DateSelectorDropdown
              className={className}
              onChange={onChange}
              {...rest}
            />
          );
        case "constant":
          return (
            <MyFormSelect
              className={className}
              onChange={onChange}
              availableValues={availableValues}
              {...rest}
              labelIsDisabled
            />
          );
        // case "time":
        //   return (
        //     <DatePicker
        //       renderInput={(props) => <div {...props} />}
        //       label="DateTimePicker"
        //       {...rest}
        //       onChange={onChange}
        //     />
        //   );
        default:
          return (
            <div className={"d-block " + className}>
              <TextareaAutosize
                className={inputClassName}
                {...rest}
                onChange={handleTextAreaChange}
                ref={domRef}
              />
            </div>
          );
      }
    }
  ),
  isEqual
);

Input.displayName = "Input";
TextInput.displayName = "TextInput";
Container.displayName = "Container";
export default Input;
