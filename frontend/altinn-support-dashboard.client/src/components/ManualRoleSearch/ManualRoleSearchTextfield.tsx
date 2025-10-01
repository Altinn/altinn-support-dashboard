import React from "react";
import { Textfield } from '@digdir/designsystemet-react';
import style from "./styles/Textfield.module.css";

type ManualRoleSearchTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
}
    
const ManualRoleSearchTextField: React.FC<ManualRoleSearchTextFieldProps> = ({
        label,
        value,
        onChange,
    }) => {
    return (
        <div className={style["textfield-div"]}>
            <Textfield
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default ManualRoleSearchTextField;