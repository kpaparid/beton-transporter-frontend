import { Dropdown } from "@themesberg/react-bootstrap";
import React, { useState, forwardRef, useEffect } from "react";
import { Portal } from "react-portal";

const CustomToggle = forwardRef(({ children, onClick }, ref) => {
  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </div>
  );
});

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        aria-labelledby={labeledBy}
        style={style}
      >
        {children}
      </div>
    );
  }
);

export const MyDropdown = (props) => {
  const { disabled = false, ariaLabel, MenuComponent, ToggleComponent } = props;
  const [show, setShow] = useState(false);

  return (
    <Dropdown
      data-testid="dropdown"
      aria-label={ariaLabel + "_dropdown"}
      show={!disabled && show}
      onToggle={(_t, _e, metadata) => {
        metadata.source ? setShow(true) : setShow(false);
      }}
    >
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {ToggleComponent}
      </Dropdown.Toggle>
      <Portal>
        <Dropdown.Menu
          className="p-0"
          style={{ minWidth: "100px" }}
          as={CustomMenu}
        >
          <Dropdown.Item className="p-0" eventKey="1">
            {MenuComponent}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Portal>
    </Dropdown>
  );
};
