import {
  faEdit,
  faPlus,
  faSave,
  faTrash,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Spinner } from "@themesberg/react-bootstrap";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Filter } from "./TableHeader";

const TableButtons = memo(
  ({
    selectSelectedRowsExist,
    selectChangesExist,
    selectMode,
    onAdd,
    onDelete,
    onDownload,
    onClose,
    onSave,
    onChangeMode,
    forceClose,
    modalProps,
    filterProps,
    download,
    remove,
    edit,
    add,
    filter,
  }) => {
    const mode = useSelector(selectMode);
    const editMode = mode === "edit";
    const addMode = mode === "addRow";
    const selectedRowsExist = useSelector(selectSelectedRowsExist);
    const changesExist = useSelector(selectChangesExist);
    // const modalLabels = useSelector(labelsSelector);
    const [loading, setLoading] = useState(false);
    const clearChanges = useCallback(() => {
      onClose();
    }, [onClose]);

    const handleAddRow = useCallback(() => {
      onChangeMode("addRow");
    }, [onChangeMode]);
    const handleEditEnable = useCallback(() => {
      clearChanges();
      onChangeMode("edit");
    }, [onChangeMode, clearChanges]);
    const handleClose = useCallback(() => {
      onChangeMode("idle");
      clearChanges();
    }, [onChangeMode, clearChanges]);
    const handleSave = useCallback(() => {
      setLoading(true);
      onSave()
        .then((r) => {
          toast.success("Saved!");
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          toast.error("Error!");
        });
    }, [onSave]);
    const handleDownload = useCallback(() => {
      onDownload();
    }, [onDownload]);
    const handleDelete = useCallback(() => {
      onDelete();
    }, [onDelete]);

    useEffect(() => {
      if (editMode && !selectedRowsExist) {
        onChangeMode();
      }
    }, [selectedRowsExist, editMode, onChangeMode]);
    return (
      <div className="d-flex flex-wrap button-group justify-content-end">
        {filter && <Filter {...filterProps}></Filter>}
        {edit && (selectedRowsExist || (editMode && !selectedRowsExist)) && (
          <MyBtn
            disabled={editMode}
            onClick={handleEditEnable}
            value={<FontAwesomeIcon icon={faEdit} />}
          />
        )}
        {remove && (selectedRowsExist || (editMode && !selectedRowsExist)) && (
          <MyBtn
            disabled={editMode}
            onClick={handleDelete}
            value={<FontAwesomeIcon icon={faTrash} />}
          ></MyBtn>
        )}

        {/* {download && (
          <MyBtn
            disabled={editMode}
            onClick={handleDownload}
            value={<FontAwesomeIcon icon={faDownload} />}
          />
        )} */}
        {(edit || add) && (editMode || addMode) && (
          <MyBtn
            disabled={!changesExist}
            onClick={handleSave}
            value={<FontAwesomeIcon icon={faSave} />}
          />
        )}
        {add && (
          <MyBtn
            disabled={addMode}
            onClick={handleAddRow}
            value={<FontAwesomeIcon icon={faPlus} />}
          />
        )}

        {(edit || add) && (editMode || addMode) && (
          <MyBtn
            variant="danger"
            onClick={handleClose}
            value={<FontAwesomeIcon icon={faWindowClose} />}
          />
        )}
        <Modal
          show={loading}
          // onHide={handleClose}
          centered
          contentClassName="bg-transparent shadow-none"
          // backdrop="static"
          keyboard={false}
        >
          <div className=" d-flex justify-content-center">
            <Spinner animation="border" variant="nonary" />
          </div>
        </Modal>
      </div>
    );
  }
);
const MyBtn = (props) => {
  const {
    onClick = "",
    value = "",
    size = "",
    variant = "primary",
    disabled,
    type,
  } = props;
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      size={size}
      disabled={disabled}
    >
      {value}
    </Button>
  );
};

export default TableButtons;
