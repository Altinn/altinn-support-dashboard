import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar/SidebarComponent';
import SearchComponent from '../components/TopSearchBar/TopSearchBarComponent';
import MainContent from '../components/MainContent/MainContentComponent';
import SettingsContentComponent from '../components/SettingsContent/SettingsContentComponent';
import { Organization, PersonalContact, Subunit, ERRole } from '../models/models';
import { Dialog, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import logologin from '../assets/logologin.svg'; // Import logo

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [subUnits, setSubUnits] = useState<Subunit[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<{ Name: string; OrganizationNumber: string } | null>(null);
    const [moreInfo, setMoreInfo] = useState<PersonalContact[]>([]);
    const [rolesInfo, setRolesInfo] = useState<ERRole[]>([]);
    const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
    const [error, setError] = useState<{ message: string; response?: string | null }>({ message: '', response: null });
    const [environment, setEnvironment] = useState('PROD');
    const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [openLoginDialog, setOpenLoginDialog] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

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

    // Adjust the base URL to include the correct API port
    const getBaseUrl = () => {


        const apiHost = window.location.hostname;
        const protocol = window.location.protocol;
        return `${protocol}//${apiHost}/api/${environment === 'TT02' ? 'TT02' : 'Production'}`;
    };

    // Check if user is authenticated (if token exists in localStorage or sessionStorage)
    useEffect(() => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            setOpenLoginDialog(false);
        }
    }, []);


    const handleLogin = async () => {
        setIsLoggingIn(true);
        setLoginError('');
        try {
            const token = btoa(`${username}:${password}`);
            const response = await fetch(`${getBaseUrl()}/auth/check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.setItem('authToken', token);
                setIsAuthenticated(true);
                setOpenLoginDialog(false);
            } else {
                const errorResponse = await response.text();
                throw new Error(`Error: ${response.statusText} - ${errorResponse}`);
            }
        } catch (error) {
            setLoginError('Au da, feil brukernavn eller passord!');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleSearch = async () => {
        const trimmedQuery = query.replace(/\s/g, '');
        setIsLoading(true);
        setError({ message: '', response: null });
        try {
            const res = await authorizedFetch(`${getBaseUrl()}/serviceowner/organizations/search?query=${encodeURIComponent(trimmedQuery)}`);
            const data = await res.json();
            let orgData: Organization[] = Array.isArray(data) ? data : [data];
            orgData = orgData.filter(org => org.type !== 'BEDR' && org.type !== 'AAFY');

            const allSubUnits: Subunit[] = [];
            for (const org of orgData) {
                try {
                    const subunitRes = await authorizedFetch(`${getBaseUrl()}/brreg/${org.organizationNumber}/underenheter`);
                    const subunitData = await subunitRes.json();

                    if (subunitData?._embedded?.underenheter) {
                        const subunits = subunitData._embedded.underenheter.map((sub: any) => ({
                            navn: sub.navn,
                            organisasjonsnummer: sub.organisasjonsnummer,
                            overordnetEnhet: sub.overordnetEnhet,
                            type: sub.organisasjonsform?.kode,
                        }));
                        allSubUnits.push(...subunits);
                    }
                } catch (error) {
                    console.error(`Error fetching subunits for ${org.organizationNumber}:`, error);
                }
            }

            setOrganizations(orgData);
            setSubUnits(allSubUnits);
            setSelectedOrg(null);
        } catch (error: any) {
            setError({ message: error.message, response: error.response || null });
            setOrganizations([]);
            setSubUnits([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectOrg = async (organizationNumber: string, name: string) => {
        setSelectedOrg({ Name: name, OrganizationNumber: organizationNumber });
        try {
            const resPersonalContacts = await authorizedFetch(`${getBaseUrl()}/serviceowner/organizations/${organizationNumber}/personalcontacts`);
            const personalContacts: PersonalContact[] = await resPersonalContacts.json();
            setMoreInfo(personalContacts);

            const subunit = subUnits.find(sub => sub.organisasjonsnummer === organizationNumber);
            const orgNumberForRoles = subunit ? subunit.overordnetEnhet : organizationNumber;

            const resRoles = await authorizedFetch(`${getBaseUrl()}/brreg/${orgNumberForRoles}`);
            const roles: { rollegrupper: ERRole[] } = await resRoles.json();
            setRolesInfo(roles.rollegrupper);
        } catch (error: any) {
            setError({ message: error.message, response: error.response || null });
            setMoreInfo([]);
            setRolesInfo([]);
        }
    };

    const toggleEnvDropdown = () => {
        setIsEnvDropdownOpen(prevState => !prevState);
    };

    const handleEnvChange = (env: string) => {
        setEnvironment(env);
        setIsEnvDropdownOpen(false);
        setOrganizations([]);
        setSubUnits([]);
        setSelectedOrg(null);
        setMoreInfo([]);
        setRolesInfo([]);
        setError({ message: '', response: null });
    };

    const handleExpandToggle = (orgNumber: string) => {
        setExpandedOrg(expandedOrg === orgNumber ? null : orgNumber);
    };

    return (
        <>
            <Dialog open={openLoginDialog} onClose={() => { }} disableEscapeKeyDown>
                <DialogContent>
                    <div style={{ textAlign: 'center' }}>
                        <img src={logologin} alt="Login Logo" style={{ width: '100px', marginBottom: '20px' }} />
                    </div>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Brukernavn"
                        type="text"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Passord"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                    {isLoggingIn && <CircularProgress />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogin} color="primary" disabled={isLoggingIn}>
                        Logg inn
                    </Button>
                </DialogActions>
            </Dialog>

            {isAuthenticated && (
                <div className="app-wrapper">
                    <Sidebar
                        environment={environment}
                        isEnvDropdownOpen={isEnvDropdownOpen}
                        toggleEnvDropdown={toggleEnvDropdown}
                        handleEnvChange={handleEnvChange}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <main className="main-content">
                        {currentPage === 'dashboard' ? (
                            <>
                                <SearchComponent query={query} setQuery={setQuery} handleSearch={handleSearch} />
                                <MainContent
                                    baseUrl={getBaseUrl()}
                                    isLoading={isLoading}
                                    organizations={organizations}
                                    subUnits={subUnits}
                                    selectedOrg={selectedOrg}
                                    moreInfo={moreInfo}
                                    rolesInfo={rolesInfo}
                                    expandedOrg={expandedOrg}
                                    handleSelectOrg={handleSelectOrg}
                                    handleExpandToggle={handleExpandToggle}
                                    error={error}
                                />
                            </>
                        ) : (
                            <SettingsContentComponent baseUrl={getBaseUrl()} environment={environment} />
                        )}
                    </main>
                </div>
            )}
        </>
    );
};

export default App;
