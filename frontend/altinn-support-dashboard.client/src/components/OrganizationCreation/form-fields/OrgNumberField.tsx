import React, { useState, useEffect, useCallback } from 'react';
import { Textfield, Paragraph, Tooltip, Alert, Heading, Button } from '@digdir/designsystemet-react';
import { useOrganizationCreation } from '../hooks/useOrganizationCreation';
import { BrregEnhetsdetaljer } from '../models/organizationTypes';

interface OrgNumberFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onFetchOrgDetails?: (orgDetails: BrregEnhetsdetaljer) => void;
    onReset?: () => void; // Callback for clearing form data
}

export const OrgNumberField: React.FC<OrgNumberFieldProps> = ({ 
    value, 
    onChange, 
    error,
    onFetchOrgDetails,
    onReset
}) => {
    const { getEnhetsdetaljer, resetOrgFetchState } = useOrganizationCreation('Production'); // Alltid bruk Production for Brreg-søk
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    
    // Ref for å spore om vi har kalt onFetchOrgDetails for gjeldende orgnummer
    const hasCalledCallback = React.useRef<{[orgNumber: string]: boolean}>({});
    
    // Refs for å unngå gjentatte API-kall og callbacks
    const previousOrgNumber = React.useRef<string>("");
    const isInitialMount = React.useRef<boolean>(true);
    
    // Funksjon for å hente organisasjonsdetaljer - redusert avhengigheter
    const fetchOrgDetails = useCallback(async (orgNumber: string) => {
        // Sjekk om organisasjonsnummeret allerede er behandlet
        if (hasCalledCallback.current[orgNumber]) {
            console.log(`Har allerede kalt callback for ${orgNumber}, hopper over`);
            return;
        }
        
        // Sjekk om vi allerede har suksess med dette nummeret
        if (success && previousOrgNumber.current === orgNumber) {
            console.log(`Allerede suksess med ${orgNumber}, hopper over`);
            return;
        }
        
        console.log(`Starter søk på organisasjonsnummer: ${orgNumber}`);
        
        setIsLoading(true);
        setErrorMessage(null);
        
        try {
            // Hent organisasjonsdetaljer fra API
            const orgDetails = await getEnhetsdetaljer(orgNumber);
            
            if (!orgDetails) {
                setErrorMessage('Fant ikke organisasjon med dette organisasjonsnummeret');
                setSuccess(false);
                return;
            }
            
            console.log('Fant organisasjon:', orgDetails);
            setSuccess(true);
            setErrorMessage(null);
            
            // Marker at vi har kalt callback for dette orgnummeret
            hasCalledCallback.current[orgNumber] = true;
            
            // Kall callback-funksjonen med organisasjonsdetaljene hvis den er definert
            if (onFetchOrgDetails) {
                console.log('Kaller onFetchOrgDetails med organisasjonsdetaljer');
                onFetchOrgDetails(orgDetails);
            }
        } catch (error) {
            console.error('Feil ved søk på organisasjonsnummer:', error);
            setErrorMessage('Det oppstod en teknisk feil ved søk etter organisasjonen. Du kan fortsatt legge inn informasjonen manuelt.');
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }, [getEnhetsdetaljer, onFetchOrgDetails, success]); // La til success for å fikse lint-feil
    
    // Reagerer på endring av organisasjonsnummer - med beskyttelse mot infinite loops
    useEffect(() => {
        // Skip på første rendering
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        // Check if org number is complete (9 digits) and has changed since last time
        if (value && value.length === 9 && value !== previousOrgNumber.current) {
            // Lagre nåværende orgnr for å unngå gjentatte kall
            previousOrgNumber.current = value;
            console.log(`Nytt 9-sifret organisasjonsnummer registrert: ${value}, kaller fetchOrgDetails`);
            fetchOrgDetails(value);
        } else if (value !== previousOrgNumber.current) {
            // Reset states if input changes and is not complete or different
            if (!success || value.length !== 9) {
                setErrorMessage(null);
                setSuccess(false);
            }
            
            // Hvis verdien er betydelig endret, nullstill tidligere verdi
            if (value.length <= 2) {
                previousOrgNumber.current = "";
            }
        }
    }, [value, fetchOrgDetails]); // value trengs her for å reagere på endringer


    
    // Handle reset form
    const handleReset = () => {
        setSuccess(false);
        setErrorMessage(null);
        onChange(""); // Clear the org number field
        resetOrgFetchState(); // Reset hook state to allow new API calls
        hasCalledCallback.current = {}; // Reset callback tracking
        previousOrgNumber.current = ""; // Reset previous org number ref
        console.log('Organizasjonsnummer felt nullstilt - all sporing og caching nullstilt');
        
        if (onReset) {
            onReset(); // Clear other form fields via callback
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Organisasjonsnummer *
                </Paragraph>
                <Tooltip content="Organisasjonens organisasjonsnummer i Brønnøysundregistrene (9 siffer). Informasjon hentes automatisk når du skriver inn et gyldig organisasjonsnummer." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flexGrow: 1 }}>
                    <Textfield 
                        label=""
                        value={value} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            // Clear error message when user types to prevent stale errors
                            if (errorMessage) setErrorMessage(null);
                            onChange(e.target.value.replace(/[^0-9]/g, '')); // Only allow numbers
                        }} 
                        placeholder="9 siffer (f.eks 991825827)"
                        disabled={isLoading || success} // Disable during loading or when successful
                        error={error} // Pass through external error from form validation
                    />
                </div>
                
                {(success || errorMessage) && (
                    <div style={{ marginLeft: '8px', marginTop: '24px' }}>
                        <Button
                            data-size="sm"
                            data-variant="tertiary"
                            onClick={handleReset}
                            aria-label="Fjern organisasjon og nullstill skjema"
                            style={{ color: 'var(--color-danger-500)' }}
                        >
                            Fjern
                        </Button>
                    </div>
                )}
            </div>
            
            {success && (
                <div style={{ marginTop: '8px' }}>
                    <Alert data-color="success">
                        <Heading level={2} data-size="xs" style={{ marginBottom: 'var(--ds-size-2)' }}>
                            Organisasjon funnet!
                        </Heading>
                        <Paragraph>
                            Informasjon fra Brønnøysundregistrene er hentet og fylt ut automatisk i skjemaet.
                            Kontroller at informasjonen er korrekt før du fortsetter.
                        </Paragraph>
                    </Alert>
                </div>
            )}
            
            {errorMessage && !success && (
                <div style={{ marginTop: '8px' }}>
                    <Alert data-color="info">
                        <Heading level={2} data-size="xs" style={{ marginBottom: 'var(--ds-size-2)' }}>
                            Organisasjon ikke funnet
                        </Heading>
                        <Paragraph>
                            {errorMessage}
                        </Paragraph>
                    </Alert>
                </div>
            )}
        </div>
    );
};
