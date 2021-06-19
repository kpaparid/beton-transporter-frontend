import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, InputGroup } from '@themesberg/react-bootstrap';
import moment from "moment";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import { DateSelectorDropdown } from './MyOwnCalendar';
import TextareaAutosize from 'react-textarea-autosize';
import { calcInvalidation, calcValidation, imgValid, imgInvalid } from './MyConsts'
import AutosizeInput from 'react-input-autosize';
import { convertToThousands, countNumberSeperators, colorizeBorder } from './utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const MyTextArea = (props) => {
    const { value = "", rows = 1,
        minRows = 1, maxRows = 4, className = "", measurement = '',
        label, validation = false, invalidation = false, disabled = false, readOnly = false,
        id='hi', onChange, errorMessage, type = 'text', outsideBorder = '',
        minWidth = '50px', placeholder = '', availableValues, maxWidth = '200px',
        digits, digitsSeperator = type === 'date' ? '/' : '', seperatorAt = [],
        disableFocus = false, onFocus, onBlur, measurementClassName = '', textareaClassName = '',
    } = props

    const [change, setChange] = useState(type === 'number' && !isNaN((value + '').replaceAll('.', '')) && value.length > 1 ? convertToThousands(value) : value + '')

    const data = {
        change, type, validation, invalidation, label, measurement, disabled, readOnly,
        minWidth, handleOnChange, value, placeholder,
        id, maxRows, outsideBorder, rows, minRows, className,
        onFocus, onBlur, disableFocus, measurementClassName, textareaClassName, maxWidth,
    }

    useEffect(() => {
        // console.log('inside Area value change ' + value)
        var v = type === 'number' && !isNaN((value + '').replaceAll('.', '')) && value.length > 1 ? convertToThousands(value) : value + ''
        // console.log(v)
        setChange(v)
    }, [value]);


    function sendText(text) {
        var value = text + ''
        // console.log('sending Pre-value: ' + value)
        seperatorAt.forEach((s, index) => {
            const seperatorIndex = s + index
            value = value.length > seperatorIndex && value[seperatorIndex] !== digitsSeperator ?
                value.slice(0, seperatorIndex) + digitsSeperator + value.slice(seperatorIndex) : value
        })
        // console.log('sending value: ' + value)
        onChange && onChange(value)


    }

    function handleOnChange(text) {
        const value = text + ''

        if (value !== '' && value.replace(change, '') === digitsSeperator) {
            console.log('DIGITSSO')
            if (type === 'date') {
                var count = (value.match(new RegExp(digitsSeperator, "g")) || []).length;

                if (count === 1 && value.indexOf(digitsSeperator) === 2)
                    sendText(value)
                else if (count === 1 && value.indexOf(digitsSeperator) === 1)
                    sendText('0' + value)
                else if (count === 2 && value.indexOf(digitsSeperator, 3) === 5 && value.indexOf(digitsSeperator) === 2)
                    sendText(value)
                else if (count === 2 && value.indexOf(digitsSeperator) === 2 && value.indexOf(digitsSeperator, 3) === 4) {
                    const splitValue = value.split(digitsSeperator)
                    sendText(splitValue[0] + digitsSeperator + '0' + splitValue[1] + digitsSeperator + splitValue[2])
                }
            }
            else sendText(value)
        }
        else {
            const clearedValue = value.replaceAll(digitsSeperator, '')
            // console.log('CLEARED VALUE ' + clearedValue)
            if (type === 'number') {
                // console.log('=============NUMBER ' + change + ' => ' + clearedValue)

                sendText(clearedValue)
            }
            else if (type === 'hour' || type === 'minute' || type === 'date') {
                // console.log('CLEARED VALUE2 ' + clearedValue)
                if (!isNaN(clearedValue)) {
                    if ((type === 'hour' || type === 'minute') && (clearedValue === '' || parseInt(clearedValue) === 0)) {
                        // console.log('CLEARED VALUE3 ' + clearedValue)
                        const newValue = digits ? new Array(digits + 1).join('0') : '0'
                        sendText(newValue)
                    }
                    else if ((type === 'date') && (clearedValue === '')) {
                        const newValue = ''
                        sendText(newValue)
                    }
                    else if (availableValues) {
                        const newValue = digits ? clearedValue.slice(-digits) : clearedValue
                        // console.log('Available value')
                        if (availableValues.indexOf(parseInt(clearedValue)) !== -1) {
                            sendText(newValue)
                        }
                    }
                    else {
                        const newValue = digits ? clearedValue.slice(-digits) : clearedValue
                        sendText(newValue)
                    }
                }
            }
            else {
                sendText(clearedValue)
            }
        }

    }
    return (
        <DumbTextArea data={data}></DumbTextArea>
    );
};

