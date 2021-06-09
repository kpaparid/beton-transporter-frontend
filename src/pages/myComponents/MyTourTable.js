import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, ProgressBar, Pagination, Form } from '@themesberg/react-bootstrap';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from "../reducers/redux";
// import { loadTransactionsData } from "../pages/reducers/loadTransactionsData";
import { TableRow, TablerowContents, HeaderRow } from './MyTableRow';
import { loadToursData } from "../reducers/loadToursData";
import { useShownTourTable, useCheckedAll, useChecked, useShownLabels, useAllLabels, useGetVisibleLabels } from "./MyConsts"


export const TourTable = () => {
    
  const dispatch = useDispatch();
    const stateAPIStatus = useLoadToursData();    
    const shownTourTable = useShownTourTable()
    const totalTours = shownTourTable.length;
    const checkedAll = useCheckedAll()
    const editMode = useSelector(state => state.tourTable.editMode)
    const shownLabels = useShownLabels()
    const checked = useChecked()
    const visibleLabels = useGetVisibleLabels()
    console.log(visibleLabels)
  
    function useLoadToursData() {
      const [stateAPIStatus, setAPIStatus] = useState('idle');
      const dispatch = useDispatch();
  
      useEffect(() => {
        setAPIStatus('loading');
        loadToursData()
          .then((data) => {
            dispatch({
              type: ACTIONS.LOAD_TOUR_TABLE,
              payload: {
                table: data.table,
                labels: data.labels,
              },
            });
            setAPIStatus('success');
          })
          .catch((error) => {
            setAPIStatus('error');
          });
      }, [dispatch]);
  
      return stateAPIStatus;
    }
  
    function handleAllClick() {
      dispatch({
        type: ACTIONS.TOGGLE_CHECK_ALL,
      });
    }
    function handleCheckboxClick(id) {
      dispatch({
        type: ACTIONS.CHECK_ONE,
        payload: {
          id: id
        }
      });
    }
    
    
    return (
      <Card border="light">
        <Card.Body className="px-1">
          <Table responsive className="align-items-center table-flush align-items-center">
            <thead className="thead-light">
              <HeaderRow
                 headers={visibleLabels.map(l => l.text)}
                 checked={checkedAll}
                 handleAllClick={handleAllClick}
                 checkbox
                />
            </thead>
            <tbody>
              {shownTourTable.map((t, index) =>
                <TableRow key={`transaction-${t.id}`}
                  row={t}
                  index={index}
                  checked={checked[t.id]}
                  handleCheckboxClick={handleCheckboxClick}
                  checkedColumns={visibleLabels}
                  editMode={editMode}
                  checkbox
                />)}
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
              Showing <b>{totalTours}</b> out of <b>25</b> entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
    );
  };
  