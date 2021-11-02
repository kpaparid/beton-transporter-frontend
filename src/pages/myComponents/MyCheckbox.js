import React, { useCallback } from "react";
import { Form, Dropdown, Card } from "@themesberg/react-bootstrap";
// import './nstyle.scss'
import { Button } from "@themesberg/react-bootstrap";

import "./MyForm.css";
import { isEqual } from "lodash";
import Scrollbars from "react-custom-scrollbars";
import { FixedSizeList } from "react-window";
function MyCheckboxContainer(props) {
  const {
    text,
    checked,
    handler,
    variant = "transparent",
    checkboxVariant = "primary",
    hover = "",
    className = "",
  } = props;

  return (
    <div className={"container-fluid p-0 m-0 " + className + " " + hover}>
      <Button
        variant={variant}
        onClick={handler}
        style={{ boxShadow: "0px 0px 0px" }}
        className="w-100 border border-0 rounded-0 rounded-top"
      >
        <div className="container-fluid w-100 ps-3 pe-4 d-flex justify-content-between">
          <div
            className="text-start"
            // onMouseLeave={(e) => (e.currentTarget.scrollLeft = 0)}
          >
            {text}
          </div>
          <Form.Check className="ps-4 d-flex justify-content-between g-0 align-items-center">
            <div className="align-items-center">
              <Form.Check.Input
                type="checkbox"
                variant={checkboxVariant}
                disabled
                checked={checked}
              />
            </div>
          </Form.Check>
        </div>
      </Button>
    </div>
  );
}
export const MyCheckboxFilter = React.memo(
  ({ onToggleAll, onToggleOne, checkedAll = true, data }) => {
    const Row = ({ index, style }) => (
      <div style={style}>
        {/* row {index} */}
        <MyCheckboxContainer
          key={"MyCheckboxContainer" + index}
          text={data[index].text}
          variant={"transparent"}
          checked={data[index].checked}
          handler={() => onToggleOne(data[index].text)}
          hover="checkbox-row"
        />
      </div>
    );
    const CustomScrollbars = ({ onScroll, forwardedRef, style, children }) => {
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
    };

    const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
      <CustomScrollbars {...props} forwardedRef={ref} />
    ));
    return (
      <>
        <Card className="checkboxFilterCard" variant="primary">
          <Card.Header className="p-0 bg-secondary text-white">
            <MyCheckboxContainer
              text={<div className="fw-bold text-start">Select All</div>}
              handler={() => onToggleAll(data.map((e) => e.text))}
              checked={checkedAll}
              className="w-100"
              variant={"secondary"}
              checkboxVariant={"tertiary"}
              // checked={true}
            />
          </Card.Header>
          <Card.Body className="p-0">
            <FixedSizeList
              outerElementType={CustomScrollbarsVirtualList}
              className="List"
              height={300}
              itemCount={data.length}
              itemSize={35}
              width={"100%"}
            >
              {Row}
            </FixedSizeList>
            {/* {data.map((item, index) => (
                <MyCheckboxContainer
                  key={"MyCheckboxContainer" + index}
                  text={item.text}
                  variant={"transparent"}
                  checked={item.checked}
                  handler={() => onToggleOne(item.text)}
                  hover="checkbox-row"
                />
              ))} */}
          </Card.Body>
        </Card>
      </>
    );
  },
  isEqual
);
