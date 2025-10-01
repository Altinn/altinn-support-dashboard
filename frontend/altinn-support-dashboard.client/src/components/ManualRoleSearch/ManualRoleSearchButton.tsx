import React from "react";
import { Button } from '@digdir/designsystemet-react';
import style from "./styles/SearchButton.module.css";

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
      <div className={style["search-button"]}>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !rollehaver || !rollegiver}
          >
            Søk
          </Button>
      </div>
    );
};

export default SearchButton;

