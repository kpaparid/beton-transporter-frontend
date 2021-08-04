import React, { useState, useEffect } from "react";
import { Form } from "@themesberg/react-bootstrap";
import MyTextArea from "./TextArea/MyTextArea";

export const MyFormSelect = (props) => {
  const {
    label,
    availableValues,
    id,
    value,
    minWidth = "100px",
    maxWidth = "150px",
    onChange,
    labelIsDisabled = false,
  } = props;

  return (
    <>
      {!labelIsDisabled && label && <Form.Label>{label}</Form.Label>}
      <select
        key={id}
        style={{
          minWidth: minWidth,
          fontSize: "inherit",
          textAlign: "center",
          textAlignLast: "center",
        }}
        onChange={onChange}
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
