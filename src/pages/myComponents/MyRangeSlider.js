import * as React from "react";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { Card } from "react-bootstrap";
import { Grid, Input } from "@material-ui/core";
import { isEqual } from "lodash";

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
    // "&:hover": {
    //   boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    // },
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

export const MyRangeSlider = React.memo(({ onChange, min = 0, max = 200 }) => {
  const [value, setValue] = React.useState([min, max]);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  const handleInputChange = (event, index) => {
    const newValue =
      index === 0
        ? [event.target.value, value[1]]
        : [value[0], event.target.value];
    if (newValue !== value) {
      setValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <Card className=' my-card"'>
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
              // valueLabelDisplay="on"
            />
          </div>
          <div className="container p-0 pt-3 d-flex justify-content-between">
            <div className="col-4">
              <RangeInput
                value={value[0]}
                size="small"
                onChange={(e) => handleInputChange(e, 0)}
                // disableUnderline
                // onBlur={handleBlur}
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
                onChange={(e) => handleInputChange(e, 1)}
                // onBlur={handleBlur}
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
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}, isEqual);
