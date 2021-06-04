import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonGroup, Breadcrumb, Dropdown } from '@themesberg/react-bootstrap';

import { TransactionsTable } from "../components/Tables";
import { DropdownFilter } from "./myComponents/Filter";
import { BreakBtn, EditBtn, MyBtn, SaveBtn, DownloadBtn } from "./myComponents/MyButtons";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from "../pages/reducers/redux";
import { TourTable } from "./myComponents/MyTourTable";
import moment from "moment";
import MyOwnCalendar from "./myComponents/MyOwnCalendar";


export default () => {

  const dispatch = useDispatch();
  const tourTable = useSelector(state => state.tourTable)
  const tourDate = moment(useSelector(state => state.tourTable.tourDate), "MM-YYYY").format("MMMM YYYY")
  useEffect(() => {
    console.log('rerender')
    console.log(tourTable)
  }, [tourTable]);


  const checkedExists = useSelector(selectorCheckedExists)

  function selectorCheckedExists(state) {
    const { tourTable } = state;
    
    return tourTable.checkedId.length !== 0 ? true : false

  }
  const toggleEditMode = () => {
    dispatch({
      type: ACTIONS.EDIT_TOGGLE,
    });
  }
  const handleEditEnable = () => {
    if (checkedExists) {
      toggleEditMode()
    }

  }
  const handleEditDisable = () => {
    toggleEditMode()
    closeAllCheckBoxes()
    clearChanges()

  }
  const handleSave = () => {
    dispatch({
      type: ACTIONS.SAVE_CHANGES,
    });
    closeAllCheckBoxes()
    clearChanges()
    toggleEditMode()
    console.log(tourTable)
  }
  const handleDownload = () => {

    console.log("DOWNLOAD")
  }
  function closeAllCheckBoxes() {
    dispatch({
      type: ACTIONS.CLOSE_CHECK_ALL,
    });
  }
  function clearChanges() {
    dispatch({
      type: ACTIONS.DELETE_CHANGES,
    });
  }
  return (
    <>
      <div className="d-block pt-4 mb-4 mb-md-0">
        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
          <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
          <Breadcrumb.Item>faHome</Breadcrumb.Item>
          <Breadcrumb.Item active>Touren</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="d-flex justify-content-between flex-wrap align-items-center py-4">
        <div className="d-flex align-items-center mt-2" >
          <Dropdown as={ButtonGroup} className="mb-2 me-2 " >
            <Dropdown.Toggle split variant="tertiary">
              Filter<FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-xs" style={{ display: "inline-table", animation: "disable" }} >
              <DropdownFilter></DropdownFilter>
            </Dropdown.Menu>
          </Dropdown>
          <h5 className="m-0 py-0 px-2">Touren Alle Werke</h5>
          <MyOwnCalendar value={tourDate}></MyOwnCalendar>

        </div>
        <div className="flex-wrap d-flex">
          <ButtonGroup className="btn-toolbar mt-2 flex-wrap justify-content-end" variant="danger">
            <EditBtn onClick={handleEditEnable} text="Edit" />
            <SaveBtn onClick={handleSave} text="Speichern" />
            <BreakBtn onClick={handleEditDisable} text="Abbruch" />
            <DownloadBtn onClick={handleDownload} />
          </ButtonGroup>
        </div>
        <TourTable></TourTable>
      </div>
    </>
  );
};
