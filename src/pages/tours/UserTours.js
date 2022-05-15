import {
  faEdit,
  faPlus,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Modal, Spinner } from "@themesberg/react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyRoutes } from "../../routes";
import {
  getGridLabels,
  getGridPrimaryLabels,
} from "../myComponents/util/labels";
import { useServices } from "../myComponents/util/services";

const UserTours = () => {
  const { currentUser, fetchTodaysTours, deleteTour } = useServices();
  const [tours, setTours] = useState();
  useEffect(() => {
    fetchTodaysTours(currentUser.uid).then(({ data }) => {
      const content = [...data.content].sort((a, b) =>
        a.arrival > b.arrival ? -1 : 1
      );
      setTours(content);
    });
  }, [fetchTodaysTours, currentUser.uid]);
  const handleDelete = useCallback(
    (id) => {
      deleteTour(id).then((r) => {
        fetchTodaysTours(currentUser.uid).then(({ data }) => {
          const content = [...data.content].sort((a, b) =>
            a.arrival > b.arrival ? -1 : 1
          );
          setTours(content);
        });
      });
    },
    [deleteTour, fetchTodaysTours, currentUser.uid]
  );

  return (
    <div
      className={` w-100 h-100 align-items-center justify-content-start d-flex flex-column bg-darker-nonary`}
    >
      <div className="p-3 w-100" style={{ maxWidth: "400px" }}>
        <div className="text-center text-senary border-bottom border-senary fw-bold py-3">
          Today's Tours
        </div>
        <div className="py-4">
          <div className="w-100 d-flex justify-content-center p-1">
            <Button
              as={Link}
              to={MyRoutes.AddTour.path}
              variant="senary"
              className="text-nonary w-100"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
          {tours?.map((t) => {
            const tour = {
              ...t,
              driver: currentUser.displayName || currentUser.email,
            };
            return (
              <NormaModal values={tour} onDelete={handleDelete}>
                <CCard left={t.buildingSite} right={t.arrival} />
              </NormaModal>
            );
          }) || (
            <div className="d-flex justify-content-center pt-2">
              <Spinner variant="senary" animation="border" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NormaModal = ({ values, children, onDelete }) => {
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    handleClose();
    onDelete(values.id);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="p-1 w-100">
        <Button variant="nonary" onClick={handleShow} className={"w-100"}>
          {children}
        </Button>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={"dark-modal"}
        scrollable
      >
        <Modal.Header className="p-0 d-flex justify-content-end">
          <div className="p-2">
            <Button
              variant="transparent"
              className="p-0 text-senary d-flex justify-content-center align-items-center"
              style={{ height: "30px", width: "30px" }}
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-1">
          {getGridPrimaryLabels("tours").map((key) => (
            <div
              key={key}
              className="d-flex flex-wrap justify-content-between border-bottom border-senary text-senary fw-bolder"
            >
              <div
                className="text-start text-break text-wrap p-1"
                style={{ minWidth: "60px" }}
              >
                {getGridLabels("tours")[key]?.text}
              </div>
              <div className="flex-fill text-end text-break text-wrap p-1 fw-bold">
                {(values[key] || "") +
                  (getGridLabels("tours")[key]?.measurement || "")}
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="">
          <div className="w-100 btn-group-wrapper d-flex justify-content-around">
            <Button
              variant="nonary"
              onClick={handleDelete}
              style={{ height: "44px", width: "44px" }}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </Button>
            <Button
              variant="senary"
              as={Link}
              to={MyRoutes.AddTour.path}
              state={{ tour: values }}
              style={{ height: "44px", width: "44px" }}
            >
              <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const CCard = ({ left, right }) => {
  return (
    <Card bg="transparent border-0" className="w-100 px-3">
      <Card.Body
        className="d-flex flex-nowrap justify-content-between align-items-top py-1 px-0 border-0 fw-bolder"
        style={{ minHeight: "70px" }}
      >
        <div className="d-flex align-items-center text-start text-break text-wrap">
          {left}
        </div>
        <div className="ps-2 pt-4 d-flex align-items-end">{right}</div>
      </Card.Body>
    </Card>
  );
};

export default UserTours;
