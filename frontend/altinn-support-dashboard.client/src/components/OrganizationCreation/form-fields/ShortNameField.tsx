import React, { useState, useEffect } from 'react';
import { Textfield, Paragraph, Tooltip } from '@digdir/designsystemet-react';

interface ShortNameFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    isCheckingName: boolean;
    nameExists: boolean | null;
    checkNameExists: (name: string) => Promise<boolean>;
}

export const ShortNameField: React.FC<ShortNameFieldProps> = ({ 
    value, 
    onChange, 
    error,
    isCheckingName,
    nameExists,
    checkNameExists
}) => {
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
        const checkName = async () => {
            if (debouncedValue && debouncedValue.length >= 2) {
                await checkNameExists(debouncedValue);
            }
        };
        
        checkName();
    }, [debouncedValue, checkNameExists]);
    
    // Helper for status messages below the input
    const getStatusMessage = () => {
        if (error) {
            return { text: error, color: "#D41E1E" }; // Red for error
        }
        if (isCheckingName) {
            return { text: "Sjekker om navnet er tilgjengelig...", color: "#6A6A6A" }; // Gray for checking
        }
        if (nameExists === true) {
            return { text: `Organisasjonen '${value}' eksisterer allerede i Altinn Studio.`, color: "#D41E1E" }; // Red for exists
        }
        if (nameExists === false && value.length >= 2) {
            return { text: "Navnet er tilgjengelig", color: "#2D8659" }; // Green for available
        }
        return { text: "2-5 tegn, små bokstaver/tall. Kan inneholde bindestrek (-)", color: "#6A6A6A" }; // Gray for default
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
                style={{ width: '100%' }}
                hideLabel
                disabled={isCheckingName}
            />
            <div style={{ 
                fontSize: '14px', 
                marginTop: '4px', 
                color: getStatusMessage().color,
                transition: 'color 0.3s ease'
            }}>
                {getStatusMessage().text}
            </div>
        </div>
    );
};
