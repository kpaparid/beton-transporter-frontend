import {
  faEnvelope,
  faPhone,
  faPlus,
  faUnlockAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "@themesberg/react-bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BgImage from "../../assets/img/illustrations/signin.svg";
import { useServices } from "../myComponents/util/services";
import { gridTableSlice } from "../reducers/redux";
import { useLoadData } from "../../api/apiMappers";

const useSettings = () => {
  const { actions, selectors } = gridTableSlice;
  const stateAPIStatus = useLoadData("settings", actions);
  const [availableValues, setAvailableValues] = useState();
  const selectSettings = useCallback(
    (state) => selectors.metaSelector.selectById(state, "settings") || [],
    [selectors.metaSelector]
  );
  const settings = useSelector(selectSettings);
  useEffect(() => {
    if (stateAPIStatus === "success") {
      setAvailableValues(settings);
    }
  }, [stateAPIStatus]);
  return availableValues;
};

export const AddUser = () => {
  const availableValues = useSettings();

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const { registerUsers } = useServices();
  async function onSubmit({ roles, ...rest }) {
    // try {
    setError("");
    setLoading(true);
    registerUsers({ ...rest, roles: roles.split(", ") || [] })
      .then((data) => {
        console.log("Successfully updated user", data);
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      });
    // navigate("/");

    setLoading(false);
  }
  useEffect(() => {
    register("email", { required: true });
    register("name", { required: true });
    register("password", { required: true });
    register("phoneNumber", { required: false });
    register("roles", { required: true });
    setValue("password", "marmi1993");
  }, []);

  return (
    <main className="w-100">
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            {/* {availableValues?.driver && (
              <Col
                xs={2}
                className="d-flex flex-wrap align-items-center justify-content-center bg-senary p-2"
                style={{ height: "500px", overflow: "auto" }}
              >
                {availableValues?.driver.map((d) => (
                  <Button
                    key={d}
                    className="w-100 rounded-0"
                    onClick={() => {
                      setValue("name", d);
                      setValue("email", d.replaceAll(" ", ".") + "@bt.de");
                      setValue("roles", "ROLE_USER, ROLE_DRIVER");
                      onSubmit(getValues());
                    }}
                  >
                    {d}
                  </Button>
                ))}
              </Col>
            )} */}
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Create an account</h3>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group id="name" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Name"
                        value={watch("name") || ""}
                        onChange={(e) => setValue("name", e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Password"
                        value={watch("password") || ""}
                        onChange={(e) => setValue("password", e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        ref={emailRef}
                        autoFocus
                        required
                        type="email"
                        placeholder="example@company.com"
                        value={watch("email") || ""}
                        onChange={(e) => setValue("email", e.target.value)}
                      />
                      <Button
                        className="generate"
                        disabled={!watch("name")}
                        onClick={() =>
                          setValue(
                            "email",
                            watch("name").replaceAll(" ", ".") + "@bt.de"
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="phone" className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faPhone} />
                      </InputGroup.Text>
                      <Form.Control
                        value={watch("phone") || ""}
                        type="text"
                        placeholder="Phone Number"
                        onChange={(e) => setValue("phone", e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="roles" className="mb-4">
                    <Form.Label>Roles</Form.Label>
                    <div className="d-flex flex-nowrap w-100 justify-content-between text-center">
                      <Button
                        className="col-3 p-1"
                        variant={
                          watch("roles")?.includes("ROLE_ADMIN")
                            ? "senary"
                            : "primary"
                        }
                        onClick={() =>
                          setValue(
                            "roles",
                            (watch("roles") ? watch("roles") + ", " : "") +
                              "ROLE_ADMIN"
                          )
                        }
                      >
                        Admin
                      </Button>
                      <Button
                        className="col-3 p-1"
                        variant={
                          watch("roles")?.includes("ROLE_USER")
                            ? "senary"
                            : "primary"
                        }
                        onClick={() =>
                          setValue(
                            "roles",
                            (watch("roles") ? watch("roles") + ", " : "") +
                              "ROLE_USER"
                          )
                        }
                      >
                        User
                      </Button>
                      <Button
                        className="col-3 p-1"
                        variant={
                          watch("roles")?.includes("ROLE_DRIVER")
                            ? "senary"
                            : "primary"
                        }
                        onClick={() =>
                          setValue(
                            "roles",
                            (watch("roles") ? watch("roles") + ", " : "") +
                              "ROLE_DRIVER"
                          )
                        }
                      >
                        Driver
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    disabled={loading}
                    variant="primary"
                    type="submit"
                    className="w-100"
                  >
                    Register User
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
export default AddUser;
