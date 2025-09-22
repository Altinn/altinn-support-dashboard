import React, { useState } from "react";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import { useAppStore } from "../hooks/Appstore";
import {
  useDarkMode,
  useOrganizationSearch,
  useOrgSearch,
} from "../hooks/hooks";
import { ErrorAlert } from "../components/Dashboard/components/ErrorAlert";
import DetailedOrgView from "../components/Dashboard/components/DetailedOrgView";
import { OrganizationList } from "../components/Dashboard/components/organizations/OrganizationList";

export const DashboardPage: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const { isDarkMode } = useDarkMode();
  const [newQuery, setNewQuery] = useState("");

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

  return (
    <div>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
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
          {showOrgList && (
            <div style={{ flex: "1 1 35%", maxWidth: "35%" }}>
              <OrganizationList
                organizations={organizations}
                subUnits={subUnits}
                expandedOrg={expandedOrg}
                showOrgList={showOrgList}
                isLoading={isLoading}
                hasSearched={hasSearched}
                handleExpandToggle={handleExpandToggle}
                handleSelectOrg={handleSelectOrg}
                query={query}
              />
            </div>
          )}

          <div style={{ flex: "1 1 65%", maxWidth: "65%" }}>
            <DetailedOrgView
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
