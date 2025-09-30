import React from "react";
import {
    setLocalStorageValue
} from "./utils/storageUtils";
import { Button } from '@digdir/designsystemet-react';


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
        <Button variant="secondary" onClick={clearSearch}>
            Tøm søk
        </Button>
    );
};

export default EmptySearch;
