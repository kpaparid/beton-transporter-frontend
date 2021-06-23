import React, { useEffect, useState } from 'react';

import moment from "moment";
import BigNumber from 'bignumber.js';

export function convertToThousands(number, decimal=0) {
    // console.log('num ' +number)
    const n = BigNumber((number +'').replaceAll('.', '').replaceAll(',', '.'))
    const value = decimal === 0 ? n.toFormat() : n.toFormat(decimal)
    const i = value.indexOf('.')
    // console.log(i)
    const v = value.replaceAll(',','.')
    if(i!== -1) {
        // console.log('val -- '+v.substring(0, i) + ',' + v.substring(i + 1))
        return v.substring(0, i) + ',' + v.substring(i + 1);
    }
    // console.log('val '+v)
    return v
}
export function countNumberSeperators(number) {
    return (number.match(/\./g) || []).length
}
export function getDifferenceOfStrings(str1, str2){
    // console.log(str1)
    // console.log(str2)
    const longString = str1.length > str2.length ? str1 : str2
    const shortString = str1.length > str2.length ? str2 : str1
    console.log('COMPARING: '+longString +' => '+shortString)
    var l = 0;
    var s = 0;
    const outliers = []
    while(l < longString.length && s < longString.length){
        if ( longString[l] === shortString[s] ) {
            l++
            s++
        }else{
            outliers.push(l)
            // console.log('pushing '+longString[l])
            l++
        }
    }
    return {value: outliers.map(i => longString[i]), index: outliers}

}
export function convertToLocalNumber(number){
    return (number + '').replaceAll('.','').replaceAll(',','.')
}
export function validateNumberSeperator(number){
   const dotIndexes =[...(number+'')].map((v, i) => ({value: v, index: i})).filter(c => c.value === '.')
   .map(_=> ((number+'').length - _.index) % 4 === 0 ? true : false
   ).indexOf(false) === -1 ? true : false
    return dotIndexes
}

export function validateNumber(number){
    const num = convertToLocalNumber(number)
    return !(BigNumber(num).isNaN()) && !(number+'').includes(' ')
}

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

