import React, { useState } from "react";
import { formatDate } from "../utils/dateUtils";
import { ERRolesSortField, SortDirection } from "../models/mainContentTypes";
import { sortERRoles } from "../utils/contactUtils";
import { useOrgDetails } from "../../../hooks/hooks";
import { ERRoles, ErRoleTableItem, Organization } from "../../../models/models";
import { useAppStore } from "../../../stores/Appstore";
import { Table, Heading, Paragraph, Card } from "@digdir/designsystemet-react";
import styles from "../styles/ERRolesTable.module.css";

interface ERRolesTableProps {
  selectedOrg: Organization;
}

const ERRolesTable: React.FC<ERRolesTableProps> = ({ selectedOrg }) => {
  const environment = useAppStore((state) => state.environment);
  const { ERolesQuery } = useOrgDetails(
    environment,
    selectedOrg.organizationNumber,
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

  const getErRoleItems = (
    rolegroups: ERRoles[] | undefined,
  ): ErRoleTableItem[] => {
    const erRoleItems: ErRoleTableItem[] = [];
    if (rolegroups == null) {
      return [];
    }

    for (const rolegroup of rolegroups) {
      for (const role of rolegroup.roller) {
        erRoleItems.push({
          fratraadt: role.fratraadt,
          sistEndret: rolegroup.sistEndret,
          type: role.type,
          enhet: role.enhet,
          person: role.person,
          groupType: rolegroup.type,
        });
      }
    }
    return erRoleItems;
  };

  const sortedERRoles = sortERRoles(
    getErRoleItems(roles),
    erRoleSortField,
    erRoleSortDirection,
  );

  return (
    <Card data-color="neutral" className={styles.Container}>
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
                  {/* Added fodselsdato here temporarily to display data from altinn.register, this only appears from TT02 data */}
                  {role.sistEndret
                    ? formatDate(role.sistEndret)
                    : role?.person?.fodselsdato}
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
