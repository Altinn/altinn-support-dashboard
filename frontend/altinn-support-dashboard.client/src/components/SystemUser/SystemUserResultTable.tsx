import { Alert, Skeleton, Table } from "@digdir/designsystemet-react";
import { AuthorizedPartyExtended } from "../../models/models";
import { useAppStore } from "../../stores/Appstore";
import { useRoleDefinitions } from "../../hooks/hooks";




interface SystemUserResultTableProps {
  data: AuthorizedPartyExtended[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const SystemUserResultTable: React.FC<SystemUserResultTableProps> =({
    data,
    isLoading,
    error
}) => {
    const environment = useAppStore((state) => state.environment);
    const roleDefinitionsQuery = useRoleDefinitions(environment);

    const roleNameMap: Record<string, string> = {};
    for (const role of roleDefinitionsQuery.data ?? []) {
        roleNameMap[role.code.toLowerCase()] = role.name;
        if (role.legacyRoleCode) roleNameMap[role.legacyRoleCode.toLowerCase()] = role.name;
    }

    
    if (isLoading) return <Skeleton variant="rectangle" height={300}/>;
    if (error) return <Alert data-color="danger">{error.message}</Alert>
    if (!data) return null;
    if (data.length === 0) return <Alert data-color="info">Ingen resultater funnet</Alert>;

    return (
        <Table border>
            <Table.Head>
                <Table.Row>
                    <Table.HeaderCell>Navn</Table.HeaderCell>
                    <Table.HeaderCell>Organisasjonsnummer</Table.HeaderCell>
                    <Table.HeaderCell>Rolle</Table.HeaderCell>
                    <Table.HeaderCell>Ressurser</Table.HeaderCell>
                    <Table.HeaderCell>Tilgangspakker</Table.HeaderCell>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {data.map((party) => (
                    <Table.Row key={party.partyUuid}>
                        <Table.Cell>{party.name}</Table.Cell>
                        <Table.Cell>{party.organizationNumber ?? party.personId ?? "-"}</Table.Cell>
                        <Table.Cell>
                            {party.authorizedRoles?.map(code => roleNameMap[code.toLowerCase()] ?? code).join(", ") ?? "—"}</Table.Cell>
                        <Table.Cell>{party.authorizedResources?.join(",") ?? "-"}</Table.Cell>
                        <Table.Cell>{party.authorizedAccessPackages?.join(",") ?? "-"}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default SystemUserResultTable;