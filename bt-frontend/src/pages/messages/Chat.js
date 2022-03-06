import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Image, Spinner } from "@themesberg/react-bootstrap";
import { debounce } from "lodash";
import isEqual from "lodash.isequal";
import moment from "moment";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { toArray } from "react-emoji-render";
import TextareaAutosize from "react-textarea-autosize";
import { useAuth } from "../../contexts/AuthContext";
import { useChatServices } from "../myComponents/util/services";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";
const Chat = ({
  active,
  onContactChange,
  left,
  right,
  headerLeft,
  headerRight,
  variant,
}) => {
  const {
    contacts,
    loadNextPage,
    activeContact,
    messages,
    sendMessage,
    setActiveContactUid,
    connect,
    disconnect,
    stompClient,
  } = useChatServices(active, null, true);

  useEffect(() => {
    !stompClient && connect();
    // return () => {
    //   disconnect();
    // };
  }, [connect, disconnect, stompClient]);

  const handleContactClick = useCallback(
    (c) => {
      onContactChange
        ? onContactChange(contacts?.find((co) => co.uid === c)).then(() =>
            setActiveContactUid(c)
          )
        : setActiveContactUid(c);
    },
    [setActiveContactUid, onContactChange, contacts]
  );

  return (
    <>
      {activeContact ? (
        <ChatComponent
          {...{
            left,
            right,
            headerLeft,
            headerRight,
            variant,
            contacts,
            onContactClick: handleContactClick,
            activeContact,
            messages,
            sendMessage,
            onScroll: loadNextPage,
          }}
        />
      ) : (
        <ComponentPreLoader />
      )}
    </>
  );
};

