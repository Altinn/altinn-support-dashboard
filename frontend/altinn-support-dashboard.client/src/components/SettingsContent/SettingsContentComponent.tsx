import React, { useState, useEffect } from 'react';
import {
    Switch,
    Typography,
    Link as MuiLink,
    Paper,
    Box,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    Button as MuiButton,
    MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FaSlack, FaBookOpen } from 'react-icons/fa';
import { SettingsContentProps } from './models/settingsTypes';
import { getVersionInfo } from './utils/versionUtils';
import { usePatTokenValidation } from './hooks/usePatTokenValidation';

// Digdir Designsystem imports
import { 
    Button, 
    Textfield, 
    Heading, 
    Paragraph, 
    Alert, 
    Tooltip,
    Select
} from '@digdir/designsystemet-react';



const SettingsContentComponent: React.FC<SettingsContentProps> = ({
    environment,
    isDarkMode,
    setIsDarkMode,
}) => {
    const { versionNumber, versionName } = getVersionInfo();
    const [giteaEnv, setGiteaEnv] = useState<string>('development');
    const { patState, validateToken, clearToken } = usePatTokenValidation(giteaEnv);
    
    const [language, setLanguage] = useState<string>('nb');
    const [patInput, setPatInput] = useState<string>('');

    // Sjekk om det allerede finnes en lagret token og hent den ved oppstart
    useEffect(() => {
        const storedToken = sessionStorage.getItem(`pat_token_${environment}`);
        if (storedToken) {
            setPatInput(storedToken);
            validateToken(storedToken);
        }
    }, [environment, validateToken]);

    const handleReload = () => {
        window.location.reload();
    };

    const toggleDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDarkModeState = event.target.checked;
        setIsDarkMode(newDarkModeState);
        localStorage.setItem('isDarkMode', newDarkModeState.toString());
    };

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value as string);
    };

    const handleLogout = () => {
        window.location.href = '/.auth/logout?post_logout_redirect_uri=/signout';
    };
    
    const handlePatInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPatInput(event.target.value);
    };
    
    const handleValidateToken = async () => {
        await validateToken(patInput);
    };
    
    const handleClearToken = () => {
        setPatInput('');
        clearToken();
    };

    return (
        <Box sx={{ 
            p: 2, 
            height: '100%',
            overflow: 'auto',
            maxHeight: 'calc(100vh - 80px)', // Subtract header height
            overflowX: 'hidden'
        }}>
            <Heading level={2} data-size="md">Generelle innstillinger</Heading>

            {/* Organisation Setup Section */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Heading level={3} data-size="sm">Organisasjonsoppsett</Heading>
                
                <Paragraph data-size="md">
                    For å opprette nye organisasjoner i Altinn Studio må du angi en gyldig Personal Access Token (PAT).
                    Denne brukes til å autentisere API-kall mot Gitea.
                </Paragraph>
                
                <Box sx={{ mb: 3 }}>
                    <Paragraph data-size="sm" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        Altinn Studio Miljø
                    </Paragraph>
                    <div style={{ marginBottom: '16px' }}>
                        <Select
                            id="gitea-environment-select"
                            value={giteaEnv}
                            onChange={(e) => {
                                setGiteaEnv(e.target.value);
                                // Clear token when changing environment
                                clearToken();
                                setPatInput('');
                            }}
                        >
                            <option value="development">Development</option>
                        </Select>
                    </div>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                    <Paragraph data-size="sm" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        Personal Access Token (PAT)
                    </Paragraph>
                    <Textfield
       
                        value={patInput}
                        onChange={handlePatInputChange}
                        type="password"
                        size="medium"
                        style={{ width: '100%', marginBottom: '16px' }}
                        error={patState.errorMessage ? true : false}
                        errorMessage={patState.errorMessage}
                        disabled={patState.isValidating}
                    />
                    
                    <Tooltip content="PAT-token brukes for å opprette organisasjoner, teams og repositories i Gitea. Denne må opprettes i Gitea med admin-tilgang." placement="top">
                        <Paragraph>Hva er en PAT-token?</Paragraph>
                    </Tooltip>
                </Box>
                
                <Box sx={{ display: 'flex', gap: '16px' }}>
                    <Button
                        onClick={handleValidateToken}
                        disabled={patState.isValidating || !patInput}
                    >
                        {patState.isValidating ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                {' '}Validerer...
                            </>
                        ) : (
                            'Valider token'
                        )}
                    </Button>
                    
                    <Button
                        variant="secondary"
                        onClick={handleClearToken}
                        disabled={patState.isValidating || !patInput}
                    >
                        Fjern token
                    </Button>
                </Box>
                
                {patState.isValid && (
                    <Alert severity="success" style={{ marginTop: '16px' }}>
                        PAT-token er validert! Logget inn som: {patState.username}
                    </Alert>
                )}
            </Paper>

            {/* Språkvalg Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Språkvalg
                </Typography>
                <FormControl fullWidth>
                    <InputLabel id="language-select-label">Velg språk</InputLabel>
                    <MuiSelect
                        labelId="language-select-label"
                        id="language-select"
                        value={language}
                        label="Velg språk"
                        onChange={handleLanguageChange}
                    >
                        <MenuItem value="nb">Norsk Bokmål</MenuItem>
                    </MuiSelect>
                </FormControl>
            </Paper>
            
            {/* Dark Mode Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Mørk Modus
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Aktiver mørk modus
                    </Typography>
                    <Switch checked={isDarkMode} onChange={toggleDarkMode} />
                </Box>
            </Paper>
            
            {/* Action Buttons */}
            <Box sx={{ mb: 3 }}>
                <MuiButton 
                    variant="secondary"
                    onClick={handleReload} 
                    style={{ marginRight: '12px' }}
                >
                    Last inn på nytt
                </MuiButton>
                <MuiButton 
                    onClick={handleLogout}
                >
                    Logg ut
                </MuiButton>
            </Box>
            
            {/* App Info Footer */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="body2" gutterBottom>
                    Applikasjonsinformasjon: {versionName} - Versjon {versionNumber}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Valgt miljø: {environment}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <MuiLink href="#" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <FaBookOpen style={{ marginRight: '8px' }} />
                        Dokumentasjon
                    </MuiLink>
                    <MuiLink href="https://digdir.slack.com/archives/C07AJ5NQE9E" sx={{ display: 'flex', alignItems: 'center' }}>
                        <FaSlack style={{ marginRight: '8px' }} />
                        Kontakt oss på Slack
                    </MuiLink>
                </Box>
            </Box>
        </Box>
    );
};

export default SettingsContentComponent;
