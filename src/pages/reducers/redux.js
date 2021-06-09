import { createStore } from 'redux';
import moment from "moment";

export const ACTIONS = {
    CLOSE_CHECK_ALL: 'CLOSE_CHECK_ALL',
    LOAD_MENU: 'LOAD_MENU',
    TOGGLE_CHECK_ALL: 'CHECK_ALL',
    LOAD_TOUR_TABLE: 'LOAD_TOUR_TABLE',
    CHECK_ONE: 'CHECK_ONE',
    SAVE_CHANGES: 'SAVE_CHANGES',
    ADD_CHANGE: 'ADD_CHANGE',
    DELETE_CHANGES: 'DELETE_CHANGES',
    EDIT_TOGGLE: 'EDIT_TOGGLE',
    TOGGLE_COLUMN: 'TOGGLE_COLUMN',
    NESTEDFILTER_TOGGLEALL: 'NESTEDFILTER_TOGGLEALL',
    NESTEDFILTER_TOGGLEONE: 'NESTEDFILTER_TOGGLEONE',
    TOURTABLE_CHANGE_TOURDATE: 'TOURTABLE_CHANGE_TOURDATE',
    
};
const myInitialState = {
    checkedAll: '',
    transactionsTable: [],
    checked: [], 
    changes: [],
    transactionsDate: '12-2021',
    transactionsFilter: {
        nestedFilter: [{
            label: '',
            filter: [{
                checked: true, 
                value: ''
            }]
        }],
        checked: []
    },

    tourTable: {
        byId: {},
        allId: [],
        shownId: [],
        checkedId: [],
        changesById: {},
        editMode: false,
        
        allLabelsId: [],
        checkedLabelsId: [],
        labelsById: {},
        tourDate: '12/2021',

        filteredOutValues: {}
    }


};

