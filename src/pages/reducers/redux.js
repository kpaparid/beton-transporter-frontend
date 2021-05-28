import { createStore } from 'redux';

export const ACTIONS = {
    CLOSE_CHECK_ALL: 'CLOSE_CHECK_ALL',
    LOAD_MENU: 'LOAD_MENU',
    TOGGLE_CHECK_ALL: 'CHECK_ALL',
    LOAD_TRANSACTIONS_TABLE: 'LOAD_TRANSACTIONS_TABLE',
    CHECK_ONE: 'CHECK_ONE',
    SAVE_CHANGES: 'SAVE_CHANGES',
    ADD_CHANGE: 'ADD_CHANGE',
    DELETE_CHANGES: 'DELETE_CHANGES',
    EDIT_TOGGLE: 'EDIT_TOGGLE',
    TOGGLE_COLUMN: 'TOGGLE_COLUMN',
    NESTEDFILTER_TOGGLEALL: 'NESTEDFILTER_TOGGLEALL',
    NESTEDFILTER_TOGGLEONE: 'NESTEDFILTER_TOGGLEONE',
    
};
const myInitialState = {
    checkedAll: '',
    transactionsTable: [],
    checked: [], 
    changes: [],
    editMode: false,
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
    }


};

function MyReducer(state = myInitialState, action) {
    switch (action.type) {
        case ACTIONS.LOAD_TRANSACTIONS_TABLE: {
            const { table } = action.payload;
            const newTransactionsTable = table.map((item, index) => ({...item, labelId: item.id, id: index}))
            const newChecked = table.map(item=>'')
            const newTransactionsFilterChecked = Array(Object.keys(table[0]).length-1).fill(true)
            const newTransactionsFilterFilters = Object.keys(table[0]).map(item => ({
                label: item,
                filter:[...new Set(table.map(row=>row[item]))].map(item => ({checked:true, value: item}))}))

            console.log(newTransactionsFilterFilters)
            
            
            const newTourTableById = table.map((item, index) => ({  ['Tour'+index] : {...item}  })).reduce((prev, curr) => ({...prev, ...curr}))
            const newTourTableAllId = table.map((item, index) => ('Tour'+index))
            

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
                    shownId: [...newTourTableAllId],
                }
            };
        }
        
        case ACTIONS.TOGGLE_COLUMN: {
            const { index } = action.payload;
            const newTransactionsFilterChecked = state.transactionsFilter.checked
            newTransactionsFilterChecked[index] = !newTransactionsFilterChecked[index]
            console.log(newTransactionsFilterChecked)
            return {
                ...state,
                transactionsFilter: {
                    ...state.transactionsFilter,
                    checked: newTransactionsFilterChecked
                }
            }
        }

        case ACTIONS.EDIT_TOGGLE: {
            return {
                ...state,
                editMode: !state.editMode,
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
            console.log('single click')
            console.log(newCheckedId)


            return {
                ...state,
                tourTable: {
                    ...state.tourTable,
                    checkedId: newCheckedId
                }
            };
        }

        case ACTIONS.SAVE_CHANGES: {
            const newTransactionsTable = state.transactionsTable
            state.changes.forEach( change => {
                const index = newTransactionsTable.findIndex( item => item.id === change.id)
                newTransactionsTable[index] = {...newTransactionsTable[index], ...change}
            })
            return {
                ...state,
                transactionsTable: newTransactionsTable,
                changes:[],
            };
        }
        case ACTIONS.ADD_CHANGE: {
            const { id, key, change } = action.payload

            console.log(id)
            console.log(key)
            console.log(change)

            const newChangesById = state.tourTable.changesById
            newChangesById[id] = {...newChangesById[id], [key] : change}

            console.log(newChangesById)

            // return {
            //     ...state,
            //     tourTable: {
            //         ...state.tourTable,
            //         changesById: newChangesById,
            //     }
            // };
        }
        case ACTIONS.DELETE_CHANGES: {
            return {
                ...state,
                changes: [],
            };
        }
        case ACTIONS.NESTEDFILTER_TOGGLEALL: {
            const { label, checked } = action.payload;
            const newNestedFilter = state.transactionsFilter.nestedFilter
            const index = newNestedFilter.findIndex(item => item.label === label)
            newNestedFilter[index].filter = newNestedFilter[index].filter.map(row => ({...row, checked:checked}))
            console.log(newNestedFilter)
            return {
                ...state,
                transactionsFilter:{
                    ...state.transactionsFilter,
                    newNestedFilter: newNestedFilter,
                }
                };
        }
        case ACTIONS.NESTEDFILTER_TOGGLEONE: {
            const { label, value_index } = action.payload;
            // console.log(value_index)
            const newNestedFilter = state.transactionsFilter.nestedFilter
            const index = newNestedFilter.findIndex(item => item.label === label)
            newNestedFilter[index].filter[value_index].checked = !newNestedFilter[index].filter[value_index].checked
            // console.log(newNestedFilter)
            return {
                ...state,
                transactionsFilter:{
                    ...state.transactionsFilter,
                    newNestedFilter: newNestedFilter,
                }
                };
        }
        default:
            return state;
    }
}



const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export function createReduxStore() {
    const store = createStore(MyReducer, enableReduxDevTools);
    return store;
}