import React from "react";
import {
    setLocalStorageValue
} from "./utils/storageUtils";
import { Button } from "@mui/material";


type EmptySearchProps = {
    clearRoles: () => void;
    sethasSearched: (value: boolean) => void;
    setRollehaver: (value: string) => void;
    setRollegiver: (value: string) => void;
};

const EmptySearch: React.FC<EmptySearchProps> = ({
    clearRoles,
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
        clearRoles();
    }

    return (
        <Button variant="outlined" onClick={clearSearch}>
            Tøm søk
        </Button>
    );
};

export default EmptySearch;
