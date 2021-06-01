import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@themesberg/react-bootstrap';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';


export default (props) => {
    const { text = "", rows = 1, minRows = 1, maxRows = 10, className = "" } = props
    const { myKey, myId, editMode=false, handleEditChange} = props
    
    const [change, setChange] = useState(text)

    function handleOnChange(id, key, event) {
        setChange(event.target.value)
        handleEditChange(id, key, event.target.value)
    }
    if (editMode) {
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
                        defaultValue={change}
                        className="fw-normal"
                        onChange={(event) => handleOnChange(myId, myKey, event)}
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
