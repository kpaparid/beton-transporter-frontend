import React, { forwardRef, useRef, memo } from "react";
import MyCheckbox from "./MyCheckbox";
import MyCalendar from "./MyCalendar";
import { useSelector } from "react-redux";
import { ButtonGroup, Dropdown } from "@themesberg/react-bootstrap";
import { DateSelector, DayCalendar } from "./MyOwnCalendar";
import { CustomDropdown, CheckboxRow } from "./TextArea/NewFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash";

export const NestedDropdown = memo(
  forwardRef(({ data, children, component, onToggleItem }, ref) => {
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
            key={"DropdownRow-" + index}
            checked={checked}
            onChange={() => onToggleItem(id)}
            displayArrow={displayArrow}
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
              <Dropdown.Item className="p-0">
                {React.cloneElement(component, { ...props })}
                {children}
              </Dropdown.Item>
            </CustomDropdown>
          </CheckboxRow>
        );
      }
    );
    return items;
  }),
  isEqual
);

const NestedFilter = (props) => {
  const { index, labels, labelId, data } = props;
  const tourDate = useSelector((state) => state.tourTable.tourDate);
  const availableDates = useSelector(selectorMenu);
  function selectorMenu(state) {
    const { shownId, byId } = state.tourTable;
    return [...new Set(shownId.map((tour) => byId[tour].datum))];
  }
  if (labels.filterType === "checkbox") {
    return (
      <Dropdown.Menu className="dropdown-menu-right">
        <MyCheckbox index={index} labels={labels} data={data} />
      </Dropdown.Menu>
    );
  }
  if (labels.filterType === "range") {
    return (
      <Dropdown.Menu className="dropdown-menu-right">
        <Dropdown.Item>
          <MyCheckbox labels={labels} data={data} />
        </Dropdown.Item>
      </Dropdown.Menu>
    );
  }
  if (labels.filterType === "date") {
    return (
      <Dropdown.Menu className="dropdown-menu-right p-0">
        <DateSelector
          // value={value}
          month={tourDate}
          disableMonthSwap
        ></DateSelector>
      </Dropdown.Menu>
    );
  } else if (labels.filterType === "none") {
    return <></>;
  }
  return <></>;
};
export const NestedFilters = (props) => {
  const { index, labels, labelId, data } = props;
  const tourDate = useSelector((state) => state.tourTable.tourDate);
  const availableDates = useSelector(selectorMenu);
  function selectorMenu(state) {
    const { shownId, byId } = state.tourTable;
    return [...new Set(shownId.map((tour) => byId[tour].datum))];
  }
  if (labels.filterType === "checkbox") {
    return (
      <Dropdown.Menu className="dropdown-menu-right">
        <MyCheckbox index={index} labels={labels} data={data} />
      </Dropdown.Menu>
    );
  }
  if (labels.filterType === "range") {
    return (
      <Dropdown.Menu className="dropdown-menu-right">
        <Dropdown.Item>
          <MyCheckbox labels={labels} data={data} />
        </Dropdown.Item>
      </Dropdown.Menu>
    );
  }
  if (labels.filterType === "date") {
    return (
      <Dropdown.Menu className="dropdown-menu-right p-0">
        <DateSelector
          // value={value}
          month={tourDate}
          disableMonthSwap
        ></DateSelector>
      </Dropdown.Menu>
    );
  } else if (labels.filterType === "none") {
    return <></>;
  }
  return <></>;
};
export default NestedFilter;
