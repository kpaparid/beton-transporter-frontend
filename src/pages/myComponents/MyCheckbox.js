import React from "react";
import { Form, Dropdown } from "@themesberg/react-bootstrap";
// import './nstyle.scss'
import { Button } from "@themesberg/react-bootstrap";

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
