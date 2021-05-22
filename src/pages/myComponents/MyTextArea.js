import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@themesberg/react-bootstrap';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';


export default (props) => {
    const { text = "", rows = 1, minRows = 1, maxRows = 10, className = "" } = props
    const { myKey, myIndex, myChecked } = props

    const [editedValue, setEditedValue] = useState(text)
    const [originalValue, setOriginalValue] = useState(text)
    
    const editMode = useSelector(selectorMenu, shallowEqual)
    function selectorMenu(state) {
        const { editMode } = state;
        return editMode;
      }

    const dispatch = useDispatch();

    const handleChange = (event) => {
        setEditedValue(event.target.value);
        dispatch({
            type: ACTIONS.ADD_CHANGE,
            payload: {
                id: myIndex,
                label: myKey,
                text: event.target.value,
            }});
    };


    if (editMode && myChecked === 'checked') {
        return (
            <> 
            <Form>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        rows="4"
                        value={editedValue}
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

        return <span>{originalValue}</span>
    }

};
