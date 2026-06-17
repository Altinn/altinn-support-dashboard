import React from "react";
import { Button } from "@digdir/designsystemet-react";
import style from "./styles/SearchButton.module.css";

type SearchButtonProps = {
  handleSearch: () => void;
};

const SearchButton: React.FC<SearchButtonProps> = ({ handleSearch }) => {
  return (
    <div className={style["search-button"]}>
      <Button onClick={handleSearch}>Søk</Button>
    </div>
  );
};

export default SearchButton;
