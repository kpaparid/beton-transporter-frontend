import { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MyRoutes } from "../../routes";
import { useChatServices } from "../myComponents/util/services";
import { ChatComponent } from "./Chat";

const UserMessenger = () => {
  const navigate = useNavigate();
  const { contacts, connect, refresh, loading } = useChatServices(
    null,
    null,
    null,
    true,
    false
  );
  const handleContactClick = useCallback(
    (uid) => {
      const activeContact = contacts.find((c) => c.uid === uid);
      navigate(MyRoutes.UserChat.path, {
        state: {
          activeContact,
        },
      });
    },
    [contacts, navigate]
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
      <div className="col-12 h-100 bg-darker-nonary">
        <div className="d-flex flex-wrap h-100 align-content-center">
          <div className="container-fluid py-3 h-100">
            <ChatComponent
              right={false}
              variant="dark"
              headerLeft={false}
              contacts={contacts}
              loadingLeft={loading}
              onContactClick={handleContactClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMessenger;
