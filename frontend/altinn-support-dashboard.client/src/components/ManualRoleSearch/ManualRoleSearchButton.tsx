import React from "react";
import { Button } from "@mui/material";


type SearchButtonProps = {
  rollehaver: string;
  rollegiver: string;
  isLoading: boolean;
  refetch: () => void;
  sethasSearched: (value: boolean) => void;
};

const SearchButton: React.FC<SearchButtonProps> = ({
    rollehaver,
    rollegiver,
    isLoading,
    refetch,
    sethasSearched,
  }) => {


    const handleSearch = async () => {
        sethasSearched(true);
        refetch();
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

