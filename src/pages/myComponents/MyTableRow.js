import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@themesberg/react-bootstrap';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import MyTextArea from './MyTextArea';





export const TableRow = (props) => {
    const { index, row, displayColumn } = props;
    const r = row.value
    const id = row.id
    
    const dispatch = useDispatch();
    function handleCheckboxClick(id, event) {
      
        dispatch({
          type: ACTIONS.CHECK_ONE,
          payload: {
            id: id
    
          }
        });
      }
  
    
    const checked = useSelector(selectorMenu)
    function selectorMenu(state) {
      const { tourTable } = state;
      const checked = tourTable.checkedId.findIndex(item => item === id) === -1 ? false : true 
      // console.log(checked)
      return checked;
    }

    return (
      <tr className="text-left align-middle" style={{ backgroundColor: '#c5ded6' }}>
        <td className="px-2" style={{width:'30px'}}>
          <Form.Check
            key={`checkbox_tablerow_${index}`}
            id={`checkbox_tablerow_${index}`}
            htmlFor={`checkbox_tablerow_${index}`}
            defaultChecked={checked}
            onChange={(event) =>handleCheckboxClick(id, event)}
          />
        </td>
        <TablerowContents
          key={`tablerow_contents_${id}`}
          row={r}
          id={id}
          // displayColumn={displayColumn}
        />
      </tr>
    );
  };
export const TablerowContents =(props) =>{
    const {row, id, displayColumn} = props
    
    
    return <>
     {Object.keys(row)
       .filter(key => (key !== 'id') 
       )
       .map((key, i) =>
         <td key={`$td-${key}`} 
           className="text-center px-1 text-wrap" 
          //  style={{ display: displayColumn[i] }}
           >
             <span>
               <MyTextArea
                key={`$myTextArea_${id}_${key}`}
                myId={id}
                myKey={key}
                text={row[key]}
                 />
             </span>
         </td>)}
    </>
  }

export const HeaderRow = (props) => {
    const { table, displayColumn }= props
    const dispatch = useDispatch();
    function handleAllClick() {
      dispatch({
        type: ACTIONS.TOGGLE_CHECK_ALL,
      });
    }
    const checkedAll = useSelector((state) => {
      const checkedIdLength = state.tourTable.checkedId.length
      const allIdLength = state.tourTable.allId.length
  
      return checkedIdLength === allIdLength
    });

    return (
      <tr className="align-middle">
        <th className="border-bottom px-2 text-left" style={{width:'30px'}}>
          <Form.Check
            id="checkboxAll"
            htmlFor="checkboxAll"
            checked={checkedAll}
            onChange={handleAllClick}
          />
        </th>
        {table.map((key, index) =>
          <th key={`$s-${key}`}
            className="border-bottom  px-2 text-wrap text-center "
            style={{display:displayColumn[index]}}
            >
            {key}
          </th>
        )}
      </tr>
    );
  };