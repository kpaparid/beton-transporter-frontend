import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Row } from "@themesberg/react-bootstrap";
import moment from "moment";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { TimePickerModal } from "../../components/TimePicker";
import { useAuth } from "../../contexts/AuthContext";
import { MyRoutes } from "../../routes";
import { useServices } from "../myComponents/util/services";

const AddWorkHours = () => {
  const location = useLocation();
  const state = location.state;
  const { currentUser } = useAuth();
  const { postWorkHour } = useServices();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();

  const saveEnabled =
    watch("begin") &&
    watch("end") &&
    watch("pause") &&
    watch("date") &&
    watch("driver");

  const onSubmit = useCallback(
    (data) => {
      postWorkHour([{ ...data, driver: currentUser.uid }])
        .then(() => navigate(MyRoutes.UserWorkHours.path))
        .catch((er) => {
          console.log(er);
        });
    },
    [postWorkHour, currentUser?.uid]
  );

  useEffect(() => {
    register("begin", { required: true });
    register("end", { required: true });
    register("pause", { required: true });
    register("date", { required: true });
    register("driver", { required: true });

    if (state?.workHour) {
      setValue("id", state.workHour.id);
      setValue("begin", state.workHour.begin);
      setValue("end", state.workHour.end);
      setValue("pause", state.workHour.pause);
      setValue("date", state.workHour.date);
      setValue("driver", state.workHour.driver + "");
    } else {
      setValue("date", moment().format("YYYY.MM.DD"));
      setValue("driver", currentUser.displayName || currentUser.email);
    }
  }, [currentUser, state]);

  return (
    <>
      <div
        className={` w-100 h-100 align-items-center justify-content-center d-flex flex-column bg-darker-nonary`}
      >
        <form className="w-100 d-flex justify-content-center">
          <div className="p-3 w-100" style={{ maxWidth: "400px" }}>
            <Row>
              <div className="w-100 py-4">
                <TimePicker
                  value={watch("begin")}
                  title={"Begin"}
                  onChange={(e) => setValue("begin", e)}
                />
                <TimePicker
                  value={watch("end")}
                  title={"End"}
                  onChange={(e) => setValue("end", e)}
                />
                <TimePicker
                  value={watch("pause")}
                  title={"Pause"}
                  onChange={(e) => setValue("pause", e)}
                />
              </div>
            </Row>
            <div className="d-flex flex-wrap w-100 justify-content-center bottom-0">
              <div className="px-2">
                <Button
                  className="fw-bolder"
                  variant="nonary"
                  style={{
                    width: "80px",
                    fontWeight: "800",
                  }}
                  onClick={() => navigate(MyRoutes.UserWorkHours.path)}
                >
                  Cancel
                </Button>
              </div>
              <div className="px-2">
                <Button
                  className="text-nonary fw-bolder"
                  variant={saveEnabled ? "senary" : "senary"}
                  disabled={!saveEnabled}
                  style={{
                    width: "80px",
                    fontWeight: "800",
                  }}
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
const TimePicker = ({ title, value, onChange }) => {
  return (
    <div className="p-1">
      <TimePickerModal
        buttonVariant={value ? "senary" : "nonary"}
        timeVariant="nonary"
        timeActiveVariant="senary"
        buttonClassName="w-100 p-0"
        buttonText={
          <BCard title={title}>
            {value || (
              <div className="pe-2">
                <FontAwesomeIcon icon={faPlus} size="xs" />
              </div>
            )}
          </BCard>
        }
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
const BCard = ({ title, children, titleWidth = "50px", contentWidth }) => {
  return (
    <Card bg="transparent border-0">
      <Card.Body className="d-flex flex-nowrap justify-content-between align-items-center p-3 border-0 fw-bolder">
        <div
          className="text-start text-break text-wrap"
          style={{ fontWeight: "800", minWidth: titleWidth }}
        >
          {title}
        </div>
        <div
          className="d-flex justify-content-end"
          style={{ width: contentWidth }}
        >
          <div className="text-end text-break text-wrap">{children}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AddWorkHours;
