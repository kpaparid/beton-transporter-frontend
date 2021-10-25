import { isEqual } from "lodash";
import * as React from "react";
import Select from "react-select";
import { useState, memo, useEffect } from "react";
export const OutlinedSelect = memo(({ onChange, value, values }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  useEffect(() => setSelectedValue(value), [value]);

  function handleChange(e) {
    setSelectedValue(e);
    onChange(e);
  }

  return (
    <div style={{ minWidth: "250px" }}>
      <Select
        className="basic-select"
        classNamePrefix="select_user"
        value={selectedValue}
        onChange={handleChange}
        options={values}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: "#F1F8FE",
          },
        })}
      />
    </div>
  );
}, isEqual);
