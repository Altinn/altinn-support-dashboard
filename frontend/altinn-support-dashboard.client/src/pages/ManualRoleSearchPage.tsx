import React, { useState } from "react";
import { getLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import InputComponent from "../components/ManualRoleSearch/ManualRoleSearchInput";
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
  const dialogRef = React.useRef<HTMLDialogElement>(null);

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

      <div className={styles.inputRow}>
        <InputComponent
          setRollehaver={setRollehaver}
          setRollegiver={setRollegiver}
        />
      </div>
      <div className={styles.resultArea}>
        <RoleTable subject={rollehaver} reportee={rollegiver} />
      </div>
    </div>
  );
};

export default ManualRoleSearchPage;
