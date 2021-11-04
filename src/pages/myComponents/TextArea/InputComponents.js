import isEqual from "lodash.isequal";
import React, { react, useEffect, useCallback, memo } from "react";
import { DateSelectorDropdown } from "./MonthPicker";
import TextField from "@mui/material/TextField";
import TimePicker from "@mui/lab/TimePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

import moment from "moment";
import { createTheme } from "@mui/material/styles";

export const MuiController = memo(({ control, rules, Input, id, ...rest }) => {
  return (
    <Controller
      rules={rules}
      name={id}
      control={control}
      defaultValue={""}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <Input
            {...{ onChange, value, ...rest }}
            error={error !== undefined}
          ></Input>
        );
      }}
    />
  );
}, isEqual);

export const MuiCustomSelect = memo(
  ({ availableValues, value = "", onChange, label, error }) => {
    return (
      <FormControl sx={{ minWidth: 80, width: "100%" }} error={error}>
        <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
        <Select
          error={error}
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={value === null ? "" : value}
          label={label}
          onChange={onChange}
          fullWidth
          variant="standard"
        >
          {availableValues.map((v, index) => (
            <MenuItem value={v} key={"select-" + index}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  },
  isEqual
);
export const MuiCustomTimePicker = memo(
  ({ value = "", onChange, label, error }) => {
    const formattedValue = moment(value, "HH:m");
    const recalcError =
      error ||
      (value !== "" &&
        value !== "Invalid Date" &&
        !moment(value, "HH:mm", true).isValid());
    return (
      <TimePicker
        ampm={false}
        onChange={(date) => onChange(moment(date).format("HH:m"))}
        value={formattedValue}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label={label}
              error={recalcError}
            ></TextField>
          );
        }}
      ></TimePicker>
    );
  },
  isEqual
);
export const MuiCustomDatePicker = memo(({ value, onChange, label, error }) => {
  const recalcError =
    error ||
    (value !== null &&
      value !== "" &&
      value !== "Invalid Date" &&
      !moment(value, "DD/MM/YYYY", true).isValid());
  return (
    <DateSelectorDropdown
      withButton
      value={value}
      portal={false}
      onChange={onChange}
      Input={(params) => (
        <TextField {...params} error={recalcError} label={label} />
      )}
      // inputProps={{ error: recalcError, label }}
    />
  );
}, isEqual);
export const MuiCustomTextField = memo(
  ({ control, label, value, type, id }) => {
    return (
      <Controller
        name="firstName"
        control={control}
        defaultValue={value ? value : ""}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            type={type}
            label={label}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
        rules={{ required: "First name required" }}
      />
    );
  },
  isEqual
);

export const inputComponentsTheme = createTheme({
  palette: {
    error: { main: "#fa5252" },
    primary: { main: "#2e3650" },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          marginTop: "20px !important",
        },
        input: {
          paddingLeft: "14px",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "standard",
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            transform: "translate(14px, 16px) scale(1)",
            fontWeight: 700,
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(0, -2.5px) scale(0.95)",
            color: "#2e3650",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          padding: "0.5rem",
          "& .MuiFormHelperText-root": {
            color: "green",
          },
          ":hover": {
            boxShadow: "0 0 0 0.2rem rgb(46, 54, 80, 50%)",
            border: 0,
          },
          "&.Mui-error:hover": {
            boxShadow: "0 0 0 0.2rem rgb(250, 82, 82, 50%)",
          },
        },
        notchedOutline: {
          top: 0,
        },
        input: {
          width: "100%",
          fontSize: "0.875rem",
          color: "#2e3650",
          lineHeight: "21px",
          top: 0,
          textAlign: "center",
          padding: 0,
        },

        disabled: {},
        focused: {},
      },
    },
  },
});
