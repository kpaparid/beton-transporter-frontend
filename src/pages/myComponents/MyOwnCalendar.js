import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Container, Table, Dropdown, Row } from '@themesberg/react-bootstrap';

import moment from "moment";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import { HeaderRow } from './MyTableRow';
import { rotateArray, calcIndexedCalendarDays } from './utilities';
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faCalendar, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyTextArea, TextAreaGroup } from './MyTextArea';
import { Portal } from 'react-portal';


export const DurationDropdownSelector = (props) => {
    const { format = 'H[h] mm[m]', value = moment('0h 00m', format).format(format),
        id = 'timeSelector', onChange, minWidth, seperator = ' ', isLimited = true,
        disabledHours = false, disabledMinutes = false,
        validation = false, invalidation = false } = props
    const [text, setText] = useState(value)
    const splitText = text.split(seperator)

    const formattedText = (disabledMinutes && disabledHours) ? '0' + seperator + '0' : disabledHours ? parseInt(text) : disabledMinutes ?
        parseInt(text) : parseInt(splitText[0]) + seperator + parseInt(splitText[1])

    console.log('value ' + value)
    console.log('formatted: ' + formattedText)
    function handleHourChange(value) {
        console.log('value eksw' + value)
        setText(value)
        console.log(formattedText)
    }
    useEffect(() => {
        onChange && onChange(text)
    }, [text]);

    function handleChange(text) {
        console.log('eksw ' + text)
        setText(text)
    }
    // const id, type, minWidth, readOnly, validation, invalidation, measurement, maxRows, onChange, values

    const data1 = {
        id: 'hour', type: 'hour', minWidth: '40px', readOnly: false, 'validation': false,
        'invalidation': false, measurement: 'hours', maxRows: 2, onChange: handleChange, 'value': formattedText
    }
    const data2 = {
        id: 'minute', type: 'minute', minWidth: '40px', readOnly: false, 'validation': false,
        'invalidation': false, measurement: 'min', maxRows: 2, onChange: handleChange, 'value': formattedText
    }
    const data = [data1, data2]
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle split variant="white" className="p-0 border-0 d-flex flex-nowrap">
                    <TextAreaGroup
                        data={data}
                    />
                </Dropdown.Toggle>
                {(!disabledMinutes && !disabledHours) &&
                    <Portal>
                        <Dropdown.Menu className="p-0">
                            <DurationSelector
                                time={text}
                                onChange={handleHourChange}
                                seperator={seperator}
                                isLimited={isLimited}
                                disabledHours={disabledHours}
                                disabledMinutes={disabledMinutes}
                            >
                            </DurationSelector>
                        </Dropdown.Menu>
                    </Portal>
                }
            </Dropdown>
        </>
    )
}

