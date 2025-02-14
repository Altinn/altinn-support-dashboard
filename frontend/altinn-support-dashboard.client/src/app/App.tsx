// App.tsx
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
import { grey } from '@mui/material/colors';
import { useDarkMode, useEnvironment, useUserDetails, useOrganizationSearch } from '../hooks/hooks';
import { getBaseUrl } from '../utils/utils';

const App: React.FC = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode();
    const { environment, isEnvDropdownOpen, toggleEnvDropdown, handleEnvChange } = useEnvironment();
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

    const handleClearSearch = () => {
        setQuery('');
    };

    const theme = React.useMemo(
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
                                            handleClearSearch={handleClearSearch}
                                            hasSearched={hasSearched}
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
