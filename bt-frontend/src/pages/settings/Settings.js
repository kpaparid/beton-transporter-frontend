import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Nav, Row, Tab } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import { useLoadData } from "../../api/apiMappers";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";
import { GridTableComponent } from "../../components/Table/GridComponent";
import {
  getGridLabels,
  getGridPrimaryLabels,
} from "../myComponents/util/labels";
import { useServices } from "../myComponents/util/services";
import { gridTableSlice } from "../reducers/redux";

const useLoader = (stateAPIStatus) => {
  const navigate = useNavigate();
  if (stateAPIStatus === "success") {
    return <SettingsComponent />;
  } else if (stateAPIStatus === "error") {
    return navigate("/500");
  } else {
    return (
      <div className="d-flex h-100 align-items-center">
        <ComponentPreLoader show={true} />
      </div>
    );
  }
};
export const Settings = () => {
  const { actions } = gridTableSlice;
  const stateAPIStatus = useLoadData("settingsTable", actions);
  return useLoader(stateAPIStatus);
};

const SettingsComponent = memo(() => {
  const { actions, selectors } = gridTableSlice;
  const { fetchAddToursSettings, postSettings } = useServices();
  const [addToursSettings, setAddToursSettings] = useState();
  useEffect(() => {
    fetchAddToursSettings().then((res) =>
      setAddToursSettings(JSON.parse(res.data[0].values[0]))
    );
  }, [fetchAddToursSettings]);

  const renderComponent = useCallback(
    (entityId) => (
      <GridTableComponent
        {...{
          stateAPIStatus: "success",
          actions,
          selectors,
          entityId,
        }}
      />
    ),
    [selectors, actions]
  );

  return (
    <div className="d-flex flex-wrap w-100 align-items-start">
      <div className="d-flex flex-wrap col-12 col-xxl-6 order-2 order-xxl-1">
        <div className="col-lg-6 order-1 col-12 p-2">
          {renderComponent("settingsWorkPlant")}
        </div>
        <div className="col-lg-6 order-2 col-12">
          <div className="col-lg-12 col-12 p-2">
            {renderComponent("settingsDischargeType")}
          </div>
          <div className="col-lg-12 col-12 p-2">
            {renderComponent("settingsVehicle")}
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap order-1 order-xxl-2 col-12 col-xxl-6">
        <div className="col-12 p-2">
          <Card>
            <Card.Header className="p-1 border-0">
              <Button variant="transparent">
                <h5 className="m-0 p-3">User Add Tours Layout</h5>
              </Button>
            </Card.Header>
            <Card.Body className="pt-0">
              {addToursSettings && (
                <SettingsCard
                  settings={addToursSettings}
                  entityId={"tours"}
                  postSettings={postSettings}
                ></SettingsCard>
              )}
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 p-2 order-1 order-xxl-1">
          {renderComponent("publicHolidays")}
        </div>
      </div>
    </div>
  );
}, isEqual);

