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
import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@themesberg/react-bootstrap";
import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../reducers/redux";
import AddRowModal from "./AddRowModal";
import { BreakBtn, DownloadBtn, EditBtn, MyBtn, SaveBtn } from "./MyButtons";
import { Filter } from "./Table/TableLabel";

const TableButtons = forwardRef(
  (
    {
      selectSelectedRowsExist,
      selectChangesExist,
      selectEditMode,
      onAdd,
      onDelete,
      onDownload,
      onClose,
      onSave,
      onToggleEdit,
      forceClose,
      modalProps,
      filterProps,
      download,
      remove,
    },
    ref
  ) => {
    const editMode = useSelector(selectEditMode);
    const selectedRowsExist = useSelector(selectSelectedRowsExist);
    const changesExist = useSelector(selectChangesExist);
    // const modalLabels = useSelector(labelsSelector);
    const [showModalDefault, setShowModalDefault] = useState(false);
    const handleAddRow = () => setShowModalDefault(true);
    const handleCloseAddRow = () => setShowModalDefault(false);
    const clearChanges = useCallback(() => {
      onClose();
    }, [onClose]);
    const handleEditEnable = useCallback(() => {
      onToggleEdit();
    }, [onToggleEdit]);
    const handleEditDisable = useCallback(() => {
      ref.current = true;
      console.log("handleEditDisable", ref.current);
      onToggleEdit();
      clearChanges();
    }, [onToggleEdit, clearChanges]);
    const handleSave = useCallback(() => {
      ref.current = true;
      console.log("handleSave", ref.current);
      onSave();
    }, [onSave]);
    const handleDownload = useCallback(() => {
      onDownload();
    }, [onDownload]);
    const handleDelete = useCallback(() => {
      onDelete();
    }, [onDelete]);

    useEffect(() => {
      if (editMode && !selectedRowsExist) {
        ref.current = true;
        console.log("handleEditDisable", ref.current);
        onToggleEdit();
        // clearChanges();
      }
    }, [selectedRowsExist, editMode]);
    return (
      <div className="d-flex flex-nowrap button-group">
        {/* <ButtonGroup
         className="btn-toolbar flex-wrap justify-content-end"
         variant="danger"
       > */}

        {filterProps && <Filter {...filterProps}></Filter>}
        {(selectedRowsExist || (editMode && !selectedRowsExist)) && (
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
        {/* <AddRowModal
          labels={modalLabels}
          title={titleModal}
          onClose={handleCloseAddRow}
          show={showModalDefault}
        /> */}

        {download && (
          <MyBtn
            disabled={editMode}
            onClick={handleDownload}
            value={<FontAwesomeIcon icon={faDownload} />}
          />
        )}
        {editMode && (
          <MyBtn
            disabled={!changesExist}
            onClick={handleSave}
            value={<FontAwesomeIcon icon={faSave} />}
          />
        )}
        {modalProps && (
          <MyBtn
            value={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleAddRow}
          ></MyBtn>
        )}

        {editMode && (
          <MyBtn
            variant="danger"
            onClick={handleEditDisable}
            value={<FontAwesomeIcon icon={faWindowClose} />}
          />
        )}
        {/* </ButtonGroup> */}
      </div>
    );
  }
);

export default TableButtons;
