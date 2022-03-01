import React, { useState, useCallback } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faBook,
  faBoxOpen,
  faChartPie,
  faCog,
  faFileAlt,
  faHandHoldingUsd,
  faLongArrowAltLeft,
  faPlane,
  faSignOutAlt,
  faTable,
  faTimes,
  faTruck,
  faUser,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { MyRoutes } from "../routes";
import ThemesbergLogo from "../assets/img/themesberg.svg";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";
import UserNavbar from "./UserNavbar";
import UserHome from "../pages/UserHome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import Android from "../assets/img/favicon/android-chrome-192x192.png";

const MyButton = ({ children, ...rest }) => {
  return (
    <Button
      variant="nonary"
      style={{
        boxShadow:
          "inset 0px 0px 1px 1px rgb(255 255 255 / 15%), 1px 1px 1px rgb(46 54 80 / 8%)",
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

const Sidebar3 = (props = {}) => {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const onCollapse = () => setShow(!show);
  const handleClick = useCallback(() => {
    setShow(false);
  }, []);
  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        bg="nonary"
        className="navbar-theme-nonary px-3 py-0"
        style={{ height: "55px" }}
      >
        <div className="w-100 d-flex flex-nowrap justify-content-between align-items-center">
          <div className="text-light d-flex align-items-end">
            <Nav.Link as={Link} to={MyRoutes.UserHome.path} className="p-0">
              <div className="d-flex flex-nowrap">
                <div className="pe-2 d-flex justify-content-left align-items-center">
                  <FontAwesomeIcon size="lg" icon={faLongArrowAltLeft} />
                </div>
                <Image src={Android} style={{ height: "30px" }}></Image>
                <span className="ps-2  d-flex justify-content-left align-items-end">
                  Beton
                </span>
              </div>
            </Nav.Link>
          </div>
          <div className="d-flex">
            <UserNavbar size="55px" />
            <div className="ps-2">
              <Navbar.Toggle
                as={MyButton}
                aria-controls="main-navbar"
                onClick={onCollapse}
              >
                <span className="navbar-toggler-icon" />
              </Navbar.Toggle>
            </div>
          </div>
        </div>
      </Navbar>
      {show && (
        <div
          className={` w-100 bg-nonary h-100 align-items-center justify-content-center d-flex flex-column `}
          style={{ position: "fixed", top: 0, zIndex: 100 }}
        >
          {show && (
            <>
              <div
                className={"w-100 overflow-auto"}
                style={{ padding: "0 38px" }}
              >
                <div className="position-fixed top-0 end-0 pt-2 pe-2">
                  <Nav.Link
                    className="text-light p-0 ratio ratio-1x1"
                    style={{ width: "30px" }}
                    onClick={onCollapse}
                  >
                    <FontAwesomeIcon
                      style={{ width: "30px", height: "30px" }}
                      icon={faTimes}
                    />
                  </Nav.Link>
                </div>
                <div>
                  <UserHome onClick={handleClick} maxWidth={"500px"}></UserHome>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Sidebar3;
