import React from "react";
import "./App.css";
import Sidebar from "../components/Sidebar/Sidebar";
import { VersionDialog } from "../components/VersionDialog/VersionDialog";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useVersionCheck } from "../hooks/useVersionCheck";
import { DashboardPage } from "../pages/DashboardPage";
import SignOutPage from "../pages/SignOutPage";
import { ManualRoleSearchPage } from "../pages/ManualRoleSearchPage";
import NewOrganizationPage from "../pages/NewOrganizationPage";
import SettingsPage from "../pages/SettingsPage";
import { useAppStore } from "../stores/Appstore";
import SignInPage from "../pages/SignInPage";
import PrivateRoutes from "./PrivateRoutes";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  // Sjekk etter nye versjoner
  const { versionInfo, shouldShowDialog, acknowledgeVersion } =
    useVersionCheck();

  return (
    <div>
      {/* Vis versjonsoppdateringsmelding hvis ny versjon er tilgjengelig */}
      <VersionDialog
        versionInfo={versionInfo}
        open={shouldShowDialog}
        onClose={acknowledgeVersion}
      />
      <Router>
        <div className="app-wrapper">
          <ToastContainer />
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/signin" element={<SignInPage />} />

              {/*Forces signin screen if user not logged in */}
              <Route element={<PrivateRoutes />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                <Route
                  path="/manualrolesearch"
                  element={<ManualRoleSearchPage />}
                />
                <Route path="/new-org" element={<NewOrganizationPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/signout" element={<SignOutPage />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
};

export default App;
