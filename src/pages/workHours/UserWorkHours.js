import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Card, Spinner } from "@themesberg/react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { ButtonGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { MyRoutes } from "../../routes";
import {
  calcDurationAndFormat,
  durationFormat,
} from "../myComponents/util/labels";
import { useServices } from "../myComponents/util/services";

const UserWorkHours = () => {
  const { currentUser } = useAuth();
  const { fetchTodaysWorkHours, deleteWorkHour } = useServices();
  const [workHours, setWorkHours] = useState();
  const [show, setShow] = useState(false);
  const [currentId, setCurrentId] = useState();
  const handleCloseModal = () => setShow(false);

  const handleShowModal = (id) => {
    setCurrentId(id);
    setShow(true);
  };
  useEffect(() => {
    fetchTodaysWorkHours(currentUser.uid).then(({ data }) =>
      setWorkHours(
        [...data.content].sort((a, b) => (a.begin > b.begin ? -1 : 1))
      )
    );
  }, [fetchTodaysWorkHours, currentUser.uid]);
  const handleDelete = useCallback(() => {
    deleteWorkHour(currentId).then((r) =>
      fetchTodaysWorkHours(currentUser.uid).then(({ data }) => {
        const content = [...data.content].sort((a, b) =>
          a.arrival > b.arrival ? -1 : 1
        );
        setWorkHours(content);
        setShow(false);
      })
    );
  }, [currentId, deleteWorkHour, fetchTodaysWorkHours, currentUser.uid]);

  return (
    <div
      className={` w-100 h-100 align-items-center justify-content-start d-flex flex-column bg-darker-nonary`}
    >
      <div className="p-3 w-100" style={{ maxWidth: "400px" }}>
        <div className="text-center text-senary border-bottom border-senary fw-bold py-3">
          Today's Work Hours
        </div>
        <div className="py-4">
          <div className="w-100 d-flex justify-content-center p-1">
            <Button
              as={Link}
              to={MyRoutes.AddWorkHours.path}
              variant="senary"
              className="w-100"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
          {workHours?.map((t) => (
            <AccordionCard
              className="normal-selector-dropdown"
              value={
                <>
                  <CCard
                    leftTitle="Start"
                    rightTitle="End"
                    left={t.begin}
                    right={t.end}
                    footer={durationFormat(
                      calcDurationAndFormat([null, t.begin, t.end])
                    )}
                  />
                </>
              }
            >
              <div className="w-100 d-flex justify-content-around">
                <Button
                  className="text-nonary"
                  variant="senary"
                  as={Link}
                  to={MyRoutes.AddWorkHours.path}
                  state={{ workHour: t }}
                >
                  <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </Button>

                <Button
                  className="text-nonary"
                  variant="senary"
                  onClick={(e) => handleShowModal(t.id)}
                >
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                </Button>
              </div>
            </AccordionCard>
          )) || (
            <div className="d-flex justify-content-center pt-2">
              <Spinner variant="senary" animation="border" />
            </div>
          )}
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleCloseModal}
        contentClassName="user-modal"
        centered
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Delete Work Hour</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this work hour?</Modal.Body>
        <Modal.Footer>
          <ButtonGroup className="w-100">
            <Button
              className="col-6"
              variant="septenary"
              onClick={handleCloseModal}
            >
              Close
            </Button>
            <Button
              className="col-6"
              variant="senary text-darker-nonary fw-bolder"
              onClick={handleDelete}
            >
              Delete <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const CCard = ({ left, right, leftTitle, rightTitle, footer }) => {
  return (
    <Card bg="transparent border-0" className="w-100 p-0">
      <Card.Body
        className="d-flex flex-wrap justify-content-between align-items-top py-1 px-0 border-0"
        style={{ minHeight: "70px" }}
      >
        <div className="col-4 pe-3 flex-fill d-flex flex-column align-items-center text-senary">
          <div className="fw-bolder">{left}</div>
        </div>
        <div className="col-4 ps-3 flex-fill d-flex flex-column align-items-center text-senary">
          <div className="fw-bolder">{right}</div>
        </div>
        <div
          className="col-12 text-senary fw-bolder text-center"
          style={{ fontSize: "18px" }}
        >
          {footer}
        </div>
      </Card.Body>
    </Card>
  );
};

const AccordionCard = ({ value, children }) => {
  return (
    <div className="p-1 h-100 w-100 border-0 user-card">
      <Accordion>
        <Accordion.Item className="bg-nonary " eventKey="0">
          <Accordion.Header>{value}</Accordion.Header>
          <Accordion.Body className="p-0 py-3 border-top px-2 border-darker-senary">
            {children}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default UserWorkHours;
