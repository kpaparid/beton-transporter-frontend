import { Dropdown } from "@themesberg/react-bootstrap";
import { isEqual } from "lodash";
import { memo, useCallback, useEffect } from "react";
import { ButtonGroup } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import { CustomDropdown } from "./Filters/CustomDropdown";
import { useGeoAddresses } from "../pages/myComponents/util/services";

export const AddressPicker = memo(({ inputStyle, value, onChange }) => {
  const { places, onChange: handlePlaceChange } = useGeoAddresses();

  const handlePlaceInputChange = useCallback(
    (e) => onChange(e.target.value),
    [onChange]
  );
  useEffect(() => handlePlaceChange(value), [value, handlePlaceChange]);
  return (
    <div className="p-1 w-100 address-picker">
      <CustomDropdown
        as={ButtonGroup}
        className={`w-100 `}
        toggleAs="custom"
        toggleClassName="p-0 border-0"
        portal={false}
        variant="transparent"
        align="end"
        drop="down"
        value={
          <div>
            <TextareaAutosize
              value={value || ""}
              minRows={1}
              style={{ ...inputStyle }}
              onChange={handlePlaceInputChange}
            />
          </div>
        }
      >
        <div className="">
          {places?.map((p) => (
            <Dropdown.Item
              className={
                "text-break text-wrap w-100 dropdown-item" +
                (p === value ? " active" : " non-active")
              }
              key={p}
              onClick={(e) => {
                onChange(p);
                e.target.blur();
              }}
            >
              {p}
            </Dropdown.Item>
          ))}
        </div>
      </CustomDropdown>
    </div>
  );
}, isEqual);