export const DurationSelector = (props) => {

    const { seperator = ' ', time = '00' + seperator + '00', onChange, isLimited = false, disabledHours = false, disabledMinutes = false } = props
    const [currentTime, setCurrentTime] = useState(time)

    const currentHour = !disabledHours &&
        (!disabledHours && !disabledMinutes ?
            parseInt(currentTime.split(seperator)[0])
            : parseInt(currentTime))
    const currentMinute = !disabledMinutes &&
        (!disabledHours && !disabledMinutes ?
            parseInt(currentTime.split(seperator)[1])
            : parseInt(currentTime))

    function handleButtonClicks(event) {
        const id = event.currentTarget.id
        switch (id) {
            case 'incr_hour': {
                return currentHour === 23 && isLimited ?
                    setCurrentTime('00' + (!disabledMinutes ? (seperator + currentMinute) : '')) :
                    setCurrentTime((currentHour + 1) + (!disabledMinutes ?
                        (seperator + currentMinute) : ''))
            }
            case 'decr_hour': {
                return currentHour === 0 && isLimited ?
                    setCurrentTime('23' + (!disabledMinutes ? (seperator + currentMinute) : '')) :
                    setCurrentTime((currentHour - 1) + (!disabledMinutes ?
                        (seperator + currentMinute) : ''))
            }
            case 'incr_min': {
                return currentMinute === 59 && isLimited ?
                    setCurrentTime((!disabledHours ? (currentHour + seperator) : '') + '00') :
                    setCurrentTime((!disabledHours ?
                        (currentHour + seperator) : '') + (currentMinute + 1))
            }
            case 'decr_min': {
                return currentMinute === 0 && isLimited ?
                    setCurrentTime((!disabledHours ? (currentHour + seperator) : '') + '59') :
                    setCurrentTime((!disabledHours ?
                        (currentHour + seperator) : '') + (currentMinute - 1))
            }
        }
    }
    function handleHourTextAreaChange(value) {
        const v = value === '' ? '00' : value
        setCurrentTime(v + (!disabledMinutes ? (seperator + currentMinute) : ''))
    }
    function handleMinTextAreaChange(value) {
        const v = value === '' ? '00' : value
        console.log(currentHour + seperator + v)
        setCurrentTime((!disabledHours ? (currentHour + seperator) : '') + v)
    }
    useEffect(() => {
        console.log('......................')
        console.log('currTime: ' + currentTime)
        console.log('currentHour: ' + currentHour)
        console.log('currentMinute: ' + currentMinute)
        onChange && onChange(currentTime)
    }, [currentTime]);

    const availableMinutes = isLimited && [...Array(60).keys()]
    const availableHours = isLimited && [...Array(24).keys()]
    const data = {
        handleButtonClicks, availableMinutes, availableHours, handleHourTextAreaChange,
        handleMinTextAreaChange, currentHour, currentMinute, disabledHours, disabledMinutes, seperator,
    }
    return (
        <DumbHourSelector data={data}></DumbHourSelector>
    )

}

export const HourSelectorDropdown = (props) => {
    const { format = 'HH:mm', value = moment('00:00', format).format(format), id = '1', onChange, minWidth } = props
    const date = useSelector(state => state.tourTable.tourDate)
    const [text, setText] = useState(value)


    console.log('value ' + value)
    console.log('isvalid eksw ' + moment(value, format, true).isValid())
    function handleHourChange(value) {
        console.log('value eksw')
        setText(value)
    }


    useEffect(() => {
        onChange && moment(text, "HH:mm", true).isValid() && onChange(text)
    }, [text]);

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle split variant="white" className="p-0 border-0">
                    <MyTextArea
                        id={'hourselector' + id}
                        type='time'
                        value={text}
                        invalidation={true}
                        readOnly
                        minWidth={minWidth}
                    />
                </Dropdown.Toggle>
                <Portal>
                    <Dropdown.Menu className="p-0">
                        <HourSelector
                            time={value}
                            onChange={handleHourChange}
                            format={format}
                        >
                        </HourSelector>
                    </Dropdown.Menu>
                </Portal>
            </Dropdown>
        </>
    )
}

export const HourSelector = (props) => {
    const { format = 'HH:mm', time = moment('00:00, ' + format).format(format), onChange } = props

    const [currentTime, setCurrentTime] = useState(moment(time, format).isValid() && time)
    const currentHour = parseInt(moment(currentTime, format).format('HH'))
    const currentMinute = parseInt(moment(currentTime, format).format('mm'))

    function handleButtonClicks(event) {
        const id = event.currentTarget.id
        console.log(currentHour)
        switch (id) {
            case 'incr_hour': {
                return currentHour === 23 ?
                    setCurrentTime(moment('00' + ':' + currentMinute, format).format(format)) :
                    setCurrentTime(moment((currentHour + 1) + ':' + currentMinute, format).format(format))
            }
            case 'decr_hour': {
                return currentHour === 0 ?
                    setCurrentTime(moment('23' + ':' + currentMinute, format).format(format)) :
                    setCurrentTime(moment((currentHour - 1) + ':' + currentMinute, format).format(format))
            }
            case 'incr_min': {
                return currentMinute === 59 ?
                    setCurrentTime(moment(currentHour + ':' + '00', format).format(format)) :
                    setCurrentTime(moment(currentHour + ':' + (currentMinute + 1), format).format(format))
            }
            case 'decr_min': {
                return currentMinute === 0 ?
                    setCurrentTime(moment(currentHour + ':' + '59', format).format(format)) :
                    setCurrentTime(moment(currentHour + ':' + (currentMinute - 1), format).format(format))
            }
        }
    }
    function handleHourTextAreaChange(value) {
        const v = value === '' ? '00' : value
        console.log('allaxe hour area')
        setCurrentTime(moment(v + ':' + currentMinute, format).format(format))
    }
    function handleMinTextAreaChange(value) {
        const v = value === '' ? '00' : value
        console.log('allaxe min area')
        console.log(currentHour + ':' + v)
        setCurrentTime(moment(currentHour + ':' + v, format).format(format))
    }
    useEffect(() => {
        console.log('currTime: ' + currentTime)
        onChange && onChange(currentTime)
    }, [currentTime]);

    const availableMinutes = [...Array(60).keys()]
    const availableHours = [...Array(24).keys()]
    const data = { currentHour, currentMinute, availableMinutes, availableHours, handleButtonClicks, handleHourTextAreaChange, handleMinTextAreaChange, availableMinutes, availableHours }
    return (
        <DumbHourSelector data={data}></DumbHourSelector>
    )
}

