import React, { useState } from "react";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import { useAppStore } from "../hooks/Appstore";
import { useOrganizationSearch } from "../hooks/hooks";
import { ErrorAlert } from "../components/Dashboard/components/ErrorAlert";
import DetailedOrgView from "../components/Dashboard/components/DetailedOrgView";
import { OrganizationList } from "../components/Dashboard/components/organizations/OrganizationList";

export const DashboardPage: React.FC = () => {
  const environment = useAppStore((state) => state.environment);

  const {
    query,
    setQuery,
    selectedOrg,
    moreInfo,
    rolesInfo,
    error,
    hasSearched,
    handleSearch,
    handleSelectOrg,
  } = useOrganizationSearch(environment);

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
          <div style={{ flex: "1 1 35%", maxWidth: "35%" }}>
            <OrganizationList
              hasSearched={hasSearched}
              handleSelectOrg={handleSelectOrg}
              query={query}
            />
          </div>

          <div style={{ flex: "1 1 65%", maxWidth: "65%" }}>
            <DetailedOrgView
              selectedOrg={selectedOrg}
              moreInfo={moreInfo}
              rolesInfo={rolesInfo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
