import React from "react";
import MyCheckbox from "./MyCheckbox";
import MyCalendar from "./MyCalendar";
import moment from "moment";
import { useSelector } from 'react-redux';
import { Dropdown } from '@themesberg/react-bootstrap';

export default (props) => {
    const { index, transactionsTable, labels } = props
    function selectorMenu(state) {
        const { transactionsDate, transactionsTable } = state;
        const table = new Set()
        const selectedMonth = moment(transactionsDate, 'MM').format('MM.YYYY')
        transactionsTable.forEach((row, index) => {
            const date = moment(transactionsTable[index].datum, 'DD.MM.YYYY')
            if (selectedMonth === date.format('MM.YYYY')) {
                table.add(date.format('YYYY-MM-DD'))
            }
        });
        return [...table];
    }
    if (labels.filterType === 'checkbox') {
        return (
            <Dropdown.Menu className="dropdown-menu-right">
                <MyCheckbox
                    index={index}
                    transactionsTable={transactionsTable}
                    labels={labels}
                />
            </Dropdown.Menu>
        )
    }
    if (labels.filterType === 'range') {
        return (
            <Dropdown.Menu className="dropdown-menu-right">
                <MyCheckbox
                    labels={labels}
                />
            </Dropdown.Menu>
        )
    }
    if (labels.filterType === 'date') {
        const transactionsDate = useSelector(state => state.transactionsDate)
        const availableDates = useSelector(selectorMenu)
        return (
            <Dropdown.Menu className="dropdown-menu-right">
                <MyCalendar
                    month={transactionsDate}
                    availableDates={availableDates}
                />
            </Dropdown.Menu>
        )
    }
    else if(labels.filterType === 'none') {
        return (<></>)
    }
    return (<></>)

}