import DropdownToggle from "@themesberg/react-bootstrap/lib/esm/DropdownToggle";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Portal } from "react-portal";
export const CustomDropdown = forwardRef(
  (
    {
      variant = "primary",
      value = "Dropdown Button",
      as,
      className = "",
      menuClassName = "",
      toggleClassName = "py-1",
      disabled = false,
      children,
      toggleAs = "default",
      toggleStyle = {},
      portal = true,
      drop = "up",
      align = "start",
      flip = "true",
      onToggle,
      width = "fit-content",
      show: controlledShow = false,
      toggle,
      controlled = false,
      menuClick,
    },
    initialRef
  ) => {
    const refList = initialRef?.refList || [];
    const inputRef = initialRef;
    const toggleRef = useRef(null);
    // const domRef = ref || backupRef;
    const toggleAsComponent =
      toggleAs === "default" ? DropdownToggle : CustomToggle;
    const [backupShow, setBackupShow] = useState(false);
    const show = controlled ? controlledShow : backupShow;
    const setShow = controlled ? toggle : setBackupShow;
    useEffect(() => {
      return () => {
        document.getElementById("body").className = `${document
          .getElementById("body")
          .className.replaceAll(`custom-dropdown-open`, "")}`;
      };
    }, []);

    const handleToggle = useCallback(
      (_t, _e, metadata) => {
        const focusWithinInput = inputRef?.current?.contains(
          document.activeElement
        );
        const focusWithin = refList
          .map((ref) => ref.current?.contains(document.activeElement))
          .reduce((a, b) => a || b, false);
        if (
          focusWithinInput ||
          (_e && _e.source !== "rootClose" && _e.source !== "select") ||
          (typeof focusWithin != "undefined" &&
            focusWithin != null &&
            focusWithin)
        ) {
          setShow(true);
          onToggle && onToggle(true);
        } else {
          setShow(false);
          onToggle && onToggle(false);
        }
      },
      [onToggle, setShow]
    );
    useEffect(() => {
      if (show) {
        document.getElementById("body").className = `${
          document.getElementById("body").className
        } custom-dropdown-open`.trim();
      } else {
        document.getElementById("body").className = `${document
          .getElementById("body")
          .className.replace("custom-dropdown-open", "")}`.trim();
      }
    }, [show]);
    const onClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <Dropdown
        as={as}
        flip={flip}
        className={className}
        show={!disabled && show}
        onToggle={handleToggle}
        disabled={disabled}
        align={align}
        drop={drop}
        // autoClose={false}
      >
        <Dropdown.Toggle
          as={toggleAsComponent}
          variant={variant}
          id="dropdown-basic"
          style={toggleStyle}
          className={"shadow-none " + toggleClassName}
        >
          {value}
        </Dropdown.Toggle>
        {portal ? (
          <Portal>
            <Dropdown.Menu
              onClick={menuClick}
              flip={flip}
              ref={toggleRef}
              className={"m-0 p-0 border border-0 " + menuClassName}
            >
              {children}
            </Dropdown.Menu>
          </Portal>
        ) : (
          <Dropdown.Menu
            onClick={menuClick}
            flip={flip}
            ref={toggleRef}
            className={"m-0 p-0 border border-0 " + menuClassName}
          >
            {children}
          </Dropdown.Menu>
        )}
      </Dropdown>
    );
  }
);
const CustomToggle = forwardRef(
  ({ children, onClick, variant, className, ...rest }, ref) => {
    const bg = "btn btn-" + variant;
    return (
      <div
        // {...rest}
        className={"w-100 " + className + " " + bg}
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </div>
    );
  }
);
