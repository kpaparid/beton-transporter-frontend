import React from "react";
import MyCheckbox from "./MyCheckbox";
import MyCalendar from "./MyCalendar";
import moment from "moment";
import { useSelector } from 'react-redux';
import { Dropdown } from '@themesberg/react-bootstrap';

export default (props) => {
    const { index, labels, labelId, data } = props
    function selectorMenu(state) {
        const { shownId, byId } = state.tourTable;
        return [...new Set(shownId.map(tour => byId[tour].datum))]
    }
    if (labels.filterType === 'checkbox') {
        return (
            <Dropdown.Menu className="dropdown-menu-right">
                <MyCheckbox
                    index={index}
                    labels={labels}
                    data={data}
                />
            </Dropdown.Menu>
        )
    }
    if (labels.filterType === 'range') {
        return (
            <Dropdown.Menu className="dropdown-menu-right">
                <MyCheckbox
                    labels={labels}
                    data={data}
                />
            </Dropdown.Menu>
        )
    }
    if (labels.filterType === 'date') {
        const tourDate = useSelector(state => state.tourTable.tourDate)
        const availableDates = useSelector(selectorMenu)
        return (
            <Dropdown.Menu className="dropdown-menu-right">
                <MyCalendar
                    month={tourDate}
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