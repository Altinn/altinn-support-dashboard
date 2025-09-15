import React from "react";
import "./App.css";
import Sidebar from "../components/Sidebar/SidebarComponent";
import MainContent from "../components/MainContent/MainContentComponent";
import SettingsContentComponent from "../components/SettingsContent/SettingsContentComponent";
import ManualRoleSearchComponent from "../components/ManualRoleSearch/ManualRoleSearchComponent";
import OrganizationCreationComponent from "../components/OrganizationCreation/OrganizationCreationComponent";
import { VersionDialog } from "../components/VersionDialog/VersionDialog";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  useDarkMode,
  useEnvironment,
  useUserDetails,
  useOrganizationSearch,
} from "../hooks/hooks";
import { useVersionCheck } from "../hooks/useVersionCheck";
import { getBaseUrl } from "../utils/utils";
import { getPalleteTheme } from "../theme/palette";
import { DashboardPage } from "../pages/DashboardPage";
import SignOutPage from "../pages/SignOutPage";
import { ManualRoleSearchPage } from "../pages/ManualRoleSearchPage";

const App: React.FC = () => {
  const { environment, handleEnvChange } = useEnvironment();
  const { userName, userEmail } = useUserDetails();
  const { isDarkMode } = useDarkMode();
  const theme = React.useMemo(() => getPalleteTheme(isDarkMode), [isDarkMode]);

  // Sjekk etter nye versjoner
  const { versionInfo, shouldShowDialog, acknowledgeVersion } =
    useVersionCheck();

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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/manualrolesearch"
                element={<ManualRoleSearchPage />}
              />
              <Route
                path="/new-org"
                element={
                  <OrganizationCreationComponent environment={environment} />
                }
              />
              <Route path="/settings" element={<SettingsContentComponent />} />
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
