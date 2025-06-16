import { useState, useEffect, useRef, useCallback } from "react";
import { OrganizationFormData, OrganizationCreationResponse, BrregSearchResponse, BrregEnhetsdetaljer } from "../models/organizationTypes";

// Hjelpefunksjon for å få riktig base URL uten dobbel "api" i path
const getCorrectBaseUrl = (): string => {
    const apiHost = window.location.hostname;
    const protocol = window.location.protocol;
    const localDev = apiHost === 'localhost';
    const portSegment = localDev ? ':7174' : '';
    return `${protocol}//${apiHost}${portSegment}`;
};

/**
 * Hook for å håndtere opprettelse av organisasjoner
 */
export const useOrganizationCreation = (environment: string) => {
    // Hent miljø fra session storage hvis det er lagret
    const [activeEnvironment, setActiveEnvironment] = useState<string>(environment);
    
    useEffect(() => {
        const storedEnvironment = sessionStorage.getItem('selected_gitea_environment');
        if (storedEnvironment) {
            console.log(`Bruker lagret miljø fra session storage: ${storedEnvironment}`);
            setActiveEnvironment(storedEnvironment);
        } else {
            console.log(`Ingen lagret miljø funnet. Bruker prop-miljø: ${environment}`);
        }
    }, [environment]);

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isCheckingName, setIsCheckingName] = useState<boolean>(false);
    const [isSearchingBrreg, setIsSearchingBrreg] = useState<boolean>(false);
    const [nameExists, setNameExists] = useState<boolean | null>(null);
    const [shortNameError, setShortNameError] = useState<string | null>(null);
    const [brregResults, setBrregResults] = useState<BrregSearchResponse | null>(null);
    const [isFetchingOrgDetails, setIsFetchingOrgDetails] = useState<boolean>(false);
    const [orgDetails, setOrgDetails] = useState<BrregEnhetsdetaljer | null>(null);

    // Refs for å holde styr på forrige organisasjonsnavn som ble sjekket og forrige orgnummer
    const lastCheckedName = useRef<string>('');
    const lastCheckedOrgNumber = useRef<string>('');
    
    /**
     * Sjekker om et kortnavn allerede eksisterer, med debounce-funksjonalitet
     * @param shortName Organisasjonens kortnavn
     * @returns True hvis navnet eksisterer, false ellers
     */
    const checkNameExists = useCallback(async (shortName: string): Promise<boolean> => {
        // Ikke gjør noe hvis strengen er for kort eller samme som forrige sjekket navn
        if (!shortName || shortName.length < 2 || shortName === lastCheckedName.current) {
            return false;
        }
        
        // Oppdater sist sjekket navn
        lastCheckedName.current = shortName;
        
        setIsCheckingName(true);
        try {
            // Bruk aktivt miljø fra state for å finne riktig token
            const token = sessionStorage.getItem(`pat_token_${activeEnvironment}`);
            console.log(`Sjekker organisasjonsnavn "${shortName}" med token for miljø: ${activeEnvironment}`);
            if (!token) {
                throw new Error("PAT-token mangler");
            }

            const response = await fetch(`${getCorrectBaseUrl()}/api/gitea/${activeEnvironment}/organizations/${shortName}/exists`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                // 404 for organisasjon som ikke eksisterer er forventet
                if (response.status === 404) {
                    setNameExists(false);
                    setShortNameError(null);
                    return false;
                }
                throw new Error(`Serverfeil: ${response.status}`);
            }

            // Forsøk å parse JSON-svar, men håndter tom respons
            try {
                const exists = await response.json();
                setNameExists(exists);
                
                // Sett feilmelding hvis organisasjonsnavnet allerede eksisterer
                if (exists) {
                    setShortNameError(`Organisasjonen '${shortName}' eksisterer allerede i Altinn Studio.`);
                } else {
                    setShortNameError(null);
                }
                
                return exists;
            } catch (jsonError) {
                // Hvis vi ikke kan parse JSON, anta at organisasjonen ikke eksisterer
                console.warn("Kunne ikke parse JSON-svar ved sjekk av organisasjonsnavn", jsonError);
                setNameExists(false);
                setShortNameError(null);
                return false;
            }
        } catch (error) {
            console.error("Feil ved sjekk av organisasjonsnavn:", error);
            setShortNameError(null);
            return false;
        } finally {
            setIsCheckingName(false);
        }
    }, [activeEnvironment]);

    /**
     * Søker etter organisasjoner i Brønnøysundregistrene
     * @param searchTerm Søkeord (navn eller organisasjonsnummer)
     * @returns Søkeresultater
     */
    const searchBrreg = useCallback(async (searchTerm: string): Promise<BrregSearchResponse | null> => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return null;
        }

        setIsSearchingBrreg(true);
        try {
            const token = sessionStorage.getItem(`pat_token_${activeEnvironment}`);
            console.log(`Søker i Brreg med token for miljø: ${activeEnvironment}`);
            if (!token) {
                throw new Error("PAT-token mangler");
            }

            const response = await fetch(`${getCorrectBaseUrl()}/api/brreg/search?name=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Serverfeil: ${response.status}`);
            }

            const data = await response.json();
            setBrregResults(data);
            return data;
        } catch (error) {
            console.error("Feil ved søk i Brønnøysundregistrene:", error);
            return null;
        } finally {
            setIsSearchingBrreg(false);
        }
    }, [activeEnvironment]);

    /**
     * Validerer et organisasjonsnummer mot Brønnøysundregistrene
     * @param orgNumber Organisasjonsnummer som skal valideres
     * @returns True hvis organisasjonsnummeret er gyldig, false ellers
     */
    const validateOrgNumber = useCallback(async (orgNumber: string): Promise<boolean> => {
        if (!orgNumber || orgNumber.length !== 9) {
            return false;
        }
        
        try {
            const token = sessionStorage.getItem(`pat_token_${activeEnvironment}`);
            if (!token) {
                throw new Error("PAT-token mangler");
            }

            const response = await fetch(`${getCorrectBaseUrl()}/api/brreg/validate/${orgNumber}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.valid === true;
        } catch (error) {
            console.error("Feil ved validering av organisasjonsnummer:", error);
            return false;
        }
    }, [activeEnvironment]);

    /**
     * Oppretter en ny organisasjon
     * @param formData Skjemadata for organisasjonen
     * @returns Resultat av opprettelsen
     */
    const createOrganization = useCallback(async (formData: OrganizationFormData): Promise<OrganizationCreationResponse> => {
        setIsCreating(true);
        try {
            const token = sessionStorage.getItem(`pat_token_${activeEnvironment}`);
            console.log(`Oppretter organisasjon med token for miljø: ${activeEnvironment}`);
            if (!token) {
                throw new Error("PAT-token mangler");
            }

            const response = await fetch(`${getCorrectBaseUrl()}/api/gitea/${activeEnvironment}/organizations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shortName: formData.shortName,
                    fullName: formData.fullName,
                    websiteUrl: formData.websiteUrl,
                    description: formData.description,
                    orgNumber: formData.orgNumber,
                    owners: formData.owners,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`Serverfeil: ${response.status} ${errorData ? JSON.stringify(errorData) : ''}`);
            }

            const data = await response.json().catch((err) => {
                console.error("Feil ved parsing av JSON-svar:", err);
                return { success: false, message: "Kunne ikke lese svar fra server" };
            });
            return data;
        } catch (error) {
            console.error("Feil ved opprettelse av organisasjon:", error);
            throw error;
        } finally {
            setIsCreating(false);
        }
    }, [activeEnvironment]);

    /**
     * Sjekker om det finnes et gyldig PAT-token for valgt miljø
     * @returns True hvis PAT-token er satt, false ellers
     */
    const hasValidPatToken = useCallback((): boolean => {
        const token = sessionStorage.getItem(`pat_token_${activeEnvironment}`);
        console.log(`Sjekker PAT-token for miljø ${activeEnvironment}: ${token ? 'Funnet' : 'Ikke funnet'}`);
        return token !== null;
    }, [activeEnvironment]);

    // Refs for å håndtere caching og låsing av organisasjonsnummer
    const hasSuccessfullyFetchedDetails = useRef<boolean>(false);
    const cachedOrgDetails = useRef<BrregEnhetsdetaljer | null>(null);
    const cachedOrgNumber = useRef<string>("");
    // Ref for å spore orgnumre som har feilet ved oppslag
    const failedOrgNumbers = useRef<{[orgNumber: string]: boolean}>({});
    
    /**
     * Nullstiller all tilstand relatert til organisasjonssøk
     * Kalles når brukeren ønsker å tømme skjemaet eller starte på nytt
     */
    const resetOrgFetchState = useCallback(() => {
        hasSuccessfullyFetchedDetails.current = false;
        cachedOrgDetails.current = null;
        cachedOrgNumber.current = "";
        lastCheckedOrgNumber.current = "";
        failedOrgNumbers.current = {}; // Nullstiller registeret over feilede orgnumre
        setOrgDetails(null);
        console.log("Cache, låsestatus og feilliste for organisasjonssøk nullstilt");
    }, []);

    /**
     * Henter detaljert informasjon om en organisasjon basert på organisasjonsnummer
     * @param orgNumber Organisasjonsnummeret som skal søkes på
     * @returns Detaljert informasjon om organisasjonen hvis funnet
     */
    const getEnhetsdetaljer = useCallback(async (orgNumber: string): Promise<BrregEnhetsdetaljer | null> => {
        if (!orgNumber || orgNumber.length !== 9) {
            return null;
        }
        
        if (cachedOrgNumber.current === orgNumber && cachedOrgDetails.current) {
            console.log("Bruker cachet data for orgnr:", orgNumber);
            return cachedOrgDetails.current;
        }
        
        // Sjekk om dette orgnummeret har feilet tidligere
        if (failedOrgNumbers.current[orgNumber]) {
            console.log(`Hopper over API-kall - orgnr ${orgNumber} har feilet tidligere`);
            return null;
        }
        
        if (hasSuccessfullyFetchedDetails.current && cachedOrgNumber.current !== orgNumber) {
            console.log("Hopper over API-kall - allerede låst på orgnr:", cachedOrgNumber.current);
            return cachedOrgDetails.current;
        }
        
        if (isFetchingOrgDetails) {
            console.log("API-kall allerede pågår, hopper over");
            return null;
        }
        
        setIsFetchingOrgDetails(true);
        
        try {
            const url = `${getCorrectBaseUrl()}/api/Production/brreg/enhet/${orgNumber}`;
            console.log(`Henter organisasjonsdetaljer fra: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            const data = await response.json();
            setOrgDetails(data);
            cachedOrgDetails.current = data;
            cachedOrgNumber.current = orgNumber;
            hasSuccessfullyFetchedDetails.current = true;
            console.log("Organisasjonsdata hentet og låst - organisasjonsnummerfelt vil nå låses");
            return data;
        } catch (error) {
            console.error("Feil ved henting av organisasjonsdetaljer:", error);
            // Marker dette orgnummeret som feilet for å unngå gjentatte kall
            failedOrgNumbers.current[orgNumber] = true;
            return null;
        } finally {
            setIsFetchingOrgDetails(false);
        }
    }, [isFetchingOrgDetails]); // Bare avhengig av isFetchingOrgDetails for å unngå doble API-kall

return {
    activeEnvironment,
    isCreating,
    isCheckingName,
    isSearchingBrreg,
    isFetchingOrgDetails,
    nameExists,
    shortNameError,
    brregResults,
    orgDetails,
    checkNameExists,
    searchBrreg,
    validateOrgNumber,
    createOrganization,
    getEnhetsdetaljer,
    resetOrgFetchState,
    hasValidPatToken
};
};