import React from "react";
import { Box } from "@mui/material";
import { setLocalStorageValue, } from "./utils/storageUtils";
import ManualRoleSearchTextField from "./ManualRoleSearchTextfield";


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
    <Box sx={{display: "flex" , gap: 2, alignItems: "center" , mb: 2}}>
      <ManualRoleSearchTextField
        label="Tilganger fra"
        value={rollegiver || ""}
        onChange={(value) => {
          setRollegiver?.(value);
          setLocalStorageValue("rollegiver", value);
        }}
        tooltip = "Organisasjonsnummeret til virksomheten som gir rollen"
      />
      <ManualRoleSearchTextField
        label="Tilganger til"
        value={rollehaver || ""}
        onChange={(value) => {
          setRollehaver?.(value);
          setLocalStorageValue("rollehaver", value);
        }}
        tooltip = "Organisasjonsnummeret til virksomheten som har rollen"
      />
    </Box>
   );
};

export default InputComponent;