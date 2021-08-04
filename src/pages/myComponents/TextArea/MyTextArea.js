import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
  useMemo,
} from "react";
import { Form } from "@themesberg/react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import { imgValid, imgInvalid } from "../MyConsts";
import AutosizeInput from "react-input-autosize";
import {
  calcInvalidation,
  calcValidation,
  countNumberSeparators,
  colorizeBorder,
  getDifferenceOfStrings,
  formatNumberInput,
  formatDateInput,
  formatTimeInput,
  keyDownController,
  formatValueAndSetCursor,
  keyPasteController,
  keyPreventDefault,
  formatInput,
} from "../util/utilities";
import { DummyWrapperRef } from "../DummyWrappers";

export const MyTextArea1 = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      value = "",
      measurement = "",
      validation = false,
      invalidation = false,
      disabled = false,
      id = "textarea",
      type = "text",
      outsideBorder = disabled ? "border-0" : "",
      minWidth = "10px",
      maxWidth = "200px",
      isValid = calcValidation(value + "", type, validation),
      isInvalid = calcInvalidation(value + "", type, invalidation),
    } = children;
    function handleSubmit(e) {
      e.preventDefault();
    }

    const [change, setChange] = useState();
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
    if (true) {
      return (
        <div className="d-block">
          <Form
            onSubmit={handleSubmit}
            key={`f-${id}}`}
            className="d-flex flex-fill w-100"
            style={{
              minWidth: minWidth,
              maxWidth: maxWidth,
            }}
          >
            {false && (
              <Form.Label className="fw-bolder w-100">{false}</Form.Label>
            )}
            {/* <Form.Group */}
            <div
              className={"d-flex flex-nowrap p-0 w-100"}
              style={{ borderRadius: "inherit" }}
            >
              <div
                data="wrapper"
                className={
                  "d-flex justify-content-center p-0 rounded w-100 " +
                  outsideBorder
                }
                style={{
                  // transition: "all 0.2s ease",
                  border: "1px solid rgb(209, 215, 224)",
                }}
              >
                <div
                  className={` d-flex flex-nowrap justify-content-center align-items-start
                        flex-fill fw-normal form-control whitedisabled border border-0 shadow-none `}
                  style={{
                    alignItems: measurement === "" ? "baseline" : "inherit",
                  }}
                >
                  <div className="text-center">{change}</div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      );
    }
  }
);

const MyTextArea = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      ariaLabel,
      type,
      value,
      validation,
      invalidation,
      label,
      measurement,
      disabled,
      readOnly,
      minWidth,
      maxWidth = "200px",
      onChange,
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

    const change = value;
    const fallbackRef = useRef(null);
    const domRef = ref || fallbackRef;
    const inputTextAreaRef = domRef;
    const inputAutoSizeRef = domRef;
    const divWrapperRef = useRef(null);
    const inputFormRef = useRef(null);
    const measurementRef = useRef(null);

    const dummyTextRef = useRef(null);
    const dummyWrapperRef = useRef(null);
    const invalidRef = useRef(null);
    const [focused, setFocused] = useState(focus);
    function handleSubmit(e) {
      e.preventDefault();
    }
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

    // const textAreaMode = false;

    const handleFocus = (e) => {
      console.log("focus");
      if (!disableFocus) {
        setFocused(true);
      }
      onFocus && onFocus(id);
    };
    const handleBlur = (e) => {
      console.log("blur");
      if (!disableFocus) {
        setFocused(false);
      }
      onBlur && onBlur(id);
    };

    // useEffect(() => {
    //   if (inputTextAreaRef.current) {
    //     inputTextAreaRef.current.focus({ preventScroll: true });
    //   } else {
    //     inputAutoSizeRef.current.children[0].firstChild.focus({
    //       preventScroll: true,
    //     });
    //   }
    // }, [change, inputAutoSizeRef, inputTextAreaRef, maxRows, textAreaMode]);
    function handleClick(e) {
      if (!disabled) {
        if (e.target.name !== "input-field" && e.target.name !== "textarea") {
          if (!focused) {
            !disableFocus && handleFocus(e);
            onFocus && onFocus();
          }
          inputTextAreaRef.current &&
            inputTextAreaRef.current.focus({ preventScroll: true });
          inputAutoSizeRef.current &&
            inputAutoSizeRef.current.children[0].firstChild.focus({
              preventScroll: true,
            });
          // if (textAreaMode) {
          //   // setCursorPosition(change.length);
          //   inputTextAreaRef.current.focus({ preventScroll: true });
          // } else {
          //   inputAutoSizeRef.current.children[0].firstChild.focus({
          //     preventScroll: true,
          //   });
          // }
        }
      }
    }
    useEffect(() => {
      colorizeBorder(divWrapperRef, isValid, isInvalid, focused);
    }, [isValid, isInvalid, focused]);

    return (
      <div className="d-block">
        <Form
          onSubmit={handleSubmit}
          key={`f-${id}}`}
          className="d-flex flex-fill w-100"
          ref={inputFormRef}
          style={{
            minWidth: minWidth,
            maxWidth: maxWidth,
          }}
        >
          {label && (
            <Form.Label className="fw-bolder w-100">{label}</Form.Label>
          )}
          {/* <Form.Group */}
          <div
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
                // transition: "all 0.2s ease",
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
              >
                {!disabled && (isInvalid || isValid) && (
                  <InvalidComponent ref={invalidRef}>
                    {{ isValid, isInvalid }}
                  </InvalidComponent>
                )}

                <TextComponent
                  ref={{
                    inputTextAreaRef,
                    inputAutoSizeRef,
                    dummyTextRef,
                    dummyWrapperRef,
                  }}
                >
                  {{
                    measurement,
                    isInvalid,
                    isValid,
                    invalidRef,
                    // textAreaMode,
                    id,
                    textareaClassName,
                    onChange,
                    type,
                    digitsSeparator,
                    // handleKeyDown,
                    maxRows,
                    change,
                    // handlePaste,
                    areaType,
                    newPlaceholder,
                    disabled,
                    readOnly,
                    handleFocus,
                    handleBlur,
                    ariaLabel,
                    measurementClassName,
                    disableFocus,
                    focused,
                    onFocus,
                  }}
                </TextComponent>
                {measurement !== "" && (
                  <MeasurementComponent
                    ref={measurementRef}
                    className={measurementClassName}
                  >
                    {{ measurement }}
                  </MeasurementComponent>
                )}
              </div>
            </div>
          </div>
          {/* </Form.Group> */}
        </Form>
      </div>
    );
  }
);

