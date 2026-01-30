import { Table } from "@digdir/designsystemet-react";

interface RoleListProps {
  roles?: string[];
  type: string;
}
const RoleList: React.FC<RoleListProps> = ({ roles, type }) => {
  return (
    <>
      {roles &&
        roles.length > 0 &&
        roles.map((role, index) => (
          <Table.Row key={index}>
            <Table.Cell>{type}</Table.Cell>
            <Table.Cell>{role}</Table.Cell>
          </Table.Row>
        ))}
    </>
  );
};

export default RoleList;
