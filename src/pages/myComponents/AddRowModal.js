import React, { memo, useEffect, useMemo, useState } from "react";
import { Card, Form, Modal } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import "./MyForm.css";
import { MyBtn } from "./MyButtons";
import { TextField, ThemeProvider, Button, Grid } from "@mui/material";
import {
  MuiCustomDatePicker,
  MuiCustomTimePicker,
  MuiCustomSelect,
  inputComponentsTheme,
  MuiCustomTextField,
  MuiController,
} from "./InputComponents";

import { useForm, Controller } from "react-hook-form";
import moment from "moment";
const ModalRow = memo(
  ({
    onChange,
    text,
    grid,
    measurement,
    id,
    type,
    availableValues,
    control,
    required,
    ...rest
  }) => {
    const theme = useMemo(() => inputComponentsTheme, []);
    const t = type === "text" ? type : "number";
    const input =
      type === "constant" ? (
        <MuiController
          id={id}
          control={control}
          label={text}
          availableValues={availableValues}
          rules={{ required, validate: (value) => value !== undefined }}
          Input={(params) => <MuiCustomSelect {...params} />}
        />
      ) : type === "time" ? (
        <MuiController
          id={id}
          control={control}
          label={text}
          rules={{
            required,
            validate: (value) => moment(value, "HH:mm", true).isValid(),
          }}
          Input={(params) => <MuiCustomTimePicker {...params} />}
        />
      ) : type === "date" ? (
        <MuiController
          id={id}
          control={control}
          label={text}
          rules={{
            required,
            validate: (value) => moment(value, "DD/MM/YYYY", true).isValid(),
          }}
          Input={(params) => <MuiCustomDatePicker {...params} />}
        ></MuiController>
      ) : (
        <MuiController
          id={id}
          control={control}
          label={text}
          multiline={type === "multiline"}
          type={t}
          rules={{ required, min: t === "number" && 0 }}
          Input={(params) => <TextField {...params} />}
        />
      );

    return (
      <Grid item md={grid} sm={12} xs={12} className="p-2">
        <ThemeProvider theme={theme}>{input}</ThemeProvider>
      </Grid>
    );
  },
  isEqual
);
const AddRowModal = memo(({ labels, title, show, onClose }) => {
  const [row, setRow] = useState({});
  function handleChange(id, value) {
    setRow((old) => ({ ...old, [id]: value }));
  }

  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <MyModal
        Header={Header({ title })}
        Body={
          <Body
            labels={labels}
            onChange={handleChange}
            control={control}
          ></Body>
        }
        Footer={<Footer onSubmit={handleSubmit(onSubmit)}></Footer>}
        title={title}
        show={show}
        onClose={onClose}
      />
    </>
  );
}, isEqual);
const Header = ({ title = "Add Row" }) => {
  return (
    <>
      <Modal.Title className="h4">{title}</Modal.Title>
    </>
  );
};
const Body = memo((props) => {
  const { labels, onChange, control } = props;
  console.log(labels);
  return (
    <>
      <Form>
        <Form.Group
          className="d-flex flex-wrap justify-content-around"
          controlId="formBasicEmail"
        >
          <Grid container spacing={6} className="w-100 m-0">
            {[8, 4, 12, 12].map((pageGrid, pageIndex) => {
              return (
                <Grid
                  item
                  xl={pageGrid}
                  md={pageGrid}
                  sm={12}
                  className="p-4"
                  key={"gridItem-" + pageIndex}
                >
                  <Card className="w-100 h-100">
                    <Card.Body>
                      <Grid
                        container
                        direction="row"
                        className="w-100 h-100 m-0"
                        alignItems="center"
                        justifyContent="space-around"
                      >
                        {labels
                          .filter((l) => l.page === pageIndex + 1)
                          .map((label, index) => {
                            return (
                              <ModalRow
                                control={control}
                                key={index}
                                {...label}
                                onChange={onChange}
                              />
                            );
                          })}
                      </Grid>
                    </Card.Body>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Form.Group>
      </Form>
    </>
  );
}, isEqual);

const Footer = ({ onSubmit }) => {
  return (
    <>
      <MyBtn onClick={onSubmit} value="Submit" className="primary-btn"></MyBtn>
    </>
  );
};
export const MyModal = (props) => {
  const {
    Header = () => <></>,
    Body = () => <></>,
    Footer = () => <></>,
    show,
    onClose,
    title,
    onSubmit,
  } = props;

  return (
    <>
      <Modal
        as={Modal.Body}
        fullscreen={false}
        show={show}
        onHide={onClose}
        size="xl"
      >
        <div className="px-0 light-green">
          <Modal.Header className="justify-content-center my-secondary-bg">
            {Header}
          </Modal.Header>
          <Modal.Body>{Body}</Modal.Body>
          <Modal.Footer className="justify-content-center">
            {Footer}
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
export default AddRowModal;
