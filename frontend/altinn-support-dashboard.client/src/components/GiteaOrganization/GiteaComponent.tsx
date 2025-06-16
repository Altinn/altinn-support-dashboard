import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    Paper,
    Box,
    Grid,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    Select
} from '@mui/material';
import '@digdir/designsystemet-css/index.css';
import '@digdir/designsystemet-theme';
import { Button, Alert, Heading, Paragraph, Textfield } from '@digdir/designsystemet-react'

type GiteaEnvironment = 'development' | 'staging' | 'production' | 'local';

interface GiteaComponentProps {}

const getGiteaBaseUrl = (env: GiteaEnvironment): string => {
    switch (env) {
        case 'development':
            return 'https://dev.altinn.studio/repos';
        case 'staging':
            return 'https://staging.altinn.studio/repos';
        case 'production':
            return 'https://altinn.studio/repos';
        case 'local':
            return 'http://studio.localhost/repos';
        default:
            return 'https://dev.altinn.studio/repos';
    }
};

const getPatSettingsUrl = (env: GiteaEnvironment): string => {
    switch (env) {
        case 'development':
            return 'https://dev.altinn.studio/repos/user/settings/applications';
        case 'staging':
            return 'https://staging.altinn.studio/repos/user/settings/applications';
        case 'production':
            return 'https://altinn.studio/user/settings/applications';
        case 'local':
            return 'http://studio.localhost/repos/user/settings/applications';
        default:
            return 'https://dev.altinn.studio/repos/user/settings/applications';
    }
};

// Storage key for the PAT token (environment-specific)
const getStorageKey = (env: GiteaEnvironment) => `gitea-pat-token-${env}`;

// Function to securely save PAT token to localStorage
const saveTokenToStorage = (token: string, env: GiteaEnvironment) => {
    try {
        // Basic encryption would be better, but for simplicity we're just storing it
        // A production app should use a more secure approach
        localStorage.setItem(getStorageKey(env), token);
    } catch (e) {
        console.error('Failed to save token to localStorage', e);
    }
};

// Function to retrieve PAT token from localStorage
const getTokenFromStorage = (env: GiteaEnvironment): string => {
    try {
        const token = localStorage.getItem(getStorageKey(env));
        return token || '';
    } catch (e) {
        console.error('Failed to retrieve token from localStorage', e);
        return '';
    }
};

// Clear token from localStorage
const clearTokenFromStorage = (env: GiteaEnvironment) => {
    try {
        localStorage.removeItem(getStorageKey(env));
    } catch (e) {
        console.error('Failed to clear token from localStorage', e);
    }
};

