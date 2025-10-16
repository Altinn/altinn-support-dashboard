import React, { useState } from "react";
import { formatDate } from "../utils/dateUtils";
import { ERRolesSortField, SortDirection } from "../models/mainContentTypes";
import { sortERRoles } from "../utils/contactUtils";
import { useOrgDetails } from "../../../hooks/hooks";
import { SelectedOrg } from "../../../models/models";
import { useAppStore } from "../../../stores/Appstore";
import { Table, Heading, Paragraph, Card } from "@digdir/designsystemet-react";
import styles from "../styles/ERRolesTable.module.css";

interface ERRolesTableProps {
  selectedOrg: SelectedOrg;
}

const ERRolesTable: React.FC<ERRolesTableProps> = ({ selectedOrg }) => {
  const environment = useAppStore((state) => state.environment);
  const { ERolesQuery } = useOrgDetails(
    environment,
    selectedOrg.OrganizationNumber,
  );
  const roles = ERolesQuery.data;

  const [erRoleSortField, setERRoleSortField] =
    useState<ERRolesSortField>(null);
  const [erRoleSortDirection, setERRoleSortDirection] =
    useState<SortDirection>(undefined);

  const handleERRoleSort = (field: ERRolesSortField) => {
    if (field === erRoleSortField) {
      if (erRoleSortDirection === "ascending") {
        setERRoleSortDirection("descending");
      } else if (erRoleSortDirection === "descending") {
        setERRoleSortField(null);
        setERRoleSortDirection(undefined);
      } else {
        setERRoleSortDirection("ascending");
      }
    } else {
      setERRoleSortField(field);
      setERRoleSortDirection("ascending");
    }
  };
  //Kan kanskje fjernes når alt er migrert over til designsystemet?

  const flatERRoles =
    roles
      ?.flatMap((roleGroup) =>
        roleGroup?.roller?.map((role) => ({
          ...role,
          sistEndret: roleGroup.sistEndret,
          // Use the role's own type instead of the group type
          type: role.type || roleGroup.type,
          enhet: role.enhet,
          person: role.person,
          fratraadt: role.fratraadt,
          // Store the group type for reference if needed
          groupType: roleGroup.type,
        })),
      )
      .filter(Boolean) || [];
  const sortedERRoles = sortERRoles(
    flatERRoles,
    erRoleSortField,
    erRoleSortDirection,
  );

  return (
    <Card data-color="neutral" className={styles.container}>
      <Heading level={2} className={styles.heading}>
        ER-roller
      </Heading>
      <Table border>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell
              sort={erRoleSortField === "type" ? erRoleSortDirection : "none"}
              onClick={() => handleERRoleSort("type")}
              className={styles["header-font"]}
            >
              Rolletype
            </Table.HeaderCell>
            <Table.HeaderCell
              sort={erRoleSortField === "person" ? erRoleSortDirection : "none"}
              onClick={() => handleERRoleSort("person")}
              className={styles["header-font"]}
            >
              Person/Virksomhet
            </Table.HeaderCell>
            <Table.HeaderCell
              sort={
                erRoleSortField === "sistEndret" ? erRoleSortDirection : "none"
              }
              onClick={() => handleERRoleSort("sistEndret")}
              className={styles["header-font"]}
            >
              Dato Endret
            </Table.HeaderCell>
            <Table.HeaderCell className={styles["header-font"]}>
              Status
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sortedERRoles && sortedERRoles.length > 0 ? (
            sortedERRoles.map((role, index) => (
              <Table.Row key={index}>
                <Table.Cell className={styles["cell-font"]}>
                  {role.type?.beskrivelse || ""}
                </Table.Cell>
                <Table.Cell className={styles["cell-font"]}>
                  {role.person
                    ? `${role.person?.navn?.fornavn || ""} ${role.person?.navn?.etternavn || ""}`.trim()
                    : role.enhet
                      ? `${role.enhet.navn?.[0] || ""} (${role.enhet.organisasjonsnummer})`
                      : ""}
                </Table.Cell>
                <Table.Cell className={styles["cell-font"]}>
                  {formatDate(role.sistEndret)}
                </Table.Cell>
                <Table.Cell className={styles["cell-font"]}>
                  {role.fratraadt ? "Fratrådt" : "Aktiv"}
                  {role.person?.erDoed ? " (Død)" : ""}
                  {role.enhet?.erSlettet ? " (Slettet)" : ""}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Paragraph className={styles.paragraph}>
                  Ingen roller funnet
                </Paragraph>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  );
};

export default ERRolesTable;
