import React from "react";
import { setLocalStorageValue, } from "./utils/storageUtils";
import ManualRoleSearchTextField from "./ManualRoleSearchTextfield";
import { Tooltip } from "@digdir/designsystemet-react";


type InputComponentProps = {
  rollehaver?: string;
  rollegiver?: string;
  setRollehaver?: (value: string) => void;
  setRollegiver?: (value: string) => void;
};

const InputComponent: React.FC<InputComponentProps> = ({
    rollehaver,
    rollegiver,
    setRollehaver,
    setRollegiver,
  }) => {

  return (
    <>
      <Tooltip content = "Organisasjonsnummeret til virksomheten som gir rollen" placement="bottom">
        <span>
          <ManualRoleSearchTextField
            label="Tilganger fra"
            value={rollegiver || ""}
            onChange={(value) => {
              setRollegiver?.(value);
              setLocalStorageValue("rollegiver", value);
            }}
          />
        </span>
      </Tooltip>
      <Tooltip content = "Organisasjonsnummeret til virksomheten som har rollen" placement="bottom">
      <span>
        <ManualRoleSearchTextField
          label="Tilganger til"
          value={rollehaver || ""}
          onChange={(value) => {
            setRollehaver?.(value);
            setLocalStorageValue("rollehaver", value);
          }}
        />
        </span>
      </Tooltip>
    </>
   );
};

export default InputComponent;