import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Card } from "@themesberg/react-bootstrap";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { ButtonGroup, Modal } from "react-bootstrap";
import { DatePickerModal } from "../../components/DatePicker";
import { useAuth } from "../../contexts/AuthContext";
import { useServices } from "../myComponents/util/services";

const UserVacations = () => {
  const { currentUser } = useAuth();
  const { fetchUpComingVacations, deleteVacation, postVacations } =
    useServices();
  const [vacations, setVacations] = useState();
  const [show, setShow] = useState(false);
  const [currentId, setCurrentId] = useState();
  const handleCloseModal = () => setShow(false);

  const handleShowModal = useCallback((id) => {
    setCurrentId(id);
    setShow(true);
  }, []);
  const handleDateChange = useCallback(
    (id, v) => {
      const data = {
        driver: currentUser.uid,
        dateFrom: v[0],
        dateTo: v[1],
        reason: "vacations",
        verified: 0,
      };
      postVacations([id ? { ...data, id } : data]).then(() =>
        fetchUpComingVacations(currentUser.uid).then(({ data }) => {
          const content = [...data.content].sort((a, b) =>
            a.dateFrom > b.dateFrom ? -1 : 1
          );
          setVacations(content);
          setShow(false);
        })
      );
    },
    [currentUser.uid, fetchUpComingVacations, postVacations]
  );

  useEffect(() => {
    fetchUpComingVacations(currentUser?.uid).then(({ data }) => {
      const content = [...data.content].sort((a, b) =>
        a.dateFrom > b.dateFrom ? -1 : 1
      );
      setVacations(content);
    });
  }, [fetchUpComingVacations, currentUser.uid]);
  const handleDelete = useCallback(() => {
    deleteVacation(currentId).then((r) => {
      fetchUpComingVacations(currentUser.uid).then(({ data }) => {
        const content = [...data.content].sort((a, b) =>
          a.dateFrom > b.dateFrom ? -1 : 1
        );
        setVacations(content);
        setShow(false);
      });
    });
  }, [currentId, deleteVacation, fetchUpComingVacations, currentUser.uid]);

  return (
    <div
      className={` w-100 h-100 align-items-center justify-content-start d-flex flex-column bg-darker-nonary`}
    >
      <div className="p-3 w-100" style={{ maxWidth: "400px" }}>
        <div className="text-center text-senary border-bottom border-senary fw-bold py-3">
          Upcoming Vacations
        </div>
        <div className="py-4">
          <div className="w-100 d-flex justify-content-center p-1">
            <DatePickerModal
              carousel
              variant="darker"
              disableMonthSwap
              min={moment().format("YYYY.MM.DD")}
              buttonVariant={"senary"}
              singleDate={false}
              buttonText={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}
              onChange={(v) => handleDateChange(null, v)}
            />
          </div>
          <Accordion>
            {vacations?.map((t, index) => (
              <AccordionCard
                key={t.id}
                itemClassName="bg-nonary"
                index={index}
                value={
                  <>
                    <CCard
                      variant="nonary"
                      middle={t.days}
                      left={t.dateFrom}
                      right={t.dateTo}
                      verified={t.verified}
                    />
                  </>
                }
              >
                <div className="w-100 d-flex justify-content-around py-1">
                  {t.verified !== 1 && (
                    <div>
                      <DatePickerModal
                        // size="sm"
                        variant="darker"
                        carousel
                        disableMonthSwap
                        min={moment().format("YYYY.MM.DD")}
                        from={t.dateFrom}
                        to={t.dateTo}
                        buttonVariant={"senary shadow-none"}
                        singleDate={false}
                        buttonText={
                          <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        }
                        onChange={(v) => handleDateChange(t.id, v)}
                      />
                    </div>
                  )}
                  <Button
                    className="shadow-none"
                    variant="senary"
                    // size="sm"
                    onClick={(e) => handleShowModal(t.id)}
                  >
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </Button>
                </div>
              </AccordionCard>
            ))}
          </Accordion>
        </div>
      </div>
      <Modal
        className="user-modal bg-transparent"
        show={show}
        onHide={handleCloseModal}
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
              variant="nonary"
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

const CCard = ({ left, right, verified }) => {
  return (
    <Card bg="transparent border-0" className={"w-100 p-0"}>
      <Card.Body
        className="d-flex flex-wrap justify-content-between align-items-top py-1 px-0 border-0"
        style={{ minHeight: "70px" }}
      >
        <div className="col-6 pe-3 flex-fill d-flex flex-column align-items-center text-nonary">
          <div className="fw-bolder text-senary">{left}</div>
        </div>
        <div className="col-6 ps-3 flex-fill d-flex flex-column align-items-center text-nonary">
          <div className="fw-bolder text-senary">{right}</div>
        </div>
        <div
          className={
            "col-12 text-senary fw-bolder text-center " +
            (verified === 1
              ? "text-confirmed"
              : verified === 0
              ? "text-pending"
              : "text-declined")
          }
          style={{ fontSize: "18px" }}
        >
          {verified === 1
            ? "Confirmed"
            : verified === 0
            ? "Pending"
            : "Declined"}
        </div>
      </Card.Body>
    </Card>
  );
};

const AccordionCard = ({
  value,
  children,
  className = "",
  itemClassName,
  index,
}) => {
  return (
    <div className={"p-1 border-0 h-100 w-100 user-card " + className}>
      <Accordion.Item className={itemClassName} eventKey={index}>
        <Accordion.Header>{value}</Accordion.Header>
        <Accordion.Body className="p-0 py-3 border-top px-2 border-darker-senary">
          {children}
        </Accordion.Body>
      </Accordion.Item>
    </div>
  );
};

export default UserVacations;
