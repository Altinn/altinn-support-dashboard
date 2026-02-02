import React, { useState } from "react";
import { getLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import InputComponent from "../components/ManualRoleSearch/ManualRoleSearchInput";
import SearchButton from "../components/ManualRoleSearch/ManualRoleSearchButton";
import EmptySearch from "../components/ManualRoleSearch/ManualRoleEmptySearchButton";
import { Heading, Button } from "@digdir/designsystemet-react";
import InformationDialogBox from "../components/InformationDialog/InformationDialogBox";
import { InformationIcon } from "@navikt/aksel-icons";
import styles from "./styles/ManualRoleSearchPage.module.css";
import RoleTable from "../components/ManualRoleSearch/RoleTable";

export const ManualRoleSearchPage: React.FC = () => {
  const [rollehaver, setRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver"),
  );
  const [rollegiver, setRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver"),
  );
  const [searchTrigger, setSearchTrigger] = useState(0);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const handleSearch = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <Heading level={1} data-size="sm">
        Manuelt Rollesøk
      </Heading>
      <Button
        onClick={() => dialogRef.current?.showModal()}
        className={styles.infoButton}
        variant="secondary"
      >
        <InformationIcon />
      </Button>
      <InformationDialogBox dialogRef={dialogRef} />

      <div className={styles["input-row"]}>
        <InputComponent
          searchTrigger={searchTrigger}
          setRollehaver={setRollehaver}
          setRollegiver={setRollegiver}
        />
        <SearchButton
          rollehaver={rollehaver}
          rollegiver={rollegiver}
          handleSearch={handleSearch}
        />
      </div>
      <div className={styles["result-area"]}>
        {(rollehaver.trim() !== "" || rollegiver.trim() !== "") && (
          <EmptySearch
            setRollehaver={setRollehaver}
            setRollegiver={setRollegiver}
          />
        )}
        <RoleTable subject={rollehaver} reportee={rollegiver} />
      </div>
    </div>
  );
};

export default ManualRoleSearchPage;
