import React, { useEffect } from "react";
import {
  Alert,
  Paragraph,
  Skeleton,
  Table,
} from "@digdir/designsystemet-react";
import RoleList from "../Dashboard/components/RoleList";
import { useAppStore } from "../../stores/Appstore";
import { useRoles } from "../../hooks/hooks";

interface RoleTableProps {
  subject: string;
  reportee: string;
  searchTrigger: number;
}

const RoleTable: React.FC<RoleTableProps> = ({
  searchTrigger,
  subject,
  reportee,
}) => {
  const environment = useAppStore((state) => state.environment);

  const roleQuery = useRoles(
    environment,
    {
      value: subject,
      partyFilter: [{ value: reportee }],
    },
    searchTrigger,
  );

  const roleInfo = roleQuery.data;

  if (roleQuery.isLoading) {
    return <Skeleton variant="rectangle" height={300} />;
  }
  if (roleQuery.isError) {
    return <Alert data-color="danger">Error when fetching roles</Alert>;
  }

  return (
    <Table border>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Rolletype</Table.HeaderCell>
          <Table.HeaderCell>Rollenavn</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {roleInfo && roleInfo.length >= 1 ? (
          <>
            <RoleList
              roles={roleInfo[0].authorizedAccessPackages}
              type="Tilgangspakke"
            />
            <RoleList
              roles={roleInfo[0].authorizedRoles}
              type="Altinn2 rolle"
            />
            <RoleList
              roles={roleInfo[0].authorizedResources}
              type="Altinn3 Ressurs"
            />
            <RoleList
              roles={roleInfo[0].authorizedInstances}
              type="Altinn3 instanse"
            />
          </>
        ) : (
          <Table.Row>
            <Table.Cell colSpan={2}>
              <Paragraph style={{ textAlign: "center" }}>
                Ingen roller funnet
              </Paragraph>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default RoleTable;
