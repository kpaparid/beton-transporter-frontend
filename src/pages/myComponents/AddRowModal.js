import React from "react";
import { Button, Container, Modal } from "@themesberg/react-bootstrap";
import MyTextArea from "./TextArea/MyTextArea";
import MyFormSelect from "./MyFormSelect";
import MyInput from "./MyInput";
export const MyModal = (props) => {
  const {
    Header = () => <></>,
    Body = () => <></>,
    Footer = () => <></>,
  } = props;
  const { show, onClose, title } = props;
  // console.log(!isNaN("1a"));

  return (
    <>
      <Modal as={Modal.Body} fullscreen={false} show={show} onHide={onClose}>
        <Modal.Header className="justify-content-center">
          <Modal.Title className="h6">{title}</Modal.Title>
          <Header></Header>
        </Modal.Header>
        <Modal.Body>
          <Body></Body>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Footer></Footer>
        </Modal.Footer>
      </Modal>

      {/* <Modal
                as={Modal.Dialog} centered show={show} onHide={onClose}>
                <Modal.Header className="justify-content-center">
                    <Modal.Title className="h6">{title}</Modal.Title>
                    <Header></Header>
                </Modal.Header>
                <Modal.Body>
                    <Body></Body>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Footer></Footer>
                </Modal.Footer>
            </Modal> */}
    </>
  );
};
export default (props) => {
  const { labels, title } = props;
  const { show, onClose } = props;

  const Body = () => {
    return (
      <>
        <Container className="">
          {Object.keys(labels).map((l, index) => {
            const label = labels[l];
            return <MyInput label={label} />;
          })}
        </Container>
      </>
    );
  };
  const Header = () => {
    return (
      <>
        <h5>Add Row</h5>
      </>
    );
  };
  const Footer = () => {
    return (
      <>
        <Button variant="tertiary">Submit</Button>
      </>
    );
  };

  return (
    <>
      <MyModal
        Header={Header}
        Body={Body}
        Footer={Footer}
        title={title}
        show={show}
        onClose={onClose}
      />
    </>
  );
};

export const AddRow = (props) => {
  return <></>;
};
