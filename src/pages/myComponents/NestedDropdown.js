import React, { forwardRef, memo, useCallback } from "react";
import {
  ButtonGroup,
  Button,
  Form,
  Accordion,
} from "@themesberg/react-bootstrap";
import { CustomDropdown } from "./CustomDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash";
import { Card } from "react-bootstrap";
import AccordionComponent from "../../components/AccordionComponent";

export const NestedDropdown = memo(
  forwardRef(
    (
      { data, children, component, onToggleItem, disableCheckBox = false },
      ref
    ) => {
      const items = data.map(
        (
          {
            id,
            as = ButtonGroup,
            text,
            checked,
            displayArrow = false,
            disabled = false,
            props,
          },
          index
        ) => {
          return {
            id: index,
            eventKey: "panel-" + index,
            title: (
              <CheckboxRow
                key={"DropdownRow-" + id + "-" + index}
                checked={checked}
                onChange={() => onToggleItem(id)}
                disableCheckBox={disableCheckBox}
              >
                <span className="h6 mb-0 fw-bold">{text}</span>
              </CheckboxRow>
            ),
            description: !disabled && component(props),
            disabled: disabled,
          };
        }
      );
      return (
        <>
          <Card variant="secondary">
            <Card.Header className="p-0">
              <Button
                variant="secondary"
                className="w-100 rounded-0 rounded-top "
              >
                Reset All
              </Button>
            </Card.Header>
            <Card.Body className="p-0 rounded-0 d-flex justify-content-center">
              <div>
                <AccordionComponent data={items} style={{ width: "400px" }} />
              </div>
            </Card.Body>
          </Card>
        </>
      );
    }
  ),
  isEqual
);
export const CheckboxRow = React.memo(
  ({ checked = true, onChange, className = "", disableCheckBox, children }) => {
    return (
      <div className={"checkbox-row d-flex align-items-center " + className}>
        {!disableCheckBox && (
          <Form.Check
            checked={checked}
            className="align-items-center m-0 ps-3 pe-1 justify-content-start"
            onChange={onChange}
          />
        )}

        <div className="ps-2 pe-2 container-fluid d-flex justify-content-between">
          {children}
        </div>
      </div>
    );
  },
  isEqual
);
