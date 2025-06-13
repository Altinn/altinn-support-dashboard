import { useState } from "react";
import { OrganizationFormData, OrganizationCreationResponse, BrregSearchResponse } from "../models/organizationTypes";
import { getBaseUrl } from "../../../utils/utils";

/**
 * Hook for å håndtere opprettelse av organisasjoner
 */
export const useOrganizationCreation = (environment: string) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isCheckingName, setIsCheckingName] = useState<boolean>(false);
    const [isSearchingBrreg, setIsSearchingBrreg] = useState<boolean>(false);
    const [nameExists, setNameExists] = useState<boolean | null>(null);
    const [brregResults, setBrregResults] = useState<BrregSearchResponse | null>(null);

    /**
     * Sjekker om et kortnavn allerede eksisterer
     * @param shortName Organisasjonens kortnavn
     * @returns True hvis navnet eksisterer, false ellers
     */
    const checkNameExists = async (shortName: string): Promise<boolean> => {
        if (!shortName || shortName.length < 2) {
            return false;
        }
        
        setIsCheckingName(true);
        try {
            const token = sessionStorage.getItem(`pat_token_${environment}`);
            if (!token) {
                throw new Error("PAT-token mangler");
            }

            const response = await fetch(`${getBaseUrl()}/api/gitea/${environment}/organizations/${shortName}/exists`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Serverfeil: ${response.status}`);
            }

            const exists = await response.json();
            setNameExists(exists);
            return exists;
        } catch (error) {
            console.error("Feil ved sjekk av organisasjonsnavn:", error);
            return false;
        } finally {
            setIsCheckingName(false);
        }
    };

    /**
     * Søker etter organisasjoner i Brønnøysundregistrene
     * @param query Søkeord (navn eller organisasjonsnummer)
     * @returns Søkeresultater
     */
    const searchBrreg = async (query: string): Promise<BrregSearchResponse> => {
        if (!query || query.length < 2) {
            return { results: [] };
        }

        setIsSearchingBrreg(true);
        try {
            const response = await fetch(`${getBaseUrl()}/api/brreg/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Serverfeil: ${response.status}`);
            }

            const data = await response.json();
            setBrregResults(data);
            return data;
        } catch (error: unknown) {
            console.error("Feil ved søk i Brønnøysundregistrene:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return { 
                results: [],
                message: `Feil ved søk i Brønnøysundregistrene: ${errorMessage}`
            };
        } finally {
            setIsSearchingBrreg(false);
        }
    };

    /**
     * Validerer et organisasjonsnummer mot Brønnøysundregistrene
     * @param orgNumber Organisasjonsnummer
     * @returns True hvis organisasjonsnummeret er gyldig, false ellers
     */
    const validateOrgNumber = async (orgNumber: string): Promise<boolean> => {
        if (!orgNumber || orgNumber.length !== 9) {
            return false;
        }

        try {
            const response = await fetch(`${getBaseUrl()}/api/brreg/validate/${orgNumber}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
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
    };

    /**
     * Oppretter en ny organisasjon
     * @param formData Skjemadata for organisasjonen
     * @returns Resultat av opprettelsen
     */
    const createOrganization = async (formData: OrganizationFormData): Promise<OrganizationCreationResponse> => {
        setIsCreating(true);
        try {
            const token = sessionStorage.getItem(`pat_token_${environment}`);
            if (!token) {
                throw new Error("PAT-token mangler");
            }

            const response = await fetch(`${getBaseUrl()}/api/gitea/${environment}/organizations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shortName: formData.shortName,
                    fullName: formData.fullName,
                    websiteUrl: formData.websiteUrl,
                    emailDomain: formData.emailDomain,
                    orgNumber: formData.orgNumber,
                    owners: formData.owners,
                    // Logo behandles separat om nødvendig
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Serverfeil: ${response.status}`);
            }

            return await response.json();
        } catch (error: unknown) {
            console.error("Feil ved opprettelse av organisasjon:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                message: `Feil ved opprettelse av organisasjon: ${errorMessage}`
            };
        } finally {
            setIsCreating(false);
        }
    };

    /**
     * Sjekker om PAT-token er satt og gyldig
     * @returns True hvis PAT-token er satt, false ellers
     */
    const hasValidPatToken = (): boolean => {
        return sessionStorage.getItem(`pat_token_${environment}`) !== null;
    };

    return {
        isCreating,
        isCheckingName,
        isSearchingBrreg,
        nameExists,
        brregResults,
        checkNameExists,
        searchBrreg,
        validateOrgNumber,
        createOrganization,
        hasValidPatToken
    };
};