function MyReducer(state = myInitialState, action) {
    switch (action.type) {
        case ACTIONS.LOAD_TOUR_TABLE: {
            const { table, labels } = action.payload;
            
            console.log('LOADING TOUR TABLE')
            const newTransactionsTable = table.map((item, index) => ({...item, labelId: item.id, id: index}))
            const newChecked = table.map(item=>'')
            const newTransactionsFilterChecked = Array(Object.keys(table[0]).length-1).fill(true)
            const newTransactionsFilterFilters = Object.keys(table[0]).map(item => ({
                label: item,
                filter:[...new Set(table.map(row=>row[item]))].map(item => ({checked:true, value: item}))}))            
            
            
            
            
            const newTourTableById = table.map((item, index) => ({  ['Tour'+index] : {...item}  })).reduce((prev, curr) => ({...prev, ...curr}))
            const newTourTableAllId = Object.keys(newTourTableById)
            
            const newLabelsById = labels.map( (label, index) => ({[label.id] : {...label, "priority": index}})).reduce((prev, curr) => ({...prev, ...curr}))
            const newAllLabelsId = labels.map( label => label.id)
            const checkedLabelsId = [...newAllLabelsId]

            const newShownId = newTourTableAllId.filter( id => (moment(newTourTableById[id].datum, 'DD/MM/YYYY').format('MM/YYYY') === state.tourTable.tourDate))


            return {
                ...state,
                checked: newChecked,
                transactionsTable: newTransactionsTable,
                transactionsFilter: {
                    checked: newTransactionsFilterChecked,
                    nestedFilter: newTransactionsFilterFilters,
                },
                tourTable: {
                    ...state.tourTable,
                    byId: newTourTableById,
                    allId: [...newTourTableAllId],
                    shownId: newShownId,
                    labelsById: newLabelsById,
                    allLabelsId: newAllLabelsId,
                    checkedLabelsId: checkedLabelsId,
                }
            };
        }
        
        case ACTIONS.TOGGLE_COLUMN: {
            const { index, labelId } = action.payload;
            console.log('Toggle_Column: '+labelId)
            const newTransactionsFilterChecked = state.transactionsFilter.checked
            newTransactionsFilterChecked[index] = !newTransactionsFilterChecked[index]
            
            const test = state.tourTable.checkedLabelsId
            const newCheckedLabelsId = state.tourTable.checkedLabelsId.indexOf(labelId) === -1 ? [...state.tourTable.checkedLabelsId, labelId] : state.tourTable.checkedLabelsId.filter(label => label !== labelId)

            
            console.log(newCheckedLabelsId)
            console.log(state.tourTable.checkedLabelsId.indexOf(labelId))


            return {
                ...state,
                transactionsFilter: {
                    ...state.transactionsFilter,
                    checked: newTransactionsFilterChecked
                },
                tourTable: {
                    ...state.tourTable,
                    checkedLabelsId: newCheckedLabelsId,
                }
            }
        }
        
        case ACTIONS.EDIT_TOGGLE: {
            const newEditMode = !state.tourTable.editMode
            console.log('edit mode' + newEditMode)
            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    editMode: newEditMode,
                }
            };
        }

        case ACTIONS.TOGGLE_CHECK_ALL: {

            const tourTable = state.tourTable
            const checkedAll = tourTable.checkedId.length === tourTable.allId.length
            var newCheckedId = checkedAll ? [] : tourTable.allId
            return {
                ...state,
                tourTable:{
                    ...state.tourTable,
                    checkedId: [...newCheckedId],
                }
                };
        }
        case ACTIONS.CLOSE_CHECK_ALL: {
            
            return {
                ...state,
                tourTable:{
                    ...state.tourTable,
                    checkedId: [],
                }
            };
        }
        
        case ACTIONS.CHECK_ONE: {
            const { id } = action.payload

            const index = state.tourTable.checkedId.findIndex(item => item === id)
            var  newCheckedId = state.tourTable.checkedId
            index === -1 ? newCheckedId.push(id) : newCheckedId = newCheckedId.filter(item => item !== id)


            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    checkedId: newCheckedId
                }
            };
        }

        case ACTIONS.SAVE_CHANGES: {
            
            const changesById = state.tourTable.changesById
            const newById = {...state.tourTable.byId}
            Object.keys(changesById).forEach(tour => {
                newById[tour] = {...newById[tour], ...changesById[tour]}
            });
            

            /**
             * TODO
             * post to backend
             */

            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    byId: newById,
                }
            };
        }
        case ACTIONS.ADD_CHANGE: {
            const { id, key, change } = action.payload
            const newChangesById = state.tourTable.changesById
            newChangesById[id] = {...newChangesById[id], [key] : change}

            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    changesById: newChangesById,
                }
            };
        }
        case ACTIONS.DELETE_CHANGES: {
            return {
                ...state,
                tourTable:{
                    ...state.tourTable,
                    changesById: {}
                } ,
            };
        }
        case ACTIONS.NESTEDFILTER_TOGGLEALL: {
            const { label, data } = action.payload;
            
            const values = data.map(item => item.value)
            const checked = data.filter(item => item.checked === 'checked')
            const checkedAll = values.length === checked.length
            const newFilteredOutValues = state.tourTable.filteredOutValues
            const newValues = checkedAll ? values : []
            newFilteredOutValues[label] = newValues;
            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    filteredOutValues: newFilteredOutValues
                }
                };
        }
        case ACTIONS.NESTEDFILTER_TOGGLEONE: {
            const { label, value } = action.payload;
            const newFilteredOutValues = {...state.tourTable.filteredOutValues}
            const newValues = newFilteredOutValues[label] && 
            (newFilteredOutValues[label].findIndex(item => item === value) === -1) ? 
            [...newFilteredOutValues[label], value] : 
            [...newFilteredOutValues[label]].filter(item => item !== value)

            newFilteredOutValues[label] = newValues
            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    filteredOutValues: newFilteredOutValues
                }
            };
        } 
        case ACTIONS.TOURTABLE_CHANGE_TOURDATE: {
            const oldMonth = moment(state.tourTable.tourDate, "MM/YYYY").format("MMM")
            const oldYear = moment(state.tourTable.tourDate, "MM/YYYY").format("YYYY")
            const { month=oldMonth, yearIncrement=0 } = action.payload;
            
            const newMonth = moment(month, 'MMM').format('MM')            
            const newYear = moment().year(parseInt(oldYear) + yearIncrement).format('YYYY')
            const newDate = moment().year(newYear).month(parseInt(newMonth) -1).format('MM/YYYY')

            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    tourDate: newDate,
                }
            }
        };

        default:
            return state;
    }
}



const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export function createReduxStore() {
    const store = createStore(MyReducer, enableReduxDevTools);
    return store;
}