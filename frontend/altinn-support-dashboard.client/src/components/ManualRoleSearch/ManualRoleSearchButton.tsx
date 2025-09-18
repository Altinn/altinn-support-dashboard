import React from "react";
import { Button } from "@mui/material";


type SearchButtonProps = {
  rollehaver: string;
  rollegiver: string;
  fetchRoles: (rollehaver: string, rollegiver: string) => Promise<void>;
  isLoading: boolean;
  sethasSearched: (value: boolean) => void;
};

const SearchButton: React.FC<SearchButtonProps> = ({
    rollehaver,
    rollegiver,
    fetchRoles,
    isLoading,
    sethasSearched,
  }) => {


    const handleSearch = async () => {
        sethasSearched(true);
        const cleanRollehaver = rollehaver.replace(/\s/g, "");
        const cleanRollegiver = rollegiver.replace(/\s/g, "");
        await fetchRoles(cleanRollehaver, cleanRollegiver);
    };
    return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={isLoading || !rollehaver || !rollegiver}
        >
          Søk
        </Button>
    );
};

export default SearchButton;

