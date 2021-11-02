import React, { forwardRef, useCallback } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import "./MyForm.css";
import { Portal } from "react-portal";
import DropdownToggle from "@themesberg/react-bootstrap/lib/esm/DropdownToggle";
export const CustomDropdown = forwardRef(
  (
    {
      variant = "primary",
      value = "Dropdown Button",
      as,
      className = "",
      menuClassName = "",
      toggleClassName = "",
      disabled = false,
      children,
      toggleAs = "default",
      toggleStyle = {},
      portal = true,
      drop,
    },
    { ref, refList = [] }
  ) => {
    const toggleAsComponent =
      toggleAs === "default" ? DropdownToggle : CustomToggle;
    const [show, setShow] = useState(false);
    const handleToggle = useCallback((_t, _e, metadata) => {
      const focusWithin = refList
        .map(
          (ref) => ref.current && ref.current.contains(document.activeElement)
        )
        .reduce((a, b) => a || b, false);
      (_e && _e.source !== "rootClose") ||
      (typeof focusWithin != "undefined" && focusWithin != null && focusWithin)
        ? setShow(true)
        : setShow(false);
    }, []);
    return (
      <Dropdown
        as={as}
        className={className}
        show={!disabled && show}
        onToggle={handleToggle}
        disabled={disabled}
        align="start"
      >
        <Dropdown.Toggle
          as={toggleAsComponent}
          variant={variant}
          id="dropdown-basic"
          style={toggleStyle}
          className={"shadow-none py-1 " + toggleClassName}
        >
          {value}
        </Dropdown.Toggle>
        {portal ? (
          <Portal>
            <Dropdown.Menu
              flip={false}
              ref={ref}
              className={"m-0 p-0 border border-0 " + menuClassName}
            >
              {children}
            </Dropdown.Menu>
          </Portal>
        ) : (
          <Dropdown.Menu
            popperConfig={{
              modifiers: [{ name: "offset", options: { offset: [-250, 0] } }],
            }}
            ref={ref}
            className={"p-0 border border-0 " + menuClassName}
          >
            {children}
          </Dropdown.Menu>
        )}
      </Dropdown>
    );
  }
);
const CustomToggle = forwardRef(({ children, onClick }, ref) => {
  return (
    <div
      className="w-100"
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
