import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { availableValues, visibleLabelsSelector, checkedExistsSelector, shownToursSelector, selectorMenu, checkedAllSelector, sortedLabelsSelector } from "./MySelectors"

import moment from "moment";
import { validateNumber, validateNumberSeperator } from "./utilities";

const useTourTable = () => useSelector(state => state.tourTable)
const useTourDate = () => useSelector(state => moment(state.tourTable.tourDate, "MM/YYYY").format("MMMM YYYY"))
const useCheckedExists = () => useSelector(checkedExistsSelector)

const useShownTourTable = () => useSelector(shownToursSelector, shallowEqual)
const useCheckedAll = () => useSelector(checkedAllSelector);
const useChecked = () => useSelector(selectorMenu)
const useShownLabels = () => useSelector(sortedLabelsSelector)
const useAllLabels = () => useSelector(state => state.tourTable.labelsById)
const useGetVisibleLabels = () => useSelector(visibleLabelsSelector)
const useGetAvailableValuesSelectInput = (key) => useSelector((state) => availableValues(state, key))

const inputLabelsWidths = {
    "wagen": { "minWidth": "100px", "maxWidth": "200px" },
    "werk": { "minWidth": "100px", "maxWidth": "200px" },
    "fahrer": { "minWidth": "100px", "maxWidth": "200px" },
    "entladeTyp": { "minWidth": "100px", "maxWidth": "200px" },
    "datum": { "minWidth": "80px", "maxWidth": "200px" },
    "cbm": { "minWidth": "80px", "maxWidth": "200px" },
    "abfahrt": { "minWidth": "80px", "maxWidth": "200px" },
    "kmAbfahrt": { "minWidth": "80px", "maxWidth": "200px" },
    "kmAnkunft": { "minWidth": "80px", "maxWidth": "200px" },
    "ankunft": { "minWidth": "80px", "maxWidth": "200px" },
    "lieferscheinNr": { "minWidth": "150px", "maxWidth": "200px" },
    "baustelle": { "minWidth": "150px", "maxWidth": "200px" },
    "entladeBeginn": { "minWidth": "80px", "maxWidth": "200px" },
    "entladeEnde": { "minWidth": "80px", "maxWidth": "200px" },
    "wartezeit": { "minWidth": "80px", "maxWidth": "200px" },
    "sonstiges": { "minWidth": "150px", "maxWidth": "200px" },
}
const calcInvalidation = (text, type, invalidation) => !invalidation ? false :
text === '' ? false :
            type === 'text' ? false :
            // type === 'number' && !isNaN(text.replaceAll('.', '').replaceAll(',', '')) && (text.match(new RegExp(',', "g")) || []).length <= 1? false :
            type === 'number' && validateNumber(text) && validateNumberSeperator(text) && (text.match(new RegExp(',', "g")) || []).length <= 1? false :
                    type === 'date' && moment(text, "DD/MM/YYYY", true).isValid() ? false :
                        type === 'time' && moment(text, "H:mm", true).isValid() ? false :
                            type === 'hour' && moment(text, "HH", true).isValid() ? false :
                                type === 'minute' && moment(text, "mm", true).isValid() ? false :
                                    type === 'duration' && moment(text, 'H[h] mm[m]', true).isValid() ? false :
                                        true
const calcValidation =(text, type, validation) => !validation ? false :
text === '' ? false :
    type === 'text' ? true :
    // type === 'number' && !isNaN(text.replaceAll('.', '').replaceAll(',', '')) && (text.match(new RegExp(',', "g")) || []).length <= 1 ? true :
        type === 'number' && validateNumber(text) && (text.match(new RegExp(',', "g")) || []).length <= 1 ? true :
            type === 'date' && moment(text, "DD/MM/YYYY", true).isValid() ? true :
                type === 'time' && moment(text, "HH:mm", true).isValid() ? true :
                    type === 'hour' && moment(text, "HH", true).isValid() ? true :
                        type === 'minute' && moment(text, "mm", true).isValid() ? true :
                            type === 'duration' && moment(text, 'H[h] mm[m]', true).isValid() ? true :
                                false
const imgValid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2305A677' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`
const imgInvalid = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23FA5252' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23FA5252' stroke='none'/%3e%3c/svg%3e")`
                              
export{
    useTourTable,
    useTourDate, 
    useCheckedExists,
    useShownTourTable,
    useCheckedAll,
    useChecked,
    useShownLabels,
    useAllLabels,
    useGetVisibleLabels,
    inputLabelsWidths,
    useGetAvailableValuesSelectInput,
    calcValidation,
    calcInvalidation, 
    imgValid,
    imgInvalid,

}