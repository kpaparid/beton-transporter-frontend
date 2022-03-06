import { Button } from "@themesberg/react-bootstrap";
import isEqual from "lodash.isequal";
import moment from "moment";
import { memo } from "react";
import { useSelector } from "react-redux";
import { getGridTitle } from "../../pages/myComponents/util/labels";
import { MonthSelectorDropdown } from "../MonthPicker";
import { YearSelectorDropdown } from "../YearPicker";

const TitleComponent = memo(({ entityId, selectTableDate, onChange }) => {
  const title = getGridTitle(entityId);
  const tableDate = useSelector(selectTableDate);

  return entityId === "workHours" ||
    entityId === "tours" ||
    entityId === "publicHolidays" ||
    entityId === "workHoursByDate" ? (
    <MonthSelectorDropdown
      onChange={onChange}
      title={title}
      date={moment(tableDate, moment.ISO_8601).format("YYYY.MM")}
    />
  ) : entityId === "" ? (
    <YearSelectorDropdown
      onChange={onChange}
      title={title}
      date={moment(tableDate, moment.ISO_8601).format("YYYY")}
    />
  ) : (
    <Button variant="transparent" className="btn-title text-wrap w-100">
      <h5> {title} </h5>
    </Button>
  );
}, isEqual);
export default TitleComponent;