export const DumbHourSelector = (props) => {
    const { format = 'HH:mm', currentHour, currentMinute, seperator, handleButtonClicks, disabledHours = false, disabledMinutes = false,
        handleHourTextAreaChange, handleMinTextAreaChange, width = "250px", minWidth = "80px", height = "100px" } = props.data
    const { availableMinutes, availableHours } = props.data
    console.log('curH' + currentHour)
    console.log('curM' + currentMinute)



    return (
        <>
            <Card border="light"
                className="shadow-sm flex-fill"
                style={{ maxWidth: width, minWidth: minWidth }}>
                <Card.Body className="px-1 py-2">
                    <div className="container p-1 d-flex">
                        {!disabledHours &&
                            <HourComponent value={currentHour}
                                availableValues={availableHours}
                                onChange={handleHourTextAreaChange}
                                onClick={handleButtonClicks}>
                            </HourComponent>}
                        {!disabledHours && !disabledMinutes && <Seperator value={seperator}></Seperator>}
                        {!disabledMinutes &&
                            <MinuteComponent value={currentMinute}
                                availableValues={availableMinutes}
                                onChange={handleMinTextAreaChange}
                                onClick={handleButtonClicks}>
                            </MinuteComponent>}
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
function HourComponent(props) {
    const { onChange, value, onClick, availableValues } = props
    console.log(value)
    if (!isNaN(value))
        return (
            <>
                <div className="container-fluid px-2 justify-content-center" style={{ width: '120px' }}>
                    <div className="d-flex py-1">
                        <span className="flex-fill"></span>
                        <Button id="incr_hour"
                            style={{ width: '30px' }}
                            onClick={onClick}
                            className="text-center  flex-fill text-nowrap noboxshadow p-0"
                            variant="white">
                            <FontAwesomeIcon className='mt-2' icon={faSortUp}></FontAwesomeIcon>
                        </Button>
                        <span className=" flex-fill"></span>
                    </div>
                    <div className="d-flex py-1 justify-content-center">
                        <MyTextArea measurement="hour"
                            value={value}
                            availableValues={availableValues}
                            type="hour"
                            onChange={onChange} rows={1}
                            minWidth="50px"
                            className="text-end m-0 text-nowrap pe-1" />
                    </div>
                    <div className="d-flex py-1">
                        <span className="flex-fill"></span>
                        <Button id="decr_hour"
                            style={{ width: '30px' }}
                            onClick={onClick}
                            className="text-center  flex-fill text-nowrap noboxshadow p-0"
                            variant="white">
                            <FontAwesomeIcon className='mt-2' icon={faSortDown}></FontAwesomeIcon>
                        </Button>
                        <span className=" flex-fill"></span>
                    </div>
                </div>
            </>
        )
    return <></>
}
function Seperator(props) {
    const value = props.value
    if (value) return (
        <>
            <div className="container-fluid px-2 py-0 justify-content-center d-flex">
                <h5 className="text-center m-0  d-flex justify-content-center align-self-center">{value}</h5>

            </div>
        </>)
    return <></>
}
function MinuteComponent(props) {
    const { onChange, value, onClick, availableValues } = props
    if (!isNaN(value)) return (
        <>
            <div className="container-fluid px-2 py-0 justify-content-center" style={{ width: '120px' }}>
                <div className="d-flex py-1">
                    <span className="flex-fill"></span>
                    <Button id="incr_min"
                        style={{ width: '30px' }}
                        onClick={onClick}
                        className="text-center  flex-fill text-nowrap noboxshadow p-0"
                        variant="white">
                        <FontAwesomeIcon className='mt-2' icon={faSortUp}></FontAwesomeIcon>
                    </Button>
                    <span className=" flex-fill"></span>
                </div>
                <div className="d-flex py-1 justify-content-center">
                    <MyTextArea measurement="min"
                        value={value}
                        availableValues={availableValues}
                        type="minute"
                        onChange={onChange}
                        rows={1} minWidth="50px"
                        className="text-end m-0 text-nowrap pe-1 " />
                </div>
                <div className="d-flex py-1">
                    <span className="flex-fill"></span>
                    <Button id="decr_min"
                        style={{ width: '30px' }}
                        onClick={onClick}
                        className="text-center  flex-fill text-nowrap noboxshadow p-0"
                        variant="white">
                        <FontAwesomeIcon className='mt-2' icon={faSortDown}></FontAwesomeIcon>
                    </Button>
                    <span className=" flex-fill"></span>
                </div>
            </div>
        </>
    )
    return <></>
}


export const MonthSelectorDropdown = (props) => {
    const { value } = props
    const date = useSelector(state => state.tourTable.tourDate)

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle split variant="light">
                    <h5 className="m-0">{value}</h5>
                </Dropdown.Toggle>

                <Dropdown.Menu className="p-0">
                    <MonthCalendar
                        value={value}
                        date={date}
                    >
                    </MonthCalendar>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}
export const DateSelectorDropdown = (props) => {
    const { value, id = 'dateSelector', onChange } = props
    const [text, setText] = useState(value)

    const day = moment(text, 'DD/MM/YYYY').isValid && text
    function handleChange(value) {
        console.log('ON CHANGE DROPDOWN')
        setText(value)
    }

    useEffect(() => {
        
        console.log('ON CHANGE DROPDOWN: '+value)
        onChange(text)
    }, [text]);

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle split variant="white" className="p-0 border-0">
                    <MyTextArea
                        id={id}
                        type='date'
                        value={text}
                        invalidation={true}
                        onChange={handleChange}
                        // errorMessage={'Invalid Date (DD/MM/YYYY)'}
                        minWidth={"150px"}
                        digitsSeperator='/'
                        seperatorAt={[2,4]}
                        // digits={8}
                    />
                </Dropdown.Toggle>
                <Portal>
                    <Dropdown.Menu className="p-0">
                        <DayCalendar
                            singleDate
                            month={moment(value, 'DD/MM/YYYY').format('MM/YYYY')}
                            onChange={handleChange}
                            
                            value={text}
                        >
                        </DayCalendar>
                    </Dropdown.Menu>
                </Portal>
            </Dropdown>
        </>
    )
}
export const DayCalendar = (props) => {


    const { month = moment().format("MM/YYYY"), singleDate = false, onChange, value, disableMonthSwap = false } = props
    const [currentMonth, setCurrentMonth] = useState(moment(month, "MM/YYYY"))
    const newDate = moment(currentMonth, "MM/YYYY").format("MMMM YYYY")
    const [clickedId, setClickedId] = useState(moment(value, "DD/MM/YYYY", true).isValid() ? [parseInt(moment(value, "DD/MM/YYYY").format("DD"))] : [])
    const [hoveredId, setHoveredId] = useState()
    const labels = rotateArray(moment.weekdays(), 1)
    const headers = labels.map(day => day.substr(0, 2) + '.')
    const tableDays = calcIndexedCalendarDays(currentMonth, labels)
    const data = {
        handleClick, handleMouseOver, clickedId,
        hoveredId, newDate, headers, tableDays, disableMonthSwap, handleIncrementMonth, handleDecrementMonth
    }
    
    useEffect(() => {
        console.log('changed month: '+month)
        if (!singleDate) {
            setClickedId([])
            setHoveredId()
            setCurrentMonth(moment(month, "MM/YYYY"))
        } else {
            moment(month, "MM/YYYY", true).isValid() && setCurrentMonth(moment(month, "MM/YYYY"))
        }
    }, [month]);

    useEffect(() => {
        console.log('changed value: ' + value) 
        if (moment(value, "DD/MM/YYYY", true).isValid()) {
            console.log('?????????????????????????????? VALID')
            console.log('?????????????????????????????? '+moment(value, "DD/MM/YYYY").format('DD'))
            setClickedId([parseInt(moment(value, "DD/MM/YYYY").format('DD'))])
            setCurrentMonth(moment(value, "DD/MM/YYYY").format('MM/YYYY'))
        }
        else {
            
            console.log('********************** INVALID')
            setClickedId([])
        }
    }, [value]);
    useEffect(() => {
        console.log('clicked Day: '+clickedId[0])
    }, [clickedId]);
    useEffect(() => {
        console.log('current Month: '+currentMonth)
    }, [currentMonth]);
    const date = clickedId.length>0 && clickedId[0] + '/' + currentMonth
    useEffect(() => {
        console.log('changed date: '+date)
        if (singleDate) {
            onChange && moment(date, "DD/MM/YYYY", true).isValid() && onChange(date)
        }
    }, [date]);

    function handleIncrementMonth() {
        setCurrentMonth(moment(currentMonth, "MM/YYYY").add(1, 'M').format("MM/YYYY"))
    }
    function handleDecrementMonth() {
        setCurrentMonth(moment(currentMonth, "MM/YYYY").add(1, 'M').format("MM/YYYY"))
    }
    function handleClick(event) {
        const id = parseInt(event.target.id.replace('Btn', ''))
        if (singleDate && clickedId.length === 1) {
            setClickedId([id])
        }
        else if (!singleDate && clickedId.length === 2) {
            setClickedId([])
            setHoveredId()
        }
        else if (!singleDate && clickedId.length === 1 && clickedId[0] === id) {
            setClickedId([])
            setHoveredId()
        }
        else setClickedId([...clickedId, id]
            .sort((a, b) => a - b)
        )
    }
    function handleMouseOver(event) {
        const id = parseInt(event.target.id.replace('Btn', ''))
        !singleDate && clickedId.length === 1 && setHoveredId(id)
    }

    return (
        <DumbDayCalendar data={data}></DumbDayCalendar>
    )
}
const DumbDayCalendar = (props) => {
    const { handleClick, handleMouseOver, clickedId, hoveredId, newDate, headers, tableDays, disableMonthSwap, handleIncrementMonth, handleDecrementMonth } = props.data

    return (
        <>
            <Card border="light" className="shadow-sm flex-fill" style={{ width: "300px", minWidth: "300px" }}>
                <Card.Body className="px-3">
                    <div className="container-fluid d-flex py-3 px-1 justify-content-around align-items-center">
                        {!disableMonthSwap && <Button onClick={handleIncrementMonth} size="sm"><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></Button>}
                        <h5 className="text-center m-0">{newDate}</h5>
                        {!disableMonthSwap && <Button onClick={handleDecrementMonth} size="sm"><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></Button>}
                    </div>
                    <Table className="user-table align-items-center">
                        <thead className="thead-light rounded-bottom">
                            <HeaderRow
                                headers={headers}
                            />
                        </thead>
                        <tbody>
                            {
                                tableDays.map((row, index) => {
                                    return <tr className="p-0 align-items-center" key={row + index}>
                                        <TableRow
                                            data={row}
                                            index={index}
                                            onClick={handleClick}
                                            onMouseOver={handleMouseOver}
                                            clickedId={clickedId}
                                            hoveredId={hoveredId}
                                        >
                                        </TableRow>
                                    </tr>
                                }
                                )
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    )
}
const TableRow = (props) => {
    const { data, onClick, onMouseOver, clickedId, hoveredId, index } = props
    return (
        data.map((day, i) => {
            const c = index * 7 + i
            if (day === ' ')
                return (
                    <td className="border-0 p-1" key={'empty' + index * 7 + i}></td>
                )
            else {

                const id = 'Btn' + day
                const from = clickedId[0]
                const toClick = clickedId[1]
                const toHover = hoveredId
                const variant = day === from ? 'primary'
                    : day === toClick ? 'primary'
                        : toClick && from && day < toClick && day > from ? 'success'
                            : toHover && from && day >= toHover && day < from ? 'danger'
                                : toHover && from && day <= toHover && day > from ? 'danger'
                                    : 'light'
                return (
                    <td className="border-0 p-1 justify-content-center" key={id}>
                        <DayButton
                            id={id}
                            variant={variant}
                            onClick={onClick}
                            onMouseOver={onMouseOver}
                            value={day}
                        />
                    </td>
                )
            }
        })
    )
}

export const DayButton = (props) => {
    const { value, variant, day, onClick, onMouseOver, id } = props
    return (
        <>
            <Button
                disabled={day === ' '}
                style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: 0,
                }}
                size="sm"
                value={day}
                id={id}
                variant={variant}
                onClick={onClick}
                onMouseOver={onMouseOver}
                className="text-center p-0"
            >{value}</Button>

        </>
    )
}
export const MonthCalendar = (props) => {
    const { value, date } = props
    const newDate = moment(date, "MM/YYYY").format("YYYY")

    const dispatch = useDispatch();
    function handlerMonthChange(month) {
        dispatch({
            type: ACTIONS.TOURTABLE_CHANGE_TOURDATE,
            payload: {
                month: month,
            }
        });
    }
    function handlerYearChange(yearIncrement) {
        dispatch({
            type: ACTIONS.TOURTABLE_CHANGE_TOURDATE,
            payload: {
                yearIncrement: yearIncrement,
            }
        });
    }
    function colorize(month) {
        return moment().month(month).format('MM') === moment(date, 'MM/YYYY').format('MM') ? 'primary' : 'light'
    }
    const data = { handlerYearChange, handlerMonthChange, colorize, newDate }
    return (
        <>
            <BaseMonthCalendar data={data} ></BaseMonthCalendar>
        </>
    )
}
export const BaseMonthCalendar = (props) => {
    const { handlerYearChange, handlerMonthChange, colorize, newDate } = props.data
    return (
        <>
            <Card border="light" className="shadow-sm flex-fill" style={{ width: "250px", minWidth: "250px" }}>
                <Card.Body>
                    <div className="container-fluid d-flex p-1 pb-3 justify-content-between align-items-center">
                        <Button variant="light" onClick={() => handlerYearChange(-1)}>{`<`}</Button>
                        <h5 className="text-center m-0">{newDate}</h5>
                        <Button variant="light" onClick={() => handlerYearChange(1)}>{`>`}</Button>
                    </div>
                    <div className="d-flex flex-wrap">
                        {moment.monthsShort().map((month, index) => {
                            return <div className="col-4 text-center text-nowrap" key={index}>
                                <MonthButton
                                    value={month}
                                    onClick={() => handlerMonthChange(month)}
                                    variant={colorize(month)}
                                ></MonthButton>
                            </div>
                        })}
                    </div>
                </Card.Body>
            </Card>

        </>
    )
}
export const MonthButton = (props) => {
    const { value, onClick, variant } = props
    return (
        <>
            <div className="fluid-container p-1">
                <Button
                    className="w-100"
                    variant={variant}
                    onClick={onClick}
                >{value}</Button>
            </div>
        </>
    )
}


export const CalendarButton = (props) => {
    const { value } = props

    return (
        <Button
            variant="white"
            style={{ padding: "0.25rem" }}
        >
            <h5 className="m-0">
                {value}
            </h5>
        </Button>
    )
}