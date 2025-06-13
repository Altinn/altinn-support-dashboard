import { useState, useEffect } from 'react';
import { PatTokenState, PatTokenValidationResponse } from '../models/settingsTypes';
import { getBaseUrl } from '../../../utils/utils';

/**
 * Hook for håndtering av PAT-token validering og lagring
 */
export const usePatTokenValidation = (environment: string) => {
  // Initialiser state med eventuell lagret token fra sessionStorage
  const [patState, setPatState] = useState<PatTokenState>(() => {
    const savedToken = sessionStorage.getItem(`pat_token_${environment}`);
    return {
      token: savedToken || '',
      isValid: !!savedToken, // Antar at en lagret token er gyldig
      isValidating: false,
      username: undefined,
      errorMessage: undefined,
    };
  });
  
  // Oppdater state hvis environment endres
  useEffect(() => {
    const savedToken = sessionStorage.getItem(`pat_token_${environment}`);
    if (savedToken) {
      setPatState({
        token: savedToken,
        isValid: true,
        isValidating: false,
        username: undefined,
        errorMessage: undefined,
      });
    } else {
      // Reset state hvis ingen token funnet for dette miljøet
      setPatState({
        token: '',
        isValid: false,
        isValidating: false,
        username: undefined,
        errorMessage: undefined,
      });
    }
  }, [environment]);

  /**
   * Validerer PAT-token mot API
   */
  const validateToken = async (token: string): Promise<boolean> => {
    if (!token || token.trim() === '') {
      setPatState({
        ...patState,
        token,
        isValid: false,
        isValidating: false,
        errorMessage: 'PAT-token kan ikke være tom',
      });
      return false;
    }
    
    try {
      setPatState({ ...patState, token, isValidating: true });
      
      // Hent riktig base URL for API-kall
      const baseUrl = getBaseUrl(environment);
      
      // Kall API-endepunkt for å validere token med riktig port
      const response = await fetch(`${baseUrl.replace(`/${environment === 'TT02' ? 'TT02' : 'Production'}`, '')}/gitea/${environment}/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      // Håndter HTTP-feil
      if (!response.ok) {
        let errorMsg = 'Feil ved validering av token';
        if (response.status === 404) {
          errorMsg = `API-endepunkt ikke funnet (${response.status}). Sjekk miljøinnstillingene.`;
        } else if (response.status === 500) {
          errorMsg = 'Intern serverfeil. Vennligst prøv igjen senere.';
        }
        
        setPatState({
          token,
          isValid: false,
          isValidating: false,
          errorMessage: errorMsg,
        });
        return false;
      }

      const data: PatTokenValidationResponse = await response.json();
      
      if (data.isValid) {
        setPatState({
          token,
          isValid: true,
          isValidating: false,
          username: 'Admin',  // Hardcoded since backend doesn't return username
          errorMessage: undefined,
        });
        
        // Lagre token i sikker storage (session storage for nå)
        // OBS: I en produksjonsmiljø bør vi vurdere sikrere alternativer
        sessionStorage.setItem(`pat_token_${environment}`, token);
        return true;
      } else {
        setPatState({
          token,
          isValid: false,
          isValidating: false,
          errorMessage: data.message || 'Ugyldig PAT-token',
        });
        return false;
      }
    } catch (error) {
      setPatState({
        ...patState,
        token,
        isValid: false,
        isValidating: false,
        errorMessage: 'Feil ved validering av PAT-token',
      });
      console.error('Token validation error:', error);
      return false;
    }
  };

  /**
   * Fjerner lagret PAT-token
   */
  const clearToken = () => {
    sessionStorage.removeItem(`pat_token_${environment}`);
    setPatState({
      token: '',
      isValid: false,
      isValidating: false,
      username: undefined,
      errorMessage: undefined,
    });
  };

  /**
   * Sjekker om PAT-token er satt og gyldig
   */
  const isTokenSet = (): boolean => {
    return patState.isValid;
  };

  /**
   * Henter ut lagret token
   */
  const getToken = (): string | null => {
    return patState.isValid ? patState.token : null;
  };

  return {
    patState,
    validateToken,
    clearToken,
    isTokenSet,
    getToken,
  };
};
