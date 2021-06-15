import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import moment from "moment";

function visibleLabelsSelector(state) {
  const c = state.tourTable.checkedLabelsId
  const shownLabels = [...c].sort((a, b) => state.tourTable.labelsById[a].priority - state.tourTable.labelsById[b].priority)
  return shownLabels.map(l => state.tourTable.labelsById[l])
}

function checkedExistsSelector(state) {
    const { tourTable } = state;
    return tourTable.checkedId.length !== 0 ? true : false
  }
  function shownToursSelector(state){
    const shownId = state.tourTable.shownId
    const table = []
    
    shownId.forEach(item => {
      var flag = true;
      flag && state.tourTable.allLabelsId.forEach(label => {
        if (state.tourTable.filteredOutValues[label] &&
          state.tourTable.filteredOutValues[label].findIndex(f => f === state.tourTable.byId[item][label]) !== -1) {
            flag = false;
        }
      })
      flag && table.push({ id: item, value: state.tourTable.byId[item] })
    })

    return [...table]
  }
  function selectorMenu(state) {
    const { tourTable } = state;      
    if(tourTable.shownId.length > 0 && tourTable.checkedId.length > 0) {
      const unchecked = tourTable.shownId.map(tour => ({[tour] : ''})).reduce((prev, curr) => ({...prev, ...curr}))
      const checked = tourTable.checkedId.map(tour => ({[tour] : 'checked'})).reduce((prev, curr) => ({...prev, ...curr}))
      return {...unchecked, ...checked};
    }
    if(tourTable.shownId.length > 0) {
      const unchecked = tourTable.shownId.map(tour => ({[tour] : ''})).reduce((prev, curr) => ({...prev, ...curr}))
      return unchecked;
    }
    }
    function checkedAllSelector(state) {
        const checkedIdLength = state.tourTable.checkedId.length
        const allIdLength = state.tourTable.allId.length
        return checkedIdLength === allIdLength
    }
    function sortedLabelsSelector(state) {
        const c = state.tourTable.checkedLabelsId
        const shownLabels = [...c].sort((a, b) => state.tourTable.labelsById[a].priority - state.tourTable.labelsById[b].priority)
        return shownLabels
      }
      function availableValues(state, key){
        return [...new Set(state.tourTable.allId.map(tour => state.tourTable.byId[tour][key]))]
      }

export{
    checkedExistsSelector,
    shownToursSelector,
    selectorMenu,
    checkedAllSelector,
    sortedLabelsSelector,
    visibleLabelsSelector,
    availableValues,
}