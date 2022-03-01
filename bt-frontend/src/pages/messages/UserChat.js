import {
  faAlignLeft,
  faChevronLeft,
  faLongArrowAltLeft,
  faPaperPlane,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button } from "@themesberg/react-bootstrap";
import Picker from "emoji-picker-react";
import { isEqual } from "lodash";
import moment from "moment";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Alert, Image, Spinner } from "react-bootstrap";
import { toArray } from "react-emoji-render";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { RecoilRoot } from "recoil";
import { MyRoutes } from "../../routes";
import { useChatServices } from "../myComponents/util/services";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
function lastSignIn(value) {
  const date = moment(value).format("YYYY.MM.DD");

  const now = moment();
  return date === now.format("YYYY.MM.DD")
    ? "today"
    : date === now.subtract(1, "day").format("YYYY.MM.DD")
    ? "yesterday"
    : moment(date, "YYYY.MM.DD").isAfter(now.subtract(5, "days"))
    ? moment(value).format("dddd")
    : moment(value).format("DD.MM.YYYY");
}
const UserChat = () => {
  const location = useLocation();
  const active = location.state?.activeContact;
  const navigate = useNavigate();
  useEffect(() => {
    !active && navigate(MyRoutes.UserMessenger.path);
  }, [active, navigate]);

  return (
    <>
      {active && (
        <RecoilRoot>
          <Chat active={active}></Chat>
        </RecoilRoot>
      )}
    </>
  );
};
const Notification = ({ content, contact }) => {
  return (
    <div className="w-100 d-flex flex-nowrap align-items-center">
      <ContactPhoto
        photoUrl={contact.photoUrl}
        name={contact.name || contact.email}
      />
      <div className="ps-3 flex-fill d-inline-block text-truncate text-break">
        <div className="fw-bolder">{contact.name || contact.email}</div>
        <div className="d-inline">{content}</div>
      </div>
    </div>
  );
};
const Chat = ({ active }) => {
  const onNewMessage = useCallback(
    ({ notification, activeUid, message, contact, setActive }) => {
      if (activeUid && notification.senderId !== activeUid) {
        toast.update(notification.senderId, {
          render: () => (
            <Notification content={message?.content} contact={contact} />
          ),
        }) ||
          toast(<Notification content={message?.content} contact={contact} />, {
            onClick: setActive,
            bodyClassName: "col-1 p-0",
            toastId: notification.senderId,
          });
      }
    },
    []
  );

  const { messages, activeContact, sendMessage, loadNextPage, disconnect } =
    useChatServices(active, onNewMessage);

  const act = activeContact || active;
  return (
    <div className="col-12 h-100 bg-darker-nonary">
      <div className="py-0 d-flex flex-wrap h-100">
        <ToastContainer
          className="user-messenger-notification"
          position="top-center"
          autoClose={50000}
          icon={false}
          hideProgressBar={false}
          newestOnTop={true}
          rtl={false}
          pauseOnFocusLoss
          draggablePercent={60}
          pauseOnHover
          limit={3}
        />
        <div className="container-fluid p-0 h-100">
          <Card
            bg="darker-nonary"
            className="user-messenger-card border-0 rounded-0 h-100"
          >
            <CardHeader
              name={act?.name || act.email}
              photoUrl={act?.photoUrl}
              onDisconnect={disconnect}
            />

            <CardBody
              lastMessage={act?.message}
              messages={messages}
              activeUid={act?.uid || act?.uid}
              onScroll={loadNextPage}
            />
            <CardFooter sendMessage={sendMessage}></CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
const CardHeader = memo(({ name, photoUrl, email, onDisconnect }) => {
  const fname = name || email;
  const handleLeaveClick = useCallback(() => {
    onDisconnect();
  }, [onDisconnect]);

  return (
    <Card.Header className="text-senary d-flex flex-nowrap align-items-center py-2 bg-nonary rounded-0 px-1">
      <Button
        variant="transparent"
        className="text-senary p-0"
        style={{ width: "30px", height: "30px" }}
        as={Link}
        to={MyRoutes.UserMessenger.path}
        onClick={handleLeaveClick}
      >
        <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
      </Button>
      <ContactPhoto name={fname} photoUrl={photoUrl} />
      <div className="ps-2 fw-bold">{fname}</div>
    </Card.Header>
  );
}, isEqual);
const CardBody = memo(({ lastMessage, messages = [], activeUid, onScroll }) => {
  const dates = [
    ...new Set(messages.map((c) => moment(c.timestamp).format("YYYY.MM.DD"))),
  ];
  const values = dates.reduce(
    (a, b) => ({
      ...a,
      [b]: messages.filter(
        (m) => b === moment(m.timestamp).format("YYYY.MM.DD")
      ),
    }),
    {}
  );

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const top = scrollHeight + scrollTop - clientHeight === 1;
      if (top) {
        onScroll && onScroll();
      }
    },
    [onScroll]
  );
  return (
    <Card.Body
      className="text-senary d-flex flex-column flex-column-reverse flex-nowrap align-items-center py-2 bg-darker-nonary rounded-0 px-3 overflow-auto"
      style={{ height: 0, overflow: "auto" }}
      onScroll={handleScroll}
    >
      {dates.map((d) => {
        return (
          <React.Fragment key={d}>
            {values[d].map((m) => (
              <Message {...m} activeUid={activeUid} key={m.timestamp} />
            ))}
            <div className="d-flex justify-content-center py-2 fw-bold w-100">
              <span
                className="border-senary border-bottom flex-grow-1"
                style={{ marginBottom: "12px" }}
              />
              <span className="text-center text-senary px-2">
                {lastSignIn(d)}
              </span>
              <span
                className="border-senary border-bottom flex-grow-1"
                style={{ marginBottom: "12px" }}
              />
            </div>
          </React.Fragment>
        );
      })}

      {/* {lastMessage && messages.length === 0 ? (
        <>
          <Message {...lastMessage} activeUid={activeUid} />
          <div className="pb-3">
            <Spinner animation="border" role="status" />
          </div>
        </>
      ) : (
        messages.map((m) => (
          <Message {...m} activeUid={activeUid} key={m.timestamp}></Message>
        ))
      )} */}
    </Card.Body>
  );
}, isEqual);

