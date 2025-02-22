﻿// SettingsContentComponent.tsx
import React, { useEffect, useState } from 'react';
import {
    Button,
    Switch,
    Alert,
    Typography,
    Link as MuiLink,
    Paper,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FaSlack, FaBookOpen } from 'react-icons/fa';
import { getBaseUrl } from '../../utils/utils';

interface SettingsContentProps {
    environment: string;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsContentComponent: React.FC<SettingsContentProps> = ({
    environment,
    isDarkMode,
    setIsDarkMode,
}) => {
    const versionnumber = '2.4.7';
    const envName = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ENV_NAME) || '';
    let versionname;
    switch (envName) {
        case 'production':
            versionname = 'Produksjonsmiljø';
            break;
        case 'test':
            versionname = 'Testmiljø';
            break;
        default:
            versionname = 'Lokalt utviklingmiljø';
    }
    const [apiStatusProd, setApiStatusProd] = useState<'connected' | 'disconnected' | 'loading'>('loading');
    const [apiStatusTT02, setApiStatusTT02] = useState<'connected' | 'disconnected' | 'loading'>('loading');
    const [language, setLanguage] = useState<string>('nb');
    const authorizedFetch = async (url: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const headers = {
            ...options.headers,
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${response.statusText}: ${errorText}`);
        }
        return response;
    };
    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                const resProd = await authorizedFetch(`${getBaseUrl('Production')}/health`);
                if (resProd.ok) {
                    setApiStatusProd('connected');
                } else {
                    setApiStatusProd('disconnected');
                }
            } catch (error) {
                setApiStatusProd('disconnected');
            }
            try {
                const resTT02 = await authorizedFetch(`${getBaseUrl('TT02')}/health`);
                if (resTT02.ok) {
                    setApiStatusTT02('connected');
                } else {
                    setApiStatusTT02('disconnected');
                }
            } catch (error) {
                setApiStatusTT02('disconnected');
            }
        };
        checkApiStatus();
    }, []);
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
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Innstillinger
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    API Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box>
                        <Typography variant="subtitle1">Production</Typography>
                        {apiStatusProd === 'loading' ? (
                            <Typography variant="body2">Laster API status...</Typography>
                        ) : apiStatusProd === 'connected' ? (
                            <Alert severity="success">API tilkoblet</Alert>
                        ) : (
                            <Alert severity="error">API ikke tilkoblet</Alert>
                        )}
                    </Box>
                    <Box>
                        <Typography variant="subtitle1">TT02</Typography>
                        {apiStatusTT02 === 'loading' ? (
                            <Typography variant="body2">Laster API status...</Typography>
                        ) : apiStatusTT02 === 'connected' ? (
                            <Alert severity="success">API tilkoblet</Alert>
                        ) : (
                            <Alert severity="error">API ikke tilkoblet</Alert>
                        )}
                    </Box>
                </Box>
            </Paper>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Språkvalg
                </Typography>
                <FormControl fullWidth>
                    <InputLabel id="language-select-label">Velg språk</InputLabel>
                    <Select
                        labelId="language-select-label"
                        id="language-select"
                        value={language}
                        label="Velg språk"
                        onChange={handleLanguageChange}
                    >
                        <MenuItem value="nb">Norsk Bokmål</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
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
            <Box sx={{ mb: 3 }}>
                <Button variant="contained" color="secondary" onClick={handleReload} sx={{ mr: 2 }}>
                    Last inn på nytt
                </Button>
                <Button variant="contained" color="primary" onClick={handleLogout}>
                    Logg ut
                </Button>
            </Box>
            <Box sx={{ mt: 5 }}>
                <Typography variant="body2" gutterBottom>
                    Applikasjonsinformasjon: {versionname} - Versjon {versionnumber}
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
