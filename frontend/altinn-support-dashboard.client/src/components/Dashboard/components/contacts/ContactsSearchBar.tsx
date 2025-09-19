import React from "react";
import { TextField, Button } from "@mui/material";
import {
  searchBarContainerStyle,
  textFieldStyle,
  clearButtonStyle,
} from "../../styles/ContactsSearchBar.styles";

interface SearchContactsBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleClearSearch: () => void;
}

const ContactsSearchBar: React.FC<SearchContactsBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleClearSearch,
}) => {
  return (
    <div className="search-ssn" style={searchBarContainerStyle}>
      <TextField
        label="Søk i kontakter"
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Navn / SSN / Telefon / E-post"
        sx={textFieldStyle}
      />
      {searchQuery.trim() !== "" && (
        <Button
          variant="outlined"
          onClick={handleClearSearch}
          sx={clearButtonStyle}
        >
          Clear Search
        </Button>
      )}
    </div>
  );
};

export default ContactsSearchBar;
