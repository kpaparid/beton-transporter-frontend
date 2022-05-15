import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyRoutes } from "../../routes";
import { useChatServices } from "../myComponents/util/services";
import { ChatComponent } from "./Chat";

const UserChat = () => {
  const location = useLocation();
  const active = location.state?.activeContact;
  const navigate = useNavigate();
  useEffect(() => {
    !active && navigate(MyRoutes.UserMessenger.path);
  }, [active, navigate]);

  const {
    contacts,
    connect,
    refresh,
    loading,
    activeContact,
    messages,
    loadNextPage,
    sendMessage,
  } = useChatServices(active, null, null, false, true);
  useEffect(() => {
    try {
      refresh();
    } catch (e) {
      connect();
    }
  }, [connect, refresh]);
  return (
    <div className="h-100 messenger-fullscreen">
      <ChatComponent
        variant="dark"
        headerLeft={false}
        left={false}
        contacts={contacts}
        activeContact={activeContact}
        messages={messages}
        onScroll={loadNextPage}
        sendMessage={sendMessage}
        loadingRight={loading}
      />
    </div>
  );
};

export default UserChat;
