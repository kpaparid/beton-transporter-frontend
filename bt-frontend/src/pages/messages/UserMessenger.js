import { Button, Card } from "@themesberg/react-bootstrap";
import moment from "moment";
import { useEffect } from "react";
import { Image, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MyRoutes } from "../../routes";
import { useChatServices } from "../myComponents/util/services";

const UserMessenger = () => {
  const { contacts } = useChatServices();
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("recoil-persist");
    };
  }, []);
  return (
    <>
      <div className="col-12 h-100 bg-darker-nonary">
        <div className="d-flex flex-wrap h-100 align-content-center">
          <div
            className="container-fluid p-0 h-100"
            style={{ maxWidth: "600px" }}
          >
            <MessengerList contacts={contacts} />
          </div>
        </div>
      </div>
    </>
  );
};
export const MessengerList = ({ contacts }) => {
  return (
    <Card bg="transparent" className="user-messenger-card p-0">
      <Card.Header>
        <div className="d-flex flex-fill justify-content-center  border-senary border-bottom">
          <span className="text-senary fw-bolder">Contacts</span>
        </div>
      </Card.Header>
      <Card.Body className="p-1">
        {contacts ? (
          <ContactsList contacts={contacts} />
        ) : (
          <div className="w-100 d-flex justify-content-center text-senary">
            <Spinner animation="border" role="status" />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
const ContactsList = ({ contacts }) => {
  return (
    <>
      <div className="d-flex flex-column btn-group-vertical px-2">
        {(contacts &&
          contacts.map((c) => <Contact key={c.uid}>{c}</Contact>)) || (
          <Spinner></Spinner>
        )}
      </div>
    </>
  );
};
const Contact = ({ children }) => {
  return (
    <Button
      className="contact"
      variant="nonary"
      as={Link}
      to={MyRoutes.UserChat.path}
      state={{ activeContact: { ...children } }}
    >
      <ContactContent {...children} />
    </Button>
  );
};
const ContactContent = ({ name, email, message, photoUrl, unreadCount }) => {
  const fname = name || email;
  const time = message?.timestamp;
  const formattedTime = time && lastSignIn(time);
  const content = message?.content;
  return (
    <>
      <div className="d-flex flex-nowrap align-items-center justify-content-between">
        <div
          className="d-flex flex-nowrap"
          style={{ maxWidth: "calc(100% - 95px)" }}
        >
          <ContactPhoto photoUrl={photoUrl} name={fname} />
          <div
            className="ps-3 text-start d-flex flex-column flex-nowrap overflowX-hidden"
            style={{ maxWidth: "calc(100% - 30px)" }}
          >
            <div className="fw-bolder text-truncate">{fname}</div>
            <div className="message text-truncate">{content}</div>
          </div>
        </div>

        <div className="d-flex align-items-end flex-column">
          <div className="time">{formattedTime}</div>
          {unreadCount !== 0 && (
            <div
              style={{ width: "24px", height: "24px", fontSize: "13px" }}
              className="border-nonary border bg-senary rounded-circle text-nonary d-flex align-items-end"
            >
              <span className="w-100 d-flex justify-content-center text-nonary">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
const ContactPhoto = ({ photoUrl, name = [] }) => {
  return !photoUrl ? (
    <div
      className="bg-senary text-nonary rounded-circle border-nonary border-1 fw-bolder"
      style={{
        height: "30px",
        width: "30px",
        minWidth: "30px",
        lineHeight: "30px",
        textAlign: "center",
        border: "solid",
      }}
    >
      {name[0]}
    </div>
  ) : (
    <Image
      src={photoUrl}
      className="rounded-circle"
      style={{ height: "30px", width: "30px" }}
    />
  );
};

function lastSignIn(value) {
  const date = moment(value).format("YYYY.MM.DD");
  const hourMinute = moment(value).format("HH:mm");

  const now = moment();
  return date === now.format("YYYY.MM.DD")
    ? hourMinute
    : date === now.subtract(1, "day").format("YYYY.MM.DD")
    ? "Yesterday"
    : moment(date, "YYYY.MM.DD").isAfter(now.subtract(5, "days"))
    ? moment(value).format("dddd")
    : moment(value).format("DD.MM.YYYY");
}

export default UserMessenger;
