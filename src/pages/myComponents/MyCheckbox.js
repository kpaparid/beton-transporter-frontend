
import React from "react";
import { Form, Dropdown, ToggleButton } from '@themesberg/react-bootstrap';
// import './nstyle.scss'
import { Button } from '@themesberg/react-bootstrap';
import { useEffect, useState } from 'react';

import InputRange from 'react-input-range';
import { useSelector, useDispatch } from "react-redux";
import { ACTIONS } from "../reducers/redux";


function MyCheckboxContainer (props) {
    const {labels, text, index='0', checked=false, handler} = props

    function selector2(state) {
        const nestedFilter = state.transactionsFilter.nestedFilter.find(row => row.label === labels.name)
        const left = nestedFilter.filter.length;
        const right = nestedFilter.filter.filter(item => item.checked === true).length
        return (left === right)
    }
    const checkedAll = useSelector(selector2)

    return (
        <div className="container-fluid p-0 py-1 px-2"  key={index}>
                    <Button className="w-100"
                        id={'nested_checkbox_'+index} 
                        variant='white'
                        onClick={() => handler(index)}
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
                                    checked = {checked}
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
    const nestedFilter2 = useSelector(state=>state.transactionsFilter.nestedFilter)
    const nestedFilter3 = useSelector(selector3)
    const dispatch = useDispatch();
    function selector2(state) {
        const nestedFilter = state.transactionsFilter.nestedFilter.find(row => row.label === labels.name)
        const left = nestedFilter.filter.length;
        const right = nestedFilter.filter.filter(item => item.checked === true).length
        return (left === right)
    }
    function selector3(state) {
        return [...state.transactionsFilter.nestedFilter.find(row => row.label === labels.name).filter]
    }
    const checkedAll = useSelector(selector2)
    function toggleAll(event){
        console.log('click')
        dispatch({
            type: ACTIONS.NESTEDFILTER_TOGGLEALL,
            payload: {
              label: labels.name,
              checked: !checkedAll
            },
          })
    }
    function toggleOne(index){
        console.log('click')
        dispatch({
            type: ACTIONS.NESTEDFILTER_TOGGLEONE,
            payload: {
              label: labels.name,
                value_index: index
            },
          })
    }


    return (
        <>
            <MyCheckboxContainer
                labels={labels}
                text='Select All'
                checked= {checkedAll}
                handler={toggleAll}
            />
            <Dropdown.Divider></Dropdown.Divider>
            {
            nestedFilter3.map((item, index) => 
            <MyCheckboxContainer
                key={index}
                index={index}
                labels={labels}
                text={item.value}
                checked={item.checked}
                handler={toggleOne}
            />)
                
            
            
            }
        </>)
}