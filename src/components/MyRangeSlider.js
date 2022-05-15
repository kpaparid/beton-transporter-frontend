import { Input } from "@material-ui/core";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { isEqual } from "lodash";
import PropTypes from "prop-types";
import * as React from "react";
import { Card } from "react-bootstrap";

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

const RangeInput = styled(Input)(({ theme }) => ({
  // color: "#3a8589",
  height: 3,
  padding: "13px 0px",
  textAlign: "center",
  "& .MuiInput-input": {
    textAlign: "center",
  },
  "&:not(.Mui-disabled):hover::before": {
    borderColor: "#567ba0",
  },
  "&:not(.Mui-disabled)::after": {
    borderColor: "#ff9751",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
}));

const MySlider = styled(Slider)(({ theme }) => ({
  color: "#3a8589",
  height: 3,
  padding: "13px 0",

  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    "& .bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 3,
  },
}));

function ThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </SliderThumb>
  );
}

ThumbComponent.propTypes = {
  children: PropTypes.node,
};

export const MyRangeSlider = React.memo(
  ({ onChange, min = 0, max = 200, gte = min, lte = max, title }) => {
    const [value, setValue] = React.useState([gte, lte]);

    const handleSliderChange = (event, newValue) => {
      setValue(newValue);
      onChange(newValue);
    };

    const handleInputChange = (event) => {
      const name = event.target.name;
      const calcValue =
        event.target.value > max
          ? max
          : event.target.value < min
          ? min
          : event.target.value;
      const newValue =
        name === "gte" ? [calcValue, value[1]] : [value[0], calcValue];
      if (newValue !== value) {
        setValue(newValue);
        onChange(newValue);
      }
    };

    return (
      <Card className="my-card">
        {title && (
          <Card.Header>
            <h5 className="w-100 text-align-center text-center">{title}</h5>
          </Card.Header>
        )}
        <Card.Body className="mui-slider">
          <div className="d-flex flex-wrap">
            <div
              className="col-12"
              style={{ paddingLeft: "1.9rem", paddingRight: "1.9rem" }}
            >
              <MySlider
                components={{ Thumb: ThumbComponent }}
                getAriaLabel={(index) =>
                  index === 0 ? "Minimum price" : "Maximum price"
                }
                min={min}
                max={max}
                value={value}
                onChange={handleSliderChange}
              />
            </div>
            <div className="container p-0 pt-3 d-flex justify-content-between">
              <div className="col-4">
                <RangeInput
                  value={value[0]}
                  size="small"
                  onChange={handleInputChange}
                  name="gte"
                  className="text-center w-100"
                  inputProps={{
                    step: 1,
                    min: min,
                    max: max,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </div>
              <div className="col-4">
                <RangeInput
                  value={value[1]}
                  size="small"
                  onChange={handleInputChange}
                  className="text-center w-100"
                  name="lte"
                  inputProps={{
                    step: 1,
                    min: gte,
                    max: lte,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  },
  isEqual
);
