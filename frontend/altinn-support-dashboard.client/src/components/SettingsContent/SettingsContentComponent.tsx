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
import { EyeIcon, EyeClosedIcon, QuestionmarkIcon } from '@navikt/aksel-icons';
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
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    // Last inn lagret PAT token fra sessionStorage ved oppstart
    useEffect(() => {
        if (patState.token) {
            setPatInput(patState.token);
        }
    }, [patState.token]);

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
            <Heading level={2} data-size="md">Innstillinger</Heading>
            <br />

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
                            <option value="development">Development (dev.altinn.studio)</option>
                        </Select>
                    </div>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                    <Paragraph data-size="sm" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        Personal Access Token (PAT)
                    </Paragraph>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <Textfield
                            value={patInput}
                            onChange={handlePatInputChange}
                            type={showPassword ? 'text' : 'password'}
                            size="medium"
                            style={{ flex: 1 }}
                            errorMessage={patState.errorMessage}
                            disabled={patState.isValidating}
                        />
                        <Button
                            variant="tertiary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ 
                                marginTop: '2px', 
                                padding: '6px', 
                                minWidth: 'unset',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '32px'
                            }}
                            aria-label={showPassword ? 'Skjul passord' : 'Vis passord'}
                        >
                            {showPassword ? 
                                <EyeIcon title="Skjul passord" fontSize="1.2rem" /> : 
                                <EyeClosedIcon title="Vis passord" fontSize="1.2rem" />}
                        </Button>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '8px' }}>
                        <Tooltip content="PAT-token brukes for å opprette organisasjoner, teams og repositories i Gitea. Denne må opprettes med admin-tilgang." placement="top">
                            <Button 
                                variant="tertiary" 
                                style={{ 
                                    padding: '4px 8px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '4px',
                                    fontSize: '14px'
                                }}
                            >
                                Hva er en PAT-token?
                            </Button>
                        </Tooltip>
                        <Button 
                            variant="tertiary" 
                            style={{ 
                                padding: '4px 8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                fontSize: '14px'
                            }}
                            onClick={() => {
                                const baseUrl = giteaEnv === 'development' 
                                    ? 'https://dev.altinn.studio' 
                                    : 'https://altinn.studio';
                                window.open(`${baseUrl}/repos/user/settings/applications`, '_blank', 'noopener,noreferrer');
                            }}
                        >
                            Generer et nytt PAT-token
                        </Button>
                    </div>
                    {patState.isValid && (
                        <Alert data-color="success" style={{ marginTop: '16px' }}>
                            PAT-token er validert.
                        </Alert>
                    )}
                    {!patState.isValid && patState.errorMessage && (
                        <Alert data-color="danger" style={{ marginTop: '16px' }}>
                            {patState.errorMessage}
                        </Alert>
                    )}
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
