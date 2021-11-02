import { forwardRef, memo, useCallback, useRef, lazy } from "react";
import { MyFormSelect } from "./MyFormSelect";
import { DateSelectorDropdown } from "./MyOwnCalendar";
// import { LazyLoad } from "react-observer-api";
import TextareaAutosize from "react-textarea-autosize";
import { isEqual } from "lodash";
import TimePicker from "./TextArea/TimePicker";

// const LazyInput = memo(
//   ({ onChange, inputClassName = "", className = "", ...rest }) => {
//     const domRef = useRef(null);
//     const handleTextAreaChange = useCallback((e) => {
//       onChange && onChange(e.target.value, "text");
//     }, []);
//     const handleOutsideClick = useCallback(() => {
//       domRef.current.focus();
//     }, []);
//     return (
//       <div
//         onClick={handleOutsideClick}
//         className={"d-block text-center w-100" + className}
//       >
//         <LazyLoad
//           as="span"
//           options={{
//             root: null,
//             rootMargin: "-300px",
//             threshold: 0,
//           }}
//           const
//           style={{
//             padding: 10,
//           }}
//         >
//           <TextareaAutosize
//             className={inputClassName + " text-nowrap"}
//             {...rest}
//             onChange={handleTextAreaChange}
//             ref={domRef}
//             style={{ width: "100%" }}
//           />
//         </LazyLoad>
//       </div>
//     );
//   },
//   isEqual
// );

export const LazyInput = memo(
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
        case "nonEditable":
          return (
            <div className={"d-block text-center disabled" + className}>
              {rest.value}
            </div>
          );
        case "bigText":
          return (
            <TextareaAutosize
              className={inputClassName}
              {...rest}
              onChange={handleTextAreaChange}
              ref={domRef}
              style={{ width: maxWidth }}
            />
          );

        case "bigNumber":
          return (
            <TextareaAutosize
              className={inputClassName}
              {...rest}
              onChange={handleTextAreaChange}
              ref={domRef}
              style={{ width: maxWidth }}
            />
          );
        case "time":
          return (
            <TimePicker
              className={inputClassName}
              {...rest}
              onChange={handleDateChange}
              style={{ width: maxWidth }}
            />
          );
        case "constant":
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
              <input
                className={"text-center"}
                type={type === "number" ? "number" : "text"}
                {...rest}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ width: maxWidth }}
              />
              {/* <TextareaAutosize
                className={inputClassName}
                {...rest}
                onChange={handleTextAreaChange}
                ref={domRef}
                style={{ width: "100%", maxWidth, minWidth }}
              /> */}
            </div>
          );
      }
    }
  ),
  isEqual
);
export default LazyInput;
