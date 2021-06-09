import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Container, Table, Dropdown, Row } from '@themesberg/react-bootstrap';

import moment from "moment";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import { HeaderRow } from './MyTableRow';
import { rotateArray, calcIndexedCalendarDays } from './utilities';
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MyTextArea from './MyTextArea';

export const HourSelectorDropdown = (props) => {
    const { value=moment('00:00', 'HH:mm').format('HH:mm'), id = 'hourSelector', onChange, minWidth} = props
    const date = useSelector(state => state.tourTable.tourDate)
    const [text, setText] = useState(value)


    console.log('value '+ value)
    console.log('isvalid eksw ' +moment(value, 'HH:mm', true).isValid())
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
                        id={'hourselector'+id}
                        type='time'
                        value={text}
                        invalidation={true}
                        readOnly
                        minWidth={"130px"}
                    />
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-0">
                    <HourSelector
                        time={value}
                        onChange={handleHourChange}
                    >
                    </HourSelector>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export const HourSelector = (props) => {
const { time=moment('00:00, HH:mm').format('HH:mm'), onChange} = props
const [currentTime, setCurrentTime] = useState(moment(time, 'HH:mm').isValid() && time)
const currentHour = parseInt(moment(currentTime, 'HH:mm').format('HH'))
const currentMinute = parseInt(moment(currentTime, 'HH:mm').format('mm'))

function handleButtonClicks(event){
    const id = event.currentTarget.id
    console.log(currentHour)
    switch (id) {
        case 'incr_hour': {
            return currentHour === 23 ?
                setCurrentTime(moment('00' + ':' + currentMinute, 'HH:mm').format('HH:mm')) :
                setCurrentTime(moment((currentHour + 1) + ':' + currentMinute, 'HH:mm').format('HH:mm'))
        }
        case 'decr_hour': {
            return currentHour === 0 ?
                setCurrentTime(moment('23' + ':' + currentMinute, 'HH:mm').format('HH:mm')) :
                setCurrentTime(moment((currentHour - 1) + ':' + currentMinute, 'HH:mm').format('HH:mm'))
        }
        case 'incr_min': {
            return currentMinute === 59 ?
                setCurrentTime(moment(currentHour + ':' + '00', 'HH:mm').format('HH:mm')) :
                setCurrentTime(moment(currentHour + ':' + (currentMinute + 1), 'HH:mm').format('HH:mm'))
        }
        case 'decr_min': {
            return currentMinute === 0 ?
                setCurrentTime(moment(currentHour + ':' + '59', 'HH:mm').format('HH:mm')) :
                setCurrentTime(moment(currentHour + ':' + (currentMinute - 1), 'HH:mm').format('HH:mm'))
        }
    }
}
function handleHourTextAreaChange(value){
    const v = value === '' ? '00' : value
    console.log('allaxe hour area')
    // console.log(parseInt(value))
    setCurrentTime(moment(v  +':'+ currentMinute, 'HH:mm').format('HH:mm'))
}
function handleMinTextAreaChange(value){
    const v = value === '' ? '00' : value
    console.log('allaxe min area')
    console.log(currentHour +':'+ v)
    setCurrentTime(moment(currentHour +':'+ v, 'HH:mm').format('HH:mm'))
}
useEffect(() => {
    console.log('currTime: '+currentTime)
    onChange(currentTime)
}, [currentTime]);
const data = {currentTime, handleButtonClicks, handleHourTextAreaChange, handleMinTextAreaChange}
return(
    <DumbHourSelector data={data}></DumbHourSelector>
)
}

export const DumbHourSelector = (props) => {
    const { currentTime, handleButtonClicks, handleHourTextAreaChange, handleMinTextAreaChange } = props.data
    const time = moment(currentTime, 'HH:mm')
    const availableHours = [...Array(24).keys()]
    const availableMinutes = [...Array(60).keys()]
    return (
        <>
            <Card border="light" className="shadow-sm flex-fill" style={{ width: "300px", minWidth: "300px" }}>
                <Card.Body className="px-0">
                    <div className="container">
                        <div className="d-flex  container-fluid p-0">
                            <div className="d-flex col-5">
                                <span className="flex-fill"></span>
                                <Button id="incr_hour" onClick={handleButtonClicks} className="text-center  flex-fill text-nowrap noboxshadow p-0" variant="white"><FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon></Button>
                                <span className=" flex-fill"></span>
                            </div>
                            <div className="d-flex col-2"></div>
                            <div className="d-flex col-5">
                                <span className="flex-fill"></span>
                                <Button id="incr_min" onClick={handleButtonClicks} className="text-center flex-fill text-nowrap noboxshadow p-0" variant="white"><FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon></Button>
                                <span className="flex-fill"></span>
                            </div>
                        </div>
                        <div className="d-flex  container-fluid py-2 p-0">
                            <MyTextArea value={time.format('HH')} availableValues={availableHours} type="hour" onChange={handleHourTextAreaChange} rows={1} minWidth="50px" className="text-center m-0 col-5 text-nowrap" />
                            <h5 className="text-center m-0 col-2 d-flex justify-content-center align-items-center">{':'}</h5>
                            <MyTextArea value={time.format('mm')} availableValues={availableMinutes} type="minute" onChange={handleMinTextAreaChange} rows={1} minWidth="50px" className="text-center m-0 col-5 text-nowrap" />
                        </div>

                        <div className="d-flex  container-fluid p-0">
                            <div className="d-flex col-5">
                                <span className="flex-fill"></span>
                                <Button id="decr_hour" onClick={handleButtonClicks} className="text-center  flex-fill text-nowrap noboxshadow p-0" variant="white"><FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon></Button>
                                <span className=" flex-fill"></span>
                            </div>
                            <div className="d-flex col-2"></div>
                            <div className="d-flex col-5">
                                <span className="flex-fill"></span>
                                <Button id="decr_min" onClick={handleButtonClicks} className="text-center flex-fill text-nowrap noboxshadow p-0" variant="white"><FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon></Button>
                                <span className="flex-fill"></span>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
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
    const { value, id = 'dateSelector', enabled = 'true', onChange } = props
    const date = useSelector(state => state.tourTable.tourDate)
    const [text, setText] = useState(value)
    function handleDateChange(value) {
        setText(value)
    }
    function handleTextAreaChange(value) {
        setText(value)
    }

    useEffect(() => {
        moment(text, "DD/MM/YYYY", true).isValid() && onChange(text)
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
                        onChange={handleTextAreaChange}
                        // errorMessage={'Invalid Date (DD/MM/YYYY)'}
                        minWidth={"150px"}
                    />
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-0">
                    <DayCalendar
                        singleDate
                        month={moment(value, 'DD/MM/YYYY').format('MM/YYYY')}
                        onChange={handleDateChange}
                        value={text}
                    >
                    </DayCalendar>
                </Dropdown.Menu>
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
    const date = moment(clickedId[0] + '/' + currentMonth, "DD/MM/YYYY").format("DD/MM/YYYY")
    useEffect(() => {
        if (singleDate) {
            onChange && moment(date, "DD/MM/YYYY", true).isValid() && onChange(date)
        }
    }, [date]);

    useEffect(() => {
        if (!singleDate) {
            setClickedId([])
            setHoveredId()
            setCurrentMonth(moment(month, "MM/YYYY"))
        } else {
            moment(month, "MM/YYYY", true).isValid() && setCurrentMonth(moment(month, "MM/YYYY"))
        }

    }, [month]);
    useEffect(() => {
        if (moment(value, "DD/MM/YYYY", true).isValid()) {
            setClickedId([parseInt(moment(value, "DD/MM/YYYY").format('DD'))])
            setCurrentMonth(moment(value, "DD/MM/YYYY").format('MM/YYYY'))
        }
        else {
            setClickedId([])
        }
    }, [value]);


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