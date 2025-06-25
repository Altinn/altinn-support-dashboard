import React from 'react';
import { Textfield, Paragraph, Tooltip } from '@digdir/designsystemet-react';

interface FullNameFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const FullNameField: React.FC<FullNameFieldProps> = ({ 
    value, 
    onChange, 
    error 
}) => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Fullt navn *
                </Paragraph>
                <Tooltip content="Det fulle navnet på organisasjonen. Dette vises i grensesnittet." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <Textfield
                id="fullName"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                size="medium"
                style={{ width: '100%' }}
                errorMessage={error}
                helperText={!error ? "Organisasjonens fulle navn" : undefined}
            />
        </div>
    );
};