const Message = memo(({ content, activeUid, recipientId, timestamp }) => {
  const sent = activeUid === recipientId;
  const variant = sent ? "senary" : "nonary";
  const timeTextVariant = sent ? "text-nonary" : "text-darker-senary";
  const divClassName = `message py-1 w-100 d-flex justify-content-${
    sent ? "end" : "start"
  }`;
  const buttonClassName = `d-flex align-items-end ${
    sent ? "text-end" : "text-start"
  } `;
  return (
    <div className={divClassName}>
      <Button
        style={{ maxWidth: "80%" }}
        variant={variant}
        className={buttonClassName}
      >
        <div className="text-break text-wrap pe-2">{content}</div>
        <div className={timeTextVariant}>
          <span
            style={{ fontSize: "13px", position: "relative", bottom: "-9px" }}
          >
            {moment(timestamp).format("HH:mm")}
          </span>
        </div>
      </Button>
    </div>
  );
});
const CardFooter = memo(({ sendMessage }) => {
  const textAreaRef = useRef();
  const [text, setText] = useState("");
  const value = parseEmojis(text);
  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
  }, []);
  const handleSend = useCallback(() => {
    sendMessage(text);
    setText("");
  }, [text]);
  const handleEnterKey = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <Card.Footer className="text-senary d-flex flex-nowrap align-items-end py-2 px-3 rounded-0 justify-content-around">
      <div className={"d-flex align-items-center bg-nonary rounded flex-fill"}>
        <TextareaAutosize
          ref={textAreaRef}
          autoFocus
          style={{
            resize: "none",
            height: "36px",
            lineHeight: "28px",
            outline: "none",
          }}
          className="rounded px-3 w-100 border-0 bg-transparent text-senary shadow-none"
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleEnterKey}
          maxRows={5}
        />
      </div>
      {text && (
        <div className="justify-content-center d-flex align-items-end ps-3">
          <div className="d-flex align-items-end">
            <Button
              variant="nonary"
              className="rounded-circle p-1 shadow-none"
              style={{
                height: "32px",
                width: "32px",
              }}
              onClick={handleSend}
            >
              <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
            </Button>
          </div>
        </div>
      )}
    </Card.Footer>
  );
}, isEqual);
const ContactPhoto = ({ photoUrl, name = [] }) => {
  return !photoUrl ? (
    <div
      className={"bg-senary text-nonary rounded-circle fw-bolder"}
      style={{
        height: "30px",
        width: "30px",
        minWidth: "30px",
        lineHeight: "30px",
        textAlign: "center",
      }}
    >
      {name[0]}
    </div>
  ) : (
    <Image
      src={photoUrl}
      className={"rounded-circle "}
      style={{ height: "30px", width: "30px" }}
    />
  );
};
const parseEmojis = (value) => {
  const emojisArray = toArray(value);
  const newValue = emojisArray.reduce((previous, current) => {
    if (typeof current === "string") {
      return previous + current;
    }
    return previous + current.props.children;
  }, "");

  return newValue;
};

export default UserChat;
