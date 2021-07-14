import React, { useState, useEffect } from "react";
import { Form } from "@themesberg/react-bootstrap";

export const MyFormSelect = (props) => {
  const {
    label,
    values,
    id,
    defaultValue,
    minWidth = "100px",
    maxWidth = "150px",
    onChange,
  } = props;
  // console.log(values)
  function handleChange(e) {
    onChange(e.target.value);
  }
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Select
          key={id}
          style={{
            width: "auto",
            minWidth: minWidth,
            fontSize: "0.875rem",
            textAlign: "center",
            textAlignLast: "center",
          }}
          onChange={handleChange}
        >
          <option defaultValue>{defaultValue}</option>
          {values.map((value, index) => (
            <option key={`${id}-${index}`}>{value}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
};