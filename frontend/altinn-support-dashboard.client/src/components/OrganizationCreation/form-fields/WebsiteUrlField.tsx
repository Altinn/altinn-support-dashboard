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
                value={value}
                onChange={(e) => onChange(e.target.value)}
                size="small"
                style={{ width: '100%' }}
                error={!!error}
                errorText={error}
                description={!error ? "F.eks. https://www.eksempel.no" : undefined}
                placeholder="https://www.domene.no"
            />
        </div>
    );
};
