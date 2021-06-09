import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@themesberg/react-bootstrap';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import MyTextArea from './MyTextArea';
import MyInput from './MyInput';





export const TableRow = (props) => {
  const { index, row, handleCheckboxClick, checked, checkedColumns, editMode, checkbox=false } = props;
  const r = row.value
  const id = row.id

  return (
    
    <tr className="text-left align-middle">
      {
      checkbox &&
      <td className="px-2" style={{ width: '30px' }}>
      <Form.Check
        key={`checkbox_tablerow_${index}`}
        id={`checkbox_tablerow_${index}`}
        htmlFor={`checkbox_tablerow_${index}`}
        checked={checked}
        onChange={(event) => handleCheckboxClick(id, event)}
      />
    </td>
    }
      <TablerowContents
        key={`tablerow_contents_${id}`}
        row={r}
        id={id}
        checkedColumns={checkedColumns}
        checked={checked}
        editMode={editMode}
        
      />
    </tr>
  );
};
export const TablerowContents = (props) => {
  const { row, id, checkedColumns, checked, editMode } = props  

  const dispatch = useDispatch();
    const handleEditChange = (id, key, change) => {
        
      dispatch({
        type: ACTIONS.ADD_CHANGE,
        payload: {
          id: id,
          key: key,
          change: change,
        }
      });
    };
  
  return <>
    {
      checkedColumns.map((label) =>
      
        <td key={`$td-${row[label.id]}`}
          className="text-center px-1 text-wrap"
        >
          <span>
            <MyInput
              id={`$td-${row[label.id]}`}
              value={row[label.id]}
              enabled={editMode && checked === 'checked'}
              onChange={handleEditChange}
              type ={label.type}
              rows={2}
              defaultValue={label.text}
              label={label.id}
              // validation
              invalidation
              errorMessage
            />
          </span>
        </td>)}
  </>
}
export const HeaderRow = (props) => {
  const { headers, checked, handleAllClick, checkbox=false } = props
  return (
    <tr className="align-middle">
      {checkbox &&
      <th className="border-bottom px-2 text-left" style={{ width: '30px' }}>
      <Form.Check
        id="checkboxAll"
        htmlFor="checkboxAll"
        checked={checked}
        onChange={handleAllClick}
      />
    </th>
      }
      
      {headers.map((header) =>
        <th 
          key={`$s-${header}`}
          className="border-bottom  px-2 text-wrap text-center "
        >
          {header}
        </th>
      )}
    </tr>
  );
};