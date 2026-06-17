import React from "react";
import { Textfield } from "@digdir/designsystemet-react";
import styles from "../../styles/ContactsSearchBar.module.css";

interface SearchContactsBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleClearSearch: () => void;
}

const SearchContactsBar: React.FC<SearchContactsBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <Textfield
      label="Søk i kontakter"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Navn / Fødselsnummer / Telefon / E-post"
      className={styles["input"]}
    />
  );
};

export default SearchContactsBar;
