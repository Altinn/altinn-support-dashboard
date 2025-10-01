import React from "react";
import { setLocalStorageValue, } from "./utils/storageUtils";
import ManualRoleSearchTextField from "./ManualRoleSearchTextfield";
import { Tooltip } from "@digdir/designsystemet-react";
import style from "./styles/InputComponent.module.css";


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
    <div className={style["input-fields"]}>
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
    </div>
   );
};

export default InputComponent;