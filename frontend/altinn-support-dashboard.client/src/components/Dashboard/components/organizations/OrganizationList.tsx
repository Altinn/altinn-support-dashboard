import React, { useEffect } from "react";
import { OrganizationCard } from "./OrganizationCard";
import { useOrgSearch } from "../../../../hooks/hooks";
import { ErrorAlert } from "../ErrorAlert";
import { SelectedOrg } from "../../../../models/models";
import { useAppStore } from "../../../../stores/Appstore";
import classes from "../../styles/OrganizationList.module.css";
import { toast } from "react-toastify"; 

import { Skeleton, Alert, Heading } from "@digdir/designsystemet-react";

interface OrganizationListProps {
  setSelectedOrg: (SelectedOrg: SelectedOrg) => void;
  selectedOrg: SelectedOrg;
  query: string;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  setSelectedOrg,
  selectedOrg,
  query,
}) => {
  const environment = useAppStore((state) => state.environment);
  const { orgQuery, subunitQuery } = useOrgSearch(environment, query);
  const organizations = orgQuery.data ?? [];
  const subUnits = subunitQuery.data ?? [];

  useEffect(() => {
    if (orgQuery.isError) {
      const errorMessage = orgQuery.error?.message.toString() ?? "Ukjent feil oppstod";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored"
      });
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
            selectedOrg={selectedOrg}
            key={org.organizationNumber}
            org={org}
            subUnits={subUnits}
            setSelectedOrg={setSelectedOrg}
          />
        ))}
    </div>
  );
};
