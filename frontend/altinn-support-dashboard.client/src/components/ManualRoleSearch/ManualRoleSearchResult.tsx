import React from "react";
import { Role } from "./models/manualRoleSearchTypes";
import RoleTable from "./ManualRoleSearchTable";
import { Alert, Heading } from '@digdir/designsystemet-react';
import styles from "./styles/ResultTable.module.css";

type ManualRoleSearchResultProps = {
    error: Error | null;
    isLoading: boolean;
    hasSearched: boolean;
    roles: Role[];
};


const ManualRoleSearchResult: React.FC<ManualRoleSearchResultProps> = ({
    error,
    isLoading,
    hasSearched,
    roles,
  }) => {

    return (
      <div className={styles["result-area"]}>
        {error && (
          <Alert data-color="danger" >
            {error.message}
          </Alert>
        )}
        {isLoading && <Heading level={2}> Laster roller...</Heading>}
        {!isLoading && hasSearched && roles.length === 0 && !error && (
            <Alert data-color="info">
            Ingen roller funnet.
          </Alert>
        )}
        {roles.length > 0 && !error && <RoleTable roles={roles} />}
    </div>
    );
};


export default ManualRoleSearchResult;