import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@themesberg/react-bootstrap';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';


export default (props) => {
    const { text = "", rows = 1, minRows = 1, maxRows = 10, className = "" } = props
    const { myKey, myIndex,  myId} = props

    const checked = useSelector(checkedSelector, shallowEqual)
    function checkedSelector(state) {
      const { tourTable } = state;
      const checked = tourTable.checkedId.findIndex(item => item === myId) === -1 ? false : true
      return checked;
    }
    
    const editMode = useSelector(state => state.tourTable.editMode)

      const editValue = useSelector(editedValueSelector, shallowEqual)
      function editedValueSelector(state) {
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
        console.log(checked)
        dispatch({
            type: ACTIONS.ADD_CHANGE,
            payload: {
              id: myId,
              key: myKey,
              change: event.target.value,
            }
          });
    };

    if (editMode && checked) {
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
                        defaultValue={editValue}
                        className="fw-normal"
                        onChange={handleChange}
                        // autoFocus
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
