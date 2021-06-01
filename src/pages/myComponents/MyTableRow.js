import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@themesberg/react-bootstrap';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from '../reducers/redux';
import MyTextArea from './MyTextArea';





export const TableRow = (props) => {
  const { index, row, handleCheckboxClick, checked, checkedColumns, editMode } = props;
  const r = row.value
  const id = row.id

  return (
    <tr className="text-left align-middle" style={{ backgroundColor: '#c5ded6' }}>
      <td className="px-2" style={{ width: '30px' }}>
        <Form.Check
          key={`checkbox_tablerow_${index}`}
          id={`checkbox_tablerow_${index}`}
          htmlFor={`checkbox_tablerow_${index}`}
          checked={checked}
          onChange={(event) => handleCheckboxClick(id, event)}
        />
      </td>
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
      checkedColumns.map((key, i) =>
        <td key={`$td-${key}`}
          className="text-center px-1 text-wrap"
        >
          <span>
            <MyTextArea
              key={`$myTextArea_${id}_${key}`}
              myId={id}
              myKey={key}
              text={row[key]}
              editMode={editMode && checked === 'checked'}
              handleEditChange={handleEditChange}
            />
          </span>
        </td>)}
  </>
}
export const HeaderRow = (props) => {
  const { headers, checked, handleAllClick } = props
  return (
    <tr className="align-middle">
      <th className="border-bottom px-2 text-left" style={{ width: '30px' }}>
        <Form.Check
          id="checkboxAll"
          htmlFor="checkboxAll"
          checked={checked}
          onChange={handleAllClick}
        />
      </th>
      {headers.map((key, index) =>
        <th 
          key={`$s-${key}`}
          className="border-bottom  px-2 text-wrap text-center "
        >
          {key}
        </th>
      )}
    </tr>
  );
};