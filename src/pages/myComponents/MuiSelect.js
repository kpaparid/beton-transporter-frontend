import * as React from "react";
import Select from "react-select";

export const OutlinedSelect = ({ onChange, value, values }) => {
  return (
    <div style={{ minWidth: "250px" }}>
      <Select
        // styles={customStyles}
        className="basic-select"
        classNamePrefix="select_user"
        value={value}
        // value={values[0]}
        onChange={onChange}
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
};
