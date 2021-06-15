import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, InputGroup } from '@themesberg/react-bootstrap';
import moment from "moment";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import { DateSelectorDropdown } from './MyOwnCalendar';
import TextareaAutosize from 'react-textarea-autosize';
import { calcInvalidation, calcValidation } from './MyConsts'

export const MyTextArea = (props) => {
    const { value = "", rows = 1 } = props
    const { minRows = 1, maxRows = 4, className = "", measurement = '' } = props
    const { label, validation = false, invalidation = false, disabled = false, readOnly = false } = props
    const { id, onChange, errorMessage, type = 'text', outsideBorder = '' } = props
    const { minWidth = '0', placeholder = '', availableValues, digits, digitsSeperator='', seperatorAt=[] } = props
    const imgValid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2305A677' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`
    const imgInvalid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23FA5252' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23FA5252' stroke='none'/%3e%3c/svg%3e")`
    const [focused, setFocused] = useState(false)
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    const inputEl = useRef()
    const inputD = useRef()
    const inputForm = useRef()

    const newPlaceholder = placeholder !== '' ? placeholder :
        type === 'date' ? 'DD/MM/YYYY' :
            type === 'minute' ? 'mm' :
                type === 'hour' ? 'hh' : ''

    const [change, setChange] = useState(value)
    const areaType = type === 'number' || type === 'time' || type === 'date' ? 'tel' : 'text'
    const isInvalid = calcInvalidation(change, type,  invalidation)
    const isValid = calcValidation(change, type,  validation)
    const cols = (change+'').length < 10 ? (change+'').length + 1 : 11
    const newWidth =
        type !== 'time' &&
            isInvalid ? '' + (parseInt(parseInt(minWidth) + 25)) + 'px' : minWidth

    function sendText(text){
        var value =text
        seperatorAt.forEach((s, index) => {
            const seperatorIndex = s + index
            value = value.length > seperatorIndex  && value[seperatorIndex] !== digitsSeperator ? 
            value.slice(0, seperatorIndex) + digitsSeperator + value.slice(seperatorIndex) : value
        })
        setChange(value)
        onChange && onChange(value)
    }

    function handleOnChange(event) {
        console.log('maxrows: '+maxRows)
        console.log('rows: '+ inputEl.current.rows)
        if( event.target.value.replace(change, '') === digitsSeperator ){
            sendText(event.target.value)
        }
        else {
            const v = event.target.value.replaceAll(digitsSeperator, '')
            console.log('v:'+v)
            if (type === 'hour' || type === 'minute' || type === 'date') {
                if (!isNaN(v)) {
                    if ((type === 'hour' || type === 'minute') && (parseInt(v) === 0 || v === '')) {
                        const newC = digits ? new Array(digits + 1).join('0') : '0'
                        sendText(newC)
                    }
                    if ((type === 'date') && (v === '')) {
                        const newC = ''
                        sendText(newC)
                    }
                    else if (availableValues) {
                        const vv = digits ? v.slice(-digits) : v
                        console.log('avail')
                        if (availableValues.indexOf(parseInt(v)) !== -1) {
                            sendText(vv)
                        }
                    }
                    else {
                        const vv = digits ? v.slice(-digits) : v
                        sendText(vv)
                    }
                }
            }
            else {
                sendText(v)
            }
        }
        
    }
    useEffect(() => {
        console.log('inside Area value change ' + value)
        setChange(value)
        colorize()
        
        // inputEl.current.cols=(change+'').length < 10 ? (change+'').length + 1 : 11
    }, [value]);
    useEffect(() => {
        console.log('NEW CHANGE:' + change)
        colorize()
    }, [change]);
    useEffect(() => {
        colorize()
    }, [focused]);

    

    function colorize() {
        const red = '250, 82, 82'
        const green = '5, 166, 119'
        const grey = '46,54, 80'
        const lightblue = '209, 215, 224'
        const darkblue = '86, 97, 144'

        const borderColor = isInvalid ? red : isValid ? green : focused ? darkblue : lightblue
        const color = isInvalid ? red : isValid ? green : grey
        if (focused) {
            inputD.current.style.boxShadow = '0 0 0 0.2rem rgb(' + color + ', 25%)'
            inputD.current.style.border = '1px solid rgb(' + borderColor + ')'
        }
        else {
            inputD.current.style.boxShadow = 'none'
            inputD.current.style.border = '1px solid rgb(' + borderColor + ')'
        }
    }
    // console.log("WREEEEEEEEEEEEEEEEEEEE: "+minWidth +value)
    // console.log(inputForm.current && getComputedStyle(inputForm.current).width)
    const [overflow, setOverflow] = useState('hidden')
   function handleHeightChange(height, rowHeight){
    //    console.log('////////////////////////////////////')
    //    console.log(height)
    //    console.log(rowHeight)
    //    console.log(inputEl.current.scrollHeight)
       
       const rows = parseInt(inputEl.current.scrollHeight/rowHeight)
    //    console.log(rows)
       rows <= maxRows ? setOverflow('hidden') : setOverflow('visible')
   }

    return (
        <>
            <Form key={`f-${id}}`} className='d-flex' ref={inputForm}>
                {label && <Form.Label className="fw-bolder">{label}</Form.Label>}
                <Form.Group className={'d-flex flex-nowrap p-0'} style={{ borderRadius: 'inherit' }}
                >
                    <div ref={inputD} className={"d-flex justify-content-center p-0 rounded " + outsideBorder}
                        style={{
                            transition: 'all 0.2s ease',
                            border: '1px solid rgb(209, 215, 224)',
                            // minWidth: inputForm.current && getComputedStyle(inputForm.current).width,
                        }}
                    >
                        <TextareaAutosize
                        
                        // ref={inputEl}

                            ref={inputEl}
                            maxRows={maxRows}
                            minRows={rows}
                            value={value}
                            onChange={(event) => handleOnChange(event)}
                            type={areaType}
                            required
                            isValid={isValid}
                            isInvalid={isInvalid}
                            placeholder={newPlaceholder}
                            disabled={disabled}
                            className={`align-middle flex-fill fw-normal form-control whitedisabled border border-0 shadow-none ${className}`}
                            readOnly={readOnly}
                            onHeightChange={(height, metaData) => handleHeightChange(height, metaData.rowHeight)}
                            onFocus={(e) => {
                                onFocus()
                                // console.log('focus')
                            }}
                            onBlur={onBlur}
                            cols={cols}
                            
                            style={{
                                fontSize: '0.875rem',
                                color: '#66799e',
                                resize: 'none',
                                // minWidth: inputForm.current.width,
                                width: 'auto',
                                textAlign: measurement === '' ? 'center' : 'end',
                                backgroundImage: isValid ? imgValid : isInvalid ? imgInvalid : '',
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "top calc(0.375em + 0.2rem) left calc(0.1em + 0.275rem)",
                                backgroundSize: "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
                                paddingRight: overflow === 'visible' ? '0.75rem' : measurement !== '' ? '0' : isValid || isInvalid ? '0.75rem' : '.75rem',
                                paddingLeft: isValid || isInvalid ? 'calc(1.5em + 1.1rem)' : '0.75rem',
                                overflow: overflow,
                                minWidth: parseInt(minWidth) 
                                    - (measurement !== '' ? 40 : 0)
                                    +'px',
                            }}
                        />
                        {measurement !== '' && <>
                            <div
                                className="align-middle flex-fill fw-normal text-nowrap whitedisabled text-start border h-100 border-0 shadow-none form-control"
                                value={measurement}
                                readOnly
                                // disabled
                                onClick={(e) => {
                                    inputEl.current.focus()
                                }}
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#66799e',
                                    paddingBottom: '0.7rem',
                                    paddingRight: '0.75rem',
                                    paddingLeft: '0.25rem',
                                    width: '40px'
                                    
                                }}

                            >{measurement}</div>
                        </>
                        }
                    </div>
                </Form.Group>
            </Form>
        </>
    );
};

export const TextAreaGroup = (props) => {

    return (
        props.data.map((item, index) => {
            const { id, type, minWidth, readOnly, validation,
                invalidation, measurement, maxRows, onChange, value } = item
            const outsideBorder = props.data.length === 1 ? '' : index === 0 ?
                'rounded-0 rounded-start' : index === props.data.length - 1 ?
                    'rounded-0 rounded-end' : 'rounded-0'
            return (
                <>
                    <MyTextArea
                        id={id}
                        type={type}
                        value={value}
                        readOnly={readOnly}
                        onChange={onChange}
                        minWidth={minWidth}
                        validation={validation}
                        invalidation={invalidation}
                        measurement={measurement}
                        maxRows={maxRows}
                        outsideBorder={outsideBorder}
                    />
                </>
            )
        })

    )
}
