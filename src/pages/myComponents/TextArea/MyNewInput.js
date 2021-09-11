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
import { green, imgInvalid, imgValid, red, validationType } from "../MyConsts";
import { MyFormSelect } from "../MyFormSelect";
import { DateSelectorDropdown } from "../MyOwnCalendar";
import {
  calcInvalidation,
  calcValidation,
  formatInput,
} from "../util/utilities";
import { isEqual } from "lodash";
import LazyLoad from "react-lazyload";
import TimePicker from "@mui/lab/TimePicker";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const Input = memo((props) => {
  const {
    value = "",
    type = "text",
    extendable = false,
    editable = false,
    maxWidth = "150px",
    minWidth = "10px",
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

export const Container2 = memo((props) => {
  const { label, onChange, value, editable, isValid, isInvalid, ...rest } =
    props;
  const theme = createTheme({
    palette: {
      error: { main: "#fa5252" },
      primary: { main: "#2e3650" },
    },
    components: {
      MuiOutlinedInput: {
        defaultProps: { value: "hi" },
        styleOverrides: {
          root: {
            // backgroundColor: "white",
            padding: "0.5rem",
            "& .MuiFormHelperText-root": {
              color: "green",
            },
            ":hover": {
              boxShadow: "0 0 0 0.2rem rgb(46, 54, 80, 50%)",
              border: 0,
              backgroundColor: "white",
            },
            "&.Mui-error:hover": {
              boxShadow: "0 0 0 0.2rem rgb(250, 82, 82, 50%)",
            },
          },
          notchedOutline: {
            top: 0,
          },
          input: {
            width: "100%",
            fontSize: "0.875rem",
            color: "#2e3650",
            lineHeight: "21px",
            top: 0,
            textAlign: "center",
            padding: 0,
            "&[type=number]": {
              "-moz-appearance": "textfield",
            },
            "&::-webkit-outer-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "&::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
          },

          disabled: {},
          focused: {},
        },
      },
    },
  });

  return (
    <div>
      <div
        className="px-3"
        style={{
          width: "fit-content",
          minWidth: "80px",
          maxWidth: "250px",
          fontSize: "0.875rem",
          height: editable ? 0 : "inherit",
          visibility: editable ? "hidden" : "inherit",
          overflow: "auto",
        }}
      >
        {value}
      </div>
      <LazyLoad>
        <ThemeProvider theme={theme}>
          <TextField
            hidden={!editable}
            {...rest}
            value={value}
            error={isInvalid}
            fullWidth
            multiline
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            readOnly
          ></TextField>
        </ThemeProvider>
      </LazyLoad>
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
        modal = false,
        ...rest
      },
      ref
    ) => {
      const backupRef = useRef(null);
      const domRef = ref ? ref : backupRef;

      function handleTextAreaChange(e) {
        onChange(e.target.value);
      }
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
