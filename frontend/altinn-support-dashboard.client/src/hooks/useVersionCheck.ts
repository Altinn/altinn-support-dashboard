import { useState, useEffect } from 'react';

// Type for version.json structure
export interface VersionInfo {
  version: string;
  releaseDate: string;
  changes: VersionChange[];
}

export interface VersionChange {
  title: string;
  description: string;
  details: string[];
}

const LOCAL_STORAGE_VERSION_KEY = 'altinn_support_dashboard_version';

/**
 * Hook for å sjekke og håndtere applikasjonsversjoner
 * 
 * Sjekker gjeldende versjon mot den som er lagret i localStorage
 * og returnerer informasjon om en ny versjon er tilgjengelig
 */
export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [shouldShowDialog, setShouldShowDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Last versjonsfil og sjekk om dialog skal vises
  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {
        setIsLoading(true);
        // Hent versjonsfil
        const response = await fetch('/version.json');
        if (!response.ok) {
          throw new Error('Kunne ikke laste versjonsinformasjon');
        }
        
        const versionData: VersionInfo = await response.json();
        setVersionInfo(versionData);
        
        // Hent gjeldende versjon fra localStorage
        const storedVersion = localStorage.getItem(LOCAL_STORAGE_VERSION_KEY);
        
        // Hvis ingen versjon er lagret eller versjonen er ulik, vis dialog
        if (!storedVersion || storedVersion !== versionData.version) {
          setShouldShowDialog(true);
        }
      } catch (err) {
        console.error('Feil ved henting av versjonsinformasjon:', err);
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersionInfo();
  }, []);

  // Bekreft at brukeren har sett den nye versjonen
  const acknowledgeVersion = () => {
    if (versionInfo) {
      // Lagre gjeldende versjon i localStorage
      localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, versionInfo.version);
      // Lukk dialogen
      setShouldShowDialog(false);
    }
  };

  return {
    versionInfo,
    shouldShowDialog,
    isLoading,
    error,
    acknowledgeVersion
  };
}
