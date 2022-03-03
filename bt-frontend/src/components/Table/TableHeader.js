import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import React, { forwardRef, memo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NestedDropdown } from "../Filters/NestedDropdown";
import { CustomDropdown } from "../Filters/CustomDropdown";
import TableButtons from "./TableButtons";

export const TableLabel = memo(
  forwardRef(({ titleProps: { title }, buttonGroupProps }, ref) => {
    return (
      <div className="d-flex justify-content-between flex-wrap align-items-center py-0">
        {title}
        <div className="flex-wrap d-flex col justify-content-end">
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
  const [show, setShow] = useState(false);
  const onClose = () => setShow(false);

  const items = [
    <NestedDropdown
      key="NestedDropdown"
      className="grid-table-filter-dropdown"
      ref={ref2}
      data={data}
      component={nestedFilterComponent}
      onToggleItem={onToggleLabel}
      resetAll={onResetAllFilters}
      selectData={selectItemsNestedFilter}
      onClose={onClose}
    />,
  ];
  return (
    <CustomDropdown
      controlled
      show={show}
      toggle={setShow}
      drop="down"
      // portal={false}
      as={ButtonGroup}
      toggleClassName="primary-btn"
      toggleStyle={{ transition: "none" }}
      menuClassName="py-0 filter-dropdown"
      ref={{ ref: ref1, refList: [ref1, ref2] }}
      value={<FontAwesomeIcon icon={faSlidersH} />}
    >
      {items}
    </CustomDropdown>
  );
}, isEqual);

TableLabel.displayName = "TableLabel";
TableButtons.displayName = "TableButtons";
