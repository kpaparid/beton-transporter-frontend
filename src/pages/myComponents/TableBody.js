import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../reducers/redux";
import {
  inputLabelsWidths,
  useShownLabels,
  useShownTourTable2,
} from "./MyConsts";
import { MyInput } from "./MyInput";
import {
  shownToursSelector2,
  shownToursSelector3,
  visibleLabelsSelector,
  allAvailableValues,
} from "./MySelectors";
import { TableRow } from "./MyTableRow";
export const TableBody = React.memo((props) => {
  const {
    // tours,
    checkedRows,
    checkedAll,
    editMode,
    // visibleLabels,
  } = props.data;

  // const tours = useSelector(shownToursSelector2, shallowEqual);
  const tours = useSelector(shownToursSelector2, shallowEqual);
  const visibleLabels = useSelector(visibleLabelsSelector, shallowEqual);
  // const values = useSelector(allAvailableValues, shallowEqual);
  // useEffect(() => {
  //   console.log("values", values);
  // }, [values]);
  useEffect(() => {
    console.log("tours", tours);
  }, [tours]);
  const dispatch = useDispatch();
  const handleCheckboxClick = useCallback((id) => {
    dispatch({
      type: ACTIONS.CHECK_ONE,
      payload: {
        id: id,
      },
    });
  }, []);
  const handleEditChange = useCallback((id, value, labelId) => {
    dispatch({
      type: ACTIONS.ADD_CHANGE,
      payload: {
        id: id,
        key: labelId,
        change: value,
      },
    });
  }, []);
  return tours.map((t, index) => {
    const checked = checkedRows[t.id];
    const enabled = editMode && checked === "checked";
    return (
      <TableRow
        index={t.id}
        key={"TableRow_" + index}
        components={
          <RowComponents
            visibleLabels={visibleLabels}
            id={t.id}
            enabled={enabled}
            val={t.value}
            onChange={handleEditChange}
            // values={t.availableValues}
          ></RowComponents>
        }
        onCheckBoxChange={handleCheckboxClick}
        checked={checked}
      ></TableRow>
    );
  });
});
const RowComponents = React.memo((props) => {
  const { visibleLabels, id, enabled, val, onChange, values } = props;
  // console.log(values);
  return visibleLabels.map((label) => {
    const minWidth = inputLabelsWidths[label.id]["minWidth"]
      ? inputLabelsWidths[label.id]["minWidth"]
      : "50px";
    const maxWidth = inputLabelsWidths[label.id]["maxWidth"]
      ? inputLabelsWidths[label.id]["maxWidth"]
      : "100px";
    const value = val[label.id];
    const newID = id + "_" + label.id;
    const type = label.type;
    const defaultValue = label.text;
    const measurement = label.measurement;
    return (
      <td key={`$td-${newID}`} className="px-1">
        <div className="justify-content-center d-flex">
          <MyInput
            labelId={label.id}
            id={newID}
            value={value}
            enabled={enabled}
            onChange={onChange}
            type={type}
            defaultValue={defaultValue}
            invalidation
            errorMessage
            minWidth={minWidth}
            maxWidth={maxWidth}
            measurement={measurement}
            // values={values[label.id]}
          />
        </div>
      </td>
    );
  });
});
