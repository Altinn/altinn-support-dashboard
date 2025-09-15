import React from "react";
import "./App.css";
import Sidebar from "../components/Sidebar/SidebarComponent";
import SettingsContentComponent from "../components/SettingsContent/SettingsContentComponent";
import { VersionDialog } from "../components/VersionDialog/VersionDialog";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useDarkMode, useEnvironment, useUserDetails } from "../hooks/hooks";
import { useVersionCheck } from "../hooks/useVersionCheck";
import { getPalleteTheme } from "../theme/palette";
import { DashboardPage } from "../pages/DashboardPage";
import SignOutPage from "../pages/SignOutPage";
import { ManualRoleSearchPage } from "../pages/ManualRoleSearchPage";
import NewOrganizationPage from "../pages/NewOrganizationPage";

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
              <Route path="/new-org" element={<NewOrganizationPage />} />
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
