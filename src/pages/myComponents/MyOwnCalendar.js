import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Container, Table } from '@themesberg/react-bootstrap';

import moment, { deprecationHandler } from "moment";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import { HeaderRow } from './MyTableRow';
import { rotateArray, calcIndexedCalendarDays } from './utilities';

export default (props) => {
    const { value } = props
    const date = useSelector(state => state.tourTable.tourDate)
    return (
        <>
            <MonthCalendar
                value={value}
                date={date}
            >
            </MonthCalendar>

            <DayCalendar
                value={value}
                date={date}
            >
            </DayCalendar>
        </>
    )
}
export const DayCalendar = (props) => {

    const { date } = props
    const newDate = moment(date, "MM-YYYY").format("MMMM YYYY")
    const [clickedId, setClickedId] = useState([])
    const [hoveredId, setHoveredId] = useState()
    const labels = rotateArray(moment.weekdays(), 1)
    const headers = labels.map(day => day.substr(0, 2) + '.')
    const tableDays = calcIndexedCalendarDays(date, labels)

    function handleClick(event) {
        if (clickedId.length === 2) {
            setClickedId([])
            setHoveredId()
        }
        else setClickedId([...clickedId, event.target.id].sort((a, b) => parseInt(a.replace('btnDay', '')) - (b.replace('btnDay', ''))))
    }
    function handleMouseOver(event) {
        clickedId.length === 1 && setHoveredId(event.target.id)
    }
    const data = { handleClick, handleMouseOver, clickedId, hoveredId, newDate, headers, tableDays }


    useEffect(() => {
        setClickedId([])
        setHoveredId()
    }, [newDate]);


    return (
        <DumbDayCalendar data={data}></DumbDayCalendar>
    )
}
export const DumbDayCalendar = (props) => {
    const { handleClick, handleMouseOver, clickedId, hoveredId, newDate, headers, tableDays } = props.data

    return (
        <>
            <Card border="light" className="shadow-sm flex-fill" style={{ width: "300px", minWidth: "300px" }}>
                <Card.Body className="px-3">
                    <div className="container-fluid d-flex py-3 px-1 justify-content-center align-items-center">
                        <h5 className="text-center m-0">{newDate}</h5>
                    </div>
                    <Table className="user-table align-items-center">
                        <thead className="thead-light rounded-bottom">
                            <HeaderRow
                                headers={headers}
                            />
                        </thead>
                        <div style={{ height: "15px" }}></div>
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
            const id = `btnDay` + c
            if (day === ' ')
                return (
                    <td className="border-0 p-1" key={id}></td>
                )
            else {
                const from = clickedId[0] && parseInt(clickedId[0].replace('btnDay', ''))
                const toClick = clickedId[1] && parseInt(clickedId[1].replace('btnDay', ''))
                const toHover = hoveredId && parseInt(hoveredId.replace('btnDay', ''))
                const variant = c === from ? 'primary'
                    : c === toClick ? 'primary'
                        : toClick && from && c < toClick && c > from ? 'success'
                            : toHover && from && c >= toHover && c < from ? 'danger'
                                : toHover && from && c <= toHover && c > from ? 'danger'
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
    const newDate = moment(date, "MM-YYYY").format("YYYY")

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
        return moment().month(month).format('MM') === moment(date, 'MM-YYYY').format('MM') ? 'primary' : 'light'
    }
    const data = { handlerYearChange, handlerMonthChange, colorize, newDate }
    return (
        <>
        <BaseMonthCalendar data={data} ></BaseMonthCalendar>
            {/* <Card border="light" className="shadow-sm flex-fill my-2" style={{ width: "250px", minWidth: "250px" }}>
                <Card.Header>
                    <div className="container-fluid d-flex p-1 justify-content-between align-items-center">
                        <Button variant="light" onClick={() => handlerYearChange(-1)}>{`<`}</Button>
                        <h5 className="text-center m-0">{newDate}</h5>
                        <Button variant="light" onClick={() => handlerYearChange(1)}>{`>`}</Button>
                    </div>

                </Card.Header>
                <Card.Body>
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
            </Card> */}

        </>
    )
}
export const BaseMonthCalendar = (props) => {
    const { handlerYearChange, handlerMonthChange, colorize, newDate } = props.data
    return (
        <>
            <Card border="light" className="shadow-sm flex-fill my-2" style={{ width: "250px", minWidth: "250px" }}>
                <Card.Header>
                    <div className="container-fluid d-flex p-1 justify-content-between align-items-center">
                        <Button variant="light" onClick={() => handlerYearChange(-1)}>{`<`}</Button>
                        <h5 className="text-center m-0">{newDate}</h5>
                        <Button variant="light" onClick={() => handlerYearChange(1)}>{`>`}</Button>
                    </div>

                </Card.Header>
                <Card.Body>
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
        <>
            <Button
                variant="white"
                style={{ padding: "0.25rem" }}
            >
                <h5
                    className="m-0"
                >
                    {value}
                </h5>
            </Button>
        </>
    )
}