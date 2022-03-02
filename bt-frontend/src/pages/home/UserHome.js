import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import {
  faClock,
  faCog,
  faPlane,
  faTruck,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nav } from "@themesberg/react-bootstrap";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { MyRoutes } from "../../routes";
import { useConnectChat, useServices } from "../myComponents/util/services";

const UserHome = ({ onClick, maxWidth = "500px" }) => {
  const { fetchUsers } = useServices();
  const [contacts, setContacts] = useState();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { findUnreadCount, currentUser } = useAuth();
  const handleUnreadMessagesChange = useCallback((value) => {
    value >= 99 ? setUnreadMessages("99+") : setUnreadMessages(value);
  }, []);

  useEffect(() => {
    fetchUsers().then(({ data }) => {
      setContacts(data);
      const contacts = data.map((c) => c.uid);
      findUnreadCount(currentUser.uid, contacts).then(({ data }) => {
        handleUnreadMessagesChange(data);
      });
    });
  }, [
    fetchUsers,
    findUnreadCount,
    currentUser.uid,
    handleUnreadMessagesChange,
  ]);

  const onMessageReceived = useCallback(() => {
    findUnreadCount(
      currentUser.uid,
      contacts.map((c) => c.uid)
    ).then(({ data, status }) => {
      status === 200 && handleUnreadMessagesChange(data);
    });
  }, [currentUser.uid, findUnreadCount, findUnreadCount, fetchUsers, contacts]);

  const chat = useConnectChat({ uid: currentUser.uid, onMessageReceived });
  const NavItem = (props) => {
    const { title, link, target, icon, image, className = "" } = props;
    // const navItemClassName = link === pathname ? "active" : "";
    const linkProps = { as: Link, to: link };
    return (
      <Nav.Item
        className="col-6 col-md-4 col-sm-4 p-1"
        style={{ aspectRatio: "1" }}
      >
        <div className="p-2 w-100 h-100">
          <Nav.Link
            {...linkProps}
            onClick={onClick}
            target={target}
            className={
              "w-100 h-100 d-flex flex-column justify-content-center align-items-center p-0 rounded " +
              className
            }
          >
            {icon && (
              <span className="sidebar-icon w-50" style={{ aspectRatio: "1" }}>
                <FontAwesomeIcon icon={icon} className="w-100 h-100" />
              </span>
            )}
            {image && (
              <span
                className="sidebar-icon w-50 text-primary"
                style={{ aspectRatio: "1" }}
              >
                {image}
              </span>
            )}
            <span className="py-1 fw-bolder  ">{title}</span>
          </Nav.Link>
        </div>
      </Nav.Item>
    );
  };

  return (
    <>
      <div
        className={` w-100 h-100 align-items-center justify-content-center d-flex flex-column bg-darker-nonary`}
      >
        <div
          className={"w-100 p-3"}
          style={{ padding: "0", maxWidth: maxWidth }}
        >
          <div className="d-flex flex-wrap justify-content-center">
            <NavItem
              className="bg-senary text-nonary"
              title="Work Hours"
              link={MyRoutes.UserWorkHours.path}
              icon={faClock}
            />

            <NavItem
              className="bg-nonary text-senary"
              title="Tours"
              link={MyRoutes.UserTours.path}
              icon={faTruck}
            />
            <NavItem
              className="bg-nonary text-senary"
              title={
                <div className="d-flex flex-row flex-wrap">
                  <span className="d-flex align-items-center">Messages</span>
                </div>
              }
              link={MyRoutes.UserMessenger.path}
              image={
                <div className="d-flex justify-content-center flex-column">
                  {unreadMessages !== 0 && (
                    <div
                      className="d-flex w-100"
                      style={{
                        position: "absolute",
                        justifyContent: "right",
                        height: "100%",
                      }}
                    >
                      <div
                        className="bg-nonary text-senary p-1 rounded-2 d-flex text-center border border-3 border-senary"
                        style={{ height: "fit-content", fontSize: "9px" }}
                      >
                        {unreadMessages}
                      </div>
                    </div>
                  )}
                  <FontAwesomeIcon
                    icon={faFacebookMessenger}
                    className="w-100 h-100 text-senary"
                  />
                </div>
              }
            />
            <NavItem
              className="bg-senary text-nonary"
              title="Overview"
              link={MyRoutes.UserOverview.path}
              icon={faUserClock}
            />

            <NavItem
              className="bg-senary text-nonary"
              title="Vacations"
              link={MyRoutes.UserVacations.path}
              icon={faPlane}
            />
            <NavItem
              className="bg-nonary text-senary"
              title="Settings"
              link={MyRoutes.UserSettings.path}
              icon={faCog}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default UserHome;
