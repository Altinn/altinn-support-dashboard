import { Card, Paragraph, Skeleton, Table, Checkbox, Textfield} from "@digdir/designsystemet-react";
import RoleList from "../Dashboard/components/RoleList";
import { useAppStore } from "../../stores/Appstore";
import { useRoles } from "../../hooks/hooks";
import { useState } from "react";
import RoleType from "../../models/roleType";
import style from "./styles/RoleTable.module.css";

interface RoleTableProps {
  subject?: string;
  reportee?: string;
}

const RoleTable: React.FC<RoleTableProps> = ({ subject, reportee }) => {
  const environment = useAppStore((state) => state.environment);

  const roleQuery = useRoles(environment, {
    value: subject ?? "",
    partyFilter: [{ value: reportee ?? "" }],
  });

  const roleInfo = roleQuery.data;
  
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set()
  );

  const toggleType = (type: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); 
      else next.add(type);
      return next;
    })
  }

  const [searchTerm, setSearchTerm] = useState("");

  const filterRoles = (roles?: string[]) => {
    if (!roles || !searchTerm) return roles;
    return roles.filter((role) => 
      role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  if (roleQuery.isLoading) {
    return <Skeleton variant="rectangle" height={300} />;
  }


  return (
    <Card data-color="neutral">
      <Textfield
        className = {style.searchField}
        label="Søk etter rolle"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Skriv inn rollenavn"
      />
      <div className={style.checkboxContainer}>
        <Checkbox label="Tilgangspakke" className ={style.checkbox} 
          checked={activeFilters.has(RoleType.AuthorizedAccessPackages)} 
          onChange={() => toggleType(RoleType.AuthorizedAccessPackages)} 
        />
        <Checkbox label="Altinn2 rolle" className ={style.checkbox}
          checked={activeFilters.has(RoleType.AuthorizedRoles)} 
          onChange={() => toggleType(RoleType.AuthorizedRoles)} 
        />
        <Checkbox label="Altinn3 instanse" className ={style.checkbox}
          checked={activeFilters.has(RoleType.AuthorizedInstances)} 
          onChange={() => toggleType(RoleType.AuthorizedInstances)} 
        />
        <Checkbox label="Enkelrettighet" className ={style.checkbox}
          checked={activeFilters.has(RoleType.AuthorizedResources)} 
          onChange={() => toggleType(RoleType.AuthorizedResources)} 
        />
      </div>
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
              {(activeFilters.size == 0 || activeFilters.has(RoleType.AuthorizedAccessPackages)) && (
                <RoleList
                  roles={filterRoles(roleInfo[0].authorizedAccessPackages)}
                  type="Tilgangspakke"
                />
              )}

              {(activeFilters.size == 0 || activeFilters.has(RoleType.AuthorizedResources)) && (
              <RoleList
                roles={filterRoles(roleInfo[0].authorizedResources)}
                type="Enkelrettighet"
              />
              )}

              {(activeFilters.size == 0 || activeFilters.has(RoleType.AuthorizedRoles)) && (
              <RoleList
                roles={filterRoles(roleInfo[0].authorizedRoles)}
                type="Altinn2 rolle"
              />
              )}

              {(activeFilters.size == 0 || activeFilters.has(RoleType.AuthorizedInstances)) && (
              <RoleList
                roles={filterRoles(roleInfo[0].authorizedInstances)}
                type="Altinn3 instanse"
              />
              )}
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
    </Card>
  );
};

export default RoleTable;
