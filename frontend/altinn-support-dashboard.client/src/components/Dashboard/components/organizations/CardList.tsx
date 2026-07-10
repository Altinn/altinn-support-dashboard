import React, { useEffect } from "react";
import { OrganizationCard } from "./OrganizationCard";
import { UserCard } from "./UserCard";
import { useOrgSearch, useUserContactInfoByNin } from "../../../../hooks/hooks";
import { Organization, SelectedCard } from "../../../../models/models";
import { useAppStore } from "../../../../stores/Appstore";
import classes from "../../styles/CardList.module.css";
import { showPopup } from "../../../Popup";

import { Skeleton, Alert, Heading } from "@digdir/designsystemet-react";

interface CardListProps {
  setSelectedCard: (selectedCard: SelectedCard) => void;
  selectedCard: SelectedCard | null;
  query: string;
}

export const CardList: React.FC<CardListProps> = ({
  setSelectedCard,
  selectedCard,
  query,
}) => {
  const environment = useAppStore((state) => state.environment);
  const { orgQuery } = useOrgSearch(environment, query);
  const { userQuery } = useUserContactInfoByNin(environment, query);
  const organizations = orgQuery.data ?? [];
  const users = userQuery.data ? [userQuery.data] : [];

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

  if (organizations.length <= 0 && users.length <= 0 && query.length > 0) {
    return (
      <Alert data-color="info">
        <Heading level={6}>Ingen organisasjoner eller brukere funnet</Heading>
      </Alert>
    );
  }

  // Default case: render organizations and users
  return (
    <div className={classes.container}>
      {users.map((user) => (
        <UserCard
          key={user.ssnToken}
          user={user}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      ))}
      {organizations
        .filter(
          (org: Organization) =>
            !organizations.some((other) =>
              other.subUnits?.some(
                (sub: Organization) =>
                  sub.organizationNumber === org.organizationNumber
              )
            )
        )
        .sort((a: Organization, b: Organization) =>
          a.name.localeCompare(b.name)
        )
        .map((org) => (
          <OrganizationCard
            selectedCard={selectedCard}
            key={org.organizationNumber}
            org={org}
            setSelectedCard={setSelectedCard}
          />
        ))}
    </div>
  );
};
