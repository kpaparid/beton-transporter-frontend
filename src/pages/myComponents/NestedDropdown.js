import React, { forwardRef, memo, useCallback } from "react";
import { ButtonGroup, Dropdown, Form } from "@themesberg/react-bootstrap";
import { CustomDropdown } from "./CustomDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash";

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
          return (
            <CheckboxRow
              key={"DropdownRow-" + id + "-" + index}
              checked={checked}
              onChange={() => onToggleItem(id)}
              displayArrow={displayArrow}
              disableCheckBox={disableCheckBox}
            >
              <CustomDropdown
                ref={{ ref: ref }}
                id={"TourFilterNested"}
                as={as}
                variant="white"
                disabled={disabled}
                className="w-100 shadow-button-none dropdown-row revertio"
                value={
                  <div className="d-flex w-100">
                    <div className="d-flex flex-fill">{text}</div>
                    {displayArrow && (
                      <div className={`dropdown-arrow text-right`}>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="dropdown-arrow ms-3"
                        />
                      </div>
                    )}
                  </div>
                }
              >
                {/* <Dropdown.Item className="p-0"> */}
                {React.cloneElement(component, { ...props })}
                {/* {children} */}
                {/* </Dropdown.Item> */}
              </CustomDropdown>
            </CheckboxRow>
          );
        }
      );
      return items;
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
