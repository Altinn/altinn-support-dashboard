import React from "react";
import { setLocalStorageValue } from "./utils/storageUtils";
import { Button } from "@digdir/designsystemet-react";
import styles from "./styles/EmptySearchButton.module.css";

type EmptySearchProps = {
  setRollehaver: (value: string) => void;
  setRollegiver: (value: string) => void;
};

const EmptySearch: React.FC<EmptySearchProps> = ({
  setRollehaver,
  setRollegiver,
}) => {
  const clearSearch = () => {
    setRollehaver("");
    setRollegiver("");
    setLocalStorageValue("rollehaver", "");
    setLocalStorageValue("rollegiver", "");
  };

  return (
    <div className={styles["empty-search-button"]}>
      <Button variant="secondary" onClick={clearSearch}>
        Tøm søk
      </Button>
    </div>
  );
};

export default EmptySearch;
