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
import { CustomDropdown } from "./Filters/CustomDropdown";

export const TimePickerModal = ({
  defaultValue = "00:00",
  value: initialValue = defaultValue,
  buttonText,
  buttonVariant = "primary",
  closeVariant = "nonary",
  saveVariant = "senary",
  timeVariant = "primary",
  timeActiveVariant = "primary",
  buttonClassName = "",
  modalClassName = "",
  modalContentClassName = "",
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(initialValue);
  const splitted = value.split(":");
  const hour = (splitted.length >= 2 && splitted[0]) || "00";
  const minute = (splitted.length >= 2 && splitted[1]) || "00";

  const handleClose = () => {
    setShow(false);
    setValue(defaultValue);
  };
  const handleShow = () => setShow(true);
  const handleSave = () => {
    onChange(value);
    handleClose();
  };

  useEffect(() => setValue(initialValue), [initialValue]);
  return (
    <>
      <Button
        variant={buttonVariant}
        onClick={handleShow}
        className={"time-picker-modal-btn " + buttonClassName}
      >
        {buttonText}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={modalClassName + " time-picker-modal"}
        contentClassName={
          "time-picker-modal-content  bg-transparent " + modalContentClassName
        }
        scrollable
      >
        <Modal.Header>
          <Modal.Title className="d-flex flex-nowrap justify-content-center align-items-center w-100">
            <div className="title-wrapper d-flex flex-nowrap">
              <div>{hour}</div>
              <div className="px-2">:</div>
              <div>{minute}</div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TimeSelectorBody
            variant={timeVariant}
            timeActiveVariant={timeActiveVariant}
            value={value || defaultValue}
            onChange={setValue}
          ></TimeSelectorBody>
        </Modal.Body>
        <Modal.Footer className="border-senary">
          <div className="w-100 btn-group-wrapper d-flex justify-content-around">
            <Button
              variant={closeVariant}
              className="col-5"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant={saveVariant}
              className="col-5 fw-bolder"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
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
              id={"TourFilter"}
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
    value,
    onChange,
    defaultValue = "00:00",
    close = false,
    className = "",
  }) => {
    const splitted = (value || defaultValue).split(":");
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
              value={value || defaultValue}
              onChange={onChange}
            ></TimeSelectorBody>
          </Card.Body>
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
      <div className="d-flex flex-nowrap w-100 justify-content-around">
        <div
          id="col-hours"
          className="col-hours d-flex flex-fill justify-content-center"
        >
          <Scrollbars
            autoHeight
            autoHide
            style={{
              marginBottom: "0px",
              width: buttonSize,
            }}
            autoHeightMin={50}
            autoHeightMax={200}
            ref={ref1}
            renderTrackHorizontal={(props) => (
              <div
                {...props}
                style={{ display: "none" }}
                className="track-horizontal"
              />
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
            renderTrackHorizontal={(props) => (
              <div
                {...props}
                style={{ display: "none" }}
                className="track-horizontal"
              />
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
