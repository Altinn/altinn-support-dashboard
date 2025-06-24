import React from 'react';
import './App.css';
import Sidebar from '../components/Sidebar/SidebarComponent';
import SearchComponent from '../components/TopSearchBar/TopSearchBarComponent';
import MainContent from '../components/MainContent/MainContentComponent';
import SettingsContentComponent from '../components/SettingsContent/SettingsContentComponent';
import ManualRoleSearchComponent from '../components/ManualRoleSearch/ManualRoleSearchComponent';
import SignOutPage from '../SignOutPage/SignOutPage';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useDarkMode, useEnvironment, useUserDetails, useOrganizationSearch } from '../hooks/hooks';
import { getBaseUrl } from '../utils/utils';

const App: React.FC = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode();
    const { environment, handleEnvChange } = useEnvironment();
    const { userName, userEmail } = useUserDetails();

    const {
        query,
        setQuery,
        organizations,
        subUnits,
        selectedOrg,
        moreInfo,
        rolesInfo,
        expandedOrg,
        error,
        erRolesError,
        isLoading,
        hasSearched,
        handleSearch,
        handleSelectOrg,
        handleExpandToggle,
    } = useOrganizationSearch(environment);


    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? 'dark' : 'light',
                    primary: {
                        main: isDarkMode ? '#4dabff' : '#004a70',
                    },
                    secondary: {
                        main: isDarkMode ? '#66b3ff' : '#0163ba',
                    },
                    background: {
                        default: isDarkMode ? '#121212' : '#f0f2f5',
                        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
                    },
                    text: {
                        primary: isDarkMode ? '#e0e0e0' : 'rgba(0, 0, 0, 0.87)',
                        secondary: isDarkMode ? '#b0b0b0' : 'rgba(0, 0, 0, 0.6)',
                    },
                    divider: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                    error: {
                        main: isDarkMode ? '#ff5c5c' : '#d32f2f',
                    },
                    warning: {
                        main: isDarkMode ? '#ffb74d' : '#ed6c02',
                    },
                    info: {
                        main: isDarkMode ? '#4dabff' : '#0288d1',
                    },
                    success: {
                        main: isDarkMode ? '#66bb6a' : '#2e7d32',
                    },
                    action: {
                        active: isDarkMode ? '#fff' : 'rgba(0, 0, 0, 0.54)',
                        hover: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        selected: isDarkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
                        disabled: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
                        disabledBackground: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                    },
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                            },
                        },
                    },
                    MuiTableCell: {
                        styleOverrides: {
                            root: {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(224, 224, 224, 1)',
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                '&.Mui-disabled': {
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : undefined,
                                },
                            },
                        },
                    },
                },
                typography: {
                    fontFamily: 'Inter, sans-serif',
                },
            }),
        [isDarkMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <div className="app-wrapper">
                    <Sidebar
                        environment={environment}
                        handleEnvChange={handleEnvChange}
                        userName={userName}
                        userEmail={userEmail}
                        isDarkMode={isDarkMode}
                    />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <>
                                        <SearchComponent
                                            query={query}
                                            setQuery={setQuery}
                                            handleSearch={handleSearch}
                                            isDarkMode={isDarkMode}
                                        />
                                        <MainContent
                                            baseUrl={getBaseUrl(environment)}
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
                                            query={query}
                                            hasSearched={hasSearched}
                                        />
                                    </>
                                }
                            />
                            <Route
                                path="/manualrolesearch"
                                element={<ManualRoleSearchComponent baseUrl={getBaseUrl(environment)} />}
                            />
                            <Route
                                path="/settings"
                                element={
                                    <SettingsContentComponent
                                        environment={environment}
                                        isDarkMode={isDarkMode}
                                        setIsDarkMode={setIsDarkMode}
                                    />
                                }
                            />
                            <Route path="/signout" element={<SignOutPage />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
