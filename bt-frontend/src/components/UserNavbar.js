import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Dropdown,
  Image,
  Nav,
  Navbar,
} from "@themesberg/react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const UserNavbar = () => {
  const { currentUser, logout } = useAuth();
  const name = currentUser?.displayName || currentUser?.email;
  return (
    <Navbar variant="dark" expanded className="p-0">
      <Container fluid className="px-0">
        <div className={`d-flex justify-content-end w-100`}>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="p-0">
                <div className="media d-flex align-items-center">
                  <div className="media-body me-2 text-light align-items-center d-none d-sm-block">
                    <span className="mb-0 font-small fw-bold">{name}</span>
                  </div>
                  {!currentUser.photoURL ? (
                    <div
                      className="bg-senary text-nonary rounded-circle fw-bolder"
                      style={{
                        height: "30px",
                        width: "30px",
                        lineHeight: "30px",
                        textAlign: "center",
                      }}
                    >
                      {name.substring(0, 2)}
                    </div>
                  ) : (
                    <Image
                      src={currentUser.photoURL}
                      className="rounded-circle"
                      style={{ height: "30px", width: "30px" }}
                    />
                  )}
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item
                  className="fw-bold px-3"
                  as={Link}
                  to="/settings"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" /> My
                  Profile
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold px-3" onClick={logout}>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-danger me-2"
                  />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
export default UserNavbar;
