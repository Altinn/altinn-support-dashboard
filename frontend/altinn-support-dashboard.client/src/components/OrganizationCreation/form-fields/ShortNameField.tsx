import React, { useState, useEffect } from 'react';
import { Textfield, Paragraph, Tooltip } from '@digdir/designsystemet-react';
import { useOrganizationCreation } from '../hooks/useOrganizationCreation';

interface ShortNameFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    environment: string;
}

export const ShortNameField: React.FC<ShortNameFieldProps> = ({ 
    value, 
    onChange, 
    error,
    environment
}) => {
    const { isCheckingName, checkNameExists, nameExists } = useOrganizationCreation(environment);
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    // Debounce input for name check
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [value]);
    
    // Check if name exists after debounce
    useEffect(() => {
        if (debouncedValue && debouncedValue.length >= 2) {
            checkNameExists(debouncedValue);
        }
    }, [debouncedValue, checkNameExists]);
    
    const getHelperText = () => {
        if (error) return error;
        if (isCheckingName) return "Sjekker om navnet er tilgjengelig...";
        if (nameExists === true) return "Dette navnet er allerede i bruk";
        if (nameExists === false && value.length >= 2) return "Navnet er tilgjengelig";
        return "2-5 tegn, små bokstaver/tall. Kan inneholde bindestrek (-)";
    };
    
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Kortnavn (brukernavn) *
                </Paragraph>
                <Tooltip content="Kortnavnet brukes i URL-er og andre steder hvor et kort, unikt navn er nødvendig. Må være mellom 2-5 tegn." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <Textfield
                value={value}
                onChange={(e) => onChange(e.target.value.toLowerCase())}
                size="medium"
                style={{ width: '100%' }}
                errorMessage={error || (nameExists ? "Dette navnet er allerede i bruk" : undefined)}
                helperText={!error && !nameExists ? getHelperText() : undefined}
                disabled={isCheckingName}
            />
        </div>
    );
};
