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
        nestedFilter: [],
        checked: []
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
            return {
                ...state,
                checked: newChecked,
                transactionsTable: newTransactionsTable,
                transactionsFilter: {
                    checked: newTransactionsFilterChecked,
                    nestedFilter: newTransactionsFilterFilters,
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
            const newCheckedAll = state.checkedAll === 'checked'? '' : 'checked'
            return {
                ...state,
                checkedAll: newCheckedAll,
                checked: state.checked.map(item => newCheckedAll),
                };
        }
        case ACTIONS.CLOSE_CHECK_ALL: {
            return {
                ...state,
                checkedAll: '',
                checked: state.checked.map(item => ''),
            };
        }
        
        case ACTIONS.CHECK_ONE: {
            const { id } = action.payload;
            var row = parseInt(id.replace('checkbox',''))
            const newChecked = state.checked
            newChecked[row] = newChecked[row] === '' ? 'checked' : ''
            return {
                ...state,
                checked: newChecked,
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
            const { id, label, text } = action.payload 
            const newChanges = state.changes
            const index = newChanges.findIndex(item => item.id === id)                    
            if(index === -1){
                const change = { id: id, [label]: text}
                newChanges.push(change)
            }
            else{
                newChanges[index] = {...newChanges[index], [label]: text}
            }
            return {
                ...state,
                changes: newChanges,
            };
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
            console.log(value_index)
            const newNestedFilter = state.transactionsFilter.nestedFilter
            const index = newNestedFilter.findIndex(item => item.label === label)
            newNestedFilter[index].filter[value_index].checked = !newNestedFilter[index].filter[value_index].checked
            console.log(newNestedFilter[index].filter[value_index].checked)
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