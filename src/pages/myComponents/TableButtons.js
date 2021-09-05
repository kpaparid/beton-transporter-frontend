import {
  faDownload,
  faEdit,
  faEraser,
  faPlus,
  faRecycle,
  faSave,
  faTrash,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@themesberg/react-bootstrap";
import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../reducers/redux";
import AddRowModal from "./AddRowModal";
import { BreakBtn, DownloadBtn, EditBtn, MyBtn, SaveBtn } from "./MyButtons";

const TableButtons = forwardRef(
  (
    {
      onToggleEdit,
      onAdd,
      onSave,
      onDownload,
      onClose,
      onDelete,
      forceClose,
      editMode = false,
      checkedRowsExist = "hi",
      changesExist = false,
      labelsSelector,
      titleModal = "Add Row",
    },
    ref
  ) => {
    const modalLabels = useSelector(labelsSelector);
    const [showModalDefault, setShowModalDefault] = useState(false);
    const handleAddRow = () => setShowModalDefault(true);
    const handleCloseAddRow = () => setShowModalDefault(false);

    const handleEditEnable = () => {
      onToggleEdit();
    };
    const handleEditDisable = () => {
      ref.current = true;
      console.log("handleEditDisable", ref.current);
      onToggleEdit();
      clearChanges();
    };
    const handleSave = () => {
      ref.current = true;
      console.log("handleSave", ref.current);
      onSave();
      onToggleEdit();
    };
    const handleDownload = () => {
      onDownload();
    };
    const handleDelete = () => {
      onDelete();
    };
    function clearChanges() {
      onClose();
    }
    useEffect(() => {
      if (editMode && !checkedRowsExist) {
        ref.current = true;
        console.log("handleEditDisable", ref.current);
        onToggleEdit();
        clearChanges();
      }
    }, [checkedRowsExist]);
    return (
      <ButtonGroup
        className="btn-toolbar flex-wrap justify-content-end"
        variant="danger"
      >
        {(checkedRowsExist || (editMode && !checkedRowsExist)) && (
          <MyBtn
            disabled={editMode}
            onClick={handleEditEnable}
            value={<FontAwesomeIcon icon={faEdit} />}
          />
        )}
        {checkedRowsExist && (
          <MyBtn
            disabled={editMode}
            onClick={handleDelete}
            value={<FontAwesomeIcon icon={faTrash} />}
          ></MyBtn>
        )}
        <AddRowModal
          labels={modalLabels}
          title={titleModal}
          onClose={handleCloseAddRow}
          show={showModalDefault}
        />

        <MyBtn
          disabled={editMode}
          onClick={handleDownload}
          value={<FontAwesomeIcon icon={faDownload} />}
        />
        {editMode && (
          <MyBtn
            disabled={!changesExist}
            onClick={handleSave}
            value={<FontAwesomeIcon icon={faSave} />}
          />
        )}
        <MyBtn
          value={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleAddRow}
        ></MyBtn>
        {editMode && (
          <MyBtn
            className="danger-btn"
            onClick={handleEditDisable}
            value={<FontAwesomeIcon icon={faWindowClose} />}
          />
        )}
      </ButtonGroup>
    );
  }
);

export default TableButtons;
