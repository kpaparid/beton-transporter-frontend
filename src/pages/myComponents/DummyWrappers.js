import { forwardRef } from "react";

export const DummyWrapperRef = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const {
      minWidth,
      maxWidth,
      measurement,
      change,
      hidden = false,
      textWrap = false,
    } = children;
    const { dummyWrapperRef, dummyTextRef } = ref;
    const wrapperStyles = {
      maxWidth: maxWidth,
      minWidth: minWidth,
      width: "100%",
      height: hidden ? "0px" : "inherit",
      visibility: hidden ? "hidden" : "inherit",
    };
    return (
      <div data="wrapper" className={" p-0 border-0"} style={wrapperStyles}>
        <div
          className={
            "d-flex flex-nowrap justify-content-center align-items-end flex-fill fw-normal form-control p-0 whitedisabled border-0 shadow-none "
          }
          ref={dummyWrapperRef}
        >
          <div
            ref={dummyTextRef}
            className={textWrap ? "text-wrap" : "text-nowrap"}
            style={{
              fontSize: "0.875rem",
              color: "#66799e",
              resize: "none",
              textAlign: measurement === "" ? "center" : "end",
              overflow: "auto",
              width: "fit-content",
            }}
          >
            {change}
          </div>
        </div>
      </div>
    );
  }
);
