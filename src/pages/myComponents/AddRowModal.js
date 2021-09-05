import React, { memo, useEffect, useState } from "react";
import { Form, Modal } from "@themesberg/react-bootstrap";
import { TextInput } from "./TextArea/MyNewInput";
import { isEqual } from "lodash";
import "./MyForm.css";
import { MyBtn } from "./MyButtons";
export const MyModal = (props) => {
  const {
    Header = () => <></>,
    Body = () => <></>,
    Footer = () => <></>,
    show,
    onClose,
    title,
  } = props;

  return (
    <>
      <Modal
        as={Modal.Body}
        fullscreen={false}
        show={show}
        onHide={onClose}
        size="xl"
      >
        <div className="px-0">
          <Modal.Header className="justify-content-center my-secondary-bg">
            {Header}
          </Modal.Header>
          <Modal.Body>{Body}</Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Footer></Footer>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
const ModalRow = memo(({ onChange, text, grid, measurement, id, ...rest }) => {
  // console.log(grid);
  const [value, setValue] = useState("");
  function handleChange(newValue) {
    if (newValue !== value) {
      setValue(newValue);
      onChange && onChange(id, newValue);
      // console.log("mR handlechange", { id, newValue });
    }
  }
  const [selectedDate, handleDateChange] = useState("2018-01-01T00:00:00.000Z");
  const measured = measurement ? "measured" : "";
  return (
    <div className="col-5 p-2">
      <Form.Label className="mb-1">{text}</Form.Label>
      <div className="d-flex flex-nowrap">
        <div className={"text-input-group " + measured}>
          {/* <Input editable value={value} onChange={handleChange} {...rest} /> */}
          <div className="wrapper wrapper-editable w-100 p-0">
            <div className="text-container">
              <TextInput
                className="w-100"
                inputClassName="w-100"
                value={value}
                onChange={handleChange}
                {...rest}
              ></TextInput>
            </div>
          </div>

          {measurement && (
            <div
              className="px-2 measurement d-flex justify-content-center"
              style={{ width: "50px" }}
            >
              {measurement}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, isEqual);
const AddRowModal = memo(({ labels, title, show, onClose }) => {
  const [row, setRow] = useState({});
  useEffect(() => {
    // console.log("effect", row);
  }, [row]);
  function handleChange(id, value) {
    setRow((old) => ({ ...old, [id]: value }));
  }
  return (
    <>
      <MyModal
        Header={Header({ title })}
        Body={Body({ labels, onChange: handleChange })}
        Footer={Footer}
        title={title}
        show={show}
        onClose={onClose}
      />
    </>
  );
}, isEqual);

export const AddRow = (props) => {
  return <></>;
};
const Body = (props) => {
  const { labels, onChange } = props;
  return (
    <>
      <Form>
        <Form.Group
          className="d-flex flex-wrap justify-content-around"
          controlId="formBasicEmail"
        >
          {labels.map((label, index) => {
            return <ModalRow key={index} {...label} onChange={onChange} />;
          })}
        </Form.Group>
      </Form>
    </>
  );
};
const Header = ({ title = "Add Row" }) => {
  return (
    <>
      <Modal.Title className="h4">{title}</Modal.Title>
    </>
  );
};
const Footer = (onSubmit) => {
  return (
    <>
      <MyBtn onSubmit={onSubmit} value="Submit" className="primary-btn"></MyBtn>
    </>
  );
};
export default AddRowModal;
