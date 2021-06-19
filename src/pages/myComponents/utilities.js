import React, { useEffect, useState } from 'react';

import moment from "moment";
import BigNumber from 'bignumber.js';

const fillTopWhites = (arr, index) => {
    if((arr[0] - (index + 1)) > 0) return [' ', ...arr]
    return [...arr]

}
const fillBottomWhites = (n, arr) => {
    if(n === 0) return [...arr]
    if(n === 1) return [...arr, ' ']
    if(n === 2) return [ ...arr, ' ', ' ']
    return [...arr]

}
export const fillWhites = (arr, index, numRows) => {
    
    
    const arr1 = fillTopWhites(arr, index)
    const whites = numRows - arr1.length    
    const newArr = fillBottomWhites(whites, arr1)
    return newArr
}
export const rotateArray = (arr, k) => arr.slice(k).concat(arr.slice(0, k));

export const calcCalendarRows = (date, labels) => {
    const startofMonth = moment(date, "MM/YYYY").startOf('month').format('dddd');
    const endOfMonth = parseInt(moment(date, "MM/YYYY").endOf('month').format('DD'));
    const rows = (endOfMonth === 31 && labels.findIndex(day => day === startofMonth) === 5 ) || 
                    (endOfMonth >= 30 && labels.findIndex(day => day === startofMonth) === 6 )? 
                    6 : 5
    return rows
}
export const transpose = (arr, numRows = arr.length) => {
   return new Array(numRows).fill().map((_, colIndex) => arr.map(row => row[colIndex]))
}
export const calcIndexedCalendarDays = (date, labels) => {
    const numRows = calcCalendarRows(date, labels)
    const days =[...Array(moment(date, 'MM/YYYY').daysInMonth()).keys()]
    .map(d => {
        const day = d + 1
        const da = moment(day.toString() + `/` + date.toString(), "DD/MM/YYYY")
        return { [da.format("dddd")] : [parseInt(da.format("DD"))] }
    }).reduce((prev, curr) => {

        const newLine = {...curr}
        const key = Object.keys(newLine)[0]
        var newCurr
        if(prev[key]){
            newCurr = {[key] : [...prev[key], ...newLine[key]]}
        }
        else{
            newCurr = {[key] : [...newLine[key]]}
        }
        return {...prev, ...newCurr}})
    
    const filledIndexWithEmptyDays = labels.map((label,  index) => fillWhites(days[label], index, numRows))
    return transpose(filledIndexWithEmptyDays, numRows)

    
 }
 export function convertArrayToObject(array) {
    return array.reduce((prev, curr) => ({...prev, ...curr}))
}
export function convertToThousands(number) {
    const value = BigNumber((number +'').replaceAll('.', '')).toFormat().replaceAll(',', '.');
    return value
}
export function countNumberSeperators(number) {
    return (number.match(/\./g) || []).length
}
export function colorizeBorder(ref, isValid=false, isInvalid=false, focused=false) {
    const red = '250, 82, 82'
    const green = '5, 166, 119'
    const grey = '46,54, 80'
    const lightblue = '209, 215, 224'
    const darkblue = '86, 97, 144'

    const borderColor = isInvalid ? red : isValid ? green : focused ? darkblue : lightblue
    const color = isInvalid ? red : isValid ? green : grey
    if (focused) {
        ref.current.style.boxShadow = '0 0 0 0.2rem rgb(' + color + ', 25%)'
        ref.current.style.border = '1.5px solid rgb(' + borderColor + ')'
    }
    else {
        ref.current.style.boxShadow = 'none'
        ref.current.style.border = '1.5px solid rgb(' + borderColor + ')'
    }
}
