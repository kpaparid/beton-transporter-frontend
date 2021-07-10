export const DummyWrapperRef = (props) => {
  const {
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
    hidden = true,
    textWrap = false,
  } = props.data;
  const wrapperStyles = {
    transition: "all 0.2s ease",
    border: "1px solid rgb(209, 215, 224)",
    maxWidth: maxWidth,
    width: "fit-content",
    height: hidden ? "0px" : "inherit",
    visibility: hidden ? "hidden" : "inherit",
  };
  return (
    <div data="wrapper" className={" p-0 border-0"} style={wrapperStyles}>
      <div
        className={
          `d-flex flex-nowrap justify-content-center align-items-end
                        flex-fill fw-normal form-control whitedisabled shadow-none ` +
          outsideBorder
        }
        ref={dummyWrapperRef}
      >
        {(isInvalid || isValid) && (
          <div
            style={{
              backgroundImage: isInvalid ? imgInvalid : isValid ? imgValid : "",
              backgroundRepeat: "no-repeat",
              backgroundSize: "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
              paddingRight: "calc(20px + 0.35em)",
              paddingLeft: "0rem",
            }}
          ></div>
        )}
        <div
          ref={dummyTextRef}
          className={textWrap ? "text-wrap" : "text-nowrap"}
          style={{
            fontSize: "0.875rem",
            color: "#66799e",
            resize: "none",
            textAlign: measurement === "" ? "center" : "end",
            overflow: "auto",
            width: "auto",
            minWidth: minWidth,
          }}
        >
          {change}
        </div>
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
  );
};
