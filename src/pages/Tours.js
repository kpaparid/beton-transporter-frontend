import React, { useEffect, useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from "@themesberg/react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { MyTourTable } from "./myComponents/MyTourTable";

import {
  editMode,
  hiddenColumnsReselect,
  nestedFilterTourData,
  reactTableData,
  tourDate,
  visibleHeaders,
} from "./myComponents/MySelectors";
import { loadToursData } from "./reducers/loadToursData";
import { ACTIONS } from "./reducers/redux";
import { MonthSelectorDropdown } from "./myComponents/MyOwnCalendar";

export const Tours = memo(() => {
  const dispatch = useDispatch();
  const dataSelector = reactTableData;
  const headersSelector = visibleHeaders;
  const hiddenColumnsSelector = hiddenColumnsReselect;
  const editSelector = editMode;
  const stateAPIStatus = useLoadToursData();
  const dateSelector = tourDate;
  const filterDataSelector = nestedFilterTourData;
  const date = useSelector(dateSelector);
  function handlerMonthChange(date) {
    dispatch({
      type: ACTIONS.TOURTABLE_CHANGE_TOURDATE,
      payload: {
        date: date,
      },
    });
  }
  const title = (
    <MonthSelectorDropdown
      title="Touren Alle Werke"
      date={date}
      onChange={handlerMonthChange}
    />
  );

  return (
    <>
      {/* <AddRowModal
        labels={allLabels}
        onClose={handleClose}
        show={showModalDefault}
      ></AddRowModal> */}
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
      <MyTourTable
        {...{
          title,
          stateAPIStatus,
          filterDataSelector,
          dataSelector,
          headersSelector,
          hiddenColumnsSelector,
          editSelector,
        }}
      />
    </>
  );
});
function useLoadToursData() {
  const [stateAPIStatus, setAPIStatus] = useState("idle");
  const dispatch = useDispatch();

  useEffect(() => {
    setAPIStatus("loading");
    loadToursData()
      .then((data) => {
        dispatch({
          type: ACTIONS.LOAD_TOUR_TABLE,
          payload: {
            table: data.table,
            labels: data.labels,
          },
        });
        setAPIStatus("success");
      })
      .catch((error) => {
        setAPIStatus("error");
      });
  }, [dispatch]);

  return stateAPIStatus;
}
