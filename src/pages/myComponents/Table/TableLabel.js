import React, { memo, useCallback, useMemo } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@themesberg/react-bootstrap";
import { forwardRef, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../../reducers/redux";
import { DateSelector } from "../MyOwnCalendar";
import { NestedDropdown } from "../NestedDropdown";
import TableButtons from "../TableButtons";
import { MyCheckboxFilter } from "../MyCheckbox";
import "../MyForm.css";
import { CustomDropdown } from "../CustomDropdown";
import { isEqual } from "lodash";

import "../MyForm.css";
export const TableLabel = memo(
  forwardRef(
    (
      {
        title,
        buttonGroupProps,
        filterProps: {
          filterDataSelector,
          onToggleFilterColumn,
          nestedFilterComponent,
        },
      },
      ref
    ) => {
      const data = useSelector(filterDataSelector);
      const ref1 = useRef(null);
      const ref2 = useRef(null);

      const items = [
        <NestedDropdown
          key="NestedDropdown"
          ref={ref2}
          data={data}
          component={nestedFilterComponent}
          onToggleItem={onToggleFilterColumn}
        />,
      ];

      return (
        <div className="d-flex justify-content-between flex-wrap align-items-center py-0">
          <div className="d-flex align-items-center">
            <ButtonGroup>
              <CustomDropdown
                id={"TourFilter"}
                as={ButtonGroup}
                toggleClassName="primary-btn"
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
            <TableButtons ref={ref} {...buttonGroupProps}></TableButtons>
          </div>
        </div>
      );
    }
  ),
  isEqual
);
TableLabel.displayName = "TableLabel";
TableButtons.displayName = "TableButtons";
