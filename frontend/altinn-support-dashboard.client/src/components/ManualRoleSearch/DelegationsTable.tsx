import { Card, Heading, Skeleton, Table } from "@digdir/designsystemet-react";
import { useAppStore } from "../../stores/Appstore";
import { useMaskinportenDelegations } from "../../hooks/hooks";
import { formatDate } from "../Dashboard/utils/dateUtils";
import style from "./styles/DelegationsTable.module.css";

interface DelegationsTableProps {
  supplierOrg?: string;
  consumerOrg?: string;
  scope?: string;
}

const DelegationsTable: React.FC<DelegationsTableProps> = ({
  supplierOrg,
  consumerOrg,
  scope,
}) => {
  const environment = useAppStore((state) => state.environment);

  const delegationsQuery = useMaskinportenDelegations(
    environment,
    supplierOrg,
    consumerOrg,
    scope
  );

  if (!supplierOrg || !consumerOrg) {
    return null;
  }

  if (delegationsQuery.isLoading) {
    return <Skeleton variant="rectangle" height={200} />;
  }

  const delegations = delegationsQuery.data ?? [];

  if (delegations.length === 0) {
    return null;
  }

  return (
    <Card data-color="neutral" className={style.card}>
      <Heading level={2} data-size="xs">
        Maskinporten-delegeringer
      </Heading>
      <Table border data-size="sm">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Ressurs</Table.HeaderCell>
            <Table.HeaderCell>Scopes</Table.HeaderCell>
            <Table.HeaderCell>Skjema Id</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {delegations.map((delegation, index) => (
            <Table.Row key={`${delegation.resourceid ?? ""}-${index}`}>
              <Table.Cell>{delegation.resourceid ?? "-"}</Table.Cell>
              <Table.Cell>{delegation.scopes?.join(", ") ?? "-"}</Table.Cell>
              <Table.Cell>{delegation.delegation_scheme_Id ?? "-"}</Table.Cell>
              <Table.Cell>
                {delegation.created ? formatDate(delegation.created) : "-"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
};

export default DelegationsTable;
