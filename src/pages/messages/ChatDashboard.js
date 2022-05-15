import { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MyRoutes } from "../../routes";
import { useChatServices } from "../myComponents/util/services";
import { ChatComponent } from "./Chat";

const ChatDashboard = () => {
  const {
    contacts,
    connect,
    refresh,
    loading,
    setActiveContactUid,
    activeContact,
    messages,
    loadNextPage,
    sendMessage,
  } = useChatServices(null, null, true, true, true);
  const handleContactClick = useCallback(
    (uid) => {
      uid !== activeContact?.uid && setActiveContactUid(uid);
    },
    [setActiveContactUid, activeContact.uid]
  );

  useEffect(() => {
    try {
      refresh();
    } catch (e) {
      connect();
    }
  }, [connect, refresh]);

  return (
    <>
      <div className="col-12 h-100">
        <div className="d-flex flex-wrap h-100 align-content-center">
          <div className="container-fluid p-0 py-3 h-100">
            <ChatComponent
              variant="light"
              border={false}
              contacts={contacts}
              onContactClick={handleContactClick}
              activeContact={activeContact}
              messages={messages}
              onScroll={loadNextPage}
              sendMessage={sendMessage}
              loadingRight={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDashboard;
