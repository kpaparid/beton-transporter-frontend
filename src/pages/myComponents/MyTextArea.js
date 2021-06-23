import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, InputGroup } from '@themesberg/react-bootstrap';
import moment from "moment";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import { DateSelectorDropdown } from './MyOwnCalendar';
import TextareaAutosize from 'react-textarea-autosize';
import { calcInvalidation, calcValidation, imgValid, imgInvalid } from './MyConsts'
import AutosizeInput from 'react-input-autosize';
import { convertToThousands, countNumberSeperators, colorizeBorder, getDifferenceOfStrings, validateNumber, } from './utilities';

export const MyTextArea = (props) => {
    const { value = "", rows = 1,
        minRows = 1, maxRows = 4, className = "", measurement = '',
        label, validation = false, invalidation = false, disabled = false, readOnly = false,
        id = 'hi', onChange, errorMessage, type = 'text', outsideBorder = '',
        minWidth = '50px', placeholder = '', availableValues, maxWidth = '200px',
        digits, digitsSeperator = type === 'date' ? '/' : '', seperatorAt = [],
        disableFocus = false, onFocus, onBlur, measurementClassName = '', textareaClassName = '',
        focus = false,
    } = props

    const [change, setChange] = useState(type === 'number' && !isNaN((value + '').replaceAll('.', '')) && value.length > 1 ? convertToThousands(value) + '' : value + '')
    const data = {
        change, type, validation, invalidation, label, measurement, disabled, readOnly,
        minWidth, handleOnChange, value, placeholder,
        id, maxRows, outsideBorder, rows, minRows, className, focus,
        onFocus, onBlur, disableFocus, measurementClassName, textareaClassName, maxWidth,
        digitsSeperator,
    }
    useEffect(() => {
        console.log('inside Area value change ' + value)
        var v = type === 'number' && validateNumber(value) && value.length > 1 ? convertToThousands(value) : value
        console.log(validateNumber(value))
        // setChange(v)
        setChange(v + '')
    }, [value]);
    function sendText(text) {
        var value = text + ''
        // console.log('sending Pre-value: ' + value)
        // seperatorAt.forEach((s, index) => {
        //     const seperatorIndex = s + index
        //     value = value.length > seperatorIndex && value[seperatorIndex] !== digitsSeperator ?
        //         value.slice(0, seperatorIndex) + digitsSeperator + value.slice(seperatorIndex) : value
        // })
        console.log('sending value: ' + value)
        onChange && onChange(value)
    }

    function handleOnChange(text) {
        const value = text + ''
        console.log('ON CHANGE prevalue: ' + change)
        console.log('ON CHANGE aftervalue: ' + value)

        if (value !== '') {
            console.log('Non Null input')
                sendText(value)
        }
        else {
            const clearedValue = value.replaceAll(digitsSeperator, '')
            // console.log('CLEARED VALUE ' + clearedValue)
            if (type === 'hour' || type === 'minute' || type === 'date') {
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
        <TextAreaComponent data={data}></TextAreaComponent>
    );
};

const TextAreaComponent = (props) => {
    const { change, type, validation, invalidation, label, measurement, disabled, readOnly,
        minWidth, maxWidth, handleOnChange, placeholder, onFocus, onBlur, textareaClassName, focus,
        id, maxRows, outsideBorder, minRows, className, disableFocus = 'false', measurementClassName = '', digitsSeperator } = props.data
    const inputTextAreaRef = useRef(null)
    const inputAutoSizeRef = useRef(null)
    const divWrapperRef = useRef(null)
    const measurementRef = useRef(null)
    const inputFormRef = useRef(null)
    const dummyTextRef = useRef(null)
    const dummyWrapperRef = useRef(null)

    const [focused, setFocused] = useState(focus)
    const handleFocus = () => setFocused(focus)
    const handleBlur = () => setFocused(false)


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
    const [cursorPosition, setCursorPosition] = useState(change.length)
    const [textAreaMode, setTextAreaMode] = useState()
    const [textWidth, setTextWidth] = useState('20px')
    const [width, setWidth] = useState('20px')

    
    function formatValueAndSetCursor(value, key, type, cursor) {
        console.log(value)
        console.log(type)
        if (type === 'number') {
            const formattedValue = formatNumberInput(value, key)
            console.log('formattedValue ' + formattedValue+'|')
            console.log('cursor ' + cursor)
            const dotDifference = countNumberSeperators(formattedValue.substr(0, cursor + 1)) - countNumberSeperators(change.substr(0, cursor + 1))
            const newCursor = formattedValue.trim().length === 0 || formattedValue === '0' ? 1 : cursor + dotDifference
            setCursorPosition(newCursor)
            return formattedValue;
        }
        if (type === 'date') {
            const formattedValue = formatDateInput(value, digitsSeperator)
            return formattedValue
        }
        else {
            setCursorPosition(cursor)
            return value
        }
    }
    function handleKeyDown(event) {
        // console.clear()
        const value = event.target.value
        const cursorStart = event.target.selectionStart
        const cursorEnd = event.target.selectionEnd
        const key = event.key
        var cursor = cursorStart
        var newValue = value
        if (event.ctrlKey) {
            if ((key === 'x' || key === 'X') && cursorStart !== cursorEnd) {
                console.log('Ctrl Cut')
                newValue = value.substr(0, cursorStart) + value.substr(cursorEnd)
            }
            else if ((key === 'Delete')) {
                console.log('Ctrl Del')
                const indexOfSpace = value.substr(cursorStart).indexOf(' ')
                console.log('index: ' + indexOfSpace)
                newValue = indexOfSpace === -1 ?
                    value.substr(0, cursorStart) :
                    value.substr(0, cursorStart) + value.substr(indexOfSpace + cursorStart + 1)
                cursor = indexOfSpace === -1 ? newValue.length : cursorStart
            }
            else if ((key === 'Backspace')) {
                console.log('Ctrl Backspace')
                const indexOfSpace = value.substr(0, cursorStart).lastIndexOf(' ')
                console.log('index: ' + indexOfSpace)
                newValue = indexOfSpace === -1 ?
                    value.substr(cursorStart) :
                    value.substr(0, indexOfSpace) + value.substr(cursorStart + 1)
                cursor = indexOfSpace === -1 ? 0 : cursorStart
            }
        }
        else if (key === ' ') {
            console.log('Space')
            newValue = value.substr(0, cursorStart) + ' ' + value.substr(cursorEnd) === ' ' ?
                '' : value.substr(0, cursorStart) + ' ' + value.substr(cursorEnd)
            console.log('NEW VALUE: ' + newValue)
            cursor = cursorStart + 1
        }
        else if (key === 'Backspace') {
            console.log('deleting from: ' + cursorStart + '    to: ' + cursorEnd)
            newValue = cursorStart === cursorEnd ?
                value.substr(0, cursorStart - 1) + value.substr(cursorEnd) :
                value.substr(0, cursorStart) + value.substr(cursorEnd)
            cursor = cursorStart === cursorEnd ? cursorStart - 1 : cursorStart
        }
        else if (key === 'Delete') {
            console.log('deleting from: ' + cursorStart + '    to: ' + cursorEnd)
            newValue = cursorStart === cursorEnd ?
                value.substr(0, cursorStart) + value.substr(cursorEnd + 1) :
                value.substr(0, cursorStart) + value.substr(cursorEnd)
            cursor = cursorStart - 1
        }
        else if (key.length === 1) {
            console.log('default key press')
            newValue = value.substr(0, cursorStart) + key + value.substr(cursorEnd)
            cursor = cursorStart + 1
        }

        if (key === 'Delete' || key === 'Backspace' || key === 'Space' || (!event.ctrlKey && key.length === 1)) {
            console.log('KEY: ' + key)
            console.log('value: ' + value)
            console.log('key:' + key + '|  start: ' + cursorStart + '  to: ' + cursorEnd)
            const formattedValue = formatValueAndSetCursor(newValue, key, type, cursor)
            handleOnChange(formattedValue)
        }

    }
    function handlePaste(event) {
        const value = event.target.defaultValue
        const cursorStart = event.target.selectionStart
        const cursorEnd = event.target.selectionEnd
        console.log('Paste')
        const text = event.clipboardData ? event.clipboardData.getData('Text') : ''
        const newValue = value.substr(0, cursorStart) + text + value.substr(cursorEnd)
        const formattedValue = formatNumberInput(newValue, 'Paste')
        const difference = getDifferenceOfStrings(change, formattedValue)
        console.log(difference)
        const count = difference.value.length === 0 ? formattedValue.length : difference.value.length
        setCursorPosition(count + cursorStart)
        handleOnChange(formattedValue)
    }
    function formatDateInput (value, digitsSeperator){
        var count = (value.match(new RegExp(digitsSeperator, "g")) || []).length;
        var newValue
        if (count === 1 && value.indexOf(digitsSeperator) === 2)
            newValue= value
        else if (count === 1 && value.indexOf(digitsSeperator) === 1)
            newValue= '0' + value
        else if (count === 2 && value.indexOf(digitsSeperator, 3) === 5 && value.indexOf(digitsSeperator) === 2)
            newValue= value
        else if (count === 2 && value.indexOf(digitsSeperator) === 2 && value.indexOf(digitsSeperator, 3) === 4) {
            const splitValue = value.split(digitsSeperator)
            newValue = splitValue[0] + digitsSeperator + '0' + splitValue[1] + digitsSeperator + splitValue[2]
        }
        return newValue
    }
    function formatNumberInput(value, key) {
        const difference = getDifferenceOfStrings(change + '', value)
        const valid = validateNumber(value)
        const validOldValue = validateNumber(change)
        if (value === '' || value === ' ') return '0'
        else if (difference.value.length === 1 && difference.value[0] === '.') {
            console.log('Detected Dot')
            if (key === 'Backspace') {
                if (!validOldValue || (validOldValue && difference.index[0] === change.length - 1)) {
                    const formattedValue = change.substr(0, difference.index[0]) + change.substr(difference.index[0] + 1)
                    return formattedValue
                } else {
                    const formattedValue = change.substr(0, difference.index[0] - 1) + change.substr(difference.index[0] + 1)
                    return convertToThousands(formattedValue)
                }
            }
            else if (key === 'Delete' || key === 'Ctrl Delete' || key === 'Cut' || key === 'Ctrl Cut') {
                if (validOldValue) {
                    const formattedValue = change.substr(0, difference.index[0]) + change.substr(difference.index[0] + 2)
                    return convertToThousands(formattedValue)
                } else {
                    const formattedValue = change.substr(0, difference.index[0]) + change.substr(difference.index[0] + 1)
                    return formattedValue
                }
            } else {
                return value
            }
        }
        else if (key === '.' || key === ' ') {
            console.log('sending => . or empty')
            return value
        }
        else if (valid) {
            console.log('sending => valid')
            if (value.slice(-2) === ',0') return value
            else if (value.slice(-1) === ',') return value
            else return convertToThousands(value)
        }
        else {
            console.log('sending => empty Comma')
            if (value === ',') return '0,'
            else return value
        }
    }
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
    useEffect(() => {
        console.log('on Change ' + change)
        const currentRows = textAreaMode && inputTextAreaRef.current ? parseInt(inputTextAreaRef.current.scrollHeight / rowHeight) : 1
        setRows(currentRows)
    }, [change]);

    useEffect(() => {
        rows > maxRows ? setOverflow('auto') : setOverflow('hidden')
    }, [rows]);

    useEffect(() => {
    }, [overflow]);
    useEffect(() => {
        if (textAreaMode) {
            inputTextAreaRef.current.width = textWidth
            inputTextAreaRef.current.focus({ preventScroll: true })
            inputTextAreaRef.current.selectionStart = cursorPosition
            inputTextAreaRef.current.selectionEnd = cursorPosition
        }
        else {
            inputAutoSizeRef.current.children[0].firstChild.focus({ preventScroll: true })
            inputAutoSizeRef.current.children[0].firstChild.selectionStart = cursorPosition
            inputAutoSizeRef.current.children[0].firstChild.selectionEnd = cursorPosition
        }
    }, [textAreaMode]);
    useEffect(() => {
        dummyWrapperRef.current && setWidth(getComputedStyle(dummyWrapperRef.current).width)
    });
    useEffect(() => {
        if (Math.abs(parseInt(maxWidth) - parseInt(width)) <= 5) {
            setTextAreaMode(true)
        } else {
            setTextWidth(getComputedStyle(dummyTextRef.current).width)
            setTextAreaMode(false)
        }
    }, [width]);
    useEffect(() => {
        setFocused(focus)
    }, [focus]);
    useEffect(() => {
        colorizeBorder(divWrapperRef, isValid, isInvalid, focused)
    }, [isValid, isInvalid, focused, swapMode]);
    useEffect(() => {
        console.log('CHANGE POSITION => ' + cursorPosition)
        if (textAreaMode) {
            inputTextAreaRef.current.selectionStart = cursorPosition
            inputTextAreaRef.current.selectionEnd = cursorPosition
        }
        else {
            inputAutoSizeRef.current.children[0].firstChild.selectionStart = cursorPosition
            inputAutoSizeRef.current.children[0].firstChild.selectionEnd = cursorPosition
        }
    }, [cursorPosition])

    return (
        <div className="d-block w-100">
            <div data='wrapper' className={" p-0 border-0"}
                style={{
                    transition: 'all 0.2s ease',
                    border: '1px solid rgb(209, 215, 224)',
                    maxWidth: maxWidth,
                    width: 'fit-content',
                    height: '0px',
                    visibility: 'hidden',
                }}
            >
                <div className={` d-flex flex-nowrap fw-normal form-control whitedisabled border-0 shadow-none `}
                    ref={dummyWrapperRef}
                >
                    {(isInvalid || isValid) &&
                        <div
                            style={{
                                backgroundImage: isInvalid ? imgInvalid : isValid ? imgValid : '',
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "calc(0.75em + 0.55rem) calc(0.75em + 0.55rem)",
                                paddingRight: 'calc(20px + 0.35em)',
                                paddingLeft: '0rem',
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
            <Form onSubmit={(e) => { e.preventDefault() }} key={`f-${id}}`} className='d-flex flex-fill' ref={inputFormRef}>
                {label && <Form.Label className="fw-bolder w-100">{label}</Form.Label>}
                <Form.Group className={'d-flex flex-nowrap p-0 w-100'} style={{ borderRadius: 'inherit' }}
                >
                    <div data='wrapper' ref={divWrapperRef} className={"d-flex justify-content-center p-0 rounded w-100 " + outsideBorder}

                        style={{
                            transition: 'all 0.2s ease',
                            border: '1px solid rgb(209, 215, 224)',
                        }}
                    >
                        <div className={` d-flex flex-nowrap justify-content-center align-items-start
                        flex-fill fw-normal form-control whitedisabled border border-0 shadow-none `}
                            style={{ alignItems: measurement === '' ? 'baseline' : 'inherit', }}
                            onClick={(e) => {
                                if (e.target.name !== 'input-field' && e.target.name !== 'textarea') {
                                    if (!focused) {
                                        !disableFocus && handleFocus()
                                        onFocus && onFocus()
                                    }
                                    setCursorPosition(change.length)
                                    if (textAreaMode) {
                                        inputTextAreaRef.current.focus({ preventScroll: true })
                                        inputTextAreaRef.current.selectionStart = cursorPosition
                                        inputTextAreaRef.current.selectionEnd = cursorPosition
                                    }
                                    else {
                                        inputAutoSizeRef.current.children[0].firstChild.focus({ preventScroll: true })
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
                                        paddingLeft: '0rem',
                                        width: '21px',
                                        height: '21px',
                                    }}></div>}
                            {textAreaMode &&
                                <TextareaAutosize
                                    name="textarea"
                                    ref={inputTextAreaRef}
                                    // autoFocus
                                    maxRows={maxRows}
                                    minRows={1}
                                    // defaultValue={change}
                                    value={change}
                                    onChange={() => { }}

                                    onKeyDown={handleKeyDown}
                                    onPaste={handlePaste}
                                    type={areaType}
                                    required
                                    placeholder={newPlaceholder}
                                    disabled={disabled}
                                    className={`d-flex flex-fill whitedisabled  border border-0 shadow-none form-control p-0 ${textareaClassName}`}
                                    readOnly={readOnly}
                                    onHeightChange={(height, metaData) => handleHeightChange(height, metaData.rowHeight)}
                                    onFocus={(e) => {
                                        !disableFocus && handleFocus()
                                        onFocus && onFocus()
                                        console.log('get ' + e.target.selectionStart)
                                        e.preventDefault();
                                    }}
                                    onBlur={(e) => {
                                        !disableFocus && handleBlur()
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
                                        // defaultValue={change}
                                        value={change}

                                        onChange={() => { }}
                                        onKeyDown={handleKeyDown}
                                        onPaste={handlePaste}
                                        type={areaType}
                                        required
                                        // autoFocus
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
                                            !disableFocus && handleFocus()
                                            onFocus && onFocus()
                                            e.preventDefault();
                                        }}
                                        onBlur={(e) => {
                                            !disableFocus && handleBlur()
                                            onBlur && onBlur()
                                        }}
                                        onKeyPress={e => {
                                            console.log('SELECTION START: ' + e.target.selectionStart)
                                            if (e.key === 'Enter' || e.key.length === 1)
                                                e.preventDefault()
                                            // handleKeyDown(e)    
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
        </div>
    )
}

export const TextAreaGroup = (props) => {
    const { outsideBorder = '', id = 'textareaGroup', data } = props
    const divWrapperRef = useRef()

    const [focused, setFocused] = useState(false)
    const focus = () => setFocused(true)
    const blur = () => setFocused(false)

    useEffect(() => {
        colorizeBorder(divWrapperRef, focused)
    }, [focused]);

    return (
        <div id={id + 'div'} key={id + 'div'} ref={divWrapperRef} className={"d-flex justify-content-center rounded w-100" + outsideBorder}
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
                        key={id + index}
                        id={id + index}
                        type={type}
                        value={value}
                        readOnly={readOnly}
                        onChange={handleChange}
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

