import React, { memo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from "@themesberg/react-bootstrap";

import { isEqual } from "lodash";
import { useLoadData } from "./myComponents/MyConsts";
import { workHoursSlice } from "./reducers/redux2";
import { GridTableComponent, Loader } from "./myComponents/Table/GridComponent";

export const Tours = memo(() => {
  const { actions, selectors } = workHoursSlice;
  const stateAPIStatus = useLoadData("toursTable", actions);
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

      <div className="col-12 py-2">{renderComponent("tours")}</div>
    </>
  );
}, isEqual);

Tours.displayName = "Tours";
