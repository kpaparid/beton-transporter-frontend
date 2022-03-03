import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyRoutes } from "../../routes";
import Chat from "./Chat";

const UserChat = () => {
  const location = useLocation();
  const active = location.state?.activeContact;
  const navigate = useNavigate();
  useEffect(() => {
    !active && navigate(MyRoutes.UserMessenger.path);
  }, [active, navigate]);

  return (
    <div className="h-100 messenger-fullscreen">
      {active && (
        <Chat active={active} left={false} variant="dark" radius="0"></Chat>
      )}
    </div>
  );
};

export default UserChat;
