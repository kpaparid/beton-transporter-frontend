import React, { useState } from 'react';
import { Col, Row, Form, Card, Button, ButtonGroup, Breadcrumb, Modal, InputGroup, Dropdown, Container, Table } from '@themesberg/react-bootstrap';
import MyModal from './MyModal';
import moment from 'moment';

export default (props) => {
    const { text= "", rows=2, minRows= 2, maxRows= 5, editMode, className= ""}= props

    const [value, setValue] = useState(text)
    const [rowsState, setRows] = useState(rows)
    const [minRowsState, setMinRows] = useState(minRows)
    const [maxRowsState, setMaxRows] = useState(maxRows)

    const handleChange = (event) => {
        const textareaLineHeight = 24;

        const previousRows = event.target.rows;
        event.target.rows = minRowsState; // reset number of rows in textarea 

        const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= maxRowsState) {
            event.target.rows = maxRowsState;
            event.target.scrollTop = event.target.scrollHeight;
        }

        setValue(event.target.value)
        setRows(currentRows < maxRowsState ? currentRows : maxRowsState)
    };
    if (editMode == true)
        return (
            <>
                <textarea
                    rows={rowsState}
                    value={value}
                    display="none"
                    className={`textarea ${className}`}
                    onChange={handleChange}
                    style={{
                        boxSizing: "border-box",
                        resize: "none",
                        overflow: "auto",
                        height: "auto",
                        padding: "8px",
                        border: "0.0625rem solid #d1d7e0",
                        borderRadius: "0.5rem"
                    }}
                />
            </>
        );
    return <span className={`fw-normal ${className}`}></span>
};