const TextComponent = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      inputTextAreaRef,
      inputAutoSizeRef,
      dummyTextRef,
      dummyWrapperRef,
    } = ref;
    const {
      measurement,
      id,
      textareaClassName,
      maxRows,
      change,
      areaType,
      newPlaceholder,
      disabled,
      readOnly,
      handleFocus,
      handleBlur,
      ariaLabel,
      onChange,
      type,
      digitsSeparator,
      disableFocus,
      focused,
      onFocus,
    } = children;

    const [cursorPosition, setCursorPosition] = useState(0);

    const data = {
      imgInvalid,
      imgValid,
      measurement,
      change,
    };
    const handleKeyDown = useCallback((event) => {
      keyPreventDefault(event);
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
        onChange(value);
      }
    });
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
        onChange(value);
      }
    }

    const [textAreaMode, setTextAreaMode] = useState(false);
    useEffect(() => {
      const scrollWidth =
        dummyTextRef.current && dummyTextRef.current.scrollWidth;
      const clientWidth =
        dummyTextRef.current && dummyTextRef.current.clientWidth;
      if (scrollWidth !== clientWidth) {
        !textAreaMode && setTextAreaMode(true);
        // inputTextAreaRef.current.focus({ preventScroll: true });
      } else {
        textAreaMode && setTextAreaMode(false);
        // inputAutoSizeRef.current &&
        //   inputAutoSizeRef.current.children[0] &&
        //   !inputAutoSizeRef.current.children[0].firstChild.focus() &&
        //   inputAutoSizeRef.current.children[0].firstChild.focus({
        //     preventScroll: true,
        //   });
      }
    });

    return (
      <>
        <div className="d-flex flex-wrap w-100">
          <DummyWrapperRef ref={{ dummyWrapperRef, dummyTextRef }}>
            {data}
          </DummyWrapperRef>
          {textAreaMode && (
            <TextArea ref={inputTextAreaRef} className={textareaClassName}>
              {{
                value: change,
                areaType,
                disabled,
                handleFocus,
                handleBlur,
                handleKeyDown,
                handlePaste,
                id,
                ariaLabel,
                readOnly,
                maxRows,
                enableMeasurement: measurement !== "",
                cursorPosition,
              }}
            </TextArea>
          )}
          {!textAreaMode && (
            <TextAutoSize ref={inputAutoSizeRef} className={textareaClassName}>
              {{
                value: change,
                areaType,
                disabled,
                placeholder: newPlaceholder,
                handleFocus,
                handleBlur,
                handleKeyDown,
                handlePaste,
                id,
                ariaLabel,
                readOnly,
                cursorPosition,
              }}
            </TextAutoSize>
          )}
        </div>
      </>
    );
  }
);

