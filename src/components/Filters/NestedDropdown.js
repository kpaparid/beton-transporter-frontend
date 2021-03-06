import React, { forwardRef, memo } from "react";
import {
  ButtonGroup,
  Button,
  Form,
  useAccordionButton,
} from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import { Card } from "react-bootstrap";
import AccordionComponent from "../AccordionComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
function CustomToggle({ children, eventKey, onChange, ...rest }) {
  const decoratedOnClick = useAccordionButton(eventKey, (e) => {
    e.stopPropagation();
    onChange(e);
  });

  return (
    <CheckboxRow onChange={decoratedOnClick} {...rest}>
      {children}
    </CheckboxRow>
  );
}
export const NestedDropdown = memo(
  forwardRef(
    (
      {
        data,
        selectData,
        children,
        component,
        onToggleItem,
        resetAll,
        className,
        disableCheckBox = false,
        onClose,
      },
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
              <CustomToggle
                key={"DropdownRow-" + id + "-" + index}
                className="w-100"
                checked={checked}
                onChange={() => onToggleItem(id)}
                disableCheckBox={disableCheckBox}
              >
                <span className="h6 mb-0 fw-bold">{text}</span>
              </CustomToggle>
            ),
            description: !disabled && component({ ...props, selectData }),
            disabled: disabled,
          };
        }
      );
      return (
        <>
          <Card className={`my-card ${className}`}>
            <div>
              <Card.Header className="card-btn">
                <Button
                  variant="secondary"
                  className="w-100 rounded-0 rounded-top container"
                  onClick={resetAll}
                >
                  <span className="reset">Reset All</span>
                  <Button className="close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                  </Button>
                </Button>
              </Card.Header>
              <Card.Body className="p-0 rounded-0 d-flex justify-content-center">
                <AccordionComponent data={items} />
              </Card.Body>
            </div>
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
      <div className={"d-flex align-items-center " + className}>
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
