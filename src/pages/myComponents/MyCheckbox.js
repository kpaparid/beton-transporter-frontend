import React from "react";
import { Form, Dropdown, Card } from "@themesberg/react-bootstrap";
// import './nstyle.scss'
import { Button } from "@themesberg/react-bootstrap";

import "./MyForm.css";
import { isEqual } from "lodash";
function MyCheckboxContainer(props) {
  const {
    text,
    checked,
    handler,
    variant = "transparent",
    checkboxVariant = "primary",
    hover = "",
    className = "",
  } = props;

  return (
    <div className={"container-fluid p-0 m-0 " + className + " " + hover}>
      <Button
        variant={variant}
        onClick={handler}
        style={{ boxShadow: "0px 0px 0px" }}
        className="w-100 rounded-0"
      >
        <div className="container-fluid w-100 ps-3 pe-4 d-flex justify-content-between">
          <div
            className="text-start"
            // onMouseLeave={(e) => (e.currentTarget.scrollLeft = 0)}
          >
            {text}
          </div>
          <Form.Check className="ps-4 d-flex justify-content-between g-0 align-items-center">
            <div className="align-items-center">
              <Form.Check.Input
                type="checkbox"
                variant={checkboxVariant}
                disabled
                checked={checked}
              />
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
        <Card
          className="checkboxFilterCard"
          variant="primary"
          style={{ maxWidth: "300px" }}
        >
          <Card.Header className="p-0 bg-secondary text-white">
            <MyCheckboxContainer
              text={<div className="fw-bold text-start">Select All</div>}
              handler={() => onToggleAll(data.map((e) => e.text))}
              checked={checkedAll}
              className="w-100"
              variant={"secondary"}
              checkboxVariant={"tertiary"}
              // checked={true}
            />
          </Card.Header>
          <Card.Body className="p-0">
            <div style={{ height: "300px", overflow: "auto" }}>
              {data.map((item, index) => (
                <MyCheckboxContainer
                  key={"MyCheckboxContainer" + index}
                  text={item.text}
                  variant={"transparent"}
                  checked={item.checked}
                  handler={() => onToggleOne(item.text)}
                  hover="checkbox-row"
                />
              ))}
            </div>
          </Card.Body>
        </Card>
      </>
    );
  },
  isEqual
);
