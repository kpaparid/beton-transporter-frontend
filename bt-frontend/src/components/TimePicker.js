import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from "@themesberg/react-bootstrap";
import isequal from "lodash.isequal";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ButtonGroup, CloseButton, Modal } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { useWindowDimensions } from "../pages/myComponents/util/utilities";
import { CustomDropdown } from "./Filters/CustomDropdown";

export const TimeResponsivePicker = memo((props) => {
  const { width, height } = useWindowDimensions();
  const modeModal = height < 650 || width < 650;
  useEffect(() => {
    const oldClassName = document.getElementById("body").className;
    const m = oldClassName
      .replaceAll("custom-modal-open", "")
      .replaceAll("custom-dropdown-open", "")
      .trim();
    document.body.className = m;
    return () =>
      (document.body.className = document.getElementById("body").className)
        .replaceAll("custom-modal-open", "")
        .replaceAll("custom-dropdown-open", "")
        .trim();
  }, [modeModal]);
  return modeModal ? (
    <TimePickerModalWithText {...props} />
  ) : (
    <TimePickerDropdown {...props} />
  );
}, isequal);

export const TimePickerModalWithText = memo((props) => {
  const { onChange, inputStyle, value } = props;

  const handleInputChange = useCallback(
    (e) => {
      const v = e.target.value;
      onChange && onChange(v);
    },
    [onChange]
  );
  const toggleComponent = useCallback(
    ({ toggle }) => {
      return (
        <div className="d-flex justify-content-center">
          <input
            type="text"
            className="text-center"
            style={inputStyle}
            autoFocus={false}
            value={value}
            onChange={handleInputChange}
            onFocus={(e) => {
              e.target.blur();
              toggle();
            }}
          />
        </div>
      );
    },
    [inputStyle, value, handleInputChange]
  );
  return (
    <TimePickerModal
      footer={false}
      modalClassName="bg-transparent"
      renderInput={toggleComponent}
      {...props}
    />
  );
}, isequal);
export const TimePickerModal = ({
  footer = true,
  defaultValue = "00:00",
  value = defaultValue,
  buttonText,
  buttonVariant = "primary",
  buttonClassName = "",
  modalClassName = "",
  modalContentClassName = "",
  onChange,
  variant = "light",
  className = "",
  renderInput = ({ toggle }) => (
    <Button
      variant={buttonVariant}
      onClick={toggle}
      className={"time-picker-modal-btn " + buttonClassName}
    >
      {buttonText}
    </Button>
  ),
}) => {
  const [show, setShow] = useState(false);
  const handleClose = useCallback(() => {
    const oldClassName = document.getElementById("body").className;
    document.getElementById("body").className = oldClassName.replace(
      "custom-modal-open",
      ""
    );
    setShow(false);
  }, []);
  const handleShow = () => {
    const oldClassName = document.getElementById("body").className;
    document.getElementById(
      "body"
    ).className = `${oldClassName} custom-modal-open`;
    setShow(true);
  };

  const handleSave = useCallback(
    (v) => {
      onChange(v);
      handleClose();
    },
    [handleClose, onChange]
  );

  useEffect(() => {
    return () => {
      const oldClassName = document
        .getElementById("body")
        .className.replace("custom-modal-open", "");
      document.getElementById("body").className = oldClassName;
    };
  }, []);
  return (
    <>
      {renderInput({ toggle: handleShow })}

      <Modal
        show={show}
        onHide={handleClose}
        onExit={handleClose}
        centered
        fullscreen
        className={modalClassName + " time-picker-modal"}
        contentClassName={
          "time-picker-modal-content  shadow-none bg-transparent " +
          modalContentClassName
        }
        scrollable
      >
        <Modal.Body
          id="modal-container"
          className="d-flex"
          onClick={(e) => {
            e.currentTarget.id === "modal-container" && setShow(false);
          }}
        >
          <div
            className="m-auto modal-body-container "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <TimeSelector
              value={value}
              onChange={onChange}
              className={className}
              variant={variant}
              footer={footer}
              onSave={handleSave}
              onClose={handleClose}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const TimePickerDropdown = memo(
  ({
    value = "00:00",
    onChange,
    disabled = false,
    portal = true,
    withButton = false,
    inputStyle,
    className = "",
    dropdownClassName = "",
  }) => {
    const handleInputChange = useCallback(
      (e) => {
        const v = e.target.value;
        onChange && onChange(v);
      },
      [onChange]
    );
    return (
      <>
        <div className={`d-block w-100  date-picker-dropdown ${className}`}>
          <div className="d-flex flex-nowrap w-100 align-items-center justify-content-center">
            <CustomDropdown
              id={"time-picker"}
              as={ButtonGroup}
              disabled={disabled}
              toggleAs="custom"
              // className={!withButton ? "w-100" : null}
              portal={portal}
              value={
                <div className="w-100 justify-content-center d-flex">
                  <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
              }
            >
              <TimeSelector
                value={value}
                onChange={onChange}
                className={dropdownClassName}
              ></TimeSelector>
            </CustomDropdown>
          </div>
        </div>
      </>
    );
  },
  isequal
);

export const TimeSelectorRange = memo(
  ({ gte = "00:00", lte = "23:59", onChange }) => {
    const handleClick = useCallback(
      (v) => {
        onChange && onChange(v);
      },
      [onChange]
    );
    return (
      <Card className="my-card">
        <Card.Header>
          <div className="d-flex flex-nowrap w-100 justify-content-around fw-bolder">
            <div className="col-5   text-center">{gte}</div>

            <div className="d-flex col-2 justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                style={{ left: "0.2px", position: "relative" }}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                icon={faLongArrowAltRight}
                style={{ right: "0.2px", position: "relative" }}
              ></FontAwesomeIcon>
            </div>
            <div className="col-5  text-center">{lte}</div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex">
            <div className="col-5  justify-content-center">
              <TimeSelectorBody
                value={gte}
                onChange={(v) => handleClick({ gte: v, lte })}
                // buttonSize="100%"
              />
            </div>
            <div className="col-2" />

            <div className="col-5  justify-content-center">
              <TimeSelectorBody
                value={lte}
                onChange={(v) => handleClick({ gte, lte: v })}
                // buttonSize="50%"
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  },
  isequal
);

export const TimeSelector = memo(
  ({
    onChange,
    defaultValue = "00:00",
    value: initialValue,
    close = false,
    className: initialClassName = "",
    variant = "light",
    footer,
    onClose,
    onSave,
    closeVariant = "secondary",
    saveVariant = "primary",
    footerVariant = variant,
  }) => {
    const className = `time-picker time-picker-${variant} ${initialClassName}`;
    const [value, setValue] = useState(initialValue || defaultValue);
    const handleChange = useCallback(
      (v) => {
        footer ? setValue(v) : onChange(v);
      },
      [onChange, footer]
    );
    const handleSave = useCallback(() => {
      onSave && onSave(value);
    }, [value, onSave]);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const splitted = value.split(":");
    const hour = (splitted.length >= 2 && splitted[0]) || "00";
    const minute = (splitted.length >= 2 && splitted[1]) || "00";

    return (
      <div className={className}>
        <Card className={`my-card time-picker-card`} style={{ width: "250px" }}>
          <Card.Header>
            <div className="d-flex flex-nowrap w-100 justify-content-between fw-bolder">
              <div className="col-1"></div>
              <div className=" className='col-10' d-flex flex-wrap">
                <div>{hour}</div>
                <div className="px-2">:</div>
                <div>{minute}</div>
              </div>
              <div className="d-flex justify-content-center align-items-center col-1">
                {close && <CloseButton className="p-0" variant="white" />}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <TimeSelectorBody
              value={value}
              onChange={handleChange}
            ></TimeSelectorBody>
          </Card.Body>
          {footer && (
            <Card.Footer>
              <div className="w-100 btn-group-wrapper d-flex justify-content-around">
                <Button
                  variant={closeVariant}
                  className="col-5 border-0"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant={saveVariant}
                  className="col-5 fw-bolder  border-0"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </Card.Footer>
          )}
        </Card>
      </div>
    );
  }
);
const TimeSelectorBody = memo(
  ({
    value = "00:00",
    onChange,
    buttonSize = "50px",
    variant = "light",
    timeActiveVariant = "primary",
  }) => {
    const splitted = value.split(":");
    const hour = (splitted.length >= 2 && splitted[0]) || "00";
    const minute = (splitted.length >= 2 && splitted[1]) || "00";

    const ref1 = useRef(null);
    const ref2 = useRef(null);

    const hours = Array(24).fill();
    const minutes = Array(60).fill();
    const handleClick = useCallback(
      (e) => {
        e.target.id === "hour"
          ? onChange && onChange(("0" + e.target.name).slice(-2) + ":" + minute)
          : onChange && onChange(hour + ":" + ("0" + e.target.name).slice(-2));
      },
      [hour, minute, onChange]
    );

    useEffect(() => {
      const h1 = (parseInt(hour) - 1) * 50;
      const h2 = (parseInt(minute) - 1) * 50;
      ref1.current.scrollTop(h1);
      ref2.current.scrollTop(h2);
    }, [hour, minute]);
    return (
      <div className="d-flex flex-nowrap w-100 justify-content-around time-selector-body">
        <div
          id="col-hours"
          className="col-hours d-flex flex-fill justify-content-center"
        >
          <Scrollbars
            autoHeight
            autoHide
            style={{ marginBottom: "0px", width: "auto" }}
            autoHeightMin={50}
            autoHeightMax={200}
            ref={ref1}
            renderView={(props) => (
              <div {...props} style={{ ...props.style, overflowX: "hidden" }} />
            )}
          >
            {hours.map((e, index) => (
              <div
                className="d-flex justify-content-center hours btn-wrapper"
                key={"h" + index}
              >
                <Button
                  id="hour"
                  variant={
                    index === parseInt(hour) ? timeActiveVariant : variant
                  }
                  name={index}
                  onClick={handleClick}
                  className={`text-center rounded-0 ${
                    index === parseInt(hour) ? "b-active " : ""
                  }`}
                  style={{ width: "100%", height: "50px" }}
                >
                  {("0" + index).slice(-2)}
                </Button>
              </div>
            ))}
          </Scrollbars>
        </div>
        <div
          id="col-minutes"
          className="col-minutes d-flex flex-fill minutes justify-content-center"
        >
          <Scrollbars
            autoHeight
            autoHide
            style={{ marginBottom: "0px", width: "auto" }}
            ref={ref2}
            autoHeightMin={50}
            autoHeightMax={200}
            renderView={(props) => (
              <div {...props} style={{ ...props.style, overflowX: "hidden" }} />
            )}
          >
            {minutes.map((e, index) => (
              <div
                className="d-flex justify-content-center btn-wrapper"
                key={"h" + index}
              >
                <Button
                  id="minute"
                  variant={
                    index === parseInt(minute) ? timeActiveVariant : variant
                  }
                  name={index}
                  onClick={handleClick}
                  className={`text-center rounded-0 ${
                    index === parseInt(minute) ? "b-active " : ""
                  }`}
                  style={{ width: buttonSize, height: "50px" }}
                >
                  {("0" + index).slice(-2)}
                </Button>
              </div>
            ))}
          </Scrollbars>
        </div>
      </div>
    );
  },
  isequal
);
export default TimePickerDropdown;
