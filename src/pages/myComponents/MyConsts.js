import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { availableValues, visibleLabelsSelector, checkedExistsSelector, shownToursSelector, selectorMenu, checkedAllSelector, sortedLabelsSelector } from "./MySelectors"

import moment from "moment";

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
            "wagen":  "100px",
            "werk":  "100px",
            "fahrer":  "100px",
            "entladeTyp":  "100px",
            "datum":  "80px",
            "cbm":  "80px",
            "abfahrt":  "80px",
            "kmAbfahrt":  "130px",
            "kmAnkunft":  "130px",
            "ankunft":  "80px",
            "lieferscheinNr":  "150px",
            "baustelle":  "150px",
            "entladeBeginn":  "80px",
            "entladeEnde":  "80px",
            "wartezeit":  "80px",
            "sonstiges":  "150px",
}
const calcInvalidation=(text, type, invalidation) => !invalidation ? false :
text === '' ? false :
            type === 'text' ? false :
                type === 'number' && !isNaN(text) ? false :
                    type === 'date' && moment(text, "DD/MM/YYYY", true).isValid() ? false :
                        type === 'time' && moment(text, "H:mm", true).isValid() ? false :
                            type === 'hour' && moment(text, "HH", true).isValid() ? false :
                                type === 'minute' && moment(text, "mm", true).isValid() ? false :
                                    type === 'duration' && moment(text, 'H[h] mm[m]', true).isValid() ? false :
                                        true
const calcValidation =(text, type, validation) => !validation ? false :
text === '' ? false :
    type === 'text' ? true :
        type === 'number' && !isNaN(text) ? true :
            type === 'date' && moment(text, "DD/MM/YYYY", true).isValid() ? true :
                type === 'time' && moment(text, "HH:mm", true).isValid() ? true :
                    type === 'hour' && moment(text, "HH", true).isValid() ? true :
                        type === 'minute' && moment(text, "mm", true).isValid() ? true :
                            type === 'duration' && moment(text, 'H[h] mm[m]', true).isValid() ? true :
                                false
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
}