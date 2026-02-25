import React, { useEffect } from "react";
import { OrganizationCard } from "./OrganizationCard";
import { useOrgSearch } from "../../../../hooks/hooks";
import { Organization, SelectedOrg } from "../../../../models/models";
import { useAppStore } from "../../../../stores/Appstore";
import classes from "../../styles/OrganizationList.module.css";
import { showPopup } from "../../../Popup";

import { Skeleton, Alert, Heading } from "@digdir/designsystemet-react";

interface OrganizationListProps {
  setSelectedOrg: (SelectedOrg: SelectedOrg) => void;
  selectedOrg: SelectedOrg | null;
  query: string;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  setSelectedOrg,
  selectedOrg,
  query,
}) => {
  const environment = useAppStore((state) => state.environment);
  const { orgQuery } = useOrgSearch(environment, query);
  const organizations = orgQuery.data ?? [];

  useEffect(() => {
    if (orgQuery.isError) {
      const errorMessage =
        orgQuery.error?.message.toString() ?? "Ukjent feil oppstod";
      showPopup(errorMessage, "error");
    }
  }, [orgQuery.isError, orgQuery.error]);

  if (orgQuery.isLoading) {
    return (
      <div role="progressbar">
        <Skeleton variant="rectangle" height={300} />
      </div>
    );
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
        .filter((org: Organization) => {
          if (org.headUnit == null) {
            return true;
          }
          return false;
        })
        .map((org) => (
          <OrganizationCard
            selectedOrg={selectedOrg}
            key={org.organizationNumber}
            org={org}
            setSelectedOrg={setSelectedOrg}
          />
        ))}
    </div>
  );
};
