/**
 * Interface for versjonsdatastrukturen i version.json
 */
export interface VersionData {
    version: string;
    releaseDate: string;
    changes: {
        title: string;
        description: string;
        details: string[];
    }[];
}

/**
 * Henter versjonsinformasjon fra version.json og lagrer i sessionStorage
 * @returns Promise som løser til versjonsdataene
 */
export const fetchVersionData = async (): Promise<VersionData> => {
    try {
        // Sjekk om dataen allerede er cachet
        const cachedData = sessionStorage.getItem('versionData');
        if (cachedData) {
            return JSON.parse(cachedData) as VersionData;
        }
        
        // Hvis ikke cachet, hent fra filen
        const response = await fetch('/version.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json() as VersionData;
        
        // Lagre i sessionStorage for senere bruk
        sessionStorage.setItem('versionData', JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error('Feil ved henting av versjonsinformasjon:', error);
        // Returner standardverdier ved feil
        return {
            version: '0.0.0',
            releaseDate: '',
            changes: []
        };
    }
};

/**
 * Henter versjonsinformasjon fra cachen eller standardverdier
 * @returns Objekt med versjonsnummer, versjonsnavn, utgivelsesdato og endringer
 */
export const getVersionInfo = () => {
    // Standard verdier som fallback
    let versionNumber = '0.0.0';
    let releaseDate = '';
    let changes: VersionData['changes'] = [];
    
    // Hent miljøinformasjon for visning
    const envName =
        (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ENV_NAME) || '';
    let versionName: string;
    switch (envName) {
        case 'production':
            versionName = 'Produksjonsmiljø';
            break;
        case 'test':
            versionName = 'Testmiljø';
            break;
        default:
            versionName = 'Miljø';
    }
    
    // Hent versjonsinformasjon fra sessionStorage
    try {
        const cachedData = sessionStorage.getItem('versionData');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData) as VersionData;
            versionNumber = parsedData.version;
            releaseDate = parsedData.releaseDate;
            changes = parsedData.changes;
        }
    } catch (error) {
        console.error('Feil ved henting av cachet versjonsinformasjon:', error);
    }
    
    return { versionNumber, versionName, releaseDate, changes }
};
