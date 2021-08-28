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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@themesberg/react-bootstrap";
import { forwardRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../reducers/redux";
import { BreakBtn, DownloadBtn, EditBtn, MyBtn, SaveBtn } from "./MyButtons";

const TableButtons = forwardRef((_, ref) => {
  const dispatch = useDispatch();

  // const tourTable = useTourTable();
  //   const tourDate = useTourDate();
  // const checkedExists = useCheckedExists();
  // const allLabels = useAllLabels();

  const [showModalDefault, setShowModalDefault] = useState(false);
  const handleAddRow = () => setShowModalDefault(true);
  // const handleClose = () => setShowModalDefault(false);
  const toggleEditMode = () => {
    dispatch({
      type: ACTIONS.EDIT_TOGGLE,
    });
  };
  const handleEditEnable = () => {
    // if (checkedExists) {
    toggleEditMode();
    // }
  };
  const handleEditDisable = () => {
    ref.current = true;
    console.log("handleEditDisable", ref.current);
    toggleEditMode();
    closeAllCheckBoxes();
    clearChanges();
  };
  const handleSave = () => {
    ref.current = true;
    console.log("handleSave", ref.current);
    dispatch({
      type: ACTIONS.SAVE_CHANGES,
    });
    closeAllCheckBoxes();
    toggleEditMode();
  };
  const handleDownload = () => {
    console.log("DOWNLOAD");
  };
  function closeAllCheckBoxes() {
    dispatch({
      type: ACTIONS.CLOSE_CHECK_ALL,
    });
  }
  function clearChanges() {
    dispatch({
      type: ACTIONS.RESET_CHANGES,
    });
  }
  return (
    <ButtonGroup
      className="btn-toolbar flex-wrap justify-content-end"
      variant="danger"
    >
      <EditBtn
        onClick={handleEditEnable}
        value={<FontAwesomeIcon icon={faEdit} />}
      />
      <BreakBtn
        onClick={handleEditDisable}
        value={<FontAwesomeIcon icon={faWindowClose} />}
      />
      <MyBtn
        value={<FontAwesomeIcon icon={faPlus} />}
        onClick={handleAddRow}
      ></MyBtn>
      <SaveBtn onClick={handleSave} value={<FontAwesomeIcon icon={faSave} />} />

      <MyBtn value={<FontAwesomeIcon icon={faTrash} />}></MyBtn>
      <DownloadBtn
        onClick={handleDownload}
        value={<FontAwesomeIcon icon={faDownload} />}
      />
    </ButtonGroup>
  );
});

export default TableButtons;
