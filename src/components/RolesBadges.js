import { Button } from "@themesberg/react-bootstrap";
import { memo, useCallback } from "react";

const RolesBadges = memo(({ value, isEditable, onChange, maxWidth }) => {
  const isUser = value.includes("ROLE_USER");
  const isDriver = value.includes("ROLE_DRIVER");
  const isAdmin = value.includes("ROLE_ADMIN");
  const isSuper = value.includes("ROLE_SUPER");

  const handleClick = useCallback(
    (name) => {
      const v = "ROLE_" + name.toUpperCase();
      const add = !value.includes(v);
      const arr = add ? [...value, v] : value.filter((r) => r !== v);
      onChange(arr);
    },
    [onChange, value]
  );

  return (
    <div
      className={`d-flex flex-wrap justify-content-center ${
        isEditable ? "editable" : ""
      }`}
      style={{ maxWidth, minWidth: maxWidth }}
    >
      <RoleBadge
        onClick={handleClick}
        enabled={isUser}
        variant="light-tertiary"
        isEditable={isEditable}
      >
        User
      </RoleBadge>
      <RoleBadge
        onClick={handleClick}
        enabled={isDriver}
        variant="very-light-blue"
        isEditable={isEditable}
      >
        Driver
      </RoleBadge>
      <RoleBadge
        onClick={handleClick}
        enabled={isAdmin}
        variant="quinary"
        isEditable={isEditable}
      >
        Admin
      </RoleBadge>

      <RoleBadge enabled={isSuper} variant="senary">
        Super
      </RoleBadge>
    </div>
  );
});
const RoleBadge = ({ children, enabled, variant, isEditable, onClick }) => {
  const bg = isEditable && enabled ? variant : isEditable ? "light" : variant;
  return (
    <>
      {(enabled || isEditable) && (
        <div className="badge-wrapper p-1">
          <Button
            active={enabled}
            className="px-2 py-1"
            variant={bg}
            style={{ fontSize: "14px", height: "31px" }}
            onClick={() => isEditable && onClick(children)}
          >
            {children}
          </Button>
        </div>
      )}
    </>
  );
};
export default RolesBadges;