const DumbTextArea = (props) => {
    const { change, type, validation, invalidation, label, measurement, disabled, readOnly,
        minWidth, maxWidth, handleOnChange, placeholder, onFocus, onBlur, textareaClassName,
        id, maxRows, outsideBorder, minRows, className, disableFocus = 'false', measurementClassName = '' } = props.data
    const inputTextAreaRef = useRef(null)
    const inputAutoSizeRef = useRef(null)
    const divWrapperRef = useRef(null)
    const measurementRef = useRef(null)
    const inputFormRef = useRef(null)
    const dummyTextRef = useRef(null)
    const dummyWrapperRef = useRef(null)

    const [focused, setFocused] = useState(false)
    const focus = () => setFocused(true)
    const blur = () => setFocused(false)

    const [overflow, setOverflow] = useState('hidden')

    const isInvalid = calcInvalidation(change + '', type, invalidation)
    const isValid = calcValidation(change + '', type, validation)

    const areaType = type === 'number' || type === 'time' || type === 'date' ? 'tel' : 'text'
    const newPlaceholder = placeholder !== '' ? placeholder :
        type === 'date' ? 'DD/MM/YYYY' :
            type === 'minute' ? 'mm' :
                type === 'hour' ? 'hh' : ''

    const [swapMode, setSwapMode] = useState(false)
    const [rowHeight, setRowHeight] = useState(21)
    const [rows, setRows] = useState(2)
    

    useEffect(() => {
        console.log('on Change '+change)
        const currentRows = textAreaMode && inputTextAreaRef.current ? parseInt(inputTextAreaRef.current.scrollHeight / rowHeight) : 1
        setRows(currentRows)
     },[change]);

    function handleHeightChange(height, rHeight) {
        const displayedRows = height / rHeight
        parseInt(displayedRows) === 1 && setSwapMode(true)
        // const valueRows = inputTextAreaRef.current.scrollHeight / rHeight
        // console.log('HEIGHT CHANGE')
        // console.log('displ '+displayedRows)
        // console.log('height '+height)
        // console.log('rowheight '+rowHeight)
        // console.log('valueRows '+valueRows)
        // console.log('ROWSSSSSSSS: '+r)
        rowHeight !== rHeight && setRowHeight(rHeight)
        // setRowHeight = height
        // displayedRows >= maxRows ? setOverflow('auto') : setOverflow('hidden')

    }
    useEffect(() =>{
        rows > maxRows ? setOverflow('auto') : setOverflow('hidden')
    },[rows]);

    useEffect(() =>{        
    },[overflow]);

    const [cursorPosition, setCursorPosition] = useState(change.length)
    const mode = divWrapperRef.current && parseInt(getComputedStyle(divWrapperRef.current).width) >= parseInt(maxWidth) ? true : false
    const [textAreaMode, setTextAreaMode] = useState(!mode)
    const [textWidth, setTextWidth] = useState('20px')

    useEffect(() => {
        if (textAreaMode) {
            inputTextAreaRef.current.width = textWidth
            inputTextAreaRef.current.focus()
            inputTextAreaRef.current.selectionStart = cursorPosition
            inputTextAreaRef.current.selectionEnd = cursorPosition
        }
        else {
            inputAutoSizeRef.current.children[0].firstChild.focus()
            inputAutoSizeRef.current.children[0].firstChild.selectionStart = cursorPosition
            inputAutoSizeRef.current.children[0].firstChild.selectionEnd = cursorPosition
        }
    }, [textAreaMode]);
    const [width, setWidth] = useState('20px')
    useEffect(() => {
        dummyWrapperRef.current && setWidth(getComputedStyle(dummyWrapperRef.current).width)
    });

    useEffect(() => {
        // console.log('RERENDER===================' + width)
        if(Math.abs(parseInt(maxWidth) - parseInt(width)) <= 5){
            setTextAreaMode(true)
            // console.log('true')
        }else{
            
            setTextWidth(getComputedStyle(dummyTextRef.current).width)
            setTextAreaMode(false)
            // console.log('false')
        }
    }, [width]);

    useEffect(() => {
        console.log('-------NEW CHANGE: ' + change)
        console.log()
        // divRef.current && console.log(getComputedStyle(divRef.current).width)
        setTextAreaMode(mode)
        if (textAreaMode) {
            inputTextAreaRef.current.selectionStart = cursorPosition
            inputTextAreaRef.current.selectionEnd = cursorPosition
        }
        else {
            inputAutoSizeRef.current.children[0].firstChild.selectionStart = cursorPosition
            inputAutoSizeRef.current.children[0].firstChild.selectionEnd = cursorPosition
        }
    }, [change]);    

    useEffect(() => {
        colorizeBorder(divWrapperRef, isValid, isInvalid, focused)
    }, [isValid, isInvalid, focused, swapMode]);

    

    function handleChange(event) {
        const value = event.target.value
        if (type === 'number' && !isNaN((value + '').replaceAll('.', '')) && value.length > 1) {
            const c = convertToThousands(change)
            const v = convertToThousands(value)
            !isNaN(change.replaceAll('.', '')) ? setCursorPosition(event.target.selectionStart + (countNumberSeperators(v) - countNumberSeperators(c))) :
                setCursorPosition(event.target.selectionStart)
        }
        else {
            setCursorPosition(event.target.selectionStart)
        }

        handleOnChange(value)
    }
    return (
        <>  
            
            
            <div data='wrapper' className={" p-0 rounded " + outsideBorder}
                        style={{
                            transition: 'all 0.2s ease',
                            border: '1px solid rgb(209, 215, 224)',
                            maxWidth: maxWidth,
                            width: 'fit-content',
                            height: '0px',
                            visibility: 'hidden',
                        }}
                    >
                    <div className={` d-flex flex-nowrap fw-normal form-control whitedisabled border border-0 shadow-none `}
                        ref={dummyWrapperRef}
                        > 
                            {(isInvalid || isValid) &&
                                <div
                                 style={{
                                    backgroundImage: isInvalid ? imgInvalid : isValid ? imgValid : '',
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
                                    paddingRight: 'calc(20px + 0.35em)',
                                    paddingLeft: '0rem'
                                }}></div>}
                                <div
                                    ref={dummyTextRef}
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#66799e',
                                        resize: 'none',
                                        textAlign: measurement === '' ? 'center' : 'end',
                                        overflow: 'auto',
                                        width: 'auto'
                                    }}
                                >{change}</div>
                            {measurement !== '' && <>
                                <div
                                    className={`d-flex align-items-end fw-normal text-nowrap whitedisabled text-start border h-100 border-0 shadow-none ${measurementClassName}`}
                                    value={measurement}
                                    readOnly
                                    ref={measurementRef}
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#66799e',
                                        width: 'auto',
                                        paddingLeft: '0.3rem',
                                    }}
                                >{measurement}</div>
                            </>
                            }
                        </div>
                    </div>
            <Form key={`f-${id}}`} className='d-flex flex-fill' ref={inputFormRef}>
                {label && <Form.Label className="fw-bolder w-100">{label}</Form.Label>}
                <Form.Group className={'d-flex flex-nowrap p-0 w-100'} style={{ borderRadius: 'inherit' }}
                >
                    <div data='wrapper' ref={divWrapperRef} className={"d-flex justify-content-center p-0 rounded w-100 " + outsideBorder}

                        style={{
                            transition: 'all 0.2s ease',
                            border: '1px solid rgb(209, 215, 224)',
                        }}
                    >
                        <div className={` d-flex flex-nowrap 
                        flex-fill fw-normal form-control whitedisabled border border-0 shadow-none `}
                            style={{ alignItems: measurement === '' ? 'baseline' : 'inherit', }}
                            onClick={(e) => {
                                if (e.target.name !== 'input-field' && e.target.name !== 'textarea') {
                                    if (!focused) {
                                        !disableFocus && focus()
                                        onFocus && onFocus()
                                    }
                                    setCursorPosition(change.length)
                                    if (textAreaMode) {
                                        inputTextAreaRef.current.focus()
                                        inputTextAreaRef.current.selectionStart = cursorPosition
                                        inputTextAreaRef.current.selectionEnd = cursorPosition
                                    }
                                    else {
                                        inputAutoSizeRef.current.children[0].firstChild.focus()
                                        inputAutoSizeRef.current.children[0].firstChild.selectionStart = cursorPosition
                                        inputAutoSizeRef.current.children[0].firstChild.selectionEnd = cursorPosition
                                    }
                                }

                            }}
                        >   
                        
                        {(isInvalid || isValid) &&
                                <div
                                 style={{
                                    backgroundImage: isInvalid ? imgInvalid : isValid ? imgValid : '',
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
                                    paddingRight: 'calc(20px + 0.35em)',
                                    paddingLeft: '0rem'
                                }}></div>}
                            {textAreaMode &&
                                <TextareaAutosize
                                    name="textarea"
                                    ref={inputTextAreaRef}
                                    autoFocus
                                    maxRows={maxRows}
                                    minRows={1}
                                    value={change}
                                    onChange={handleChange}
                                    type={areaType}
                                    required
                                    placeholder={newPlaceholder}
                                    disabled={disabled}
                                    className={`d-flex flex-fill whitedisabled  border border-0 shadow-none form-control p-0 ${textareaClassName}`}
                                    readOnly={readOnly}
                                    onHeightChange={(height, metaData) => handleHeightChange(height, metaData.rowHeight)}
                                    onFocus={(e) => {
                                        !disableFocus && focus()
                                        onFocus && onFocus()
                                    }}
                                    onBlur={(e) => {
                                        !disableFocus && blur()
                                        onBlur && onBlur()
                                    }}
                                    onKeyPress={e => {
                                        if (e.key === 'Enter')
                                            e.preventDefault()
                                    }}

                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#66799e',
                                        resize: 'none',
                                        textAlign: measurement === '' ? 'center' : 'end',
                                        overflow: overflow,
                                        width: textWidth
                                    }}
                                />}
                            {!textAreaMode &&
                                <div ref={inputAutoSizeRef} className="flex-fill">
                                    <AutosizeInput
                                        name="input-field"
                                        value={change}
                                        onChange={handleChange}
                                        type={areaType}
                                        required
                                        autoFocus
                                        placeholder={newPlaceholder}
                                        disabled={disabled}
                                        autoComplete="off"
                                        className={`d-flex flex-fill whitedisabled  border border-0 shadow-none ${textareaClassName}`}
                                        style={{
                                            textAlign: measurement === '' ? 'center' : 'end',
                                            justifyContent: measurement === '' ? 'center' : 'flex-end',
                                        }}
                                        readOnly={readOnly}
                                        onFocus={(e) => {
                                            !disableFocus && focus()
                                            onFocus && onFocus()
                                        }}
                                        onBlur={(e) => {
                                            !disableFocus && blur()
                                            onBlur && onBlur()
                                        }}
                                        onKeyPress={e => {
                                            if (e.key === 'Enter')
                                                e.preventDefault()
                                        }}

                                        inputStyle={{
                                            fontSize: '0.875rem',
                                            color: '#66799e',
                                            border: 0,
                                            boxShadow: 'none',
                                            outline: 0,
                                            padding: '0px',
                                        }}
                                    />
                                </div>
                            }
                            {measurement !== '' && <>
                                <div
                                    className={`d-flex align-items-end flex-fill fw-normal text-nowrap whitedisabled text-start border h-100 border-0 shadow-none ${measurementClassName}`}
                                    value={measurement}
                                    readOnly
                                    ref={measurementRef}
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#66799e',
                                        width: 'auto',
                                        paddingLeft: '0.3rem',
                                    }}
                                >{measurement}</div>
                            </>
                            }
                        </div>
                    </div>
                </Form.Group>
            </Form>
        </>
    )
}

