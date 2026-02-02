import React, { useEffect, useState } from "react";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "./utils/storageUtils";
import ManualRoleSearchTextField from "./ManualRoleSearchTextfield";
import { Tooltip } from "@digdir/designsystemet-react";
import style from "./styles/InputComponent.module.css";

type InputComponentProps = {
  setRollehaver: (value: string) => void;
  setRollegiver: (value: string) => void;
  searchTrigger: number;
};

const InputComponent: React.FC<InputComponentProps> = ({
  setRollehaver,
  setRollegiver,
  searchTrigger,
}) => {
  const [localRollehaver, setLocalRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver") || "",
  );
  const [localRollegiver, setLocalRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver") || "",
  );

  useEffect(() => {
    setRollegiver(localRollegiver);
    setRollehaver(localRollehaver);
  }, [searchTrigger]);

  return (
    <div className={style["input-fields"]}>
      <Tooltip
        content="Organisasjonsnummeret til virksomheten som gir rollen"
        placement="bottom"
      >
        <span>
          <ManualRoleSearchTextField
            label="Tilganger fra"
            value={localRollegiver || ""}
            onChange={(value) => {
              setLocalRollegiver?.(value);
              setLocalStorageValue("rollegiver", value);
            }}
          />
        </span>
      </Tooltip>
      <Tooltip
        content="Organisasjonsnummeret til virksomheten som har rollen"
        placement="bottom"
      >
        <span>
          <ManualRoleSearchTextField
            label="Tilganger til"
            value={localRollehaver || ""}
            onChange={(value) => {
              setLocalRollehaver?.(value);
              setLocalStorageValue("rollehaver", value);
            }}
          />
        </span>
      </Tooltip>
    </div>
  );
};

export default InputComponent;

