import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Form } from "@themesberg/react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import {
  calcInvalidation,
  calcValidation,
  imgValid,
  imgInvalid,
} from "../MyConsts";
import AutosizeInput from "react-input-autosize";
import {
  countNumberSeparators,
  colorizeBorder,
  getDifferenceOfStrings,
  formatNumberInput,
  formatDateInput,
  formatTimeInput,
  keyDownController,
  formatValueAndSetCursor,
  keyPasteController,
} from "../util/utilities";
import { DummyWrapperRef } from "../DummyWrappers";

export const MyTextArea = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      ariaLabel = "input",
      value = "",
      rows = 1,
      minRows = 1,
      maxRows = 4,
      // className = "",
      measurement = "",
      label,
      validation = false,
      invalidation = false,
      disabled = false,
      readOnly = false,
      id = "textarea",
      onChange,
      errorMessage,
      type = "text",
      outsideBorder = "",
      minWidth = "10px",
      placeholder = "",
      availableValues,
      maxWidth = "200px",
      digits,
      digitsSeparator = type === "date" ? "/" : "",
      seperatorAt = [],
      disableFocus = false,
      onFocus,
      onBlur,
      measurementClassName = "",
      textareaClassName = "",
      focus = false,
      getFocus,
      isValid = calcValidation(value + "", type, validation),
      isInvalid = calcInvalidation(value + "", type, invalidation),
    } = children;
    const fallbackRef = useRef(null);
    const domRef = ref || fallbackRef;
    const [change, setChange] = useState(value);
    function handleOnChange(text) {
      console.log("Sending: " + text);
      onChange && onChange(text);
    }
    const children2 = {
      ariaLabel,
      change,
      type,
      validation,
      invalidation,
      label,
      measurement,
      disabled,
      readOnly,
      minWidth,
      handleOnChange,
      value,
      placeholder,
      id,
      maxRows,
      outsideBorder,
      rows,
      minRows,
      className,
      focus,
      onFocus,
      onBlur,
      disableFocus,
      measurementClassName,
      textareaClassName,
      maxWidth,
      digitsSeperator: digitsSeparator,
      getFocus,
      isValid,
      isInvalid,
    };
    // console.log(ref);
    useEffect(() => {
      switch (type) {
        case "number": {
          setChange(formatNumberInput(value));
          break;
        }
        case "date": {
          setChange(formatDateInput(value));
          break;
        }
        case "time": {
          setChange(formatTimeInput(value));
          break;
        }
        default:
          setChange(value);
      }
    }, [type, value]);
    return <TextAreaComponent ref={domRef}>{children2}</TextAreaComponent>;
  }
);

