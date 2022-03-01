import React, { useState } from "react";
import Select from "react-select";

export const MyFormSelect = (props) => {
  const {
    availableValues,
    value,
    onChange,
    hidden = false,
    maxWidth,
    minWidth,
    className = "",
    disabledArrow,
  } = props;
  const [selectedValue, setSelectedValue] = useState(
    availableValues.find((v) => v.label === value)
  );
  function handleChange(selectedOption) {
    setSelectedValue(selectedOption);
    onChange && onChange(selectedOption?.label || "");
  }

  return (
    <div
      className="dummy px-2 d-flex flex-nowrap justify-content-center w-100"
      style={{ maxWidth }}
    >
      {availableValues && !hidden && (
        <div
          className={
            "d-flex justify-content-center overflow-visible w-100 " + className
          }
        >
          <Select
            disabledArrow={disabledArrow}
            options={availableValues}
            defaultValue={selectedValue}
            // className="w-100"
            classNamePrefix="react-select"
            onChange={handleChange}
            isSearchable={false}
            isClearable={true}
            style={{ justifyContent: "center" }}
            components={{
              IndicatorSeparator: () => null,
            }}
            menuPortalTarget={document.getElementById("root")}
            styles={{
              container: (base) => ({
                ...base,
                justifyContent: "center",
                width: "100%",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                // width: "100%",
                // width: "calc(100% + 80px)",
                // maxWidth,
              }),
              valueContainer: (base) => ({
                ...base,
                padding: 0,
                justifyContent: "center",
                width: selectedValue
                  ? 7 * (selectedValue?.label).length + 50
                  : 73,
              }),
              singleValue: (base) => ({
                ...base,
                padding: 0,
                marginLeft: 0,
                marginRight: 0,
              }),
            }}
            closeMenuOnScroll={(event) => {
              return event.target.id === "root";
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "black",
              },
            })}
          />
        </div>
      )}
    </div>
  );
};
