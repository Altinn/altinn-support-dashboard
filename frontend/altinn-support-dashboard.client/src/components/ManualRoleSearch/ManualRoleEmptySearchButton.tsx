import React from "react";
import {
    setLocalStorageValue
} from "./utils/storageUtils";
import { Button } from '@digdir/designsystemet-react';
import styles from "./styles/EmptySearchButton.module.css";


type EmptySearchProps = {
    sethasSearched: (value: boolean) => void;
    setRollehaver: (value: string) => void;
    setRollegiver: (value: string) => void;
};

const EmptySearch: React.FC<EmptySearchProps> = ({
    sethasSearched,
    setRollehaver,
    setRollegiver
}) => {


    const clearSearch = () => {
        setRollehaver("");
        setRollegiver("");
        setLocalStorageValue("rollehaver", "");
        setLocalStorageValue("rollegiver", "");
        sethasSearched(false);
    }

    return (
        <div className={styles["empty-search-button"]}>
            <Button variant="secondary" onClick={clearSearch}>
                Tøm søk
            </Button>
        </div>
    );
};

export default EmptySearch;
