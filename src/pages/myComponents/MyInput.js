import react from "react"
import MyFormSelect from "./MyFormSelect"
import { DateSelectorDropdown, HourSelectorDropdown } from "./MyOwnCalendar"
import MyTextArea from "./MyTextArea"
import { inputLabelsWidths, useGetAvailableValuesSelectInput } from "./MyConsts"


export default (props) => {
    
    const { label, onChange, type,
        value, enabled, rows=1,
        defaultValue = 'Select ' + value, validation = false, invalidation = false, errorMessage } = props
    const id = 'inputModal-' + value
    function handleOnChange(change){
        console.log('ready to update db')
        console.log('value for DB: '+ change)
    }
    const minWidth = inputLabelsWidths[label] ?  inputLabelsWidths[label] : '100px'
    if (!enabled) {
        return (
            <div
                style={{
                    minWidth: minWidth,
                    fontSize: '0.875rem',
                    color: '#66799e'
                }}
            >{value}
            </div>
        )
    }
    else if (type === 'text') {
        return (
            <>            
            <MyTextArea
                id={id}
                maxRows={5}
                onChange={handleOnChange}
                value={value}
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
                id={id}
                maxRows={2}
                type='number'
                value={value}
                validation={validation}
                invalidation={invalidation}
                errorMessage={errorMessage}
                onChange={handleOnChange}
                minWidth={minWidth}
            />
        )
    }
    else if (type === 'date') {
        return (
            <>
                <DateSelectorDropdown
                    id={id}
                    enabled={true}
                    value={value}
                    onChange={handleOnChange}
                    minWidth={minWidth}
                    maxRows={2}
                ></DateSelectorDropdown>

            </>
        )
    }
    else if (type === 'constant') {
        const values = useGetAvailableValuesSelectInput(label).filter(v => v !== value)
        const def = value
        console.log(def)
        return (
            <MyFormSelect
                label={label}
                id={id}
                values={values}
                onChange={handleOnChange}
                value={def}
                defaultValue={def}
                minWidth={minWidth}

            />
        )
    }else if (type === 'time') {
        return (
            <HourSelectorDropdown 
            id={id}
            value={value}
            minWidth={minWidth + 50}
            > </HourSelectorDropdown>
        )
    }
    
    else {
        return (
            <MyTextArea
                id={id}
                rows={rows}
                type='text'
                onChange={handleOnChange}
                value={value}
                validation={validation}
                invalidation={invalidation}
                errorMessage={errorMessage}
                minWidth={minWidth}
            />
        )
    }
}