import React, { forwardRef, useLayoutEffect } from "react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup, Form, Dropdown } from "@themesberg/react-bootstrap";
import { useState } from "react";
import { useSelector } from "react-redux";
import NestedFilter from "../NestedFilter";
import "../MyForm.css";
import { Portal } from "react-portal";
import { isEqual } from "lodash";
export const CustomDropdown = forwardRef(
  (
    {
      variant = "tertiary",
      value = "Dropdown Button",
      as,
      className = "",
      menuClassName = "",
      disabled = false,
      children,
    },
    { ref, refList = [] }
  ) => {
    const [show, setShow] = useState(false);
    // console.log(ref, refList);
    return (
      <Dropdown
        as={as}
        className={className}
        disabled={disabled}
        show={!disabled && show}
        onToggle={(_t, _e, metadata) => {
          const focusWithin = refList
            .map(
              (ref) =>
                ref.current && ref.current.contains(document.activeElement)
            )
            .reduce((a, b) => a || b, false);

          metadata.source ||
          (typeof focusWithin != "undefined" &&
            focusWithin != null &&
            focusWithin)
            ? setShow(true)
            : setShow(false);
        }}
      >
        <Dropdown.Toggle
          variant={variant}
          id="dropdown-basic"
          className="shadow-none py-1"
        >
          {value}
        </Dropdown.Toggle>
        <Portal>
          <Dropdown.Menu ref={ref} className={"p-0 " + menuClassName}>
            {children}
          </Dropdown.Menu>
        </Portal>
      </Dropdown>
    );
  }
);

export const CheckboxRow = React.memo(
  ({ checked = true, onChange, className = "", children }) => {
    return (
      <div className={"d-flex align-items-center " + className}>
        <Form.Check
          checked={checked}
          className="align-items-center m-0 ps-3 pe-1 justify-content-start"
          onChange={onChange}
        ></Form.Check>

        <div className="ps-2 pe-2 container-fluid d-flex justify-content-between">
          {children}
        </div>
      </div>
    );
  },
  isEqual
);

export const DropdownFilterYikes = (onChange) => {
  const data = useSelector(myDataSelector);
  const displayArrowByLabel = useSelector(tourTableUniqueLengthSelector);
  const labels = useSelector((state) => state.tourTable.labelsById);
  const checked = useSelector((state) => {
    const checkedList = state.tourTable.allLabelsId
      .map((label) => ({
        [label]:
          state.tourTable.checkedLabelsId.indexOf(label) === -1
            ? ""
            : "checked",
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
    return checkedList;
  });

  function myDataSelector(state) {
    const values = state.tourTable.allLabelsId
      .map((label) => {
        const tourTableByLabel = state.tourTable.shownId.map(
          (item) => state.tourTable.byId[item][label]
        );
        const values = [...new Set(tourTableByLabel)].map((item) => ({
          value: item,
          checked:
            state.tourTable.filteredOutValues[label] &&
            state.tourTable.filteredOutValues[label].findIndex(
              (e) => e === item
            ) !== -1
              ? ""
              : "checked",
        }));
        return { [label]: values };
      })
      .reduce((prev, curr) => ({ ...prev, ...curr }));
    return values;
  }
  console.log(data);

  function tourTableUniqueLengthSelector(state) {
    const length = state.tourTable.allLabelsId
      .map((label) => {
        if (state.tourTable.labelsById[label].filterType === "none")
          return { [label]: false };
        const tourTableByLabel = state.tourTable.shownId.map(
          (item) => state.tourTable.byId[item][label]
        );
        const length = [...new Set(tourTableByLabel)].length;
        if (length > 1) return { [label]: true };
        return { [label]: false };
      })
      .reduce((prev, curr) => ({ ...prev, ...curr }));
    return length;
  }
  return (
    <div>
      {Object.keys(labels).map((labelId, index) => (
        <div key={labelId} className="d-flex align-items-center">
          <Form.Check
            id={`checkbox${index}`}
            htmlFor={`checkbox${index}`}
            checked={checked[labelId]}
            className="align-items-center m-0 ps-3 pe-1 justify-content-start mycheckbox"
            onChange={(e) => onChange(index, labelId, e)}
          ></Form.Check>
          <DropdownContent
            labelId={labelId}
            index={index}
            displayArrow={displayArrowByLabel[labelId]}
            data={data}
          />
        </div>
      ))}
    </div>
  );
};
function DropdownContent(props) {
  const { labelId, index, displayArrow, data } = props;
  const label = useSelector((state) => state.tourTable.labelsById[labelId]);
  const currentWidth = useWindowSize();
  function useWindowSize() {
    const [size, setSize] = useState(0);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    });
    return size;
  }

  return (
    <Dropdown
      drop={currentWidth > 600 ? "right" : "down"}
      as={ButtonGroup}
      disabled
      className="d-flex p-0 ps-4 pe-2 py-1 mydropdownlist"
      style={{ minWidth: "200px" }}
    >
      <Dropdown.Toggle
        split
        variant="white"
        disabled={label.filterType === "none"}
        className="d-flex shadow-none"
      >
        <DropdownRow label={label} displayArrow={displayArrow} />
      </Dropdown.Toggle>
      <NestedFilter
        index={index}
        labels={label}
        labelId={labelId}
        data={data}
      />
    </Dropdown>
  );
}
export const DropdownRow = (props) => {
  const displayArrow = props.displayArrow ? "d-block" : "d-none";
  const left = props.label.text;

  return (
    <div className="ps-2 pe-2 container-fluid d-flex justify-content-between">
      <div className="d-flex align-items-center">
        <div className="align-items-center ps-0 text-wrap text-left pe-4 text-break">
          {left}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-end">
        {/* <div className="align-items-center ps-3 text-right  text-truncate w-50">{right}</div> */}
        <div className={`dropdown-arrow text-right ${displayArrow}`}>
          <FontAwesomeIcon icon={faAngleRight} className="dropdown-arrow" />
        </div>
      </div>
    </div>
  );
};
