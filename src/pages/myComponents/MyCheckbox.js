import React from "react";
import { Form, Dropdown, ToggleButton } from "@themesberg/react-bootstrap";
// import './nstyle.scss'
import { Button } from "@themesberg/react-bootstrap";
import { useEffect, useState } from "react";

import InputRange from "react-input-range";
import { useSelector, useDispatch } from "react-redux";
import { ACTIONS } from "../reducers/redux";

function MyCheckboxContainer(props) {
  const { labels, text, index = "0", checked, handler } = props;

  return (
    <div className="container-fluid p-0 py-1 px-2" key={index}>
      <Button
        className="w-100"
        id={"nested_checkbox_" + index}
        variant="white"
        onClick={handler}
        style={{ boxShadow: "0px 0px 0px" }}
      >
        <div className="container-fluid mycontainer d-flex justify-content-between">
          <div>{text}</div>
          <Form.Check
            className="d-flex justify-content-between g-0 align-items-center"
            id={`checkbox-${labels.id}-${index}`}
            htmlFor={`checkbox-${labels.id}-${index}`}
          >
            <div className="align-items-center">
              <Form.Check.Input type="checkbox" disabled checked={checked} />
            </div>
          </Form.Check>
        </div>
      </Button>
    </div>
  );
}

export default (props) => {
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
      type: ACTIONS.NESTEDFILTER_TOGGLEALL,
      payload: {
        label: label,
        data: data[label],
      },
    });
  }
  function toggleOne(label, value) {
    console.log("click nestedFilter Single");
    dispatch({
      type: ACTIONS.NESTEDFILTER_TOGGLEONE,
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
