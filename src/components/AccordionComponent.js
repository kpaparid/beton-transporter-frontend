import { Accordion, Card } from "@themesberg/react-bootstrap";
import isequal from "lodash.isequal";
import React, { memo } from "react";

const AccordionComponent = memo((props) => {
  const { data = [], className = "", style } = props;

  const AccordionItem = (item) => {
    const { eventKey, title, description, disabled = false } = item;
    function handleClick(e) {
      e.stopPropagation();
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
    return (
      <Accordion.Item eventKey={eventKey}>
        <div className={disabled ? "disabled" : ""}>
          <Accordion.Header variant="link" onClick={handleClick}>
            <span className="h6 mb-0 fw-bold">{title}</span>
          </Accordion.Header>
        </div>

        {!disabled && (
          <Accordion.Body>
            <Card.Body className="p-0 border-0">
              <div className="mb-0">{description}</div>
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
