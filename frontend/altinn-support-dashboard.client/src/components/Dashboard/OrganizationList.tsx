import React from "react";
import { Alert, Typography, Skeleton } from "@mui/material";
import { OrganizationCard } from "./OrganizationCard";
import { Organization, Subunit } from "../../models/models";

interface OrganizationListProps {
  organizations: Organization[];
  subUnits: Subunit[];
  expandedOrg: string | null;
  showOrgList: boolean;
  isRoleView: boolean;
  isLoading: boolean;
  hasSearched: boolean;
  randomQuote: string;
  handleExpandToggle: (orgNumber: string) => void;
  handleSelectOrg: (orgNumber: string, name: string) => void;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  subUnits,
  expandedOrg,
  showOrgList,
  isRoleView,
  isLoading,
  hasSearched,
  randomQuote,
  handleExpandToggle,
  handleSelectOrg,
}) => {
  if (!showOrgList) return null;

  return (
    <div className={`org-list ${isRoleView ? "hidden" : ""}`}>
      {isLoading ? (
        <div role="progressbar">
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        </div>
      ) : organizations.length === 0 ? (
        hasSearched ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="h6">Ingen organisasjoner funnet</Typography>
          </Alert>
        ) : (
          <div className="no-search-message">
            <Typography variant="h6">"{randomQuote}"</Typography>
          </div>
        )
      ) : (
        organizations
          .filter((org) => {
            if (
              (org.type === "BEDR" || org.type === "AAFY") &&
              subUnits.some(
                (sub) => sub.organisasjonsnummer === org.organizationNumber,
              )
            ) {
              return false;
            }
            return true;
          })
          .map((org) => (
            <OrganizationCard
              key={org.organizationNumber}
              org={org}
              subUnits={subUnits}
              expandedOrg={expandedOrg}
              onExpandToggle={handleExpandToggle}
              onSelectOrg={handleSelectOrg}
            />
          ))
      )}
    </div>
  );
};
