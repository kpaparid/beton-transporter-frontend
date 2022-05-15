import { Button } from "@themesberg/react-bootstrap";
import { memo, useCallback } from "react";

const StatusBadges = memo(({ value, isEditable, onChange, maxWidth }) => {
  const enabled = value !== "0";

  const handleClick = useCallback(() => {
    const v = enabled ? "0" : "1";
    onChange(v);
  }, [onChange, enabled]);

  return (
    <div
      className={`d-flex flex-nowrap justify-content-center `}
      style={{ maxWidth, minWidth: maxWidth }}
    >
      <Badge
        onClick={handleClick}
        enabled={true}
        variant={enabled ? "duodenary" : "denary"}
        isEditable={isEditable}
      >
        {enabled ? "Enabled" : "Disabled"}
      </Badge>
    </div>
  );
});
const Badge = ({ children, enabled, variant, isEditable, onClick }) => {
  const bg = isEditable && enabled ? variant : isEditable ? "light" : variant;
  return (
    (enabled || isEditable) && (
      <div className="badge-wrapper px-2">
        <Button
          active={enabled}
          className="px-2 py-1"
          variant={bg}
          style={{ fontSize: "14px" }}
          onClick={() => isEditable && onClick(children)}
        >
          {children}
        </Button>
      </div>
    )
  );
};
export default StatusBadges;
