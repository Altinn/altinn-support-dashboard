import React from "react";
import { OrganizationCard } from "./OrganizationCard";
import { useOrgSearch } from "../../../../hooks/hooks";
import { ErrorAlert } from "../ErrorAlert";
import { SelectedOrg } from "../../../../models/models";
import { useAppStore } from "../../../../stores/Appstore";
import classes from "../../styles/OrganizationList.module.css";

import { Skeleton, Alert, Heading } from "@digdir/designsystemet-react";

interface OrganizationListProps {
  setSelectedOrg: (SelectedOrg: SelectedOrg) => void;
  query: string;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  setSelectedOrg,
  query,
}) => {
  const environment = useAppStore((state) => state.environment);
  const { orgQuery, subunitQuery } = useOrgSearch(environment, query);
  const organizations = orgQuery.data ?? [];
  const subUnits = subunitQuery.data ?? [];

  if (orgQuery.isLoading) {
    return (
      <div role="progressbar">
        <Skeleton variant="rectangle" height={300} />
      </div>
    );
  }

  if (orgQuery.isError) {
    const error = { message: orgQuery.error.message.toString() };
    return <ErrorAlert error={error} />;
  }

  if (organizations.length <= 0 && query.length > 0) {
    return (
      <Alert data-color="info">
        <Heading level={6}>Ingen organisasjoner funnet</Heading>
      </Alert>
    );
  }

  // Default case: render organizations
  return (
    <div className={classes.container}>
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
            setSelectedOrg={setSelectedOrg}
          />
        ))}
    </div>
  );
};