const SettingsCard = ({ settings, entityId, postSettings }) => {
  const labels = getGridLabels(entityId);
  const [activeKey, setActiveKey] = useState("tab1");
  const primarylabels = getGridPrimaryLabels(entityId);
  const tabs = Object.keys(settings);
  const [newTabLabels, setNewTabLabels] = useState(
    tabs.reduce((a, b) => ({ ...a, [b]: settings[b].labels }), {})
  );
  const [newTabTitle, setTabTitle] = useState(
    tabs.reduce((a, b) => ({ ...a, [b]: settings[b].title }), {})
  );
  const handleResetClick = useCallback(() => {
    setNewTabLabels(
      tabs.reduce((a, b) => ({ ...a, [b]: settings[b].labels }), {})
    );
    setTabTitle(tabs.reduce((a, b) => ({ ...a, [b]: settings[b].title }), {}));
  }, [settings, tabs]);
  const handleSave = useCallback(() => {
    // postSettings(newTabLabels);
    const b = tabs.reduce(
      (a, b) => ({
        ...a,
        [b]: { labels: newTabLabels[b], title: newTabTitle[b] },
      }),
      {}
    );
    const body = { id: "add-tours", value: JSON.stringify(b) };
    const body2 = {
      id: "work-plant",
      value: JSON.stringify([
        "Dortmund Holcim",
        "Ludenscheid Holcim",
        "Balve Holcim",
        "Plettenberg Holcim",
        "Unna Holcim",
        "Luenen Holcim",
        "Radevormwald Holcim",
        "Wuppertal Holcim",
        "Herne Holcim",
        "Sonstige Holcim",
        "Iserlohn Elskes",
        "Witten Elskes",
        "Dortmund Elskes",
        "Kamen Elskes",
        "Werl Elskes",
        "Sonstige Elskes",
        "Soest Hellwegbeton",
        "Sonstige Hellwegbeton",
        "Sundern TB Westenfeld",
        "Neheim TB Westenfeld",
        "Sprockhoevel TER",
        "Menden Herbrueger",
        "Meschede TB Meschede",
        "Sonstige",
      ]),
    };
    // postSettings(body);
    postSettings(body2);
  }, [postSettings, newTabLabels, newTabTitle, tabs]);

  return (
    <div className="d-flex flex-wrap w-100 justify-content-center">
      <UserField
        className="col-xxl-12 col-xl-6 col-12"
        tabs={tabs}
        newTabTitle={newTabTitle}
        setTabTitle={setTabTitle}
        primarylabels={primarylabels}
        newTabLabels={newTabLabels}
        activeKey={activeKey}
        setNewTabLabels={setNewTabLabels}
        labels={labels}
      />
      <UserDisplay
        className="col-xxl-12 col-xl-6 col-12"
        activeKey={activeKey}
        settings={settings}
        newTabLabels={newTabLabels}
        newTabTitle={newTabTitle}
        labels={labels}
        setActiveKey={setActiveKey}
        tabs={tabs}
        onReset={handleResetClick}
        onSave={handleSave}
      />
    </div>
  );
};
const UserField = ({
  tabs,
  newTabTitle,
  setTabTitle,
  primarylabels,
  newTabLabels,
  activeKey,
  setNewTabLabels,
  labels,
  className = "",
}) => {
  return (
    <div
      className={`d-flex flex-column col-6 justify-content-center ${className}`}
      // style={{ maxWidth: "520px" }}
    >
      <div className="d-flex w-100 flex-wrap justify-content-center align-content-center pb-2 border-bottom">
        {tabs.map((t) => (
          <TitleButton
            key={t}
            value={newTabTitle[t]}
            onChange={(v) => setTabTitle((old) => ({ ...old, [t]: v }))}
          />
        ))}
      </div>

      <div className="w-100 pt-2 d-flex flex-wrap justify-content-center align-content-center">
        {primarylabels.map((p) => (
          <div className="p-2" style={{ height: "50px" }} key={p}>
            <Button
              className="w-100 h-100 p-0 px-3"
              variant={
                newTabLabels[activeKey].includes(p)
                  ? "light-tertiary"
                  : tabs
                      .filter((t) => t !== activeKey)
                      .reduce((a, b) => [...a, ...newTabLabels[b]], [])
                      .includes(p)
                  ? "very-light-blue"
                  : "light"
              }
              onClick={() => {
                setNewTabLabels((old) => {
                  const alreadyExists = old[activeKey].includes(p);
                  return {
                    ...old,
                    [activeKey]: alreadyExists
                      ? old[activeKey].filter((l) => l !== p)
                      : [...old[activeKey], p],
                  };
                });
              }}
            >
              {labels[p].text}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
const UserDisplay = ({
  activeKey,
  setActiveKey,
  settings,
  labels,
  tabs,
  newTabLabels,
  onReset,
  onSave,
  newTabTitle,
  className = "",
}) => {
  return (
    <div className={`p-2 ${className}`}>
      <div
        className={`bg-darker-nonary p-5 rounded `}
        style={{
          // minWidth: "600px",
          // transform: "scale(0.8)",
          height: "fit-content",
        }}
      >
        <Tab.Container activeKey={activeKey}>
          <Row>
            <Col lg={12} className="">
              <Nav className="nav-tabs d-flex flex-nowrap justify-content-around w-100 border-0">
                {tabs.map((t) => (
                  <Nav.Item className="col-4" key={t}>
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
                      {newTabTitle[t]}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col lg={12}>
              <Tab.Content>
                {tabs.map((t) => (
                  <Tab.Pane eventKey={t} className="py-4" key={t}>
                    <Scrollbars
                      // autoHide={false}
                      autoHeight
                      autoHeightMax={300}
                    >
                      {newTabLabels[t].map((l) => (
                        <BCard title={labels[l].text} key={l} />
                      ))}
                    </Scrollbars>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        <div className="d-flex flex-nowrap w-100 justify-content-center bottom-0">
          <div className="px-2">
            <Button
              onClick={onReset}
              className="fw-bolder"
              variant="nonary"
              style={{
                width: "80px",
                fontWeight: "800",
              }}
            >
              Reset
            </Button>
          </div>
          <div className="px-2">
            <Button
              className="fw-bolder"
              variant={"senary"}
              style={{
                width: "80px",
                fontWeight: "800",
              }}
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
const TitleButton = ({ value: initialValue, onChange }) => {
  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState(initialValue);
  const ref = useRef();

  const handleInputChange = useCallback((e) => setValue(e.target.value), []);
  const handleBlur = useCallback(
    (e) => {
      setEditable(false);
      onChange(value);
    },
    [onChange, value]
  );

  useEffect(() => {
    ref.current.focus();
  }, [editable]);

  return (
    <div className="p-2" style={{ height: "50px" }}>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setEditable(true);
        }}
        className="w-100 h-100 p-0 px-3"
        variant="senary"
      >
        <input
          ref={ref}
          disabled={!editable}
          autoFocus
          className={`border-0 ${
            editable ? "bg-white" : "bg-transparent"
          } text-center text-dark  opacity-100 fw-bold`}
          value={value}
          style={{ maxWidth: "100px", outline: "0" }}
          onBlur={handleBlur}
          onChange={handleInputChange}
        ></input>
      </Button>
    </div>
  );
};
const BCard = ({ title, titleWidth = "50px", contentWidth }) => {
  return (
    <div className="p-1">
      <Button variant="nonary" className={"w-100 p-0"}>
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
              <div className={"text-end text-break text-wrap "}>
                <div className="pe-2">
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Button>
    </div>
  );
};

export default Settings;
