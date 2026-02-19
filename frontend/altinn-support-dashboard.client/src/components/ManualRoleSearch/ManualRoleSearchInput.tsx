import React, { useState } from "react";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "./utils/storageUtils";
import ManualRoleSearchTextField from "./ManualRoleSearchTextfield";
import { Button, Tooltip } from "@digdir/designsystemet-react";
import style from "./styles/InputComponent.module.css";
import SearchButton from "./ManualRoleSearchButton";

type InputComponentProps = {
  setRollehaver: (value: string) => void;
  setRollegiver: (value: string) => void;
};

const InputComponent: React.FC<InputComponentProps> = ({
  setRollehaver,
  setRollegiver,
}) => {
  const [localRollehaver, setLocalRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver") || "",
  );
  const [localRollegiver, setLocalRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver") || "",
  );

  const handleSearch = () => {
    setRollegiver(localRollegiver);
    setRollehaver(localRollehaver);
  };

  const clearSearch = () => {
    setLocalRollegiver("");
    setLocalRollehaver("");
    setLocalStorageValue("rollegiver", "");
    setLocalStorageValue("rollehaver", "");
  };

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
      <div className={style["button-group"]}>
        <SearchButton
          handleSearch={handleSearch}
        />
        {(localRollehaver.trim() !== "" || localRollegiver.trim() !== "") && (
          <Button variant="secondary" onClick={clearSearch}>
            Tøm søk
          </Button>
        )}
      </div>
    </div>
  );
};

export default InputComponent;
