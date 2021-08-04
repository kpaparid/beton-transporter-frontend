import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTourTable } from "./MyConsts";
import {
  Col,
  Row,
  Nav,
  Card,
  Image,
  Button,
  Table,
  ProgressBar,
  Pagination,
  Form,
} from "@themesberg/react-bootstrap";
import { ACTIONS } from "../reducers/redux";
import { MyTextArea } from "./TextArea/MyTextArea";
import { loadToursData } from "../reducers/loadToursData";
import { MyInput } from "./MyInput";
import { HeaderRow } from "./MyTableRow";
import { MyTable, TourTable5 } from "./TourTable2";

export const MyTourTable = (props) => {
  const stateAPIStatus = useLoadToursData();
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
  // const state = useSelector((state) => state.tourTable);
  // useEffect(() => {
  //   console.log("NEW State", state);
  // }, [state]);
  return (
    <Card border="light">
      <Card.Body className="px-1">
        {stateAPIStatus !== "success" && (
          <div className="w-100 h-100 text-center">
            <h2>LOADING</h2>
          </div>
        )}
        {stateAPIStatus === "success" && (
          <>
            <TourTable5></TourTable5>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
