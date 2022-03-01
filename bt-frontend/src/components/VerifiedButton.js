import { faCheck, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup } from "@themesberg/react-bootstrap";
import { memo } from "react";

const VerifiedButton = memo(({ value, isEditable, onChange }) => {
  const active1 = parseInt(value) === 1;
  const active2 = parseInt(value) === 0;
  const active3 = parseInt(value) === -1;
  const className1 =
    active1 || isEditable ? "text-confirmed" : "text-confirmed opacity-0";
  const className2 =
    active2 || isEditable ? "text-pending" : "text-pending opacity-0";
  const className3 =
    active3 || isEditable ? "text-declined" : "text-declined opacity-0";
  const disabled = !isEditable;
  return (
    <div className={`verified-wrapper ${isEditable ? "editable" : ""}`}>
      <Button
        active={active1}
        disabled={disabled}
        variant="transparent"
        className={`left ${className1}`}
        onClick={() => onChange(1)}
      >
        <FontAwesomeIcon icon={faCheck} />
      </Button>
      <Button
        active={active2}
        disabled={disabled}
        variant="transparent"
        className={`center ${className2}`}
        onClick={() => onChange(0)}
      >
        <FontAwesomeIcon icon={faMinus} />
      </Button>
      <Button
        active={active3}
        disabled={disabled}
        variant="transparent"
        className={`right ${className3}`}
        onClick={() => onChange(-1)}
      >
        <FontAwesomeIcon icon={faTimes} />
      </Button>
    </div>
  );
});
export default VerifiedButton;
