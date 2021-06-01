import React from "react";

import { DateRangePicker } from "react-dates";

import { useState } from 'react';
import moment from "moment";

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';

import "react-dates/initialize";
import 'moment/locale/de'


export default (props) => {

    const { month, availableDates } = props
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [focusedInput, setFocusedInput] = useState();
    console.log(availableDates)
    // const isOutsideRange = day => day.isAfter(moment()) || day.isBefore(moment().subtract(31, "days"));
    const isOutsideRange = day => day.isBefore(moment(month, 'M').subtract(31, "days"));

    return (
        <div>
            <DateRangePicker
                startDatePlaceholderText="Start Date"
                endDatePlaceholderText="End Date"
                regular
                block
                showClearDates
                reopenPickerOnClearDates
                navNext={<div></div>}
                navPrev={<div></div>}
                hideKeyboardShortcutsPanel
                isOutsideRange={isOutsideRange}
                initialVisibleMonth={() => moment(month, 'MM-YYYY')}
                numberOfMonths={1}
                noBorder
                startDate={startDate}
                startDateId="start-date"
                endDate={endDate}
                endDateId="end-date"
                // minimumNights={0}
                onDatesChange={({ startDate, endDate }) => {
                    setStartDate(startDate);
                    setEndDate(endDate);
                }}
                focusedInput={focusedInput}
                keepOpenOnDateSelect
                onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
                isDayBlocked={day => {
                    if (availableDates
                        .findIndex(date => day.format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) === -1){
                        return true
                    }
                    return false;
                }
                }
            // renderMonthElement={({ month }) => moment(month).locale('de').format('MMMM YYYY')}
            // renderMonthText={month => {
            //         moment.locale('de')
            //       moment(month).format('M')

            //   }}


            // renderCalendarInfo={(props) => {
            //     return (
            //         <div >
            //             Apply
            //         </div>
            //     )
            // }}
            />
        </div>
    );

}