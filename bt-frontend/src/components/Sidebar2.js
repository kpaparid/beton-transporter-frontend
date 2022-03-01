import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, Image, Navbar, Container } from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { MyRoutes } from "../routes";
import Android from "../assets/img/favicon/android-chrome-192x192.png";
// import UserNavbar from "./UserNavbar";
import { useUserNavbar } from "../contexts/AuthContext";

const Sidebar2 = () => {
  const { dropdown } = useUserNavbar();
  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-nonary px-3 py-0"
        style={{ height: "55px" }}
      >
        <div className="w-100 d-flex flex-nowrap justify-content-between align-items-center">
          <div className="text-light d-flex align-items-end">
            <Nav.Link as={Link} to={MyRoutes.UserHome.path}>
              <Image src={Android} style={{ height: "30px" }}></Image>
              <span className="ps-2">Beton</span>
            </Nav.Link>
          </div>
          {dropdown}
          {/* <UserNavbar /> */}
        </div>
      </Navbar>
    </>
  );
};
export default Sidebar2;

export const UserNavbar = () => {
  const { dropdown } = useUserNavbar();
  return (
    // <Navbar variant="dark" expanded className="p-0">
    <Container fluid className="px-0">
      <div className={`d-flex justify-content-end w-100`}>
        <Nav className="align-items-center">{dropdown}</Nav>
      </div>
    </Container>
    // </Navbar>
  );
};
