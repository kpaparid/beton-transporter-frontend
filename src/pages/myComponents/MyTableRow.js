import React, { useMemo, useCallback } from "react";
import { Form } from "@themesberg/react-bootstrap";

import { useDispatch } from "react-redux";
import { ACTIONS } from "../reducers/redux";
import { MyInput } from "./MyInput";
import {
  inputLabelsWidths,
  useGetAvailableValuesSelectInput,
} from "./MyConsts";

export const TableRow = React.memo((props) => {
  const {
    components,
    index = "test",
    onCheckBoxChange,
    checked = false,
  } = props;
  return (
    <tr className="text-left align-middle">
      {onCheckBoxChange && (
        <td className="px-2" style={{ width: "30px" }}>
          <Form.Check
            key={`checkbox_tablerow_${index}`}
            id={`checkbox_tablerow_${index}`}
            htmlFor={`checkbox_tablerow_${index}`}
            checked={checked}
            onChange={() => onCheckBoxChange(index)}
          />
        </td>
      )}
      {components}
    </tr>
  );
});

// export const TableRow = React.memo((props) => {
//   const {
//     index,
//     row,
//     // handleCheckboxClick,
//     checked,
//     checkedColumns,
//     editMode,
//     checkbox = false,
//     values,
//     // dispatch,
//   } = props;
//   const dispatch = useDispatch();
//   const r = row.value;
//   const id = row.id;
//   const handleCheckboxClick = useCallback((id) => {
//     console.log("callback");
//     dispatch({
//       type: ACTIONS.CHECK_ONE,
//       payload: {
//         id: id,
//       },
//     });
//   }, []);

//   return (
//     <tr className="text-left align-middle">
//       {checkbox && (
//         <td className="px-2" style={{ width: "30px" }}>
//           <Form.Check
//             key={`checkbox_tablerow_${index}`}
//             id={`checkbox_tablerow_${index}`}
//             htmlFor={`checkbox_tablerow_${index}`}
//             checked={checked}
//             onChange={(event) => handleCheckboxClick(id, event)}
//           />
//         </td>
//       )}
//       <TablerowContents
//         key={"tablerow_contents_" + id}
//         row={r}
//         id={id}
//         checkedColumns={checkedColumns}
//         checked={checked}
//         editMode={editMode}
//         values={values}
//       />
//     </tr>
//   );
// });
// export const CellComponent = React.memo((component, id) => {
//   return (
//     <td key={"td_" + id} className="px-1">
//       <div className="justify-content-center d-flex">{component}</div>
//     </td>
//   );
// });
// export const TablerowContents = React.memo((props) => {
//   const { row, id, checkedColumns, checked, editMode, values } = props;

//   const dispatch = useDispatch();
//   const handleEditChange = useCallback((value, labelId) => {
//     console.log("dispatch: " + value + labelId);
//     dispatch({
//       type: ACTIONS.ADD_CHANGE,
//       payload: {
//         id: id,
//         key: labelId,
//         change: value,
//       },
//     });
//   }, []);
//   return (
//     <>
//       {checkedColumns.map((label) => {
//         const minWidth = inputLabelsWidths[label.id]["minWidth"]
//           ? inputLabelsWidths[label.id]["minWidth"]
//           : "50px";
//         const maxWidth = inputLabelsWidths[label.id]["maxWidth"]
//           ? inputLabelsWidths[label.id]["maxWidth"]
//           : "100px";
//         const value = row[label.id];
//         const newID = id + "_" + label.id;
//         // + row[label.id]
//         const type = label.type;
//         const enabled = editMode && checked === "checked";
//         const defaultValue = label.text;
//         // console.log(GetValues);
//         // const values = GetValues(label.id).filter((v) => v !== value);
//         const measurement = label.measurement;

//         return (
//           <td key={`$td-${newID}`} className="px-1">
//             <div className="justify-content-center d-flex">
//               <MyInput
//                 id={newID}
//                 value={value}
//                 enabled={enabled}
//                 // onChange={(value) => handleEditChange(value, label.id)}
//                 onChange={console.log}
//                 type={type}
//                 defaultValue={defaultValue}
//                 // values={GetValues(label.id)}
//                 values={values}
//                 invalidation
//                 errorMessage
//                 minWidth={minWidth}
//                 maxWidth={maxWidth}
//                 measurement={measurement}
//               />
//             </div>
//           </td>
//         );
//       })}
//     </>
//   );
// });
export const HeaderRow = (props) => {
  const { headers, checked, handleAllClick, checkbox = false } = props;
  return (
    <tr className="align-middle">
      {checkbox && (
        <th className="border-bottom px-2 text-left" style={{ width: "30px" }}>
          <Form.Check
            id="checkboxAll"
            htmlFor="checkboxAll"
            checked={checked}
            onChange={handleAllClick}
          />
        </th>
      )}

      {headers.map((header) => (
        <th
          key={`$s-${header}`}
          className="border-bottom  px-2 text-nowrap text-center "
        >
          {header}
        </th>
      ))}
    </tr>
  );
};
