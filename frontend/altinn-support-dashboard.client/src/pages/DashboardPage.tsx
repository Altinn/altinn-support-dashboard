import React, { useState } from "react";
import MainContentComponent from "../components/Dashboard/MainContentComponent";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import { useAppStore } from "../hooks/Appstore";
import { useDarkMode, useOrganizationSearch } from "../hooks/hooks";
import { getBaseUrl } from "../utils/utils";
import { ErrorAlert } from "../components/Dashboard/ErrorAlert";
import { OrganizationList } from "../components/Dashboard/OrganizationList";

export const DashboardPage: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const { isDarkMode } = useDarkMode();

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

  // Local UI state
  const [showOrgList] = useState<boolean>(true);
  const [isRoleView] = useState<boolean>(false);

  const [randomQuote] = useState<string>(() => {
    const quotes = [
      "Søk etter en organisasjon",
      "Start typing to find organizations...",
      "Ingen søk utført ennå",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  return (
    <div>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        isDarkMode={isDarkMode}
      />

      {error?.message ? (
        <ErrorAlert error={error} />
      ) : (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {/* Sidebar: Organization list */}
          {showOrgList && (
            <div style={{ flex: "1 1 35%", maxWidth: "35%" }}>
              <OrganizationList
                organizations={organizations}
                subUnits={subUnits}
                expandedOrg={expandedOrg}
                showOrgList={showOrgList}
                isRoleView={isRoleView}
                isLoading={isLoading}
                hasSearched={hasSearched}
                randomQuote={randomQuote}
                handleExpandToggle={handleExpandToggle}
                handleSelectOrg={handleSelectOrg}
              />
            </div>
          )}

          {/* Main content area */}
          <div style={{ flex: "1 1 65%", maxWidth: "65%" }}>
            <MainContentComponent
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
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
