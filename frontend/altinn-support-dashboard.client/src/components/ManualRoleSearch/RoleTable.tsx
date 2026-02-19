import { Card, Paragraph, Skeleton, Table, Checkbox} from "@digdir/designsystemet-react";
import RoleList from "../Dashboard/components/RoleList";
import { useAppStore } from "../../stores/Appstore";
import { useRoles } from "../../hooks/hooks";
import { useState } from "react";
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

  if (roleQuery.isLoading) {
    return <Skeleton variant="rectangle" height={300} />;
  }


  return (
    <Card data-color="neutral">
      <div className={style.checkboxContainer}>
        <Checkbox label="Tilgangspakke" className ={style.checkbox} 
          checked={activeFilters.has("Tilgangspakke")} 
          onChange={() => toggleType("Tilgangspakke")} 
        />
        <Checkbox label="Altinn2 rolle" className ={style.checkbox}
          checked={activeFilters.has("Altinn2 rolle")} 
          onChange={() => toggleType("Altinn2 rolle")} 
        />
        <Checkbox label="Altinn3 instanse" className ={style.checkbox}
          checked={activeFilters.has("Altinn3 instanse")} 
          onChange={() => toggleType("Altinn3 instanse")} 
        />
        <Checkbox label="Enkelrettighet" className ={style.checkbox}
          checked={activeFilters.has("Enkelrettighet")} 
          onChange={() => toggleType("Enkelrettighet")} 
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
              {(activeFilters.size == 0 || activeFilters.has("Tilgangspakke")) && (
                <RoleList
                  roles={roleInfo[0].authorizedAccessPackages}
                  type="Tilgangspakke"
                />
              )}

              {(activeFilters.size == 0 || activeFilters.has("Enkelrettighet")) && (
              <RoleList
                roles={roleInfo[0].authorizedResources}
                type="Enkelrettighet"
              />
              )}

              {(activeFilters.size == 0 || activeFilters.has("Altinn2 rolle")) && (
              <RoleList
                roles={roleInfo[0].authorizedRoles}
                type="Altinn2 rolle"
              />
              )}

              {(activeFilters.size == 0 || activeFilters.has("Altinn3 instanse")) && (
              <RoleList
                roles={roleInfo[0].authorizedInstances}
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
