import React, { memo } from "react";
import isequal from "lodash.isequal";
import { Card, Accordion } from "@themesberg/react-bootstrap";

const AccordionComponent = memo((props) => {
  const { defaultKey, data = [], className = "", style } = props;

  const AccordionItem = (item) => {
    const { eventKey, title, description, disabled = false } = item;

    return (
      <Accordion.Item eventKey={eventKey}>
        <div className={disabled && "disabled"}>
          <Accordion.Button variant="link">
            <span className="h6 mb-0 fw-bold">{title}</span>
          </Accordion.Button>
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

  return data.map((d) => (
    <Accordion
      className={className}
      defaultActiveKey={defaultKey}
      style={style}
    >
      <AccordionItem key={`accordion-${d.id}`} {...d} />
    </Accordion>
  ));
}, isequal);
export default AccordionComponent;
