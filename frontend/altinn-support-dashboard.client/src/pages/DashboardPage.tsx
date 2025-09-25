import React, { useState } from "react";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import DetailedOrgView from "../components/Dashboard/components/DetailedOrgView";
import { OrganizationList } from "../components/Dashboard/components/organizations/OrganizationList";
import { Organization, SelectedOrg } from "../models/models";
import { useDashboardStore } from "../stores/DashboardStore";

export const DashboardPage: React.FC = () => {
  const query = useDashboardStore((s) => s.query);
  const setQuery = useDashboardStore((s) => s.setQuery);
  const selectedOrg = useDashboardStore((s) => s.selectedOrg);
  const setSelectedOrg = useDashboardStore((s) => s.setSelectedOrg);
  return (
    <div>
      <SearchComponent query={query} setQuery={setQuery} />

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div style={{ flex: "1 1 35%", maxWidth: "35%" }}>
          <OrganizationList setSelectedOrg={setSelectedOrg} query={query} />
        </div>

        <div style={{ flex: "1 1 65%", maxWidth: "65%" }}>
          <DetailedOrgView selectedOrg={selectedOrg} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
