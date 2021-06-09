import React, { useState, useEffect, useRef } from 'react';
import { Container, Form } from '@themesberg/react-bootstrap';
import moment from "moment";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import { DateSelectorDropdown } from './MyOwnCalendar';

export default (props) => {
    const { value = "", rowss = 1 } = props
    const { minRows = 1, maxRows = 4, className = "" } = props
    const { label, validation=false, invalidation=false, disabled=false, readOnly=false} = props
    const { id, onChange, errorMessage, type='text'} = props
    const {  minWidth='0', placeholder='', availableValues} = props
    const [rows, setRows] = useState(minRows)

    const inputEl = useRef();
    useEffect(() => {
        inputEl.current.rows = ~~(inputEl.current.scrollHeight / 21)
    }, []);



    const newPlaceholder = placeholder !== '' ? placeholder :
                            type === 'date' ? 'DD/MM/YYYY' : 
                            type === 'minute' ? 'mm' :
                            type === 'hour' ? 'hh' : ''

    const [change, setChange] = useState(value)
    const areaType = type === 'number' || type === 'time'|| type === 'date' ? 'tel' : 'text'
    const isValid = !validation ? false : 
        change === '' ? false :
        type === 'text' ? true :
        type === 'number' && !isNaN(change) ? true : 
        type === 'date' && moment(change, "DD/MM/YYYY", true).isValid() ? true : 
        type === 'time' && moment(change, "HH:mm", true).isValid() ? true : 
        type === 'hour' && moment(change, "HH", true).isValid() ? true : 
        type === 'minute' && moment(change, "mm", true).isValid() ? true : 
            false
    const isInvalid = !invalidation ? false : 
        change === '' ? false :
        type === 'text' ? false :
            type === 'number' && !isNaN(change) ? false : 
            type === 'date' && moment(change, "DD/MM/YYYY", true).isValid() ? false : 
            type === 'time' && moment(change, "HH:mm", true).isValid() ? false : 
            type === 'hour' && moment(change, "HH", true).isValid() ? false : 
            type === 'minute' && moment(change, "mm", true).isValid() ? false : 
            true
            // console.log('change: '+change)
            // console.log('isInvalid '+moment(change, "HH:mm", true).isValid())
    function handleOnChange(event) {
        const v = event.target.value
        console.log('===================')
        console.log(v)
        console.log(!isNaN(v))
        if (type === 'hour' || type === 'minute') {
            if (!isNaN(v)) {
                if (v === '0' || v === '') {
                        console.log('vrika se keno ')
                        setChange('00')
                        onChange && onChange('00')
                }
                else if (availableValues) {
                    const vv = ('0' + parseInt(v)).slice(-2)
                    console.log('avail')
                    if (availableValues.indexOf(parseInt(v)) !== -1) {
                        
                        console.log('vrika se Avail '+vv)
                        setChange(vv)
                        onChange && onChange(vv)
                    }
                    else{
                        console.log('den vrika '+v)
                    }
                }
                else {
                    const vv = ('0' + parseInt(v)).slice(-2)
                    console.log('time xwris avail')
                    setChange(vv)
                    onChange && onChange(vv)
                }
            }
        }
        else {
            console.log('mpika')
            setChange(v)
            onChange && onChange(v)
        }

        
        event.target.rows = 1
        const r = ~~(event.target.scrollHeight / 21)
        console.log('rows:' +r)
        if (r <= maxRows){
            console.log('mesa')
            event.target.rows = r
        }else{
            event.target.rows = maxRows
        }
    }
    useEffect(() => {
        console.log('inside Area value change')
        setChange(value)
     }, [value]);
     useEffect(() => {
        console.log('rows')
        console.log(rows)
     }, [rows]);

     
         

        return (
            <>
            <Form key={`f-${id}}`} className={'d-flex '+className}>
                <Form.Group className={' p-0'}
                >
                    {label && <Form.Label className="fw-bolder">{label}</Form.Label>}
                    <Form.Control
                        ref={inputEl}
                        id={id}
                        as="textarea"
                        rows={1}
                        value={change}
                        type={areaType}
                        onChange={(event) => handleOnChange(event)}
                        required 
                        isValid={isValid}
                        isInvalid={isInvalid}
                        placeholder={newPlaceholder}
                        disabled={disabled}
                        className="fw-normal  h-100 text-center whitedisabled"
                        readOnly={readOnly}
                        
                        style={{
                            fontSize: '0.875rem',
                            color: '#66799e',    
                            resize: 'none',
                            minWidth: minWidth,
                        }} />
                    {/* {errorMessage && 
                    <Form.Control.Feedback type="invalid" key={'feedback-'+id}>
                        {errorMessage}
                    </Form.Control.Feedback>
                    } */}
                </Form.Group>
            </Form>
            </>
        );
};
