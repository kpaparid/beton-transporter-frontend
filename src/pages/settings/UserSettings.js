import {
  faAt,
  faCamera,
  faLocationArrow,
  faPen,
  faTruck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Image,
  Modal,
  Spinner,
} from "@themesberg/react-bootstrap";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const UserSettings = () => {
  const { currentUser, updateUser, updatePhone, claims } = useAuth();
  const [customClaims, setCustomClaims] = useState();
  useEffect(() => claims().then((r) => setCustomClaims(r)), [claims]);

  const hiddenFileInput = useRef();
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleNameChange = (value) =>
    updateUser({ displayName: value }).then(() => setShow(false));
  const handlePhoneChange = (value) =>
    updatePhone(value).then(() => setShow(false));
  const handleClick = useCallback(() => hiddenFileInput.current.click(), []);
  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file.type === "image/jpeg" || file.type === "image/png") {
      setShow(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "aewhjhan");
      formData.append(
        "public_id",
        "bt/users/" + currentUser.uid + "/" + moment().toISOString()
      );
      const options = { method: "POST", body: formData };
      fetch("https://api.cloudinary.com/v1_1/duvwxquad/upload", options).then(
        (res) =>
          res.json().then(({ secure_url, ...rest }) => {
            const newUrl = secure_url.replace(
              "/upload/",
              "/upload/w_300,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/"
            );
            updateUser({ photoURL: newUrl }).then((rk) => {
              setShow(false);
            });
          })
      );
    }
  };
  return (
    <div
      className={` w-100 h-100 align-items-start justify-content-start d-flex flex-column bg-darker-nonary`}
    >
      <div className="w-100 h-100 d-flex flex-column pt-3  user-settings">
        <Card className="text-center p-0 mb-4 border-0 text-senary">
          <Card.Header className="pb-1 bg-darker-nonary d-flex justify-content-center flex-column border-0">
            <div className="d-flex justify-content-center">
              <div>
                {currentUser.photoURL ? (
                  <Image
                    src={currentUser.photoURL}
                    className="user-avatar large-avatar rounded-circle border-0"
                    resize="contain"
                  />
                ) : (
                  <div
                    className="bg-nonary text-senary rounded-circle fw-bolder user-avatar large-avatar rounded-circle border-0"
                    style={{
                      height: "30px",
                      width: "30px",
                      lineHeight: "30px",
                      textAlign: "center",
                      fontSize: "40px",
                    }}
                  >
                    {(currentUser.displayName || currentUser.email).substring(
                      0,
                      2
                    )}
                  </div>
                )}

                <div
                  style={{
                    position: "relative",
                    height: "40px",
                    width: "40px",
                    bottom: "40px",
                    right: "-100px",
                  }}
                >
                  <Button
                    className="w-100 h-100 rounded-circle p-0 d-flex justify-content-center align-items-center"
                    variant="senary"
                    onClick={handleClick}
                  >
                    <FontAwesomeIcon size="lg" icon={faCamera} />
                  </Button>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={uploadPhoto}
              style={{ display: "none" }}
            />
          </Card.Header>
          <Card.Body className="bg-darker-nonary px-2 py-0">
            <div className="d-flex flex-column justify-content-center">
              <EditableField
                value={currentUser.displayName}
                title="Name"
                icon={faUser}
                editable
                onChange={handleNameChange}
              />
              <EditableField
                icon={faAt}
                value={currentUser.email}
                title="E-mail"
              />
              {customClaims?.vehicle && (
                <EditableField
                  icon={faTruck}
                  title="Vehicle"
                  value={customClaims.vehicle}
                />
              )}
              {customClaims?.workPlant && (
                <EditableField
                  icon={faLocationArrow}
                  title="Work Plant"
                  value={customClaims.workPlant}
                />
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="bg-transparent text-center"
      >
        <Modal.Body>
          <Spinner animation="border" className="text-white" />
        </Modal.Body>
      </Modal>
    </div>
  );
};
const EditableField = ({
  editable,
  onChange,
  value,
  placeholder,
  title,
  icon,
}) => {
  const [editMode, setEditMode] = useState(false);
  const handleClick = () => setEditMode((old) => !old);
  const handleClose = () => setEditMode(false);
  const handleSave = (v) => onChange(v).then(() => setEditMode(false));
  const handleCancel = () => {
    setEditMode(false);
  };
  return (
    <>
      <div
        className={`d-flex ps-1 pe-4 py-2 w-100 flex-nowrap justify-content-around align-items-center `}
        style={{
          paddingBottom: editMode && "1px",
        }}
      >
        <div className="text-darker-senary pb-2" style={{ width: "30px" }}>
          <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        </div>
        <div
          className="flex-fill ms-3 d-flex pb-2"
          style={{
            borderBottom: "0.0625rem solid rgb(252 111 91 / 48%)",
          }}
        >
          <div className="pe-3 flex-fill flex-column fw-bold w-100 d-flex justify-content-start align-items-start">
            <span className="text-darker-senary">{title}</span>
            <span>{value}</span>
          </div>
          {editable && (
            <>
              <div
                className="text-darker-senary d-flex justify-content-center align-items-center"
                style={{ width: "30px" }}
              >
                <Button
                  variant="transparent"
                  className="text-darker-senary p-0 border-0 shadow-none "
                  size="sm"
                  onClick={handleClick}
                >
                  <FontAwesomeIcon icon={faPen} />
                </Button>
              </div>
              <EditModal
                show={editMode}
                onClose={handleClose}
                onSave={handleSave}
                onCancel={handleCancel}
                title={title}
                value={value}
                placeholder={placeholder}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
const EditModal = ({
  show,
  onClose,
  title,
  value: initialValue,
  placeholder,
  onSave,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const handleInputChange = (e) => setValue(e.target.value);
  const handleCancel = () => {
    setValue(initialValue);
    onCancel();
  };
  const handleSave = () => {
    onSave(value);
  };
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      fullscreen
      contentClassName="bg-transparent text-center"
      dialogClassName="dark-modal"
    >
      <Modal.Body className="d-flex align-items-end w-100">
        <>
          <Card className="bg-darker-nonary w-100">
            <Card.Header className="pb-1">
              <div className="d-flex fw-bolder text-senary">Insert {title}</div>
            </Card.Header>
            <Card.Body className="py-1 d-flex justify-content-start flex-column text-senary">
              <input
                value={value}
                spellCheck={false}
                placeholder={placeholder}
                className="w-100 col-10 border-0 shadow-none fw-bold p-0 border-bottom border-senary text-senary"
                style={{ backgroundColor: "transparent", outline: "none" }}
                autoFocus
                onChange={handleInputChange}
              />
            </Card.Body>
            <Card.Footer>
              <div className="w-100 d-flex justify-content-end">
                <Button
                  variant="nonary"
                  className="me-2"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="senary"
                  className="fw-bold"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </>
      </Modal.Body>
    </Modal>
  );
};
export default UserSettings;
