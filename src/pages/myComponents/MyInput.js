import react, { useState, useEffect } from "react"
import MyFormSelect from "./MyFormSelect"
import { DateSelectorDropdown, HourSelectorDropdown, DurationDropdownSelector } from "./MyOwnCalendar"
import { MyTextArea } from "./MyTextArea"



export default (props) => {

    const { title, onChange, type,
        value, enabled, rows = 1, minWidth = '100px', values = [],
        defaultValue = 'Select ' + value, validation = false, invalidation = false, errorMessage, measurement='' } = props
    const id = 'inputModal-' + value

    // function handleOnChange(change) {
    //     console.log('ready to update db')
    //     console.log('value for DB: ' + change)
        
    // }
    // useEffect(() => {
    //     console.log(value)
    // }, [newValue]);
    const [newValue, setNewValue] = useState(value)
    function handleOnChange(change) {
        console.log('ready to update db')
        console.log('value for DB: ' + change)
        setNewValue(change)
        
    }
    useEffect(() => {
        console.log('change: '+value+' ===> ' + newValue)
    }, [newValue]);

    if (!enabled) {
        return (
            <div
                style={{
                    minWidth: minWidth,
                    fontSize: '0.875rem',
                    color: '#66799e'
                }}
            >{value+' '+measurement}
            </div>
        )
    }
    else if (type === 'text') {
        return (
            <>
                <MyTextArea
                    label={title}
                    id={id}
                    maxRows={5}
                    onChange={handleOnChange}
                    value={newValue}
                    validation={validation}
                    invalidation={invalidation}
                    errorMessage={errorMessage}
                    minWidth={minWidth}
                />
            </>
        )
    }
    else if (type === 'number' || type === 'distance') {
        
        return (
            <MyTextArea
                label={title}
                id={id}
                maxRows={3}
                type='number'
                value={newValue}
                validation={validation}
                invalidation={invalidation}
                errorMessage={errorMessage}
                onChange={handleOnChange}
                minWidth={minWidth}
                measurement={measurement}
            />
        )
    }
    else if (type === 'date') {
        return (
            <>
                <DateSelectorDropdown
                    id={id}
                    value={newValue}
                    onChange={handleOnChange}
                    validation={validation}
                    invalidation={invalidation}
                    minWidth={minWidth}
                    maxRows={2}
                ></DateSelectorDropdown>

            </>
        )
    }
    else if (type === 'constant') {

        return (
            <MyFormSelect
                label={title}
                id={id}
                values={values}
                onChange={handleOnChange}
                defaultValue={value}
                minWidth={minWidth}
                validation={validation}
                invalidation={invalidation}

            />
        )
    } else if (type === 'time') {
        return (
            <HourSelectorDropdown
                id={id}
                value={newValue}
                minWidth={'100px'}
            > </HourSelectorDropdown>
        )
    }

    else if (type === 'duration') {
        console.log('MINUTE: ' + value)
        return (
            <DurationDropdownSelector
                id={'id'}
                value={newValue}
                //   seperator={'h '}
                isLimited={false}
                validation={false}
                invalidation={false}
                disabledHours
                measurement={measurement}

            ></DurationDropdownSelector>
        )
    }
    else {
        <div>{newValue}</div>
    }
}