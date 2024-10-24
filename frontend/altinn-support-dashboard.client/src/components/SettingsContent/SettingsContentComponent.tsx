import React, { useState, useEffect } from 'react';
import { Button, Switch, Alert, Heading, Paragraph, Link } from '@digdir/designsystemet-react';
import { FaSlack, FaBookOpen } from 'react-icons/fa';

interface SettingsContentProps {
    baseUrl: string;
    environment: string;
}

const SettingsContentComponent: React.FC<SettingsContentProps> = ({ environment }) => {

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Use these to change version number and name
    const versionnumber = "1.3.0";
    const versionname = "Test";

    // State variables for API status of both environments
    const [apiStatusProd, setApiStatusProd] = useState<'connected' | 'disconnected' | 'loading'>('loading');
    const [apiStatusTT02, setApiStatusTT02] = useState<'connected' | 'disconnected' | 'loading'>('loading');

    const [language, setLanguage] = useState<string>('nb'); // Default language

    // Helper function for authorized fetch requests
    const authorizedFetch = async (url: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const headers = {
            ...options.headers,
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${response.statusText}: ${errorText}`);
        }
        return response;
    };

    // Function to construct base URLs for both environments
    const getBaseUrl = (env: string) => {
        const apiPort = 7174;
        const apiHost = window.location.hostname;
        const protocol = window.location.protocol;

        return `${protocol}//${apiHost}:${apiPort}/api/${env}`;
    };

    useEffect(() => {
        // Initialize dark mode based on stored preference or browser preference
        const storedDarkMode = localStorage.getItem('isDarkMode');
        if (storedDarkMode !== null) {
            const darkModeEnabled = storedDarkMode === 'true';
            setIsDarkMode(darkModeEnabled);
            if (darkModeEnabled) {
                document.body.classList.add('dark-mode');
            }
        } else {
            const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDarkMode);
            if (prefersDarkMode) {
                document.body.classList.add('dark-mode');
            }
        }

        // Check API connection status for both environments
        const checkApiStatus = async () => {
            // Check PROD environment
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

            // Check TT02 environment
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

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.reload();
    };

    const handleReload = () => {
        window.location.reload();
    };

    const toggleDarkMode = () => {
        const newDarkModeState = !isDarkMode;
        setIsDarkMode(newDarkModeState);
        localStorage.setItem('isDarkMode', newDarkModeState.toString());
        if (newDarkModeState) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
        // Implement language change logic here
    };

    return (
        <div className="settings-content">
            <h1>Innstillinger</h1>

            <div className="settings-section">
                <h2>API Status</h2>
                <div className="api-status-container">
                    <div className="api-status-item">
                        <Heading level={4} size="sm">
                            Production
                        </Heading>
                        {apiStatusProd === 'loading' ? (
                            <Paragraph>Laster API status...</Paragraph>
                        ) : apiStatusProd === 'connected' ? (
                            <Alert severity="success">
                                <Heading level={5} size="xs" spacing>
                                    API tilkoblet
                                </Heading>
                            </Alert>
                        ) : (
                            <Alert severity="danger">
                                <Heading level={5} size="xs" spacing>
                                    API ikke tilkoblet
                                </Heading>
                            </Alert>
                        )}
                    </div>
                    <div className="api-status-item">
                        <br />
                        <Heading level={4} size="sm">
                            TT02
                        </Heading>
                        {apiStatusTT02 === 'loading' ? (
                            <Paragraph>Laster API status...</Paragraph>
                        ) : apiStatusTT02 === 'connected' ? (
                            <Alert severity="success">
                                <Heading level={5} size="xs" spacing>
                                    API tilkoblet
                                </Heading>
                            </Alert>
                        ) : (
                            <Alert severity="danger">
                                <Heading level={5} size="xs" spacing>
                                    API ikke tilkoblet
                                </Heading>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h2>Språkvalg</h2>
                <label htmlFor="language-select">Velg språk:</label>
                <select
                    id="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                    className="language-select"
                >
                    <option value="nb">Norsk Bokmål</option>
                    {/* Add more language options if needed */}
                </select>
            </div>

            <div className="settings-section">
                <h2>Mørk Modus</h2>
                <label>
                    Aktiver mørk modus
                    <Switch checked={isDarkMode} onChange={toggleDarkMode} />
                </label>

            </div>

            <div className="settings-section">
                <Button variant="secondary" onClick={handleReload}>
                    Relast side
                </Button>
                <br />
                <Button variant="primary" onClick={handleLogout}>
                    Logg ut
                </Button>
            </div>

            <div className="settings-footer">
                <Paragraph>Applikasjonsinformasjon: {versionname} - Versjon {versionnumber}</Paragraph>
                <Paragraph>Valgt miljø: {environment}</Paragraph>
                <br />
                <Link href="">
                    <FaBookOpen />
                    &nbsp;Dokumentasjon
                </Link>
                <br />
                <br />
                <Link href="https://digdir.slack.com/archives/C07AJ5NQE9E">
                    <FaSlack />
                    &nbsp;Kontakt oss på Slack
                </Link>
            </div>
        </div>
    );
};

export default SettingsContentComponent;
