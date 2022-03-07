import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Col,
  Form,
  Nav,
  Row,
  Tab,
} from "@themesberg/react-bootstrap";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ButtonGroup, Dropdown, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { CustomDropdown } from "../../components/Filters/CustomDropdown";
import { TimePickerModal } from "../../components/TimePicker";
import { useAuth } from "../../contexts/AuthContext";
import { MyRoutes } from "../../routes";
import {
  getGridLabelDefaultValue,
  getGridLabelIsNotRequired,
  getGridLabels,
  getGridLabelUserType,
  getGridPrimaryLabels,
} from "../myComponents/util/labels";
import { useGeoAddresses, useServices } from "../myComponents/util/services";

const AddTours = () => {
  const location = useLocation();
  const hasPreviousState = location.key !== "default";
  const state = location.state;
  const [availableValues, setAvailableValues] = useState();
  const [tabs, setTabs] = useState();

  const { currentUser, claims } = useAuth();
  const { postTour, fetchSettings } = useServices();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [activeKey, setActiveKey] = useState("tab1");
  const tabNumber = activeKey.match(/\d+/g)[0];
  const onSubmit = useCallback(
    (data) => {
      postTour([{ ...data, driver: currentUser.uid }])
        .then(() =>
          hasPreviousState
            ? navigate(-1, { replace: true })
            : navigate(MyRoutes.UserTours.path, { replace: true })
        )
        .catch((er) => {
          console.log(er);
        });
    },
    [postTour]
  );
  const notRequired = (label) => getGridLabelIsNotRequired("tours", label);
  const isFilled = (tab) =>
    tabs &&
    tabs[tab].labels.reduce((a, b) => a && (notRequired(b) || watch(b)), true);
  const tab1Filled = isFilled("tab1");
  const tab2Filled = isFilled("tab2");
  const tab3Filled = isFilled("tab3");
  const nextEnabled =
    (tabNumber === "1" && tab1Filled) ||
    (tabNumber === "2" && tab2Filled) ||
    (tab1Filled && tab2Filled && tab3Filled);

  useEffect(() => {
    fetchSettings(["dischargeType", "vehicle", "workPlant", "add-tours"]).then(
      ({ data }) => {
        const content = data.reduce(
          (a, b) => ({
            ...a,
            [b.id]: ["dischargeType", "vehicle", "workPlant"].includes(b.id)
              ? JSON.parse(b.values)
              : b.values,
          }),
          {}
        );
        setAvailableValues(content);
        setTabs(JSON.parse(content["add-tours"]));
      }
    );
    register("waitTime", { required: false });
    register("dischargeBegin", { required: false });
    register("dischargeType", { required: false });
    register("dischargeEnd", { required: false });
    register("other", { required: false });

    if (state?.tour) {
      setValue("id", state.tour.id);
      setValue("driver", state.tour.driver);
      setValue("date", state.tour.date);
      setValue("vehicle", state.tour.vehicle + "");
      setValue("workPlant", state.tour.workPlant);
      setValue("deliveryNr", state.tour.deliveryNr + "");
      setValue("buildingSite", state.tour.buildingSite);
      setValue("cbm", state.tour.cbm + "");
      setValue("arrival", state.tour.arrival);
      setValue("kmArrival", state.tour.kmArrival + "");
      setValue("dischargeBegin", state.tour.dischargeBegin);

      setValue("dischargeType", state.tour.dischargeType);
      setValue("dischargeEnd", state.tour.dischargeEnd);
      setValue("waitTime", state.tour.waitTime);
      setValue("departure", state.tour.departure);
      setValue("kmDeparture", state.tour.kmDeparture + "");
      setValue("other", state.tour.other);
    } else {
      // getUpdatedUser();
      currentUser.reload();
      claims().then(({ claims: { workPlant, vehicle } }) => {
        workPlant && setValue("workPlant", workPlant);
        vehicle && setValue("vehicle", vehicle);
      });
      setValue("date", moment().format("YYYY.MM.DD"));
      setValue("driver", currentUser.displayName || currentUser.email);
    }
  }, [currentUser, claims, state, fetchSettings, register, setValue]);

  return (
    <>
      <div
        className={` w-100 h-100 align-items-center justify-content-center d-flex flex-column bg-darker-nonary`}
      >
        <form>
          <div className="p-3 w-100" style={{ maxWidth: "400px" }}>
            <Tab.Container activeKey={activeKey}>
              <Row>
                <Col lg={12} className="">
                  <Nav className="nav-tabs d-flex flex-nowrap justify-content-around w-100 border-0">
                    {tabs &&
                      Object.keys(tabs).map((t) => (
                        <Nav.Item className="col-4">
                          <Nav.Link
                            onClick={() => setActiveKey(t)}
                            eventKey={t}
                            className={
                              "border-bottom  border-senary mb-sm-3 mb-md-0 text-center fw-bolder px-1 " +
                              (activeKey === t
                                ? "text-nonary bg-senary"
                                : "text-senary bg-darker-nonary")
                            }
                          >
                            {tabs[t].title}
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                  </Nav>
                </Col>
                <Col lg={12}>
                  <Tab.Content>
                    {tabs &&
                      Object.keys(tabs).map((t) => (
                        <Tab.Pane eventKey={t} className="py-4">
                          {tabs[t].labels.map((l) => (
                            <InputComponent
                              type={getGridLabelUserType("tours", l)}
                              title={getGridLabels("tours")[l]?.text}
                              value={watch(l)}
                              availableValues={availableValues[l]}
                              onChange={(e) => setValue(l, e)}
                              contentWidth={"100px"}
                              defaultValue={getGridLabelDefaultValue(
                                "tours",
                                l
                              )}
                            />
                          ))}
                        </Tab.Pane>
                      ))}

                    <Tab.Pane eventKey="tab4" className="py-4">
                      {tab1Filled && tab2Filled && tab3Filled && (
                        <SubmitList
                          values={{
                            ...getValues(),
                            cbm: parseFloat(getValues().cbm),
                            kmDeparture: parseInt(getValues().kmDeparture),
                            kmArrival: parseInt(getValues().kmArrival),
                            deliveryNr: parseInt(getValues().deliveryNr),
                            waitTime: parseInt(getValues().waitTime || 0),
                          }}
                        ></SubmitList>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            <div className="d-flex flex-nowrap w-100 justify-content-center bottom-0">
              <div className="px-2">
                <Button
                  className="fw-bolder"
                  variant="nonary"
                  style={{
                    width: "80px",
                    fontWeight: "800",
                  }}
                  onClick={() =>
                    hasPreviousState
                      ? navigate(-1, { replace: true })
                      : navigate(MyRoutes.UserTours.path, { replace: true })
                  }
                >
                  Cancel
                </Button>
              </div>
              <div className="px-2">
                {activeKey === "tab4" ? (
                  <Button
                    className="fw-bolder"
                    variant={nextEnabled ? "senary" : "nonary"}
                    disabled={!nextEnabled}
                    style={{
                      width: "80px",
                      fontWeight: "800",
                    }}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    className="fw-bolder"
                    variant={"senary"}
                    disabled={!nextEnabled}
                    style={{
                      width: "80px",
                      fontWeight: "800",
                    }}
                    onClick={() =>
                      setActiveKey("tab" + (parseInt(tabNumber) + 1))
                    }
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

const InputComponent = ({
  type,
  title,
  value,
  onChange,
  availableValues,
  contentWidth,
  defaultValue,
}) => {
  switch (type) {
    case "time":
      return <TimePicker title={title} value={value} onChange={onChange} />;
    case "modal":
      return (
        <NormaModal
          availableValues={availableValues}
          title={title}
          value={value}
          onClick={onChange}
        />
      );
    case "input-number":
      return (
        <InputCard
          contentWidth={contentWidth}
          title={title}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          type="number"
          min={0}
        />
      );
    case "textarea":
      return (
        <InputCard
          contentWidth={contentWidth}
          textarea={true}
          title={title}
          value={value}
          onChange={onChange}
        />
      );
    case "disabled":
      return <Disabled value={value} title={title} />;
    case "navi":
      return <Navi value={value} onChange={onChange} title={title} />;
    default:
      break;
  }
};

const NormaModal = ({ value, availableValues, onClick, title }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClick = (value) => {
    onClick(value);
    handleClose();
  };

  return (
    <>
      <div className="p-1 w-100">
        <Button
          variant={value ? "senary" : "nonary"}
          onClick={handleShow}
          className={"w-100 p-0"}
        >
          <BCard title={title}>
            {value || (
              <div className="pe-2">
                <FontAwesomeIcon icon={faPlus} size="xs" />
              </div>
            )}
          </BCard>
        </Button>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={"dark-modal px-3 d-flex justify-content-center"}
        contentWidth={{ width: "fit-content" }}
        scrollable
      >
        <Modal.Header className="p-0 d-flex justify-content-end">
          <div className="pt-2 pe-2">
            <Button
              variant="transparent"
              className="p-0 text-senary d-flex justify-content-center align-items-center"
              style={{ height: "30px", width: "30px" }}
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-1">
          {availableValues?.map((v) => (
            <div
              onClick={() => handleClick(v)}
              key={v}
              style={{ minWidth: "150px" }}
              className={
                "py-2 d-flex flex-wrap justify-content-between border-bottom border-senary text-senary fw-bolder"
              }
            >
              <div className="text-start text-break text-wrap ps-2 pe-2">
                {v}
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="py-1"></Modal.Footer>
      </Modal>
    </>
  );
};
const Navi = ({ title, value, onChange }) => {
  const { places, onChange: handlePlaceChange } = useGeoAddresses();
  const handlePlaceInputChange = useCallback(
    (e) => {
      handlePlaceChange(e.target.value);
      // setValue("buildingSite", e.target.value);
      onChange(e.target.value);
    },
    [onChange, handlePlaceChange]
  );
  return (
    <DropdownCard
      title={title}
      className="custom-selector-dropdown w-100"
      titleWidth="75px"
      input={(props) => (
        <>
          <div style={{ maxWidth: "160px" }}>
            <TextareaAutosize
              value={value || ""}
              minRows={1}
              autoFocus
              className="form-control p-0 border-0 text-center text-nonary text-break text-wrap user-card-input w-100 fw-bolder"
              onChange={handlePlaceInputChange}
              {...props}
            />
          </div>
        </>
      )}
      value={value}
    >
      <div className="">
        {places?.map((p) => (
          <Dropdown.Item
            className={
              "text-break text-wrap w-100 dropdown-item" +
              (p === value ? " active" : " non-active")
            }
            key={p}
            onClick={(e) => {
              handlePlaceChange(p);
              onChange(p);
              e.target.blur();
            }}
          >
            {p}
          </Dropdown.Item>
        ))}
      </div>
    </DropdownCard>
  );
};
const Disabled = ({ title, value }) => {
  return (
    <div className="p-1">
      <Button variant={value ? "senary" : "nonary"} className={"w-100 p-0"}>
        <BCard title={title}>
          {value || (
            <div className="pe-2">
              <FontAwesomeIcon icon={faPlus} size="xs" />
            </div>
          )}
        </BCard>
      </Button>
    </div>
  );
};
const TimePicker = ({ title, value, onChange }) => {
  return (
    <div className="p-1">
      <TimePickerModal
        buttonVariant={value ? "senary" : "nonary"}
        timeVariant="nonary"
        timeActiveVariant="senary"
        buttonClassName="w-100 p-0"
        variant="dark"
        buttonText={
          <BCard title={title}>
            {value || (
              <div className="pe-2">
                <FontAwesomeIcon icon={faPlus} size="xs" />
              </div>
            )}
          </BCard>
        }
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
const DropdownCard = ({
  title,
  value,
  availableValues = [],
  onChange,
  children,
  className,
  titleWidth,
  contentWidth,
  input,
}) => {
  const ref = useRef();
  const variant = value ? "senary" : "nonary";
  const [enabled, setEnabled] = useState(false);
  const handleToggle = (show) => {
    setEnabled(show);
    if (!show) {
      console.log("toggle", show);
    }
  };
  return (
    <div className="p-1 h-100 w-100 user-card">
      {children ? (
        <CustomDropdown
          as={ButtonGroup}
          className={`w-100 ${className}`}
          toggleAs="custom"
          toggleClassName="p-0"
          variant={variant}
          portal={false}
          align="end"
          drop="down"
          onToggle={handleToggle}
          value={
            <BCard
              title={title}
              titleWidth={titleWidth}
              contentWidth={contentWidth}
            >
              {(enabled && (input ? input({ ref }) : value)) || value || (
                <div className="pe-2">
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </div>
              )}
            </BCard>
          }
          ref={ref}
        >
          {children}
        </CustomDropdown>
      ) : (
        <Dropdown as={ButtonGroup} className={`w-100 ${className}`}>
          <Dropdown.Toggle
            variant={variant}
            className="shadow-none p-0 text-break text-wrap"
          >
            <BCard
              title={title}
              titleWidth={titleWidth}
              contentWidth={contentWidth}
            >
              {(enabled && (input ? input({ ref }) : value)) || value || (
                <div className="pe-2">
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </div>
              )}
            </BCard>
          </Dropdown.Toggle>

          {availableValues.length !== 0 && (
            <Dropdown.Menu style={{ width: "fit-content" }}>
              {availableValues.map((v) => (
                <Dropdown.Item
                  className={
                    "text-break text-wrap" + (value === v ? " active" : "")
                  }
                  key={v}
                  onClick={() => {
                    onChange && onChange(v);
                  }}
                >
                  {v}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </Dropdown>
      )}
    </div>
  );
};
const InputCard = ({
  title,
  value,
  textarea = false,
  onChange,
  defaultValue = "",
  type,
  titleWidth,
  contentWidth,
}) => {
  const ref = useRef();
  const variant = value ? "senary" : "nonary";
  const [enabled, setEnabled] = useState(false);
  const handleChange = (e) => onChange(e.target.value);
  useEffect(() => {
    enabled && ref.current.focus();
  }, [enabled, ref]);

  return (
    <div className="p-1 h-100 w-100 user-card">
      <Button
        className="w-100 p-0"
        variant={variant}
        onClick={() => {
          ref.current?.focus();
          setEnabled(true);
        }}
      >
        <BCard
          title={title}
          titleWidth={titleWidth}
          contentWidth={contentWidth}
        >
          {!enabled ? (
            value ? (
              <div className="text-center text-break text-wrap">{value}</div>
            ) : (
              <div className="pe-2">
                <FontAwesomeIcon icon={faPlus} size="xs" />
              </div>
            )
          ) : textarea ? (
            <div>
              <TextareaAutosize
                minRows={1}
                ref={ref}
                className="form-control p-0 text-center text-nonary text-break text-wrap user-card-input w-100 fw-bolder"
                value={value || defaultValue}
                onChange={handleChange}
                onBlur={() => setEnabled(false)}
              />
            </div>
          ) : (
            <Form.Control
              type={type}
              ref={ref}
              className="p-0 px-1 text-center text-nonary user-card-input fw-bolder text-truncate"
              value={value || defaultValue}
              onChange={handleChange}
              onBlur={() => setEnabled(false)}
            />
          )}
        </BCard>
      </Button>
    </div>
  );
};
const SubmitList = ({ values }) => {
  return (
    <>
      <Card bg="nonary">
        <Card.Body>
          {getGridPrimaryLabels("tours").map((key) => (
            <div
              key={key}
              className="d-flex flex-wrap justify-content-between border-bottom border-senary text-senary fw-bolder"
            >
              <div
                className="text-start text-wrap pe-2"
                style={{ minWidth: "70px" }}
              >
                {getGridLabels("tours")[key]?.text}
              </div>
              <div className="flex-fill text-end text-break text-wrap ps-2 fw-bold">
                {values[key] &&
                  values[key] +
                    ((getGridLabels("tours")[key]?.measurement &&
                      " " + getGridLabels("tours")[key].measurement) ||
                      "")}
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    </>
  );
};
const BCard = ({ title, children, titleWidth = "50px", contentWidth }) => {
  return (
    <Card bg="transparent border-0">
      <Card.Body className="d-flex flex-nowrap justify-content-between align-items-center p-3 border-0 fw-bolder">
        <div
          className={"text-start text-break text-wrap"}
          style={{ fontWeight: "800", minWidth: titleWidth }}
        >
          {title}
        </div>
        <div
          className="d-flex justify-content-end"
          style={{ width: contentWidth }}
        >
          <div className={"text-end text-break text-wrap "}>{children}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AddTours;
