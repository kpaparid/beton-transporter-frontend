import react, { useState, useEffect } from "react"
import MyFormSelect from "./MyFormSelect"
import { DateSelectorDropdown, HourSelectorDropdown, DurationDropdownSelector } from "./MyOwnCalendar"
import { MyTextArea } from "./MyTextArea"



export default (props) => {

    const { title, onChange, type,
        value, enabled, rows = 1, minWidth = '100px', maxWidth = '50px', values = [],
        defaultValue = 'Select ' + value, validation = false, invalidation = false, 
        errorMessage, measurement='' } = props
    const id = 'inputModal-' + value

    const [newValue, setNewValue] = useState(value)
    function handleOnChange(change) {
        // console.log('ready to update db')
        console.log('value for DB: ' +newValue +' ===> '+ change )
        setNewValue(change)
        
    }
    useEffect(() => {
        // console.log('change: '+value+' ===> ' + newValue)
    }, [newValue]);

    if (!enabled) {
        return (
            <div
                style={{
                    minWidth: minWidth,
                    maxWidth: maxWidth,
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
                maxWidth={maxWidth}
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
                    maxWidth={maxWidth}
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
                maxWidth={maxWidth}
                validation={validation}
                invalidation={invalidation}

            />
        )
    } else if (type === 'time') {
        return (
            <HourSelectorDropdown
                id={id}
                value={newValue}
                minWidth={minWidth}
                maxWidth={maxWidth}
            > </HourSelectorDropdown>
        )
    }

    else if (type === 'duration') {
        return (
            <DurationDropdownSelector
                id={id}
                // value={newValue}
                value={'15-20'}
                //   seperator={'h '}
                isLimited={false}
                validation={false}
                invalidation={false}
                minWidth={minWidth}
                maxWidth={maxWidth}
                // disabledHours
                measurement={measurement}

            ></DurationDropdownSelector>
        )
    }
    else {
        <div>{newValue}</div>
    }
}