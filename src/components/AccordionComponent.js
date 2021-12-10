import React, { memo, useContext } from "react";
import isequal from "lodash.isequal";
import {
  Card,
  Accordion,
  useAccordionButton,
} from "@themesberg/react-bootstrap";
import { AccordionContext } from "react-bootstrap";

const AccordionComponent = memo((props) => {
  const { defaultKey, data = [], className = "", style } = props;

  const AccordionItem = (item) => {
    const { eventKey, title, description, disabled = false } = item;
    function handleClick(e) {
      const c = e.target;
      e.stopPropagation();
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
    return (
      <Accordion.Item eventKey={eventKey}>
        <div className={disabled && "disabled"}>
          <Accordion.Header variant="link" onClick={handleClick}>
            <span className="h6 mb-0 fw-bold">{title}</span>
          </Accordion.Header>
        </div>

        {!disabled && (
          <Accordion.Body>
            <Card.Body className="py-2 px-0">
              <Card.Text className="mb-0">{description}</Card.Text>
            </Card.Body>
          </Accordion.Body>
        )}
      </Accordion.Item>
    );
  };

  return (
    <Accordion className={className} style={style}>
      {data.map((d) => (
        <AccordionItem key={`accordion-${d.id}`} {...d} />
      ))}
    </Accordion>
  );
}, isequal);
export default AccordionComponent;