const TextAreaComponent = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      ariaLabel,
      change,
      type,
      validation,
      invalidation,
      label,
      measurement,
      disabled,
      readOnly,
      minWidth,
      maxWidth,
      handleOnChange,
      placeholder,
      onFocus,
      onBlur,
      textareaClassName,
      focus,
      id,
      maxRows,
      outsideBorder,
      disableFocus = "false",
      measurementClassName = "",
      isValid,
      isInvalid,
      digitsSeparator,
    } = children;

    const inputTextAreaRef = ref;
    const inputAutoSizeRef = ref;
    const divWrapperRef = useRef(null);
    const inputFormRef = useRef(null);
    const dummyTextRef = useRef(null);
    const dummyWrapperRef = useRef(null);
    const [focused, setFocused] = useState(focus);
    const [overflow, setOverflow] = useState("hidden");
    // const isInvalid = calcInvalidation(change + "", type, invalidation);
    // const isValid = calcValidation(change + "", type, validation);
    const areaType =
      type === "number" || type === "time" || type === "date" ? "tel" : "text";
    const newPlaceholder =
      placeholder !== ""
        ? placeholder
        : type === "date"
        ? "DD/MM/YYYY"
        : type === "minute"
        ? ""
        : type === "hour"
        ? ""
        : "";
    const [rowHeight, setRowHeight] = useState(21);
    const [cursorPosition, setCursorPosition] = useState(change.length);
    const [textAreaMode, setTextAreaMode] = useState();
    const [textWidth, setTextWidth] = useState(minWidth);
    const [width, setWidth] = useState(minWidth);
    const dummyTextWidth =
      dummyTextRef.current && getComputedStyle(dummyTextRef.current).width;
    const data = {
      minWidth,
      maxWidth,
      isValid,
      isInvalid,
      dummyWrapperRef,
      imgInvalid,
      imgValid,
      dummyTextRef,
      measurement,
      change,
      outsideBorder,
      measurementClassName,
    };
    const handleFocus = () => {
      if (!disableFocus) {
        setFocused(true);
      }
      onFocus && onFocus(id);
    };
    const handleBlur = () => {
      if (!disableFocus) {
        setFocused(false);
      }
      onBlur && onBlur(id);
    };
    function handleKeyDown(event) {
      const controller = keyDownController(event);
      if (controller) {
        const { value, cursor } = formatValueAndSetCursor(
          controller.value,
          change,
          controller.cursor,
          event.key,
          type,
          digitsSeparator
        );
        setCursorPosition(cursor);
        handleOnChange(value);
      }
    }
    function handlePaste(event) {
      const controller = keyPasteController(event);
      if (controller) {
        const { value, cursor } = formatValueAndSetCursor(
          controller.value,
          change,
          controller.cursor,
          event.key,
          type,
          digitsSeparator
        );
        const difference = getDifferenceOfStrings(change, value);
        const count =
          difference.value.length === 0
            ? value.length
            : difference.value.length;
        setCursorPosition(cursor + count);
        handleOnChange(value);
      }
    }

    function handleHeightChange(_, rHeight) {
      rowHeight !== rHeight && setRowHeight(rHeight);
    }

    useEffect(() => {
      const currentRows =
        textAreaMode && inputTextAreaRef.current
          ? parseInt(inputTextAreaRef.current.scrollHeight / rowHeight)
          : 1;
      currentRows > maxRows ? setOverflow("auto") : setOverflow("hidden");
      dummyWrapperRef.current &&
        setWidth(getComputedStyle(dummyWrapperRef.current).width);
      if (textAreaMode) {
        inputTextAreaRef.current.focus({ preventScroll: true });
        inputTextAreaRef.current.selectionStart = cursorPosition;
        inputTextAreaRef.current.selectionEnd = cursorPosition;
      } else {
        inputAutoSizeRef.current.children[0].firstChild.focus({
          preventScroll: true,
        });
        inputAutoSizeRef.current.children[0].firstChild.selectionStart =
          cursorPosition;
        inputAutoSizeRef.current.children[0].firstChild.selectionEnd =
          cursorPosition;
      }
    }, [
      change,
      cursorPosition,
      inputAutoSizeRef,
      inputTextAreaRef,
      maxRows,
      rowHeight,
      textAreaMode,
      textWidth,
    ]);

    useEffect(() => {
      if (Math.abs(parseInt(maxWidth) - parseInt(width)) <= 2) {
        setTextAreaMode(true);
      } else {
        setTextWidth(getComputedStyle(dummyTextRef.current).width);
        setTextAreaMode(false);
      }
    }, [dummyTextWidth, maxWidth, width]);
    useEffect(() => {
      colorizeBorder(divWrapperRef, isValid, isInvalid, focused);
    }, [isValid, isInvalid, focused]);

    function handleClick(e) {
      if (e.target.name !== "input-field" && e.target.name !== "textarea") {
        if (!focused) {
          !disableFocus && handleFocus(e);
          onFocus && onFocus();
        }
        // setCursorPosition(change.length);

        if (textAreaMode) {
          inputTextAreaRef.current.focus({ preventScroll: true });
          inputTextAreaRef.current.selectionStart = cursorPosition;
          inputTextAreaRef.current.selectionEnd = cursorPosition;
        } else {
          inputAutoSizeRef.current.children[0].firstChild.focus({
            preventScroll: true,
          });
          inputAutoSizeRef.current.children[0].firstChild.selectionStart =
            cursorPosition;
          inputAutoSizeRef.current.children[0].firstChild.selectionEnd =
            cursorPosition;
        }
      }
    }
    return (
      <div className="d-block w-100">
        <DummyWrapperRef data={data}></DummyWrapperRef>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          key={`f-${id}}`}
          className="d-flex flex-fill w-100"
          ref={inputFormRef}
          style={{ width: width, minWidth: minWidth, maxWidth: maxWidth }}
        >
          {label && (
            <Form.Label className="fw-bolder w-100">{label}</Form.Label>
          )}
          <Form.Group
            className={"d-flex flex-nowrap p-0 w-100"}
            style={{ borderRadius: "inherit" }}
          >
            <div
              data="wrapper"
              ref={divWrapperRef}
              className={
                "d-flex justify-content-center p-0 rounded w-100 " +
                outsideBorder
              }
              style={{
                transition: "all 0.2s ease",
                border: "1px solid rgb(209, 215, 224)",
              }}
            >
              <div
                className={` d-flex flex-nowrap justify-content-center align-items-start
                        flex-fill fw-normal form-control whitedisabled border border-0 shadow-none ${textareaClassName}`}
                style={{
                  alignItems: measurement === "" ? "baseline" : "inherit",
                }}
                onClick={handleClick}
                // onMouseDown={(e) => e.preventDefault()}
              >
                {(isInvalid || isValid) && (
                  <div
                    style={{
                      backgroundImage: isInvalid
                        ? imgInvalid
                        : isValid
                        ? imgValid
                        : "",
                      backgroundRepeat: "no-repeat",
                      backgroundSize:
                        "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
                      paddingRight: "calc(20px + 0.35em)",
                      paddingLeft: "0rem",
                      width: "21px",
                      height: "21px",
                    }}
                  ></div>
                )}
                {textAreaMode && (
                  <TextareaAutosize
                    name="textarea"
                    ref={inputTextAreaRef}
                    key={"textarea_field_" + id}
                    id={"textarea_field_" + id}
                    maxRows={maxRows}
                    minRows={1}
                    value={change}
                    onChange={(e) => {
                      e.preventDefault();
                    }}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    type={areaType}
                    required
                    placeholder={newPlaceholder}
                    disabled={disabled}
                    className={`d-flex flex-fill whitedisabled  form-control border border-0 shadow-none py-0 px-1 ${textareaClassName}`}
                    readOnly={readOnly}
                    onHeightChange={(height, metaData) =>
                      handleHeightChange(height, metaData.rowHeight)
                    }
                    onFocus={(e) => handleFocus(e)}
                    onBlur={(e) => handleBlur(e)}
                    style={{
                      fontSize: "0.875rem",
                      color: "#66799e",
                      resize: "none",
                      textAlign: measurement === "" ? "center" : "end",
                      overflow: overflow,
                      width: textWidth,
                    }}
                  />
                )}
                {!textAreaMode && (
                  <div
                    ref={inputAutoSizeRef}
                    style={{
                      width: "calc(5px + " + textWidth + ")",
                      // width: textWidth,
                    }}
                  >
                    <AutosizeInput
                      aria-label={ariaLabel + "_" + id}
                      id={"input_field_" + id}
                      name="input-field"
                      value={change}
                      key={"input_field_" + id}
                      onChange={(e) => {
                        e.preventDefault();
                      }}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      type={areaType}
                      required
                      // autoFocus
                      placeholder={newPlaceholder}
                      disabled={disabled}
                      autoComplete="off"
                      className={`d-flex whitedisabled  border border-0 shadow-none py-0 px-0 `}
                      style={{
                        textAlign: measurement === "" ? "center" : "center",
                        width: "98%",
                      }}
                      readOnly={readOnly}
                      onFocus={(e) => {
                        handleFocus(e);
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                      }}
                      inputStyle={{
                        fontSize: "0.875rem",
                        color: "#66799e",
                        border: 0,
                        boxShadow: "none",
                        outline: 0,
                        padding: "0px",
                        width: "100%",
                        textAlign: measurement === "" ? "center" : "center",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                )}
                {measurement !== "" && (
                  <>
                    <div
                      className={`d-flex align-items-end fw-normal text-nowrap whitedisabled text-start border h-100 border-0 shadow-none ${measurementClassName}`}
                      value={measurement}
                      readOnly
                      style={{
                        fontSize: "0.875rem",
                        color: "#66799e",
                        width: "auto",
                        paddingLeft: "0.3rem",
                      }}
                    >
                      {measurement}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
);

export const TextAreaGroup = (props) => {
  const {
    minWidth,
    maxWidth,
    isValid = false,
    isInvalid = false,
    id = "textareaGroup",
    data,
    maxRows,
    onChange,
    disabled = false,
    readOnly = false,
    type,
  } = props;
  const divWrapperRef = useRef();
  const [focused, setFocused] = useState(false);

  const handleClick = (e) => {
    if (!focused) {
      data.ref[0].current.children[0] &&
        data.ref[0].current.children[0].firstChild.focus({
          preventScroll: true,
        });
      data.ref[0].current && data.ref[0].current.focus({ preventScroll: true });
    }
  };
  const handleFocus = (e) => {
    setFocused(true);
  };
  const handleBlur = (e) => {
    console.log("blur");
    setFocused(false);
  };
  useEffect(() => {
    console.log("colorizing");
    colorizeBorder(divWrapperRef, isValid, isInvalid, focused);
  }, [focused, isInvalid, isValid]);

  return (
    <div
      id={id + "_div"}
      key={id + "_div"}
      ref={divWrapperRef}
      className={`d-flex flex-nowrap justify-content-center align-items-start
                         fw-normal form-control `}
      style={{
        transition: "all 0.2s ease",
        border: "1px solid rgb(209, 215, 224)",
        width: "100%",
      }}
      onClick={handleClick}
      // onBlur={() => setFocused(false)}
    >
      {(isInvalid || isValid) && (
        <div
          className="border border-0 d-flex"
          style={{
            backgroundImage: isInvalid ? imgInvalid : isValid ? imgValid : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
            alignSelf: "center",
            width: "21px",
            height: "21px",
            paddingRight: "calc(20px + 0.35em)",
          }}
        ></div>
      )}
      {data.map((item, index) => {
        const { id, value, measurement, ref } = item;
        const outsideBorder =
          index === 0
            ? "border-0 border-start p-0"
            : index === data.length - 1
            ? "border-0 border-end p-0"
            : "";
        const measurementClassName = index === 0 ? "" : "";
        const textareaClassName =
          index === 1 ? "p-0" : index === 0 ? "p-0" : "";

        return (
          <MyTextArea ref={ref} key={id}>
            {{
              id: id,
              type: type,
              value: value,
              readOnly: readOnly,
              onChange: (v) => onChange(v, index),
              minWidth: parseInt(minWidth) / 2 + "px",
              maxWidth: parseInt(maxWidth) / 2 + "px",
              validation: false,
              invalidation: false,
              measurement,
              maxRows,
              outsideBorder,
              disableFocus: true,
              disabled,
              onFocus: handleFocus,
              onBlur: handleBlur,
              onClick: handleClick,
              disableFormControl: true,
              measurementClassName: measurementClassName,
              textareaClassName: textareaClassName,
            }}
          </MyTextArea>
        );
      })}
    </div>
  );
};
