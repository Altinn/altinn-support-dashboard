import React from 'react';
import { Textfield, Paragraph, Tooltip } from '@digdir/designsystemet-react';

interface EmailDomainFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const EmailDomainField: React.FC<EmailDomainFieldProps> = ({ 
    value, 
    onChange, 
    error 
}) => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    E-postdomene
                </Paragraph>
                <Tooltip content="E-postdomenet som brukes av organisasjonen. Dette brukes for automatisk tilgangsstyring." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <Textfield
                value={value}
                onChange={(e) => onChange(e.target.value)}
                size="medium"
                style={{ width: '100%' }}
                errorMessage={error}
                helperText={!error ? "F.eks. eksempel.no" : undefined}
                placeholder="domene.no"
            />
        </div>
    );
};
