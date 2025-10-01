import React, { useState } from "react";
import { getLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import { UseManualRoleSearch } from "../hooks/hooks";
import InputComponent from "../components/ManualRoleSearch/ManualRoleSearchInput";
import SearchButton from "../components/ManualRoleSearch/ManualRoleSearchButton";
import EmptySearch from "../components/ManualRoleSearch/ManualRoleEmptySearchButton";
import ManualRoleSearchResult from "../components/ManualRoleSearch/ManualRoleSearchResult";
import { Heading} from '@digdir/designsystemet-react';
import styles from"./styles/ManualRoleSearchPage.module.css";
import resultTableStyles from "./styles/ManualRoleSearch/ResultTable.module.css";

export const ManualRoleSearchPage: React.FC = () => {
  const [rollehaver, setRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver"),
  );
  const [rollegiver, setRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver"),
  );
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: roles = [],
    isLoading,
    error,
    refetch,
  } = UseManualRoleSearch(rollehaver, rollegiver);

  return (
    <div>
      <Heading level={1} data-size="sm" >
        Manuelt Rollesøk
      </Heading>

      <div className={styles["input-row"]}>
        <InputComponent
          rollehaver={rollehaver}
          rollegiver={rollegiver}
          setRollehaver={setRollehaver}
          setRollegiver={setRollegiver}
        />
        <SearchButton
          rollehaver={rollehaver}
          rollegiver={rollegiver}
          isLoading={isLoading}
          refetch={refetch}
          sethasSearched={setHasSearched}
        />
      </div>
      <div className={styles["result-area"]}>
        {(hasSearched ||
          rollehaver.trim() !== "" ||
          rollegiver.trim() !== "") && (
          <EmptySearch
            sethasSearched={setHasSearched}
            setRollehaver={setRollehaver}
            setRollegiver={setRollegiver}
          />
        )}
        <ManualRoleSearchResult
          error={error}
          isLoading={isLoading}
          hasSearched={hasSearched}
          roles={roles}
        />
      </div>
    </div>
  );
};

export default ManualRoleSearchPage;
