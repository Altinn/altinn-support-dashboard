import React, { useState } from 'react';
import {
    Button,
    Switch,
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
// Import removed: getBaseUrl
import { SettingsContentProps } from './models/settingsTypes';
import { getVersionInfo } from './utils/versionUtils';


const SettingsContentComponent: React.FC<SettingsContentProps> = ({
    environment,
    isDarkMode,
    setIsDarkMode,
}) => {
    const { versionNumber, versionName } = getVersionInfo();

    const [language, setLanguage] = useState<string>('nb');

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
