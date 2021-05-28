import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@themesberg/react-bootstrap';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';


export default (props) => {
    const { text = "", rows = 1, minRows = 1, maxRows = 10, className = "" } = props
    const { myKey, myIndex,  myId} = props

    const checked = useSelector(selectorMenu, shallowEqual)
    function selectorMenu(state) {
      const { tourTable } = state;
      const checked = tourTable.checkedId.findIndex(item => item === myId) === -1 ? false : true 
      return checked;
    }
    
    const editMode = useSelector(selectorMenu, shallowEqual)
    function selectorMenu(state) {
        const { editMode } = state;
        // console.log(myChecked)
        // console.log(state.tourTable.byId)
        return editMode;
      }

      const editValue = useSelector(selectorMenu2, shallowEqual)
      function selectorMenu2(state) {
        const { tourTable } = state;
        var row = tourTable.byId[myId][myKey]
        if(tourTable.changesById[myId] && tourTable.changesById[myId][myKey]){
            row = tourTable.changesById[myId][myKey]
        }
        return row;
        }


    const dispatch = useDispatch();

    const handleChange = (event) => {
        console.log('render')
        dispatch({
            type: ACTIONS.ADD_CHANGE,
            payload: {
              id: myId,
              key: myKey,
              change: event.target.value,
            }
          });
    };

    // if (editMode && checked) {
        if (true) {
        return (
            <> 
            <Form
            key={`f${myId}_${myKey}`}>
                <Form.Group
                key={`fg${myId}_${myKey}`}>
                    <Form.Control
                        id={`fc${myId}_${myKey}`}
                        key={`fc${myId}_${myKey}`}
                        as="textarea"
                        rows="4"
                        value={editValue}
                        className="fw-normal"
                        onChange={handleChange}
                        style={{
                            minWidth: "100px",
                            fontSize: '14px',
                            color: 'inherit'
                        }} />
                </Form.Group>
            </Form>
            </>
        );
    }else{

        return <span>{text}</span>
    }

};
