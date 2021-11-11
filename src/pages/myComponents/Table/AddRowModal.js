import React, { memo, useCallback, useState } from "react";
import { isEqual } from "lodash";
import {
  Button,
  Card,
  Form,
  InputGroup,
  Modal,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { MyFormSelect } from "../MyFormSelect";
const Lazer = React.lazy(() => import("../TextArea/LazyInput"));
const AddRowModal = memo(({ selectLabelsModal, title }) => {
  const labels = useSelector(selectLabelsModal);
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);
  const renderInput = useCallback(
    ({ type, ...rest }) => {
      switch (type) {
        case "constant":
          return (
            <MyFormSelect
              className="form-control"
              justifyContent="start"
              {...rest}
            ></MyFormSelect>
          );

        default:
          return <Form.Control type="text" {...rest} />;
      }
    },

    []
  );

  return (
    <>
      <Button
        variant="primary"
        className="my-3"
        onClick={() => setShowDefault(true)}
      >
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </Button>
      <Modal
        as={Modal.Dialog}
        size="lg"
        centered
        show={showDefault}
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title className="h6">{title}</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          <Card className="card-">
            <Card.Body>
              <Form className="d-flex flex-wrap justify-content-around">
                {labels.map((e) => (
                  <Form.Group className="mb-3 col-5">
                    <Form.Label>{e.text}</Form.Label>
                    <InputGroup>{renderInput(e)}</InputGroup>
                  </Form.Group>
                ))}
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            I Got It
          </Button>
          <Button
            variant="link"
            className="text-gray ms-auto"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}, isEqual);

export default AddRowModal;
