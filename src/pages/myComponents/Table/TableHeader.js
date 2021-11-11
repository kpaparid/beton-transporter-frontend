import React, { memo, useCallback, useMemo } from "react";
import {
  faAngleDown,
  faFilter,
  faSlidersH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@themesberg/react-bootstrap";
import { forwardRef, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NestedDropdown } from "../Filters/NestedDropdown";
import TableButtons from "./TableButtons";
import { CustomDropdown } from "../Filters/CustomDropdown";
import { isEqual } from "lodash";

export const TableLabel = memo(
  forwardRef(({ titleProps: { title }, buttonGroupProps }, ref) => {
    return (
      <div className="d-flex justify-content-between flex-wrap align-items-center py-0">
        {title}
        <div className="flex-wrap d-flex">
          <TableButtons ref={ref} {...buttonGroupProps}></TableButtons>
        </div>
      </div>
    );
  }),
  isEqual
);

export const Filter = memo((props) => {
  const {
    selectItemsFilter,
    onToggleLabel,
    nestedFilterComponent,
    selectItemsNestedFilter,
    onResetAllFilters,
  } = props;

  const data = useSelector(selectItemsFilter) || [];
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const items = [
    <NestedDropdown
      key="NestedDropdown"
      ref={ref2}
      data={data}
      component={nestedFilterComponent}
      onToggleItem={onToggleLabel}
      resetAll={onResetAllFilters}
      selectData={selectItemsNestedFilter}
    />,
  ];
  return (
    <CustomDropdown
      as={ButtonGroup}
      toggleClassName="primary-btn"
      toggleStyle={{ transition: "none" }}
      menuClassName="py-1 filter-dropdown"
      ref={{ ref: ref1, refList: [ref1, ref2] }}
      value={<FontAwesomeIcon icon={faSlidersH} />}
    >
      {items}
    </CustomDropdown>
  );
}, isEqual);

TableLabel.displayName = "TableLabel";
TableButtons.displayName = "TableButtons";
