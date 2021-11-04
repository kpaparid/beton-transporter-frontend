import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Form, Dropdown, Card } from "@themesberg/react-bootstrap";
// import './nstyle.scss'
import { Button } from "@themesberg/react-bootstrap";

import "./MyForm.css";
import { isEqual } from "lodash";
import Scrollbars from "react-custom-scrollbars";
import memoize from "memoize-one";
import { FixedSizeList, areEqual } from "react-window";
import _ from "lodash";
import { useSelector } from "react-redux";
function MyCheckboxContainer(props) {
  const {
    text,
    handler,
    variant = "transparent",
    checkboxVariant = "primary",
    hover = "",
    className = "",
    height = "auto",
    checked,
  } = props;
  const ref = useRef(null);

  return (
    <Button
      variant={variant}
      onClick={handler}
      className={className}
      style={{ height }}
    >
      <div className="w-100 d-flex justify-content-between">
        <div className="text-start">{text}</div>
        <Form.Check className="ps-4 d-flex justify-content-between g-0 align-items-center">
          <div className="align-items-center d-flex">
            <Form.Check.Input
              ref={ref}
              type="checkbox"
              variant={checkboxVariant}
              disabled
              checked={checked}
            />
          </div>
        </Form.Check>
      </div>
    </Button>
  );
}

export const MyCheckboxFilter = React.memo(
  ({ onToggleAll, onToggleOne, height = "35px", checkedAll, rows }) => {
    return (
      <>
        <Card className="checkboxFilterCard my-card" variant="primary">
          <Card.Header className="card-btn">
            <MyCheckboxContainer
              text={<div className="fw-bold text-start">Select All</div>}
              handler={onToggleAll}
              checked={checkedAll}
              className="checkbox-header"
              variant={"secondary"}
              checkboxVariant={"tertiary"}
            />
          </Card.Header>
          <Card.Body className="p-0">
            <List data={rows} onClick={onToggleOne}></List>
          </Card.Body>
        </Card>
      </>
    );
  },
  isEqual
);
const Row = memo(({ data, index, style }) => {
  const { items, toggleItemActive, selectData } = data;
  const item = items[index];
  return (
    <div style={style}>
      <MyCheckboxContainer
        key={"MyCheckboxContainer" + index}
        text={item.text}
        variant={"transparent"}
        checked={item.checked}
        handler={() => toggleItemActive(item.text, index)}
        className="checkbox-row"
        height={35}
      />
    </div>
  );
}, areEqual);

const createItemData = memoize((items, toggleItemActive) => ({
  items,
  toggleItemActive,
}));

const List = memo(({ data, onClick }) => {
  const itemData = createItemData(data, onClick);
  return (
    <FixedSizeList
      outerElementType={CustomScrollbarsVirtualList}
      className="List"
      height={300}
      itemCount={data.length}
      itemData={itemData}
      itemSize={35}
      width={"100%"}
    >
      {Row}
    </FixedSizeList>
  );
}, isEqual);
const CustomScrollbars = memo(({ onScroll, forwardedRef, style, children }) => {
  const refSetter = useCallback((scrollbarsRef) => {
    if (scrollbarsRef) {
      forwardedRef(scrollbarsRef.view);
    } else {
      forwardedRef(null);
    }
  }, []);
  return (
    <Scrollbars
      ref={refSetter}
      style={{ ...style, overflow: "hidden" }}
      onScroll={onScroll}
    >
      {children}
    </Scrollbars>
  );
}, isEqual);

const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref} />
));
