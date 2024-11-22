// src/App.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';

import './App.css';
import Sidebar from '../components/Sidebar/SidebarComponent';
import SearchComponent from '../components/TopSearchBar/TopSearchBarComponent';
import MainContent from '../components/MainContent/MainContentComponent';
import SettingsContentComponent from '../components/SettingsContent/SettingsContentComponent';
import { Organization, PersonalContact, Subunit, ERRole } from '../models/models';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { grey } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignOutPage from '../SignOutPage/SignOutPage'; // Adjusted the import path

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [subUnits, setSubUnits] = useState<Subunit[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<{ Name: string; OrganizationNumber: string } | null>(null);
    const [moreInfo, setMoreInfo] = useState<PersonalContact[]>([]);
    const [rolesInfo, setRolesInfo] = useState<ERRole[]>([]);
    const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
    const [error, setError] = useState<{ message: string; response?: string | null }>({ message: '', response: null });
    const [erRolesError, setErRolesError] = useState<string | null>(null);
    const [environment, setEnvironment] = useState('PROD');
    const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>('dashboard');
    const [hasSearched, setHasSearched] = useState(false); // Added hasSearched state

    // Dark Mode State
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Create MUI Theme
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? 'dark' : 'light',
                    primary: {
                        main: '#004a70',
                    },
                    secondary: {
                        main: '#0163ba',
                    },
                    background: {
                        default: isDarkMode ? grey[900] : '#f0f2f5',
                        paper: isDarkMode ? grey[800] : '#ffffff',
                    },
                },
                typography: {
                    fontFamily: 'Inter, sans-serif',
                },
            }),
        [isDarkMode]
    );

    const getBaseUrl = useCallback(() => {
        const apiHost = window.location.hostname;
        const protocol = window.location.protocol;
        return `${protocol}//${apiHost}:7174/api/${environment === 'TT02' ? 'TT02' : 'Production'}`;
    }, [environment]);

    const authorizedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
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
    }, []);

    const [userName, setUserName] = useState('Du er ikke innlogget');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Fetch user details from Azure App Service
        fetch('/.auth/me')
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    const user = data[0];
                    const nameClaim = user.user_claims.find((claim: any) => claim.typ === 'name');
                    const emailClaim = user.user_claims.find((claim: any) => claim.typ === 'preferred_username');

                    setUserName(nameClaim ? nameClaim.val : 'Ukjent Bruker');
                    setUserEmail(emailClaim ? emailClaim.val : 'Ingen e-post funnet');
                }
            })
            .catch((error) => console.error('Error fetching user info:', error));
    }, []);

    // Time and Date State
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Function to get formatted date and time
    const getFormattedDateTime = (date: Date) => {
        const optionsTime: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const formattedTime = date.toLocaleTimeString('no-NO', optionsTime);

        const weekday = date.toLocaleDateString('no-NO', { weekday: 'long' });
        const day = date.getDate();
        const month = date.toLocaleDateString('no-NO', { month: 'long' });
        const year = date.getFullYear();

        // Capitalize weekday and month
        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

        const formattedDate = `${capitalizedWeekday}, ${day}. ${capitalizedMonth} ${year}`;

        return { formattedTime, formattedDate };
    };

    // Get formatted date and time
    const { formattedTime, formattedDate } = getFormattedDateTime(currentDateTime);

    const handleSearch = useCallback(async () => {
        const trimmedQuery = query.replace(/\s/g, '');
        setIsLoading(true);
        setError({ message: '', response: null });
        setErRolesError(null); // Reset ER roles error
        setHasSearched(true); // Set hasSearched to true when search is initiated
        try {
            const res = await authorizedFetch(
                `${getBaseUrl()}/serviceowner/organizations/search?query=${encodeURIComponent(trimmedQuery)}`
            );
            const data = await res.json();
            let orgData: Organization[] = Array.isArray(data) ? data : [data];
            // Removed filtering to include all organization types
            // orgData = orgData.filter((org) => org.type !== 'BEDR' && org.type !== 'AAFY');

            const allSubUnits: Subunit[] = [];
            for (const org of orgData) {
                try {
                    const subunitRes = await authorizedFetch(
                        `${getBaseUrl()}/brreg/${org.organizationNumber}/underenheter`
                    );
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
                    console.warn(`No subunits found for organization ${org.organizationNumber}:`, error);
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
    }, [query, authorizedFetch, getBaseUrl]);

    const handleSelectOrg = useCallback(
        async (organizationNumber: string, name: string) => {
            setSelectedOrg({ Name: name, OrganizationNumber: organizationNumber });
            setMoreInfo([]);
            setRolesInfo([]);
            setError({ message: '', response: null });
            setErRolesError(null); // Reset ER roles error

            try {
                // Fetch personal contacts
                const resPersonalContacts = await authorizedFetch(
                    `${getBaseUrl()}/serviceowner/organizations/${organizationNumber}/personalcontacts`
                );
                const personalContacts: PersonalContact[] = await resPersonalContacts.json();
                setMoreInfo(personalContacts);

                // Fetch ER roles
                try {
                    const subunit = subUnits.find((sub) => sub.organisasjonsnummer === organizationNumber);
                    const orgNumberForRoles = subunit ? subunit.overordnetEnhet : organizationNumber;

                    const resRoles = await authorizedFetch(`${getBaseUrl()}/brreg/${orgNumberForRoles}`);
                    const roles: { rollegrupper: ERRole[] } = await resRoles.json();
                    setRolesInfo(roles.rollegrupper);
                } catch (rolesError: any) {
                    console.error('Error fetching ER-roles:', rolesError);
                    setErRolesError('ER roller kunne ikke hentes.'); // Set ER roles error
                }
            } catch (error: any) {
                console.error('Error fetching data:', error);
                setError((prevError) => ({
                    message: prevError.message + ' Feil ved henting av data.',
                    response: error.response || null,
                }));
            }
        },
        [authorizedFetch, getBaseUrl, subUnits]
    );

    const toggleEnvDropdown = () => setIsEnvDropdownOpen((prev) => !prev);

    const handleEnvChange = (env: string) => {
        setEnvironment(env);
        setIsEnvDropdownOpen(false);
        setOrganizations([]);
        setSubUnits([]);
        setSelectedOrg(null);
        setMoreInfo([]);
        setRolesInfo([]);
        setError({ message: '', response: null });
        setErRolesError(null); // Reset ER roles error
        setHasSearched(false); // Reset hasSearched when environment changes
    };

    const handleExpandToggle = (orgNumber: string) => {
        setExpandedOrg(expandedOrg === orgNumber ? null : orgNumber);
    };

    // Initialize dark mode based on stored preference or browser preference
    useEffect(() => {
        const storedDarkMode = localStorage.getItem('isDarkMode');
        if (storedDarkMode !== null) {
            const darkModeEnabled = storedDarkMode === 'true';
            setIsDarkMode(darkModeEnabled);
        } else {
            const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDarkMode);
        }
    }, []);

    // Handle Logout Function
    const handleLogout = () => {
        // Redirect the user to the logout URL with a post-logout redirect to /signout
        window.location.href = '/.auth/logout?post_logout_redirect_uri=/signout';
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <div className="app-wrapper">
                    <Sidebar
                        environment={environment}
                        isEnvDropdownOpen={isEnvDropdownOpen}
                        toggleEnvDropdown={toggleEnvDropdown}
                        handleEnvChange={handleEnvChange}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        userName={userName}
                        userEmail={userEmail}
                        formattedTime={formattedTime}
                        formattedDate={formattedDate}
                        isDarkMode={isDarkMode}
                    />
                    <main className="main-content">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    currentPage === 'dashboard' ? (
                                        <>
                                            <SearchComponent
                                                query={query}
                                                setQuery={setQuery}
                                                handleSearch={handleSearch}
                                                isDarkMode={isDarkMode}
                                            />
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
                                                erRolesError={erRolesError}
                                                formattedTime={formattedTime}
                                                formattedDate={formattedDate}
                                                isDarkMode={isDarkMode}
                                                query={query} // Pass the query prop
                                                hasSearched={hasSearched} // Pass hasSearched prop
                                            />
                                        </>
                                    ) : (
                                        <SettingsContentComponent
                                            environment={environment}
                                            isDarkMode={isDarkMode}
                                            setIsDarkMode={setIsDarkMode}
                                            handleLogout={handleLogout} // Pass handleLogout to Settings
                                        />
                                    )
                                }
                            />
                            <Route path="/signout" element={<SignOutPage />} />
                            {/* Redirect any unknown paths to home */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
