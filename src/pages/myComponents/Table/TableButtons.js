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
        onChangeMode();
      }
    }, [selectedRowsExist, editMode, onChangeMode]);
    return (
      <div className="d-flex flex-nowrap button-group">
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

        {download && (
          <MyBtn
            disabled={editMode}
            onClick={handleDownload}
            value={<FontAwesomeIcon icon={faDownload} />}
          />
        )}
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
        {/* </ButtonGroup> */}
      </div>
    );
  }
);

export default TableButtons;
