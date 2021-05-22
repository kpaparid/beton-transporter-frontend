import React from "react";
import { Nav, Card, Button, Table, Pagination } from '@themesberg/react-bootstrap';
import { workHours } from "../../data/tables";
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup, Dropdown } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropdownFilter } from "../myComponents/Filter";



export const MonthlyWorkHours = (props) => {
    const totalWorkHours = workHours.length;
    const { workerName, workerID, month } = props;

    const TableRow = (props) => {
        const { workerName, date, day, start, end, pause, duration } = props;
        return (
            <tr className="text-center">
                <td>
                    <span className="fw-bolder">
                        {workerName}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {date}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {day}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {start}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {end}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {pause}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {duration}
                    </span>
                </td>
            </tr>
        );
    };

    return (
        <div className="table-wrapper table-responsive shadow-sm flex-fill ">
            <Card border="light" className="table-wrapper table-responsive shadow-sm flex-fill">
                <div className="d-flex justify-content-between flex-wrap align-items-center m-4">
                    <div className="d-flex align-items-center mt-2" >
                        <Dropdown as={ButtonGroup} className="mb-2 me-2 " >
                            <Dropdown.Toggle split variant="tertiary">
                                Filter<FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-menu-xs" style={{ display: "inline-table", animation: "disable" }} >
                                <DropdownFilter></DropdownFilter>
                            </Dropdown.Menu>
                        </Dropdown>
                        <h5 className="m-0 py-0 px-2">Arbeitszeiten März 2021</h5>
                    </div>
                    <div className="btn-toolbar mt-2 flex-wrap justify-content-end">
                        <Button variant="outline-info" size="sm">Edit</Button>
                        <Button variant="outline-info" size="sm">Speichern</Button>
                        <Button variant="outline-info" size="sm">Abbruch</Button>
                        <Button variant="outline-info" size="sm">Download</Button>
                    </div>
                </div>
                <Card.Body>
                    <Table hover className="user-table align-items-center">
                        <thead className="thead-light">
                            <tr className="text-center">
                                <th className="border-bottom">Mitarbeiter</th>
                                <th className="border-bottom">Datum</th>
                                <th className="border-bottom">Wochentag</th>
                                <th className="border-bottom">Beginn</th>
                                <th className="border-bottom">Ende</th>
                                <th className="border-bottom">Pause</th>
                                <th className="border-bottom">dauer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workHours.map(t => <TableRow key={`monthlyWorkHours-${t.id}`} {...t} />)}
                        </tbody>
                    </Table>
                    <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
                        <Nav>
                            <Pagination className="mb-2 mb-lg-0">
                                <Pagination.Prev>
                                    Previous
                </Pagination.Prev>
                                <Pagination.Item active>1</Pagination.Item>
                                <Pagination.Item>2</Pagination.Item>
                                <Pagination.Item>3</Pagination.Item>
                                <Pagination.Item>4</Pagination.Item>
                                <Pagination.Item>5</Pagination.Item>
                                <Pagination.Next>
                                    Next
                </Pagination.Next>
                            </Pagination>
                        </Nav>
                        <small className="fw-bold">
                            Showing <b>{totalWorkHours}</b> out of <b>25</b> entries
            </small>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </div>
    );
};

export const Mycard = (props) => {
    const { className, title, headers, table='', footer='', options=''} = props;

    const TableRow = (props) => {
        const table = props.table;
        return (
            <tr className="text-center align-middle">
                {Object.keys(table).filter(key => key !== 'id').map(key =>

                    <td key={`${title}-${key}`}><span className="fw-normal text-wrap">
                        {table[key]}
                    </span>
                    </td>)}
            </tr>
        );
    };
    const FooterRow = (props) => {
        const { table } = props;
        
        if(footer !== ''){
            return (
                <tr className="text-center thead-light">
                    
                    {table.map(t =>

                        <th className="thead-light py-1 " scope="row" key={`${title}-${t}`}>
                            <span className="fw-bolder "style={{fontSize:"13px"}}>{t}</span>
                        </th>)}
                </tr>
            );
        }
        return ``;
        
    };

    return (
        <div className="flex-fill table-wrapper table-responsive">
            <Card border="light" className={`shadow-sm flex-fill ${className}`}>
                <div className="d-flex justify-content-between flex-wrap align-items-center m-4 py-2">
                    <h5 className="m-0 py-0 px-2 mt-2">{title}</h5>
                    <div className="btn-toolbar mt-2 flex-wrap justify-content-end">
                        <Button variant="outline-info" size="sm">Edit</Button>
                        <Button variant="outline-info" size="sm">Speichern</Button>
                    </div>
                </div>
                <Card.Body className="p-0 p-sm-1 table-responsive-sm table-condensed">
                    <Table hover className="table table-sm">
                        <thead className="thead-light">
                            <tr className="text-center">
                                {headers.map((h, id) => <th key={`header-${title}-${id}`} className="border-bottom"><span className="fw-bolder f-lg" >{h}</span></th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {table.map(t => <TableRow key={`tr-${title}-${t.id}`} table={t} />)}
                            <FooterRow table={footer}></FooterRow>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};