import { Button, Modal } from "@themesberg/react-bootstrap";
import isEqual from "lodash.isequal";
import { memo, useCallback, useEffect, useState } from "react";

const CustomModal = memo(
  ({
    footer = true,
    defaultValue = "00:00",
    value: initialValue = defaultValue,
    buttonText,
    buttonVariant = "primary",
    closeVariant = "secondary",
    saveVariant = "primary",
    buttonClassName = "",
    modalClassName = "",
    modalContentClassName = "",
    onChange,
    variant = "light",
    onClose,
    footerVariant = variant,
    show: controlledShow,
    toggle,
    controlled = false,
    renderInput = ({ toggle }) => (
      <Button
        variant={buttonVariant}
        onClick={toggle}
        className={"custom-modal-btn " + buttonClassName}
      >
        {buttonText}
      </Button>
    ),
    children,
  }) => {
    const [backupShow, setBackupShow] = useState(false);
    const show = controlled ? controlledShow : backupShow;
    const setShow = controlled ? toggle : setBackupShow;

    const [value, setValue] = useState(initialValue);

    const handleClose = useCallback(() => {
      const oldClassName = document.getElementById("body").className;
      document.getElementById("body").className = oldClassName.replace(
        "custom-modal-open",
        ""
      );
      setShow(false);
      setValue(initialValue);
    }, [initialValue, setShow]);
    const handleShow = () => {
      const oldClassName = document.getElementById("body").className;
      document.getElementById(
        "body"
      ).className = `${oldClassName} custom-modal-open`;
      setShow(true);
    };

    const handleSave = useCallback(() => {
      onChange(value);
      handleClose();
    }, [value, handleClose, onChange]);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      return () => {
        const oldClassName = document
          .getElementById("body")
          .className.replace("custom-modal-open", "");
        document.getElementById("body").className = oldClassName;
      };
    }, []);
    return (
      <>
        {renderInput({ toggle: handleShow })}
        <Modal
          show={show}
          onHide={handleClose}
          onExit={handleClose}
          centered
          fullscreen
          className={modalClassName + " custom-modal"}
          contentClassName={
            "custom-modal-content  shadow-none bg-transparent " +
            modalContentClassName
          }
          scrollable
        >
          <Modal.Body
            id="modal-container"
            className="d-flex"
            onClick={(e) => {
              e.currentTarget.id === "modal-container" && setShow(false);
            }}
          >
            <div
              className="m-auto modal-body-container "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {children}
              {footer && (
                <Modal.Footer className={`border-senary ${footerVariant}`}>
                  <div className="w-100 btn-group-wrapper d-flex justify-content-around">
                    <Button
                      variant={closeVariant}
                      className="col-5 border-0"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={saveVariant}
                      className="col-5 fw-bolder  border-0"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </div>
                </Modal.Footer>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  },
  isEqual
);
export default CustomModal;
