import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBoxOpen,
  faChartPie,
  faCog,
  faFileAlt,
  faHandHoldingUsd,
  faSignOutAlt,
  faTable,
  faTimes,
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

const Sidebar = (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button
            as={Nav.Link}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />
              </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

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
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={MyRoutes.DashboardOverview.path}
        >
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block text-white bg-primary`}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image
                    src={ProfilePicture}
                    className="card-img-top rounded-circle border-white"
                  />
                </div>
                <div className="d-block">
                  <h6>Hi, Jane</h6>
                  <Button
                    as={Link}
                    variant="secondary"
                    size="xs"
                    to={MyRoutes.Signin.path}
                    className="text-dark"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{" "}
                    Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem
                title="Overview"
                link={MyRoutes.DashboardOverview.path}
                icon={faChartPie}
              />
              <NavItem
                title="Tours"
                icon={faHandHoldingUsd}
                link={MyRoutes.Tours.path}
              />
              <NavItem
                title="Workhours"
                icon={faHandHoldingUsd}
                link={MyRoutes.Arbeitszeiten.path}
              />
              <NavItem
                title="Messages"
                icon={faHandHoldingUsd}
                link={MyRoutes.Nachrichten.path}
              />
              <NavItem
                title="Settings"
                icon={faCog}
                link={MyRoutes.Settings.path}
              />

              <Dropdown.Divider className="my-3 border-indigo" />

              <CollapsableNavItem
                eventKey="documentation/"
                title="Getting Started"
                icon={faBook}
              >
                <NavItem
                  title="React Project"
                  link={MyRoutes.Presentation.path}
                  image={ReactHero}
                />
                <CollapsableNavItem
                  eventKey="components/"
                  title="Components"
                  icon={faBoxOpen}
                >
                  <NavItem title="Accordion" link={MyRoutes.Accordions.path} />
                  <NavItem title="Alerts" link={MyRoutes.Alerts.path} />
                  <NavItem title="Badges" link={MyRoutes.Badges.path} />
                  <NavItem
                    external
                    title="Widgets"
                    link="https://demo.themesberg.com/volt-pro-react/#/components/widgets"
                    target="_blank"
                    badgeText="Pro"
                  />
                  <NavItem
                    title="Breadcrumbs"
                    link={MyRoutes.Breadcrumbs.path}
                  />
                  <NavItem title="Buttons" link={MyRoutes.Buttons.path} />
                  <NavItem title="Forms" link={MyRoutes.Forms.path} />
                  <NavItem title="Modals" link={MyRoutes.Modals.path} />
                  <NavItem title="Navbars" link={MyRoutes.Navbars.path} />
                  <NavItem title="Navs" link={MyRoutes.Navs.path} />
                  <NavItem title="Pagination" link={MyRoutes.Pagination.path} />
                  <NavItem title="Popovers" link={MyRoutes.Popovers.path} />
                  <NavItem title="Progress" link={MyRoutes.Progress.path} />
                  <NavItem title="Tables" link={MyRoutes.Tables.path} />
                  <NavItem title="Tabs" link={MyRoutes.Tabs.path} />
                  <NavItem title="Toasts" link={MyRoutes.Toasts.path} />
                  <NavItem title="Tooltips" link={MyRoutes.Tooltips.path} />
                </CollapsableNavItem>
                <CollapsableNavItem
                  eventKey="tables/"
                  title="Tables"
                  icon={faTable}
                >
                  <NavItem
                    title="Bootstrap Table"
                    link={MyRoutes.BootstrapTables.path}
                  />
                </CollapsableNavItem>

                <CollapsableNavItem
                  eventKey="examples/"
                  title="Page Examples"
                  icon={faFileAlt}
                >
                  <NavItem title="Sign In" link={MyRoutes.Signin.path} />
                  <NavItem title="Sign Up" link={MyRoutes.Signup.path} />
                  <NavItem
                    title="Forgot password"
                    link={MyRoutes.ForgotPassword.path}
                  />
                  <NavItem
                    title="Reset password"
                    link={MyRoutes.ResetPassword.path}
                  />
                  <NavItem title="Lock" link={MyRoutes.Lock.path} />
                  <NavItem
                    title="404 Not Found"
                    link={MyRoutes.NotFound.path}
                  />
                  <NavItem
                    title="500 Server Error"
                    link={MyRoutes.ServerError.path}
                  />
                </CollapsableNavItem>

                <NavItem
                  external
                  title="Plugins"
                  link="https://demo.themesberg.com/volt-pro-react/#/plugins/charts"
                  target="_blank"
                  badgeText="Pro"
                  icon={faChartPie}
                />

                <NavItem title="Overview" link={MyRoutes.DocsOverview.path} />
                <NavItem title="Download" link={MyRoutes.DocsDownload.path} />
                <NavItem
                  title="Quick Start"
                  link={MyRoutes.DocsQuickStart.path}
                />
                <NavItem title="License" link={MyRoutes.DocsLicense.path} />
                <NavItem
                  title="Folder Structure"
                  link={MyRoutes.DocsFolderStructure.path}
                />
                <NavItem title="Build Tools" link={MyRoutes.DocsBuild.path} />
                <NavItem title="Changelog" link={MyRoutes.DocsChangelog.path} />
              </CollapsableNavItem>
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
export default Sidebar;
