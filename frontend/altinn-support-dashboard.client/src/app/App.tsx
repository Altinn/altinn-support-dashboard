import React from "react";
import "./App.css";
import Sidebar from "../components/Sidebar/SidebarComponent";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import MainContent from "../components/MainContent/MainContentComponent";
import SettingsContentComponent from "../components/SettingsContent/SettingsContentComponent";
import ManualRoleSearchComponent from "../components/ManualRoleSearch/ManualRoleSearchComponent";
import OrganizationCreationComponent from "../components/OrganizationCreation/OrganizationCreationComponent";
import SignOutPage from "../SignOutPage/SignOutPage";
import { VersionDialog } from "../components/VersionDialog/VersionDialog";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import {
  useDarkMode,
  useEnvironment,
  useUserDetails,
  useOrganizationSearch,
} from "../hooks/hooks";
import { useVersionCheck } from "../hooks/useVersionCheck";
import { getBaseUrl } from "../utils/utils";
import { getPalleteTheme } from "../theme/palette";

const App: React.FC = () => {
  const { environment, handleEnvChange } = useEnvironment();
  const { userName, userEmail } = useUserDetails();
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const theme = React.useMemo(() => getPalleteTheme(isDarkMode), [isDarkMode]);

  // Sjekk etter nye versjoner
  const { versionInfo, shouldShowDialog, acknowledgeVersion } =
    useVersionCheck();

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Vis versjonsoppdateringsmelding hvis ny versjon er tilgjengelig */}
      <VersionDialog
        versionInfo={versionInfo}
        open={shouldShowDialog}
        onClose={acknowledgeVersion}
      />
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
                element={
                  <ManualRoleSearchComponent
                    baseUrl={getBaseUrl(environment)}
                  />
                }
              />
              <Route
                path="/new-org"
                element={
                  <OrganizationCreationComponent environment={environment} />
                }
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
