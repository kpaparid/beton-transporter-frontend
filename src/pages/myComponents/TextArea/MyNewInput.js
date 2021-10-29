import React, { useMemo, useCallback, forwardRef, memo, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "../MyForm.css";
import { imgInvalid, imgValid, validationType } from "../MyConsts";
import { MyFormSelect } from "../MyFormSelect";
import { DateSelectorDropdown } from "../MyOwnCalendar";
import { calcInvalidation, calcValidation } from "../util/utilities";
import { isEqual } from "lodash";
// import LazyLoad from "react-lazyload";
import { LazyLoad } from "react-observer-api";
export const Input = memo((props) => {
  const {
    value = "",
    type = "text",
    extendable = false,
    editable = false,
    // maxWidth = "150px",
    // minWidth = "10px",
    style: inputStyle = {},
    lazyLoad = true,
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
      (isInvalid ? " invalid" : isValid ? " valid" : ""),
    [editable, isValid, isInvalid, type]
  );
  const style = extendable
    ? { ...inputStyle }
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
  ({
    img,
    value,
    type,
    extendable,
    lazyLoad = true,
    measurement,
    maxWidth,
    minWidth,
    ...rest
  }) => {
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
                  style={{ maxWidth, minWidth }}
                  onMouseLeave={(e) => (e.currentTarget.scrollLeft = 0)}
                >
                  {value}
                  {/* {formatInput(value, type)} */}
                </span>
              </div>
              {measurement !== "" && (
                <span className="measurement">{measurement}</span>
              )}
            </div>
          )}
          <div className="editable-container">
            {lazyLoad ? (
              <LazyContainer
                {...{ value, type, maxWidth, minWidth, ...rest }}
              />
            ) : (
              <TextInput {...{ value, type, maxWidth, minWidth, ...rest }} />
            )}
          </div>
        </div>
      </>
    );
  },
  isEqual
);

export const LazyContainer = memo((props) => {
  return (
    <LazyLoad
      as="span"
      className="w-100"
      placeholder={<div>{props.value}</div>}
    >
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
        modal = false,
        minWidth,
        maxWidth,
        ...rest
      },
      ref
    ) => {
      const backupRef = useRef(null);
      const domRef = ref ? ref : backupRef;

      const handleTextAreaChange = useCallback((e) => {
        onChange && onChange(e.target.value, "text");
      }, []);
      const handleDateChange = useCallback((value) => {
        console.log("CHNAGEEEEEEEEEEEEEEEEEEEEEEE", value);
        onChange && onChange(value, "date");
      }, []);
      const handleSelectChange = useCallback((value) => {
        onChange && onChange(value, "select");
      }, []);
      const handleOutsideClick = useCallback(() => {
        domRef.current.focus();
      }, []);
      switch (type) {
        case "date":
          return (
            <DateSelectorDropdown
              className={className}
              onChange={handleDateChange}
              {...rest}
              inputStyle={{ maxWidth, minWidth }}
            />
          );
        case "constant":
          return (
            <div className={"d-block text-center disabled" + className}>
              {rest.value}
            </div>
          );
        case "select":
          return (
            <MyFormSelect
              className={className}
              onChange={handleSelectChange}
              availableValues={availableValues}
              {...rest}
              maxWidth={maxWidth}
              minWidth={minWidth}
              labelIsDisabled
            />
          );
        default:
          return (
            <div
              onClick={handleOutsideClick}
              className={"d-block text-center w-100" + className}
            >
              <TextareaAutosize
                className={inputClassName}
                {...rest}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ width: "100%", maxWidth, minWidth }}
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
