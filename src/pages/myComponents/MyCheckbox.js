
import React from "react";
import { Form, Dropdown, ToggleButton } from '@themesberg/react-bootstrap';
// import './nstyle.scss'
import { Button } from '@themesberg/react-bootstrap';
import { useEffect, useState } from 'react';

import InputRange from 'react-input-range';
import { useSelector, useDispatch } from "react-redux";
import { ACTIONS } from "../reducers/redux";


function MyCheckboxContainer (props) {
    const {labels, text, index='0', checked=false, onChange} = props
    function btnTapped() {
        console.log('tapped');
    }
    return (
        <div className="container-fluid p-0 py-1 px-2"  key={index}>
                    <Button className="w-100" 
                        variant='white'
                        onClick={onChange}
                        >
                        <div className="container-fluid mycontainer d-flex justify-content-between">
                            <div>{text}</div>
                            <Form.Check className="d-flex justify-content-between g-0 align-items-center"
                                id={`checkbox-${labels.name.toString()}-${index}`}
                                htmlFor={`checkbox-${labels.name.toString()}-${index}`}
                                >
                                <div className="align-items-center">
                                    <Form.Check.Input 
                                    type='checkbox' 
                                    disabled
                                    defaultChecked = {checked}
                                    />
                                </div>
                            </Form.Check>
                        </div>
                    </Button>
                 </div>
    )
}
export default (props) => {
    const { labels } = props
    const nestedFilter = useSelector(selector)
    const nestedFilter2 = useSelector(state=>state.transactionsFilter.nestedFilter)
    const dispatch = useDispatch();
    function selector(state) {
        return state.transactionsFilter.nestedFilter.find(row => row.label === labels.name)
    }
    function selector2(state) {
        const nestedFilter = state.transactionsFilter.nestedFilter.find(row => row.label === labels.name)
        return nestedFilter.filter.length === nestedFilter.filter.filter(item => item.checked === true).length;
    }
    const checkedAll = useSelector(selector2)
    function toggleAll(event){
        console.log('click')
        dispatch({
            type: ACTIONS.NESTEDFILTER_TOGGLEALL,
            payload: {
              label: labels.name,
              checked: false
            },
          })
          console.log(nestedFilter)
    }

    return (
        <>
            <MyCheckboxContainer
                labels={labels}
                text='Select All'
                checked= {checkedAll}
                onChange={toggleAll}
            />
            <Dropdown.Divider></Dropdown.Divider>
            {
            nestedFilter.filter.map((item, index) => 
            <MyCheckboxContainer
                key={index}
                labels={labels}
                text={item.value}
                checked={item.checked}
            />)
                
            
            
            }
        </>)
}