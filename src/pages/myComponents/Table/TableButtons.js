import {
  faDownload,
  faEdit,
  faPlus,
  faSave,
  faTrash,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import React, { memo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MyBtn } from "./MyButtons";
import { Filter } from "./TableHeader";
import AddRowModal from "./AddRowModal";

const TableButtons = memo(
  ({
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
  }) => {
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
      onToggleEdit();
      clearChanges();
    }, [onToggleEdit, clearChanges]);
    const handleSave = useCallback(() => {
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
        onToggleEdit();
        // clearChanges();
      }
    }, [selectedRowsExist, editMode, onToggleEdit]);
    return (
      <div className="d-flex flex-nowrap button-group">
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
        {modalProps && <AddRowModal {...modalProps} />}

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
