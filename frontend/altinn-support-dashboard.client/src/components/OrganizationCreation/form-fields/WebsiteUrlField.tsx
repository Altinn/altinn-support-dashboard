import React from 'react';
import { Textfield, Paragraph, Tooltip } from '@digdir/designsystemet-react';

interface WebsiteUrlFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const WebsiteUrlField: React.FC<WebsiteUrlFieldProps> = ({ 
    value, 
    onChange, 
    error 
}) => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Nettside
                </Paragraph>
                <Tooltip content="Organisasjonens nettside. Dette er valgfritt, men anbefales." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <Textfield
                value={value.replace(/^https?:\/\//, '')}
                onChange={(e) => {
                    // Store the value without prefix in the form state
                    // The validation will handle adding the prefix when needed
                    const inputValue = e.target.value;
                    onChange(inputValue);
                    console.log('WebsiteUrl changed:', inputValue);
                }}
                size="small"
                prefix="https://"
                style={{ width: '100%' }}
                error={!!error}
                errorText={error}
                description={!error ? "F.eks. eksempel.no" : undefined}
                placeholder="www.domene.no"
            />
        </div>
    );
};
