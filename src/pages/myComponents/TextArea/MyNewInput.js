import React, { useEffect, useState, useMemo, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "../MyForm.css";
import { imgInvalid, imgValid, validationType } from "../MyConsts";
import { MyFormSelect } from "../MyFormSelect";
import { DateSelectorDropdown } from "../MyOwnCalendar";
import {
  calcInvalidation,
  calcValidation,
  formatInput,
} from "../util/utilities";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";

export const Input = React.memo((props) => {
  const {
    value,
    type = "text",
    editSelector,
    isSelected = false,
    ...rest
  } = props;
  const isValid = useMemo(
    () => calcValidation(value + "", validationType(type), false),
    [value, type]
  );
  const isInvalid = useMemo(
    () => calcInvalidation(value + "", validationType(type), true),
    [value, type]
  );
  const editMode = useSelector(editSelector);

  const editable = useMemo(
    () => isSelected && editMode,
    [editMode, isSelected]
  );
  const img = useMemo(
    () => (isInvalid ? imgInvalid : isValid ? imgValid : "none"),
    [isInvalid, isValid]
  );
  const className = useMemo(
    () =>
      "wrapper" +
      (editable ? " wrapper-editable" : "") +
      (isInvalid ? " invalid" : isValid ? " valid" : "") +
      (type === "constant" ? " selection" : ""),
    [editable, isValid, isInvalid, type]
  );

  return (
    <div className={className}>
      <Container
        {...{
          ...rest,
          type,
          value,
          img,
          className,
        }}
      />
    </div>
  );
});

export const Container = React.memo(
  ({
    img,
    className,
    value,
    type,
    measurement,
    maxWidth = "150px",
    minWidth = "10px",
    ...rest
  }) => {
    return (
      <>
        <div
          className="text-container"
          style={{
            maxWidth,
            minWidth,
          }}
        >
          <div className="dummy">
            <div
              className="img-container"
              style={{ backgroundImage: img }}
            ></div>
            <div className="text-flex">
              <span
                className="text-span"
                onMouseLeave={(e) => (e.currentTarget.scrollLeft = 0)}
              >
                {formatInput(value, type)}
              </span>
            </div>
            {measurement !== "" && (
              <span className="measurement">{measurement}</span>
            )}
          </div>
          <LazyContainer {...{ value, type, ...rest }} />
        </div>
      </>
    );
  },
  isEqual
);

const LazyContainer = React.memo((props) => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setVis(true);
  }, []);
  return <div className="finalwrappi">{vis && <TextInput {...props} />}</div>;
});

const TextInput = ({ onChange, type, availableValues, ...rest }) => {
  function handleTextAreaChange(e) {
    onChange(e.target.value);
  }

  switch (type) {
    case "date":
      return <DateSelectorDropdown onChange={onChange} {...rest} />;
    case "constant":
      return (
        <MyFormSelect
          onChange={handleTextAreaChange}
          availableValues={availableValues}
          {...rest}
          labelIsDisabled
        />
      );
    default:
      return <TextareaAutosize {...rest} onChange={handleTextAreaChange} />;
  }
};

export default Input;
