import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from "@themesberg/react-bootstrap";
import { messages } from "../data/tables";
import teamMembers from "../data/teamMembers";

import NewMessage from "./myComponents/NewMessage";
import DisplayMessage from "./myComponents/DisplayMessage";
import MessageList from "./myComponents/MessageList";

const NachRichten = () => {
  const [visible, setVisible] = useState(0);
  const [message, setMessage] = useState(messages[0]);
  const [receivers, setReceivers] = useState([]);

  function clearData() {
    setMessage({
      id: 0,
      from: "",
      to: "",
      title: "",
      mail: "",
      date: "",
      status: "",
    });
    setVisible(0);
    setReceivers([]);
  }
  const data = {
    visible,
    setVisible,
    message,
    setMessage,
    receivers,
    setReceivers,
    clearData,
  };

  return (
    <>
      <div className="py-4 d-flex flex-wrap">
        <div className="container-fluid p-0">
          <div className="row">
            <div className={`col-12 col-sm-${visible === 0 ? "12" : "6"} p-1`}>
              <MessageList data={data} table={messages} />
            </div>
            <div
              className={`col-12 col-sm-6 p-1 ${
                visible === 1 ? "d-flex" : "d-none"
              }`}
            >
              <NewMessage data={data} table={teamMembers} />
            </div>
            <div
              className={`col-12 col-sm-6 p-1 ${
                visible === 2 ? "d-flex" : "d-none"
              }`}
            >
              <DisplayMessage data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NachRichten;
