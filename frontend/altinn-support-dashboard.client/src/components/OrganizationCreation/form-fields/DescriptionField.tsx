import React from 'react';
import { Paragraph, Tooltip, Textarea} from '@digdir/designsystemet-react';

interface DescriptionFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ 
    value, 
    onChange, 
    error 
}) => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Beskrivelse
                </Paragraph>
                <Tooltip content="En beskrivelse av organisasjonen og dens formål" placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            {error && (
                <div style={{ color: 'red', marginBottom: '8px', fontSize: '14px' }}>
                    {error}
                </div>
            )}
            
            <div>
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '10px',
                        borderRadius: '4px',
                        border: error ? '1px solid red' : '1px solid #ccc',
                        fontFamily: 'inherit',
                        fontSize: '14px'
                    }}
                    placeholder="Organisasjonens formål og aktiviteter"
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Beskrivelse hentes automatisk fra Brønnøysundregisteret når organisasjonsnummer fylles ut, men bør spesifiseres
                </div>
            </div>
        </div>
    );
};
