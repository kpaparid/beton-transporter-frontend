import React, { useEffect } from "react";
import { Button } from "@themesberg/react-bootstrap";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { primaryVariant } from "./MyConsts";

import "./MyForm.css";

const defaultVariant = "primary";

export const EditBtn = (props) => {
  const editMode = useSelector((state) => state.tourTable.editMode);
  const { onClick, className = "", size, variant, value = "Edit" } = props;
  return (
    <MyBtn
      className={`${className} ${editMode ? "disabled" : ""} `}
      onClick={onClick}
      value={value}
      variant={variant}
      size={size}
    ></MyBtn>
  );
};
export const SaveBtn = (props) => {
  const editMode = useSelector((state) => state.tourTable.editMode);
  const { onClick, className = "", size, variant, value = "Save" } = props;
  return (
    <MyBtn
      className={`${className} ${editMode ? "d-block" : "disabled d-none"} `}
      onClick={onClick}
      value={value}
      variant={variant}
      size={size}
    ></MyBtn>
  );
};
export const BreakBtn = (props) => {
  const editMode = useSelector((state) => state.tourTable.editMode);
  const { onClick, className = "", size, variant, value = "Break" } = props;
  return (
    <MyBtn
      className={`${className} ${editMode ? "d-block" : "disabled d-none"} `}
      onClick={onClick}
      value={value}
      variant={variant}
      size={size}
    ></MyBtn>
  );
};
export const DownloadBtn = (props) => {
  const { onClick, className = "", size, variant, value = "Download" } = props;
  return (
    <MyBtn
      className={`${className} `}
      onClick={onClick}
      value={value}
      variant={variant}
      size={size}
    ></MyBtn>
  );
};
export const MyBtn = (props) => {
  const {
    onClick = "",
    value = "",
    className = "primary-btn",
    size = "",
    variant = defaultVariant,
    disabled,
  } = props;
  return (
    <Button
      className={className}
      onClick={onClick}
      size={size}
      disabled={disabled}
    >
      {value}
    </Button>
  );
};
