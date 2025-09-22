import React from "react";
import { Alert, Typography, Skeleton } from "@mui/material";
import { OrganizationCard } from "./OrganizationCard";
import { useOrgSearch } from "../../../../hooks/hooks";
import { useAppStore } from "../../../../hooks/Appstore";

interface OrganizationListProps {
  hasSearched: boolean;
  handleSelectOrg: (orgNumber: string, name: string) => void;
  query: string;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  hasSearched,
  handleSelectOrg,
  query,
}) => {
  const environment = useAppStore((state) => state.environment);
  const { orgQuery, subunitQuery } = useOrgSearch(environment, query);
  const organizations = orgQuery.data ?? [];
  const subUnits = subunitQuery.data ?? [];

  if (orgQuery.isLoading) {
    return (
      <div role="progressbar">
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
      </div>
    );
  }

  if (organizations.length === 0) {
    return hasSearched ? (
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="h6">Ingen organisasjoner funnet</Typography>
      </Alert>
    ) : null;
  }

  // Default case: render organizations
  return (
    <div className={`org-list`}>
      {organizations
        .filter((org) => {
          // filter out subunits if parent is already included
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
            onSelectOrg={handleSelectOrg}
          />
        ))}
    </div>
  );
};
