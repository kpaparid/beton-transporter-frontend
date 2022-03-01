import { isEqual } from "lodash";
import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadData } from "../../api/apiMappers";
import { ComponentPreLoader } from "../../components/ComponentPreLoader";
import { GridTableComponent } from "../../components/Table/GridComponent";
import { gridTableSlice } from "../reducers/redux";

const useLoader = (stateAPIStatus) => {
  const navigate = useNavigate();
  if (stateAPIStatus === "success") {
    return <UsersComponent />;
  } else if (stateAPIStatus === "error") {
    return navigate("/500");
  } else {
    return (
      <div className="d-flex h-100 align-items-center">
        <ComponentPreLoader show={true} />
      </div>
    );
  }
};
export const Users = () => {
  const { actions } = gridTableSlice;
  const stateAPIStatus = useLoadData("usersTable", actions);
  return useLoader(stateAPIStatus);
};

const UsersComponent = memo(() => {
  const { actions, selectors } = gridTableSlice;
  const renderComponent = useCallback(
    (entityId) => (
      <GridTableComponent
        {...{
          stateAPIStatus: "success",
          actions,
          selectors,
          entityId,
        }}
      />
    ),
    [selectors, actions]
  );

  return (
    <div className="d-flex flex-wrap w-100">
      <div className="col-12">{renderComponent("users")}</div>
    </div>
  );
}, isEqual);

export default Users;
