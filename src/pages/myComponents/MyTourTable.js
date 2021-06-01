import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, ProgressBar, Pagination, Form } from '@themesberg/react-bootstrap';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from "../reducers/redux";
// import { loadTransactionsData } from "../pages/reducers/loadTransactionsData";
import { TableRow, TablerowContents, HeaderRow } from './MyTableRow';
import { MyTextArea } from './MyTextArea';
import { loadToursData } from "../reducers/loadToursData";


export const TourTable = (props) => {
    
  const dispatch = useDispatch();
    const stateAPIStatus = useLoadToursData();    
    const shownTourTable = useSelector(shownToursSelector, shallowEqual)
    const totalTours = shownTourTable.length;
  
    function shownToursSelector(state){
      const shownId = state.tourTable.shownId
      const table = []
      
      shownId.forEach(item => {
        var flag = true;
        flag && state.tourTable.allLabelsId.forEach(label => {
          if (state.tourTable.filteredOutValues[label] &&
            state.tourTable.filteredOutValues[label].findIndex(f => f === state.tourTable.byId[item][label]) !== -1) {
              flag = false;
          }
        })
        flag && table.push({ id: item, value: state.tourTable.byId[item] })
      })

      return [...table]
    }
  
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
    const checkedAll = useSelector((state) => {
      const checkedIdLength = state.tourTable.checkedId.length
      const allIdLength = state.tourTable.allId.length
      return checkedIdLength === allIdLength
    });
    
  
    function handleCheckboxClick(id, event) {
      dispatch({
        type: ACTIONS.CHECK_ONE,
        payload: {
          id: id
        }
      });
    }
    const checked = useSelector(selectorMenu)
    function selectorMenu(state) {
      const { tourTable } = state;      
      if(tourTable.shownId.length > 0 && tourTable.checkedId.length > 0) {
        const unchecked = tourTable.shownId.map(tour => ({[tour] : ''})).reduce((prev, curr) => ({...prev, ...curr}))
        const checked = tourTable.checkedId.map(tour => ({[tour] : 'checked'})).reduce((prev, curr) => ({...prev, ...curr}))
        return {...unchecked, ...checked};
      }
      if(tourTable.shownId.length > 0) {
        const unchecked = tourTable.shownId.map(tour => ({[tour] : ''})).reduce((prev, curr) => ({...prev, ...curr}))
        return unchecked;
      }
      }
    
    const editMode = useSelector(state => state.tourTable.editMode)

    const shownLabels = useSelector(sortedLabelsSelector)
    function sortedLabelsSelector(state) {
      const c = state.tourTable.checkedLabelsId
      const shownLabels = [...c].sort((a, b) => state.tourTable.labelsById[a].priority - state.tourTable.labelsById[b].priority)
      return shownLabels
    }
    
    return (
      <Card border="light" className="table-wrapper table-responsive shadow table">
        <Card.Body className="px-1">
          <Table className="user-table align-items-center">
            <thead className="thead-light">
              <HeaderRow
                 headers={shownLabels}
                 checked={checkedAll}
                 handleAllClick={handleAllClick}
                />
            </thead>
            <tbody>
              {shownTourTable.map((t, index) =>
                <TableRow key={`transaction-${t.id}`}
                  row={t}
                  index={index}
                  checked={checked[t.id]}
                  handleCheckboxClick={handleCheckboxClick}
                  checkedColumns={shownLabels}
                  editMode={editMode}
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
  