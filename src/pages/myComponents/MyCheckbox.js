import React from "react";
import { Form, Dropdown, ToggleButton } from "@themesberg/react-bootstrap";
// import './nstyle.scss'
import { Button } from "@themesberg/react-bootstrap";
import { useEffect, useState } from "react";

import InputRange from "react-input-range";
import { useSelector, useDispatch } from "react-redux";
import { ACTIONS } from "../reducers/redux";
import "./MyForm.css";
import { isEqual } from "lodash";
function MyCheckboxContainer(props) {
  const { text, checked, handler } = props;

  return (
    <div
      className="container-fluid p-0 py-1 px-2 revertio"
      style={{ maxWidth: "250px" }}
    >
      <Button
        variant="white"
        onClick={handler}
        style={{ boxShadow: "0px 0px 0px" }}
        className="w-100"
      >
        <div className="container-fluid mycontainer w-100 d-flex justify-content-between">
          <div
            className="truncate-hovered-overflow"
            onMouseLeave={(e) => (e.currentTarget.scrollLeft = 0)}
          >
            {text}
          </div>
          <Form.Check className="d-flex justify-content-between g-0 align-items-center">
            <div className="align-items-center">
              <Form.Check.Input type="checkbox" disabled checked={checked} />
            </div>
          </Form.Check>
        </div>
      </Button>
    </div>
  );
}
export const MyCheckboxFilter = React.memo(
  ({ onToggleAll, onToggleOne, checkedAll = true, data }) => {
    console.log(data);
    return (
      <>
        <MyCheckboxContainer
          text="Select All"
          handler={() => onToggleAll(data.map((e) => e.text))}
          checked={checkedAll}
          // checked={true}
        />
        <Dropdown.Divider></Dropdown.Divider>
        {data.map((item, index) => (
          <MyCheckboxContainer
            key={"MyCheckboxContainer" + index}
            text={item.text}
            checked={item.checked}
            handler={() => onToggleOne(item.text)}
          />
        ))}
      </>
    );
  },
  isEqual
);
const MyCheckbox = (props) => {
  const { labels, data } = props;
  const dispatch = useDispatch();

  const checkedAll =
    data[labels.id].filter((item) => item.checked === "checked").length ===
    data[labels.id].length
      ? "checked"
      : "";
  console.log(checkedAll);

  function toggleAll(label, data, event) {
    console.log("click nestedFilter All");
    dispatch({
      type: ACTIONS.NESTEDFILTER_TOGGLE_ALL,
      payload: {
        label: label,
        data: data[label],
      },
    });
  }
  function toggleOne(label, value) {
    console.log("click nestedFilter Single");
    dispatch({
      type: ACTIONS.NESTEDFILTER_TOGGLE_ONE,
      payload: {
        label: label,
        value: value,
      },
    });
  }

  return (
    <>
      <MyCheckboxContainer
        labels={labels}
        text="Select All"
        handler={(e) => toggleAll(labels.id, data, e)}
        checked={checkedAll}
      />
      <Dropdown.Divider></Dropdown.Divider>
      {data[labels.id].map((item, index) => (
        <MyCheckboxContainer
          key={index}
          index={index}
          labels={labels}
          text={item.value}
          checked={item.checked}
          handler={(e) => toggleOne(labels.id, item.value)}
        />
      ))}
    </>
  );
};
export default MyCheckbox;