export const TextAreaGroup = (props) => {
    const { outsideBorder = '', id='textareaGroup', data } = props
    const divWrapperRef = useRef()

    const [focused, setFocused] = useState(false)
    const focus = () => setFocused(true)
    const blur = () => setFocused(false)

    useEffect(() => {
        colorizeBorder(divWrapperRef, focused)
    }, [focused]);

    return (
        <div id={id+'div'} key={id+'div'} ref={divWrapperRef} className={"d-flex justify-content-center rounded w-100" + outsideBorder}
            style={{
                transition: 'all 0.2s ease',
                border: '1px solid rgb(209, 215, 224)',
            }}>
            {data.map((item, index) => {
                const { id, type, minWidth, maxWidth, readOnly, validation,
                    invalidation, measurement, maxRows, onChange, value } = item
                const outsideBorder = index === 0 ? 'border-0 border-end' : 'border-0'
                const measurementClassName = index === 0 ? 'pe-1' : ''
                const textareaClassName = index === 1 ? 'ps-1' : ''
                function handleChange(value) {
                    onChange(type, value)
                }
                return (
                         <MyTextArea
                            key={id+index}
                            id={id+index}
                            type={type}
                            value={value}
                            readOnly={readOnly}
                            // onChange={handleChange}
                            minWidth={parseInt(minWidth) / 2 + 'px'}
                            maxWidth={parseInt(maxWidth) / 2 + 'px'}
                            validation={validation}
                            invalidation={invalidation}
                            measurement={measurement}
                            maxRows={maxRows}
                            outsideBorder={outsideBorder}
                            disableFocus
                            onFocus={focus}
                            onBlur={blur}
                            measurementClassName={measurementClassName}
                            textareaClassName={textareaClassName}
                        /> 
                )
            })
            }
        </div>
    )
}