// Format website URL to ensure it has a protocol prefix, implement backend later
const formatWebsiteUrl = (url: string): string => {
    if (!url) return '';
    
    // If URL already has a protocol, return as is
    if (url.match(/^https?:\/\//i)) {
        return url;
    }
    
    // Otherwise, prepend https://
    return `https://${url}`;
};

const GiteaComponent: React.FC<GiteaComponentProps> = () => {
    const [shortName, setShortName] = useState('');
    const [fullName, setFullName] = useState('');
    const [website, setWebsite] = useState('');
    const [environment, setEnvironment] = useState<GiteaEnvironment>('development');
    const [giteaBaseUrl, setGiteaBaseUrl] = useState(getGiteaBaseUrl('development'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [rememberToken, setRememberToken] = useState(true);
    
    // Initialize patToken from localStorage if available
    const [patToken, setPatToken] = useState('');
    
    // Load token from localStorage when component mounts or environment changes
    useEffect(() => {
        const savedToken = getTokenFromStorage(environment);
        if (savedToken) {
            setPatToken(savedToken);
        }
    }, [environment]);
    
    const handleEnvironmentChange = (env: GiteaEnvironment) => {
        setEnvironment(env);
        setGiteaBaseUrl(getGiteaBaseUrl(env));
        
        // Load token for the selected environment
        const savedToken = getTokenFromStorage(env);
        if (savedToken) {
            setPatToken(savedToken);
        } else {
            setPatToken('');
        }
    };

    const handleCreateOrganization = async () => {
        if (!shortName || !fullName || !patToken) {
            setError('Alle felt må fylles ut');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Use the backend API endpoint with the configured base URL
            const response = await fetch('https://localhost:7174/api/gitea/create/orgwithteams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patToken,
                    giteaBaseUrl,
                    shortName,
                    fullname: fullName,
                    website: formatWebsiteUrl(website) || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === "Could not authenticate with the provided token.") {
                    const patUrl = getPatSettingsUrl(environment);
                    setError(
                        'Ved manglende token eller rettigheter til å utføre operasjonen kan du ikke fortsette. ' +
                        'Du må sette opp et personlig token i Altinn Studio: ' +
                        `<a href="${patUrl}" target="_blank" rel="noopener noreferrer">` +
                        'Klikk her for å sette opp PAT i Altinn Studio</a>'
                    );
                } else {
                    setError(data.message || 'Failed to create organization');
                }
            } else {
                setSuccess(`Organisasjonen ${shortName} ble opprettet med standard team og repository`);
                // Reset form fields after successful creation
                setShortName('');
                setFullName('');
                setWebsite('');
                
                // Save token if remember option is checked
                if (rememberToken) {
                    saveTokenToStorage(patToken, environment);
                }
            }
        } catch (err) {
            setError('An error occurred while communicating with the server');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gitea Organisasjons oppretter
                </Typography>
                <Typography variant="body1" paragraph>
                    Opprett en ny organisasjon i Gitea med standard team og repository.
                </Typography>

                {error && (
                    <Alert data-color="danger" style={{ marginBottom: '1.5rem' }} data-size="sm">
                        <Heading
                            size='sm'
                            level={3}
                            style={{ marginBottom: 'var(--ds-size-2)' }}
                        >
                            Det har skjedd en feil
                        </Heading>
                        <Paragraph size="sm">
                            <span dangerouslySetInnerHTML={{ __html: error }} />
                        </Paragraph>
                    </Alert>
                )}

                {success && (
                    <Alert data-color="success" style={{ marginBottom: '1.5rem' }} data-size="sm">
                        <Heading
                            size="sm"
                            level={3}
                            style={{ marginBottom: 'var(--ds-size-2)' }}
                        >
                            Organisasjon opprettet
                        </Heading>
                        <Paragraph size="sm">
                            {success}
                        </Paragraph>
                    </Alert>
                )}

                <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Textfield
                                required
                                label="Kortnavn for organisasjonen"
                                description="Kortnavn for organisasjonen"
                                type="text"
                                value={shortName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShortName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Textfield
                                required
                                label="Fullt offisielt navn på virksomheten"
                                description="Fullt navn (unngå blokkbokstaver)"
                                type="text"
                                value={fullName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textfield
                                label="Nettstedsadresse"
                                description="URL til nettsiden til organisasjonen"
                                prefix="https://"
                                value={website}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textfield
                                required
                                label="Personal Access Token (PAT)"
                                description="Personal Access Token (PAT) for Gitea"
                                value={patToken}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newToken = e.target.value;
                                    setPatToken(newToken);
                                    
                                    // Optionally save as user types - but better to save only on success
                                    // if (rememberToken && newToken) {
                                    //     saveTokenToStorage(newToken, environment);
                                    // }
                                }}
                                type="password"
                                autoComplete="off"
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        id="remember-token"
                                        checked={rememberToken}
                                        onChange={(e) => setRememberToken(e.target.checked)}
                                        style={{ marginRight: '8px' }}
                                    />
                                    <label htmlFor="remember-token">
                                        Husk token i nettleseren (Merk: lagres i localStorage)
                                    </label>
                                </div>
                                {getTokenFromStorage(environment) && (
                                    <Button 
                                        variant="secondary" 
                                        size="small"
                                        onClick={() => {
                                            clearTokenFromStorage(environment);
                                            // Only clear the input field if we're not preserving a token for another operation
                                            if (!rememberToken) {
                                                setPatToken('');
                                            }
                                        }}
                                    >
                                        Slett lagret token
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="environment-select-label">Miljø</InputLabel>
                                <Select
                                    labelId="environment-select-label"
                                    value={environment}
                                    label="Miljø"
                                    onChange={(e) => handleEnvironmentChange(e.target.value as GiteaEnvironment)}
                                >
                                    <MenuItem value="development">Development (dev.altinn.studio)</MenuItem>
                                    <MenuItem value="staging">Staging (staging.altinn.studio)</MenuItem>
                                    <MenuItem value="production">Production (altinn.studio)</MenuItem>
                                    <MenuItem value="local">Local (studio.localhost)</MenuItem>
                                </Select>
                                <FormHelperText>Velg Gitea miljøet du ønsker å bruke</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="primary"
                                onClick={handleCreateOrganization}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Opprett organisasjon'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default GiteaComponent;
