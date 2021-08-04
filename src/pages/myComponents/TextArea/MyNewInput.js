import { Fade, Form, Table } from "@themesberg/react-bootstrap";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Suspense } from "react";
import AutosizeInput from "react-input-autosize";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";
import "../MyForm.css";
import loadable from "@loadable/component";
import {
  green,
  grey,
  imgInvalid,
  imgValid,
  red,
  validationType,
} from "../MyConsts";
import { MyDropdown } from "../MyDropdown";
import { FormSelectArea, MyFormSelect } from "../MyFormSelect";
import { DateSelectorDropdown } from "../MyOwnCalendar";
import { editMode } from "../MySelectors";
import {
  calcColor,
  calcInvalidation,
  calcValidation,
  formatInput,
} from "../util/utilities";
import LazyLoad from "react-lazyload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import LazyComponent from "../LazyComponent";

const Wrapper = styled.div(
  ({ editable, isValid, isInvalid, colorize, image, type }) => `
  height: 100%;
  font-size: 0.875rem;
  color: black !important;
  display: flex;
  flex: nowrap;
  justify-content: center;
  box-shadow: none;
  transition: all 0.2s ease;
  border: ${editable ? `1.5px solid ${colorize()}` : `none`};

  .dummy {
    .text-span{
    overflow: hidden;
    text-overflow: ellipsis;
    }
    display: flex;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    background-repeat: no-repeat;
    background-size: calc(0.75em + 1.55rem) calc(0.55em + 0.8rem);
    background-position: left;
    background-image: ${image};
    padding-right: ${
      type === "constant" && editable
        ? "1.8rem !important"
        : !editable & (isValid || isInvalid)
        ? "1rem !important"
        : "4px"
    };
    padding-left: ${
      !editable && (isValid || isInvalid) ? "2rem !important;" : "4px;"
    }
    ${
      editable
        ? `min-height:0;
          //visibility: hidden;
          //height: 0;
          `
        : `min-height: 25px;
          visibility: visible;
          height: auto;
          padding-top: 2px;
          padding-bottom: 2px;
          `
    }
  }
  :focus-within {
    box-shadow: 0 0 0 0.2rem ${colorize("50%")};
    border: 1.5px solid ${colorize()};
    background-color: white;
  }
  :hover {
    background-color: white;
    .text-span {
      ${!editable && "overflow: auto; text-overflow: inherit;"}
    }
  }
  select {
    height: 25px;
    color: black;
    border: none;
    width: 100%;
    background-color: transparent;
    padding-right: 0rem !important;
    padding-left: 0rem !important;
    :focus {
      border: none;
      box-shadow: none;
      outline: none;
    }
    :focus-visible {
      outline: none;
    }
  }
  input,
  textarea {
    width: 100%;
    background-color: transparent;
    border: none;
    text-align: center;
    resize: none;
    vertical-align: bottom;

    padding-right: 0.25rem !important;
    padding-left: 0.25rem !important;

    overflow: hidden;
    :focus {
      outline: none;
    }
  }
`
);

const Input2 = React.memo((props) => {
  const { value, type } = props.data;
  const isValid = calcValidation(value + "", validationType(type), false);
  const isInvalid = calcInvalidation(value + "", validationType(type), true);
  return (
    <MyNewInput
      {...{
        ...props,
        isValid,
        isInvalid,
      }}
    />
  );
});
export const MyNewInput = React.memo((props) => {
  const {
    isValid = false,
    isInvalid = false,
    editable = false,
    data,
    onChange,
    onBlur,
  } = props;
  const {
    value,
    type,
    measurement,
    maxWidth = "150px",
    minWidth = "10px",
  } = data;
  const img = isInvalid ? imgInvalid : isValid ? imgValid : "none";
  const className =
    "wrapper" +
    (editable ? " wrapper-editable" : "") +
    (isInvalid ? " invalid" : isValid ? " valid" : "") +
    (type === "constant" ? " selection" : "");
  return (
    <>
      <div
        className={className}
        style={{
          maxWidth,
          minWidth,
        }}
      >
        <div className="text-container">
          <div className="dummy" style={{ backgroundImage: img }}>
            <span className="text-span">{formatInput(value, type)}</span>
            {!editable && measurement !== "" && (
              <span className="ps-1 measurement">{measurement}</span>
            )}
          </div>
          <Compi3 onBlur={onBlur} onChange={onChange} data={data} />
        </div>
      </div>
    </>
  );
});

const Compi3 = React.memo((props) => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setVis(true);
  }, []);
  return (
    <div className="finalwrappi">{vis && <LazyComponent {...props} />}</div>
  );
});
// const LazyComp = React.lazy(() => import("../LazyComponent"));
const LazyComp = loadable(() => import("../LazyComponent"));
const Compi4 = React.memo((props) => {
  const { type, onBlur, value, onChange } = props;
  console.log(editMode);
  return (
    <Suspense
      fallback={
        <div className="dummy dummy-visible">
          <span className="text-span">loading</span>
        </div>
      }
    >
      <LazyComp {...{ type, onBlur, value, onChange }}></LazyComp>
    </Suspense>
  );
});
const Compi2 = (props) => {
  const { type, onBlur, value, onChange } = props;
  function handleTextAreaChange(e) {
    onChange(e.target.value);
  }

  return (
    <LazyLoad height={250} placeholder={<div>loading</div>}>
      <TextareaAutosize
        onBlur={onBlur}
        value={value}
        onChange={handleTextAreaChange}
      />
    </LazyLoad>
  );
};

// const LazyComp = loadable(() => import("../LazyComponent"));
// const LazyComp = React.lazy(() => import("../LazyComponent"));
const Compi = (props) => {
  // formatInput(props.value, props.type)
  return (
    <div>
      {/* <div className="dummy dummy-visible">
        <span className="text-span">loading {props.value}</span>
      </div> */}
      <Suspense
        fallback={
          <div className="dummy dummy-visible">
            <span className="text-span">loading</span>
          </div>
        }
      >
        {/* <LazyComp {...props}></LazyComp> */}
      </Suspense>
    </div>
  );
};

export default Input2;