const TextArea = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const fallbackRef = useRef(null);
    const domRef = ref || fallbackRef;
    const {
      value,
      areaType,
      disabled,
      handleFocus,
      handleBlur,
      handleKeyDown,
      handlePaste,
      readOnly,
      ariaLabel,
      id,
      maxRows = 1,
      enableMeasurement,
      cursorPosition,
    } = children;
    const [rowHeight, setRowHeight] = useState(21);
    const [overflow, setOverflow] = useState("hidden");
    const scrollHeight = ref.current && ref.current.scrollHeight;
    useEffect(() => {
      const currentRows = ref.current
        ? parseInt(ref.current.scrollHeight / rowHeight)
        : 1;
      currentRows > maxRows ? setOverflow("auto") : setOverflow("hidden");
    }, [scrollHeight]);
    function handleHeightChange(_, rHeight) {
      rowHeight !== rHeight.rowHeight && setRowHeight(rHeight.rowHeight);
    }

    useEffect(() => {
      console.log("============");
      console.log(domRef.current);
      if (cursorPosition) {
        if (domRef.current) {
          console.log("cP", cursorPosition);
          domRef.current.selectionStart = cursorPosition;
          domRef.current.selectionEnd = cursorPosition;
        }
      }
      console.log(domRef.current.selectionStart);
    });

    return (
      <TextareaAutosize
        aria-label={ariaLabel + "_" + id}
        name="textarea"
        ref={domRef}
        key={"textarea_field_" + id}
        id={"textarea_field_" + id}
        maxRows={maxRows}
        minRows={1}
        value={value}
        onChange={(e) => {
          e.preventDefault();
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        type={areaType}
        required
        disabled={disabled}
        className={`d-flex flex-fill whitedisabled  form-control border border-0 shadow-none p-0 ${className}`}
        readOnly={readOnly}
        onHeightChange={handleHeightChange}
        // onFocus={handleFocus}
        // onBlur={handleBlur}
        style={{
          fontSize: "0.875rem",
          color: "#66799e",
          resize: "none",
          textAlign: enableMeasurement ? "center" : "end",
          overflow: overflow,
          // width: textWidth,
          width: "100%",
        }}
      />
    );
  }
);
const TextAutoSize = React.memo(
  forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      const {
        value,
        areaType,
        disabled,
        placeholder,
        handleFocus,
        handleBlur,
        handleKeyDown,
        handlePaste,
        readOnly,
        ariaLabel,
        id,
        cursorPosition,
      } = children;

      const fallbackRef = useRef(null);
      const domRef = ref || fallbackRef;
      useEffect(() => {
        if (cursorPosition) {
          console.log("cP", cursorPosition);
          if (domRef.current.children[0]) {
            domRef.current.children[0].firstChild.selectionStart =
              cursorPosition;
            domRef.current.children[0].firstChild.selectionEnd = cursorPosition;
          }
        }
      });
      return (
        <div
          ref={domRef}
          style={{
            width: "100%",
          }}
        >
          {/* <div>{value}</div> */}
          <AutosizeInput
            aria-label={ariaLabel + "_" + id}
            id={"input_field_" + id}
            name="input-field"
            value={value}
            key={"input_field_" + id}
            onChange={(e) => {
              e.preventDefault();
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            type={areaType}
            required
            // autoFocus
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className={
              "d-flex whitedisabled  border border-0 shadow-none rounded-0 p-0 " +
              className
            }
            style={{
              textAlign: "center",
              width: "100%",
            }}
            // readOnly={readOnly}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
            inputStyle={{
              fontSize: "0.875rem",
              color: "#66799e",
              border: 0,
              boxShadow: "none",
              outline: 0,
              padding: "0px",
              width: "100%",
              textAlign: "center",
              backgroundColor: "transparent",
            }}
          />
        </div>
      );
    }
  )
);
const MeasurementComponent = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const { measurement } = children;

    return (
      <>
        <div
          ref={ref}
          className={`d-flex align-items-end fw-normal text-nowrap
             whitedisabled text-start rounded-0 border h-100 border-0 shadow-none ${className}`}
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
    );
  }
);
const InvalidComponent = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const { isInvalid, isValid } = children;

    return (
      <div
        ref={ref}
        style={{
          backgroundImage: isInvalid ? imgInvalid : isValid ? imgValid : "",
          backgroundRepeat: "no-repeat",
          backgroundSize: "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
          paddingRight: "calc(20px + 0.35em)",
          paddingLeft: "0rem",
          width: "21px",
          height: "21px",
        }}
      ></div>
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
    setFocused(false);
  };
  useEffect(() => {
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
export default MyTextArea;
