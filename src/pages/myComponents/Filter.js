import React from "react";
import { useLayoutEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Form, ButtonGroup, Dropdown } from '@themesberg/react-bootstrap';
import { labels } from "../../data/transactions";

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import NestedFilter from "./NestedFilter";

export const DropdownRow = (props) => {
    const { label, transactionsTable } = props;
    const left= label.text
    const right=[...new Set(transactionsTable.map(t => t[label.name]))]
    
    const display = (right.length === 1) || (label.filterType === 'none') ? 'd-none' : 'd-block'
    return (
        <div className="ps-2 pe-2 container-fluid d-flex justify-content-between">
            <div className="d-flex align-items-center">
                <div className="align-items-center ps-0 text-wrap text-left pe-4 text-break">{left}</div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
                {/* <div className="align-items-center ps-3 text-right  text-truncate w-50">{right}</div> */}
                <div className={`dropdown-arrow text-right ${display}`}>
                    <FontAwesomeIcon icon={faAngleRight} className="dropdown-arrow" />
                </div>
            </div>


        </div>
    )
};
function Dropd(props){
    const { label, index, transactionsTable}= props
    const currentWidth = useWindowSize();
    function useWindowSize() {
        const [size, setSize] = useState(0);
        useLayoutEffect(() => {
            function updateSize() {
                setSize(window.innerWidth);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        });
        return size;
    }
        return (
        <Dropdown
            drop={(currentWidth > 600) ? "right" : "down"}
            as={ButtonGroup}
            disabled
            className="d-flex p-0 ps-4 pe-2 py-1 mydropdownlist"
            style={{ minWidth: '200px' }}>
            <Dropdown.Toggle split variant="white" disabled={label.filterType === 'none'} className="d-flex shadow-none">
                <DropdownRow
                    label={label}
                    transactionsTable={transactionsTable}
                />
            </Dropdown.Toggle>
            <NestedFilter
                index={index}
                transactionsTable={transactionsTable}
                labels={label}
            />
        </Dropdown>
        )
}  
export const DropdownFilter = (props) => {
    const dispatch = useDispatch();
    
    
    const checked = useSelector(state => state.transactionsFilter.checked)      
      function handleChange(index, event) {
        dispatch({
            type: ACTIONS.TOGGLE_COLUMN,
            payload: {
              index: index,
            },
          })
      }
      
    const transactionsTable = useSelector(state => state.transactionsTable)
    
    return (
        <div>
            {labels.map((label, index) =>
                <div key={label.name.toString()} className="d-flex align-items-center">
                    <Form.Check
                        id={`checkbox${index}`}
                        htmlFor={`checkbox${index}`}
                        defaultChecked={checked[index]}
                        className="align-items-center m-0 ps-3 pe-1 justify-content-start mycheckbox"
                        onChange= {(e) => handleChange(index, e)}>
                    </Form.Check>
                    
                    
                    <Dropd label={label} index={index} transactionsTable={transactionsTable}></Dropd>
                    <Dropdown.Divider></Dropdown.Divider>
                </div>
            )}
        </div>

    )
};