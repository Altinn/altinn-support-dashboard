import React from "react";
import { TextField, Button } from "@mui/material";

interface SearchContactsBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleClearSearch: () => void;
}

const SearchContactsBar: React.FC<SearchContactsBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleClearSearch,
}) => {
  return (
    <div
      className="search-ssn"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <TextField
        label="Søk i kontakter"
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Navn / SSN / Telefon / E-post"
        sx={{ mb: 2 }}
      />
      {searchQuery.trim() !== "" && (
        <Button
          variant="outlined"
          onClick={handleClearSearch}
          sx={{ height: "fit-content", mb: 2 }}
        >
          Clear Search
        </Button>
      )}
    </div>
  );
};

export default SearchContactsBar;
