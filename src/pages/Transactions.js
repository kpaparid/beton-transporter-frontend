import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonGroup, Breadcrumb, Dropdown } from '@themesberg/react-bootstrap';

import { TransactionsTable } from "../components/Tables";
import { DropdownFilter } from "./myComponents/Filter";
import { BreakBtn, EditBtn, MyBtn, SaveBtn, DownloadBtn } from "./myComponents/MyButtons";

export default () => {

  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = () => {
    editMode? setEditMode(false) : setEditMode(true)
  }
  const handleDownload = () => {
    console.log("DOWNLOAD")
  }

  return (

    <>
  
        <div className="d-block pt-4 mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Volt</Breadcrumb.Item>
            <Breadcrumb.Item active>Transactions</Breadcrumb.Item>
          </Breadcrumb>
        </div>   

      
        <div className="d-flex justify-content-between flex-wrap align-items-center py-4">
          
          <div className="d-flex align-items-center mt-2" >
            <Dropdown as={ButtonGroup} className="mb-2 me-2 " >
              <Dropdown.Toggle split variant="tertiary">
                Filter<FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-xs" style={{display:"inline-table", animation: "disable"}} >
                <DropdownFilter></DropdownFilter>
              </Dropdown.Menu>
            </Dropdown>
            <h5 className="m-0 py-0 px-2">Touren Alle Werke Marz 2021s</h5>
          </div>
          <div className="flex-wrap d-flex">
          <ButtonGroup className="btn-toolbar mt-2 flex-wrap justify-content-end" variant="danger">
              <EditBtn editMode={editMode} onClick={toggleEditMode}/>
              <SaveBtn editMode={editMode} onClick={toggleEditMode}/>
              <BreakBtn editMode={editMode} onClick={toggleEditMode}/>
              <DownloadBtn onClick={handleDownload}/>
          </ButtonGroup>
        </div>
        </div>
      <TransactionsTable />
      
           
      
      

    </>
  );
};