export const ChatComponent = memo(
  ({
    left = true,
    right = true,
    headerLeft = true,
    headerRight = true,
    variant = "light",
    contacts,
    onContactClick,
    activeContact,
    messages,
    onScroll,
    sendMessage,
    loadingLeft = false,
    loadingRight = false,
  }) => {
    const { currentUser } = useAuth();
    const handleContactClick = useCallback(
      (c) => {
        onContactClick && onContactClick(c);
      },
      [onContactClick]
    );
    const handleScroll = useMemo(
      () => onScroll && debounce(onScroll, 400),
      [onScroll]
    );
    return (
      <>
        <div className="col-12 h-100">
          <div className="py-0 d-flex flex-wrap h-100">
            <div className="container-fluid p-0 h-100">
              <div
                className={`col-12 h-100 rounded messenger messenger-${variant} ${
                  left ? "left" : ""
                } ${right ? "right" : ""}`}
              >
                <div className="py-0 d-flex flex-wrap h-100">
                  <div className="wrapper w-100">
                    {left && (
                      <div className="h-100 flex-fill">
                        <div className="messenger-left">
                          {headerLeft && (
                            <CardHeader
                              name={
                                currentUser.displayName || currentUser.email
                              }
                              photoUrl={currentUser?.photoURL}
                            />
                          )}

                          <Card.Body className="p-0">
                            {!loadingLeft && contacts ? (
                              <Scrollbars
                                autoHeight
                                autoHeightMax={"100%"}
                                className="h-100"
                                renderTrackVertical={(props) => {
                                  return (
                                    <div
                                      {...props}
                                      className="track-vertical"
                                    ></div>
                                  );
                                }}
                                renderView={(props) => {
                                  return (
                                    <div
                                      {...props}
                                      style={{
                                        ...props.style,
                                        overflowX: "hidden",
                                      }}
                                    ></div>
                                  );
                                }}
                              >
                                <ContactsList
                                  contacts={contacts}
                                  onClick={handleContactClick}
                                  activeContact={activeContact}
                                />
                              </Scrollbars>
                            ) : (
                              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                <Spinner
                                  animation="border"
                                  variant={variant === "dark" && "senary"}
                                />
                              </div>
                            )}
                          </Card.Body>
                          <Card.Footer className="py-2 px-3" />
                        </div>
                      </div>
                    )}

                    {right && activeContact && (
                      <Card className="messenger-right flex-fill">
                        {headerRight && (
                          <CardHeader
                            name={activeContact?.name || activeContact.email}
                            photoUrl={activeContact?.photoUrl}
                          />
                        )}

                        <CardBody
                          loading={loadingRight}
                          messages={messages}
                          activeUid={activeContact?.uid}
                          lastMessage={activeContact?.message}
                          onScroll={handleScroll}
                        />
                        <CardFooter sendMessage={sendMessage}></CardFooter>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
  isEqual
);

const ContactsList = ({ contacts, activeContact, ...rest }) => {
  return (
    <>
      <div className="d-flex flex-column messages-list">
        {contacts.map((c) => {
          const active = activeContact?.uid === c.uid;
          return (
            <Contact {...rest} key={c.uid} active={active}>
              {c}
            </Contact>
          );
        })}
      </div>
    </>
  );
};
const Contact = ({ children, onClick, active }) => {
  return (
    <Button
      className={`contact m-2 me-3`}
      variant={active ? "primary" : "secondary"}
      onClick={() => onClick(children.uid)}
    >
      <ContactContent {...children} active={active} />
    </Button>
  );
};
const ContactContent = ({
  name,
  email,
  message,
  photoUrl,
  unreadCount,
  active,
}) => {
  const fname = name || email;
  const time = message?.timestamp;
  const formattedTime = time && toDateFormat(time);
  const content = message?.content;
  const unreadExists = unreadCount !== 0;
  return (
    <>
      <div className="d-flex flex-nowrap align-items-center">
        <ContactPhoto photoUrl={photoUrl} name={fname} />
        <div className="px-2 text-start d-flex flex-fill flex-column flex-nowrap overflowX-hidden">
          <div className="fw-bolder text-truncate">{fname}</div>
          <div className="message">{content}</div>
        </div>
        <div
          className={`d-flex align-items-end flex-column${
            unreadExists ? " unread-count-active" : ""
          }`}
        >
          <div className="time">{formattedTime}</div>
          {unreadExists && (
            <div
              style={{ width: "24px", height: "24px", fontSize: "13px" }}
              className={`unread-count rounded-circle d-flex align-items-end`}
            >
              <span className="w-100 d-flex justify-content-center">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
const ContactPhoto = ({ photoUrl, name }) => {
  return (
    <div className="contact-avatar">
      {photoUrl ? (
        <Image
          src={photoUrl}
          className="user-avatar rounded-circle border-0"
          resize="contain"
        />
      ) : (
        <div className="fallback-icon rounded-circle fw-bolder user-avatar rounded-circle">
          {name?.substring(0, 2)}
        </div>
      )}
    </div>
  );
};
const CardHeader = memo(({ name, photoUrl }) => {
  return (
    <Card.Header className="py-2 px-1 ">
      {name && (
        <>
          <div className="ps-2">
            <ContactPhoto name={name} photoUrl={photoUrl} />
          </div>
          <div className="ps-2 fw-bold">{name}</div>
        </>
      )}
    </Card.Header>
  );
}, isEqual);
const CardBody = memo(
  ({ messages, activeUid, onScroll, lastMessage, loading }) => {
    const stillRefreshing =
      loading ||
      (lastMessage !== null &&
        messages.length === 0 &&
        activeUid !== messages[0]?.recipientId &&
        activeUid !== messages[0]?.senderId);

    useEffect(() => {
      const l = lastMessage;
      const u = activeUid;
      const k =
        lastMessage !== null &&
        messages.length === 0 &&
        activeUid !== messages[0]?.recipientId &&
        activeUid !== messages[0]?.senderId;
    }, [activeUid, lastMessage]);

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
        const top = scrollHeight + scrollTop - clientHeight;
        if (top <= 10) {
          onScroll && onScroll();
        }
      },
      [onScroll]
    );
    return stillRefreshing ? (
      <div className="h-100 fallback-body d-flex flex-fill justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    ) : (
      <Card.Body className="py-2 px-3" onScroll={handleScroll}>
        {dates.map((d) => {
          return (
            <React.Fragment key={d}>
              {values[d].map((m) => (
                <Message {...m} activeUid={activeUid} key={m.timestamp} />
              ))}
              <div className="date-bar py-2 fw-bold">
                <span className="bar" />
                <span className="date px-2">{toDateBarFormat(d)}</span>
                <span className="bar" />
              </div>
            </React.Fragment>
          );
        })}
      </Card.Body>
    );
  },
  isEqual
);

const Message = memo(({ content, activeUid, recipientId, timestamp }) => {
  const sent = activeUid === recipientId;
  const divClassName = `py-1 message ${sent ? "sent" : "received"}`;
  return (
    <div className={divClassName}>
      <Button variant="secondary">
        <div className="text-break text-wrap pe-2">{content}</div>
        <div className="time">
          <span>{moment(timestamp).format("HH:mm")}</span>
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
  }, [text, sendMessage]);
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
    <Card.Footer className="py-2 px-3">
      <div className="textarea-wrapper">
        <TextareaAutosize
          ref={textAreaRef}
          autoFocus
          spellCheck={false}
          className="px-3"
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
              variant="secondary"
              className="p-1 send-btn"
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
function toDateBarFormat(value) {
  const now = moment();
  return value === now.format("YYYY.MM.DD")
    ? "today"
    : value === now.subtract(1, "day").format("YYYY.MM.DD")
    ? "yesterday"
    : moment(value, "YYYY.MM.DD").isAfter(now.subtract(5, "days"))
    ? moment(value, "YYYY.MM.DD").format("dddd")
    : moment(value, "YYYY.MM.DD").format("DD.MM.YYYY");
}
function toDateFormat(value) {
  const date = moment(value).format("YYYY.MM.DD");

  const now = moment();
  return date === now.format("YYYY.MM.DD")
    ? moment(value).format("HH:mm")
    : date === now.subtract(1, "day").format("YYYY.MM.DD")
    ? "yesterday"
    : moment(date, "YYYY.MM.DD").isAfter(now.subtract(5, "days"))
    ? moment(value).format("dddd")
    : moment(value).format("DD.MM.YYYY");
}
export default Chat;
