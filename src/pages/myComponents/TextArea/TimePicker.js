import isequal from "lodash.isequal";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { CustomDropdown } from "../Filters/CustomDropdown";
import { ButtonGroup } from "react-bootstrap";
import { Button, Card } from "@themesberg/react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
export const MyTimePicker = memo(
  ({
    value = "00:00",
    onChange,
    disabled = false,
    portal = true,
    withButton = false,
    inputStyle,
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
        <div className="d-block w-100">
          <div className="d-flex flex-nowrap w-100 align-items-center">
            <CustomDropdown
              id={"TourFilter"}
              as={ButtonGroup}
              disabled={disabled}
              toggleAs="custom"
              className={!withButton ? "w-100" : null}
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
              <TimeSelector value={value} onChange={onChange}></TimeSelector>
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

export const TimeSelector = memo(({ value = "00:00", onChange }) => {
  const splitted = value.split(":");
  const hour = (splitted.length >= 2 && splitted[0]) || "00";
  const minute = (splitted.length >= 2 && splitted[1]) || "00";

  return (
    <Card className="my-card" style={{ width: "250px" }}>
      <Card.Header>
        <div className="d-flex flex-nowrap w-100 justify-content-center fw-bolder">
          <div>{hour}</div>
          <div className="px-2">:</div>
          <div>{minute}</div>
        </div>
      </Card.Header>
      <Card.Body>
        <TimeSelectorBody value={value} onChange={onChange}></TimeSelectorBody>
      </Card.Body>
    </Card>
  );
});
const TimeSelectorBody = memo(
  ({ value = "00:00", onChange, buttonSize = "50px" }) => {
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
        <div id="col-hours" className="d-flex flex-fill justify-content-center">
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
              <div className="d-flex justify-content-center">
                <Button
                  id="hour"
                  name={index}
                  onClick={handleClick}
                  variant={index === parseInt(hour) ? "primary" : "light"}
                  className="text-center rounded-0"
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
          className="d-flex flex-fill justify-content-center"
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
              <div className="d-flex justify-content-center">
                <Button
                  id="minute"
                  name={index}
                  onClick={handleClick}
                  variant={index === parseInt(minute) ? "primary" : "light"}
                  className="text-center rounded-0"
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
export default MyTimePicker;
