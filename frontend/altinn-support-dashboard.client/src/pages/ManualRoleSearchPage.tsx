import React, { useState } from "react";
import { getLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import { UseManualRoleSearch } from "../hooks/hooks";
import InputComponent from "../components/ManualRoleSearch/ManualRoleSearchInput";
import SearchButton from "../components/ManualRoleSearch/ManualRoleSearchButton";
import EmptySearch from "../components/ManualRoleSearch/ManualRoleEmptySearchButton";
import ManualRoleSearchResult from "../components/ManualRoleSearch/ManualRoleSearchResult";
import { Heading, Button} from '@digdir/designsystemet-react';
import InformationDialogBox from "../components/InformationDialog/InformationDialogBox";
import { InformationIcon } from '@navikt/aksel-icons';
import styles from"./styles/ManualRoleSearchPage.module.css";
import { useAppStore } from "../stores/Appstore";

export const ManualRoleSearchPage: React.FC = () => {
  const [rollehaver, setRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver"),
  );
  const [rollegiver, setRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver"),
  );
  const [hasSearched, setHasSearched] = useState(false);
  const environment = useAppStore((state) => state.environment);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const {
    data: roles = [],
    isLoading,
    error,
    refetch,
  } = UseManualRoleSearch(rollehaver, rollegiver, environment);

  return (
    <div>
      <Heading level={1} data-size="sm" >
        Manuelt Rollesøk
      </Heading>
      <Button 
      onClick={() => dialogRef.current?.showModal()}
      className={styles.infoButton}
      variant="secondary">
        <InformationIcon />
      </Button>
      <InformationDialogBox dialogRef={dialogRef} />

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
