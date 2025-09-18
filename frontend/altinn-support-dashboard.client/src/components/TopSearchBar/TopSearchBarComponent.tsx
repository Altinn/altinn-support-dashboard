import React from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";

import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

type SearchComponentProps = {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: () => void;
  isDarkMode: boolean;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  query,
  setQuery,
  handleSearch,
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom>
      Søk etter Organisasjoner
    </Typography>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Mobilnummer / E-post / Organisasjonsnummer"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {query && (
              <IconButton onClick={() => setQuery("")} edge="end">
                <ClearIcon />
              </IconButton>
            )}
            <IconButton onClick={handleSearch} edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

export default SearchComponent;
