import React, { memo, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Form } from "@themesberg/react-bootstrap";

import { isEqual } from "lodash";
import {
  useLoadData,
  grids,
  loadWorkHoursPageGrids,
} from "./myComponents/MyConsts";

import { workHoursSlice } from "./reducers/redux2";
import { useDispatch, useSelector } from "react-redux";
import {
  GridCardComponent,
  GridTableComponent,
  Loader,
} from "./myComponents/Table/GridComponent";
import { OutlinedSelect } from "./myComponents/MuiSelect";
import { createSelector } from "reselect";

// export const ArbeitsZeiten2 = memo(() => {
//   const sliceName = "workHoursTable";
//   const { actions, selectors } = workHoursSlice;
//   const stateAPIStatus = useLoadData(sliceName, actions);
//   const dispatch = useDispatch();
//   const selectMeta = useMemo(
//     () =>
//       createSelector(
//         [
//           selectors.metaSelector.selectEntities,
//           selectors.usersSelector.selectEntities,
//           selectors.usersSelector.selectAll,
//         ],
//         (meta, users, all) => {
//           const currentUserId = meta && meta.user && meta.user.value;
//           const allUsers = all.map(({ id, firstName, lastName }) => ({
//             value: id,
//             label: lastName + " " + firstName,
//           }));
//           const currentUser = {
//             value: currentUserId,
//             label:
//               users[currentUserId] &&
//               users[currentUserId].lastName +
//                 " " +
//                 users[currentUserId].firstName,
//           };
//           return {
//             currentUser,
//             users: allUsers,
//           };
//         }
//       ),
//     [selectors]
//   );
//   // const onChangeSelect = useCallback(
//   //   (e) =>
//   //     loadWorkHoursPageGrids(e.value, actions, dispatch).then(() =>
//   //       dispatch(actions.changeCurrentUser(e.value))
//   //     ),
//   //   [actions, dispatch]
//   // );
//   const { currentUser, users } = useSelector(selectMeta);

//   const renderComponent = useCallback(
//     (entityId, props) => {
//       return (
//         <>
//           <Loader stateAPIStatus={stateAPIStatus}>
//             <GridTableComponent
//               {...{
//                 stateAPIStatus,
//                 actions,
//                 selectors,
//                 entityId,
//               }}
//             />
//           </Loader>
//         </>
//       );
//     },
//     [stateAPIStatus]
//   );

//   return (
//     <>
//       <div className="d-block pt-4 mb-4 mb-md-0">
//         <Breadcrumb
//           className="d-none d-md-inline-block"
//           listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
//         >
//           <Breadcrumb.Item>
//             <FontAwesomeIcon icon={faHome} />
//           </Breadcrumb.Item>
//           <Breadcrumb.Item>faHome</Breadcrumb.Item>
//           <Breadcrumb.Item active>ArbeitsZeiten</Breadcrumb.Item>
//         </Breadcrumb>
//       </div>

//       <div className="d-flex pb-3">
//         <OutlinedSelect
//           onChange={onChangeSelect}
//           value={currentUser}
//           values={users}
//         ></OutlinedSelect>
//       </div>
//       <div className="col-12 pb-2 d-flex flex-wrap">
//         <div className="col-12 col-xxl-7">{renderComponent("workHours")}</div>
//         <div className="col-12 col-xxl-5 ps-3">
//           <div className="col-12 pb-2">
//             {renderComponent("vacationsOverview")}
//           </div>
//           <div className="col-12 py-2">{renderComponent("vacations")}</div>

//           <div className="col-12 py-2">{renderComponent("workHoursBank")}</div>
//           <div className="col-12 py-2">{renderComponent("absent")}</div>
//         </div>
//       </div>
//     </>
//   );
// }, isEqual);

export const ArbeitsZeiten = memo(() => {
  const { actions, selectors } = workHoursSlice;
  const stateAPIStatus = useLoadData("workHoursTable", actions);
  // const loading = useSelector(selectors.tablesSelector.selectById(state, ''))
  const renderComponent = useCallback(
    (entityId) => {
      return (
        <>
          <Loader stateAPIStatus={stateAPIStatus}>
            <GridTableComponent
              {...{
                stateAPIStatus,
                actions,
                selectors,
                entityId,
              }}
            />
          </Loader>
        </>
      );
    },
    [selectors, actions, stateAPIStatus]
  );

  return (
    <>
      <div className="d-block pt-4 mb-4 mb-md-0">
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
        >
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Tours</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="col-12 py-2">{renderComponent("workHours")}</div>
    </>
  );
}, isEqual);

ArbeitsZeiten.displayName = "ArbeitsZeiten";

export default ArbeitsZeiten;
