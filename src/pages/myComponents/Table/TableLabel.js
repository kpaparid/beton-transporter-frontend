import React, { memo } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@themesberg/react-bootstrap";
import moment from "moment";
import { forwardRef, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../../reducers/redux";
import { DateSelector, MonthSelectorDropdown } from "../MyOwnCalendar";
import { tourDate, nestedFilterTourData } from "../MySelectors";
import { NestedDropdown } from "../NestedFilter";
import TableButtons from "../TableButtons";
import { MyCheckboxFilter } from "../MyCheckbox";
import "../MyForm.css";
import { CustomDropdown } from "../TextArea/NewFilter";
import { isEqual } from "lodash";

export const FilterComponent = memo(({ type, label, ...rest }) => {
  const dispatch = useDispatch();
  function toggleOne(value) {
    console.log("click nestedFilter Single");
    dispatch({
      type: ACTIONS.NESTEDFILTER_TOGGLE_ONE,
      payload: {
        label: label,
        value: value,
      },
    });
  }
  function toggleAll(data) {
    console.log("click nestedFilter All");
    dispatch({
      type: ACTIONS.NESTEDFILTER_TOGGLE_ALL,
      payload: {
        label: label,
        data: data,
      },
    });
  }
  function dateChange(dates) {
    console.log("click nestedFilter Date", dates);
    dispatch({
      type: ACTIONS.NESTEDFILTER_ADD_FILTER,
      payload: {
        label: "datum",
        value: dates,
      },
    });
  }
  switch (type) {
    case "checkbox":
      return (
        <MyCheckboxFilter
          {...rest}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
        />
      );
    case "range":
      return (
        <MyCheckboxFilter
          {...rest}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
        />
      );
    case "date":
      return (
        <DateSelector
          // value={"12/04/2021"}
          // date={"25/2/2006"}
          // day={[20, 23]}
          // month={8}
          // year={2021}
          {...rest.data}
          // {...rest}
          disableMonthSwap
          onChange={dateChange}
        />
      );
    default:
      break;
  }
}, isEqual);

export const TableLabel = forwardRef(
  ({ children: { filterDataSelector, title } }, ref) => {
    const data = useSelector(filterDataSelector);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const dispatch = useDispatch();
    function handleToggleColumn(id) {
      dispatch({
        type: ACTIONS.TOGGLE_COLUMN,
        payload: {
          id: id,
        },
      });
    }
    const items = [
      <NestedDropdown
        ref={ref2}
        data={data}
        component={<FilterComponent></FilterComponent>}
        onToggleItem={handleToggleColumn}
      />,
    ];

    return (
      <div className="d-flex justify-content-between flex-wrap align-items-center py-0">
        <div className="d-flex align-items-center">
          <ButtonGroup>
            <CustomDropdown
              id={"TourFilter"}
              as={ButtonGroup}
              variant="primary"
              menuClassName="py-1"
              ref={{ ref: ref1, refList: [ref1, ref2] }}
              value={
                <>
                  Filter
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="dropdown-arrow ms-2"
                  />
                </>
              }
            >
              {items}
            </CustomDropdown>
            {title}
          </ButtonGroup>
        </div>
        <div className="flex-wrap d-flex">
          <TableButtons ref={ref}></TableButtons>
        </div>
      </div>
    );
  }
);
