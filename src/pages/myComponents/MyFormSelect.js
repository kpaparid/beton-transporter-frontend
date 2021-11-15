import React, { useState, useEffect } from "react";
import { Form } from "@themesberg/react-bootstrap";
import MyTextArea from "./TextArea/MyTextArea";
import Select from "react-select";
import { red } from "./MyConsts";

export const MyFormSelect = (props) => {
  const {
    availableValues,
    value,
    onChange,
    hidden = false,
    maxWidth,
    minWidth,
    className = "",
    justifyContent = "center",
  } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  function handleChange(selectedOption) {
    setSelectedValue(selectedOption.value);
    onChange && onChange(selectedOption.value);
  }

  const options = availableValues.map((v) => ({
    value: v,
    label: v,
  }));
  return (
    <>
      {availableValues && !hidden && (
        <div
          className={"dummy w-100 overflow-visible " + className}
          style={{
            maxWidth,
            minWidth,
          }}
          // onClick="event.stopPropagation()"
        >
          <Select
            placeholder={selectedValue}
            options={options}
            value={selectedValue}
            className="w-100"
            onChange={handleChange}
            isSearchable={false}
            menuPortalTarget={document.querySelector("body")}
            components={{
              IndicatorSeparator: () => null,
            }}
            styles={{
              control: (base) => ({
                ...base,
                border: 0,
                boxShadow: 0,
                minHeight: 21,
                transition: "none",
                width: "100%",
                backgroundColor: "inherit",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: 0,
                paddingLeft: justifyContent === "center" ? 27 : 0,
                justifyContent,
                width: 8 * (selectedValue + "").length + 100,
              }),
              singleValue: (base) => ({
                ...base,
                padding: 0,
                paddingLeft: 5,
                paddingRight: 5,
                color: "#2E3650",
              }),
              placeholder: (base) => ({
                ...base,
                padding: 0,
                paddingLeft: 5,
                paddingRight: 5,
                color: "#2E3650",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: 0,
                transition: "none",
                color: "#2E3650",
              }),

              indicatorSeparator: (base) => ({ ...base, margin: 3 }),
              indicatorsContainer: (base) => ({ ...base, paddingRight: 7 }),
              input: (base) => ({
                ...base,
                padding: 0,
                margin: 0,
                color: "#2E3650",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "black",
              },
            })}
          ></Select>
        </div>
      )}
    </>
  );
};
export const FormSelectArea = (props) => {
  const { id, defaultValue, minWidth, maxWidth, onChange, disabled } = props;
  return !disabled ? (
    <MyFormSelect {...props}></MyFormSelect>
  ) : (
    <MyTextArea>
      {{
        id,
        maxRows: 3,
        value: defaultValue,
        invalidation: true,
        onChange,
        minWidth,
        maxWidth,
        disabled,
      }}
    </MyTextArea>
  );
};
