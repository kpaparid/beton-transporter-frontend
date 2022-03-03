import {
  faChartPie,
  faCog,
  faHandHoldingUsd,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Image, Nav, Navbar } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import SimpleBar from "simplebar-react";
import { useUserNavbar } from "../contexts/AuthContext";
import { MyRoutes } from "../routes";

const MyButton = ({ children, variant = "nonary", ...rest }) => {
  return (
    <Button
      variant={variant}
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
const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const { dropdown } = useUserNavbar();
  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon,
      image,
      badgeText,
      badgeBg = "tertiary",
      badgeColor = "primary",
    } = props;
    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        bg="primary"
        className="navbar-theme-primary px-3 py-0 d-md-none"
        style={{ height: "55px" }}
      >
        <div className="w-100 d-flex flex-nowrap justify-content-end align-items-center">
          <div className="d-flex">
            <div className="ps-2">
              <Navbar.Toggle
                as={(props) => (
                  <MyButton {...props} variant="primary"></MyButton>
                )}
                aria-controls="main-navbar bg-primary"
                onClick={onCollapse}
                style={{ transform: "scale(75%)" }}
              >
                <span className="navbar-toggler-icon bg-primary" />
              </Navbar.Toggle>
            </div>
          </div>
        </div>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block text-white bg-primary h-100`}
        >
          <div className="sidebar-inner px-4 p-3 h-100">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div>{dropdown}</div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="h-100 overflow-auto flex-column flex-nowrap pt-3 pt-md-0 h-100 d-flex flex-column justify-content-between">
              <div>
                <NavItem
                  title="Overview"
                  link={MyRoutes.DashboardOverview.path}
                  icon={faChartPie}
                />
                <NavItem
                  title="Tours"
                  icon={faHandHoldingUsd}
                  link={MyRoutes.DashboardTours.path}
                />
                <NavItem
                  title="Workhours"
                  icon={faHandHoldingUsd}
                  link={MyRoutes.DashboardWorkHours.path}
                />
                <NavItem
                  title="Messages"
                  icon={faHandHoldingUsd}
                  link={MyRoutes.Chat.path}
                />
                <NavItem
                  title="Users"
                  icon={faUser}
                  link={MyRoutes.Users.path}
                />
                <NavItem
                  title="Settings"
                  icon={faCog}
                  link={MyRoutes.Settings.path}
                />

                <NavItem
                  title="App"
                  icon={faCog}
                  link={MyRoutes.UserHome.path}
                />
              </div>
              {dropdown}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
export default Sidebar;
