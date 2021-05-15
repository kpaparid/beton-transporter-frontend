import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb } from '@themesberg/react-bootstrap';



import { MonthlyWorkHours, Mycard } from './myComponents/MyTables';
import { absentTable, vacationsClaim, vacationsOverview, workHoursKonto } from "../data/tables";


export default () => {
    const month = 3;
    const workerName = "Maik Litt"
    const workerID = 1;
    return (


        <>
            <div className="d-block pt-4 mb-4 mb-md-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item>Volt</Breadcrumb.Item>
                    <Breadcrumb.Item active>Nachrichten</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="col-12 d-flex flex-wrap">
                    <div className="col-12 col-xxl-8"><MonthlyWorkHours workerID={workerID} month={month} /></div>
                    <div className="col-12 col-xxl-4">
                        <div className="col-12 "><Mycard className="ms-xxl-2 mt-xxl-0 mt-3" footer={["GESAMT","","10"]} headers={["MITARBEITER", "Monat", "Stunden"]} title={"Arbeitszeitkonto"} table={workHoursKonto} /></div>
                        <div className="col-12 "><Mycard className="ms-xxl-2 mt-xxl-0 mt-3" headers={["MITARBEITER", "Bereits Genommen", "Rest"]} title={"Urlaubsanspruch"} table={vacationsClaim} /></div>
                        <div className="col-12 "><Mycard className="ms-xxl-2 mt-xxl-0 mt-3" footer={["GESAMT","","","50"]} headers={["MITARBEITER", "VON", "BIS", "TAGE"]} title={"Urlaubsübersicht"} table={vacationsOverview} /></div>
                        <div className="col-12 "><Mycard className="ms-xxl-2 mt-xxl-0 mt-3" headers={["MITARBEITER", "VON", "BIS", "TAGE", ""]} title={"Fehlzeiten"} table={absentTable} /></div>
                        </div>
            </div>
        </>
    );
};