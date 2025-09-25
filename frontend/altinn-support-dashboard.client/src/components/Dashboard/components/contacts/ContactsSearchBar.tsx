import React from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

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
    <TextField
      label="Søk i kontakter"
      variant="outlined"
      size="small"
      fullWidth
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Navn / SSN / Telefon / E-post"
      slotProps={{
        input: {
          endAdornment: searchQuery.trim() !== "" && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchContactsBar;
