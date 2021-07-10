import React, { useState } from "react";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  ButtonGroup,
  Breadcrumb,
  Modal,
  InputGroup,
  Dropdown,
  Container,
  Table,
} from "@themesberg/react-bootstrap";
import MyModal from "./MyModal";
import moment from "moment";

export default (props) => {
  const teamMembers = props.table;
  const { message, setMessage, receivers, setReceivers, clearData } =
    props.data;
  const defaultValue = "Choose Name";

  const [showModalDefault, setShowModalDefault] = useState(false);
  const handleClose = () => setShowModalDefault(false);

  const handleAddReceiver = (event) => {
    const value = event.target.value;
    if (value !== defaultValue)
      setReceivers((r) => [...new Set([...receivers, value])]);
  };
  const handleRemoveReceiver = (event) => {
    const value = event.target.value;
    setReceivers((r) => receivers.filter((re) => re !== value));
  };
  const handleSend = (event) => {
    setShowModalDefault(true);
    setMessage({
      ...message,
      ["to"]: receivers,
      ["date"]: moment().format("DD/MM/YY"),
    });
  };
  const handleTextChange = (event) => {
    const value = event.target.value;
    setMessage({
      ...message,
      [event.target.name]: value,
    });
  };
  const ReceiversBtn = () => {
    return (
      <div className="d-flex mt-1 flex-wrap">
        {receivers.map((r, index) => (
          <CustomBtn className="m-1" key={index} name={r}></CustomBtn>
        ))}
      </div>
    );
  };
  const CustomBtn = (props) => {
    const { name, className } = props;
    return (
      <ButtonGroup className={`d-flex alignt-items-center ${className}`}>
        <Button>{name}</Button>
        <Button
          variant="danger"
          size="sm"
          value={name}
          onClick={handleRemoveReceiver}
        >
          x
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <>
      <Card border="light" className="shadow-sm flex-fill my-2 d-flex">
        <div className="px-4 d-flex flex-fill flex-wrap flex-lg-nowrap align-items-center justify-content-center w-100">
          <h3 className="m-4 ms-6  text-center container-fluid">
            Neue Nachricht
          </h3>
          <div className="justify-content-end m-3 ms-0">
            <Button onClick={clearData} variant="danger">
              x
            </Button>
          </div>
        </div>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Select value={defaultValue} onChange={handleAddReceiver}>
                <option defaultValue>{defaultValue}</option>
                {teamMembers.map((t, index) => (
                  <option key={index}>{t.name}</option>
                ))}
              </Form.Select>
              <ReceiversBtn></ReceiversBtn>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Betreff</Form.Label>
              <Form.Control
                as="textarea"
                name="title"
                rows="1"
                value={message.title}
                onChange={handleTextChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nachricht</Form.Label>
              <Form.Control
                as="textarea"
                name="mail"
                rows="10"
                value={message.mail}
                onChange={handleTextChange}
              />
            </Form.Group>
            <Form.Control type="file" className="mb-3" />
            <Button variant="primary" className="my-3" onClick={handleSend}>
              Send
            </Button>
            <MyModal
              message={message}
              onClose={handleClose}
              show={showModalDefault}
            ></MyModal>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};
