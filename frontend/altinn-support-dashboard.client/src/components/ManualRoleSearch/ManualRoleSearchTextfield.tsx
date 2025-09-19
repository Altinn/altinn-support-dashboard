import React from "react";
import { 
    TextField,
    InputAdornment,
    Tooltip,
    IconButton    
 } from "@mui/material";
 import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

type ManualRoleSearchTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tooltip: string;
}
    
const ManualRoleSearchTextField: React.FC<ManualRoleSearchTextFieldProps> = ({
        label,
        value,
        onChange,
        tooltip
    }) => {
    return (
        <TextField
            label={label}
            variant="outlined"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Tooltip title={tooltip}>
                            <IconButton>
                                <HelpOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                )
            }}
            fullWidth
        />
    );
};

export default ManualRoleSearchTextField;