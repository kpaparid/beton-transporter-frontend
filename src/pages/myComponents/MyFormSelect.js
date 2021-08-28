import React, { useState, useEffect } from "react";
import { Form } from "@themesberg/react-bootstrap";
import MyTextArea from "./TextArea/MyTextArea";

export const MyFormSelect = (props) => {
  const {
    label,
    availableValues,
    id,
    value,
    onChange,
    onBlur,
    labelIsDisabled = false,
  } = props;
  const [defaultValue, setDefaultValue] = useState(value);

  useEffect(() => {
    setDefaultValue(value);
  }, [value]);
  function handleChange(e) {
    console.log("change");
    setDefaultValue(e.target.value);
    onChange(e);
  }
  return (
    <>
      {!labelIsDisabled && label && <Form.Label>{label}</Form.Label>}
      <select
        key={id}
        value={defaultValue}
        onChange={handleChange}
        onBlur={onBlur}
        selected
      >
        {availableValues.map((value, index) => (
          <option key={`${id}-${index}`}>{value}</option>
        ))}
      </select>
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
