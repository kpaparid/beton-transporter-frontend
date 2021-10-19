import React, { memo, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from "@themesberg/react-bootstrap";

import { MyTable } from "./myComponents/MyTourTable";

import { isEqual } from "lodash";
import {
  useButtonGroupProps,
  useFilterProps,
  useLoadData,
  // useTableLabelProps,
  // useTableProps,
} from "./myComponents/MyConsts";
import { toursSlice, workHoursSlice } from "./reducers/redux2";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  GridCardComponent,
  GridTableComponent,
} from "./myComponents/GridComponent";

export const Tours = memo(() => {
  const sliceName = "workHoursTable";
  const { actions, selectors } = workHoursSlice;
  const stateAPIStatus = useLoadData("toursTable", actions);
  const dispatch = useDispatch();
  const selectMeta = useMemo(
    () =>
      createSelector(
        [
          selectors.metaSelector.selectEntities,
          selectors.usersSelector.selectEntities,
          selectors.usersSelector.selectAll,
        ],
        (meta, users, all) => {
          const currentUserId = meta && meta.user && meta.user.value;
          const allUsers = all.map(({ id, firstName, lastName }) => ({
            value: id,
            label: lastName + " " + firstName,
          }));
          const currentUser = {
            value: currentUserId,
            label:
              users[currentUserId] &&
              users[currentUserId].lastName +
                " " +
                users[currentUserId].firstName,
          };
          return {
            currentUser,
            users: allUsers,
          };
        }
      ),
    [selectors]
  );
  const onChangeSelect = useCallback((e) =>
    dispatch(actions.changeCurrentUser(e.value))
  );
  const { currentUser, users } = useSelector(selectMeta);

  const renderComponent = useCallback(
    (entityId, props) => {
      // const type = grids[entityId].type;
      // console.log(type);
      return (
        <>
          {/* <Loader stateAPIStatus={stateAPIStatus}> */}
          {/* {type === GRIDTYPE.TABLE ? ( */}
          {true ? (
            <GridTableComponent
              {...{
                stateAPIStatus,
                actions,
                selectors,
                entityId,
              }}
            />
          ) : (
            <GridCardComponent
              {...{
                stateAPIStatus,
                actions,
                stateOffset: entityId,
                ...props,
              }}
            />
          )}
          {/* </Loader> */}
        </>
      );
    },
    [stateAPIStatus]
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
          <Breadcrumb.Item>faHome</Breadcrumb.Item>
          <Breadcrumb.Item active>Touren</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="col-12 py-2">{renderComponent("tours")}</div>
    </>
  );
}, isEqual);

Tours.displayName = "Tours";
