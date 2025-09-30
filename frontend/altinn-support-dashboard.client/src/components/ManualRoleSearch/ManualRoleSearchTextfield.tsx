import React from "react";
 import { Textfield, Tooltip } from '@digdir/designsystemet-react';

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
        <>
            <Textfield
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </>
    );
};

export default ManualRoleSearchTextField;