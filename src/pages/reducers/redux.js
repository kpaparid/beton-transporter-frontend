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
};



const myInitialState = {
    checkedAll: '',
    transactionsTable: [],
    checked: [], 
    changes: [],
    editMode: false,
};
function MyReducer(state = myInitialState, action) {
    switch (action.type) {
        case ACTIONS.LOAD_TRANSACTIONS_TABLE: {
            const { table } = action.payload;
            const newChecked = table.map(item=>'')
            return {
                ...state,
                checked: newChecked,
                transactionsTable: table
            };
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
            console.log(state.checked)
            return {
                ...state,
                checked: newChecked,
            };
        }

        case ACTIONS.SAVE_CHANGES: {
            
            const newTransactionsTable = state.transactionsTable
            console.log(state.changes)
            
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
        default:
            return state;
    }
}



const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export function createReduxStore() {
    const store = createStore(MyReducer, enableReduxDevTools);
    return store;
}