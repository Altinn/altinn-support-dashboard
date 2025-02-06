// SearchComponent.tsx
import React from 'react';
import { TextField, IconButton, InputAdornment, Box, Typography, Button } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

type SearchComponentProps = {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: () => void;
    handleClearSearch: () => void;
    hasSearched: boolean;
    isDarkMode: boolean;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
    query,
    setQuery,
    handleSearch,
    handleClearSearch,
    hasSearched,
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
                if (e.key === 'Enter') {
                    handleSearch();
                }
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {query && (
                            <IconButton onClick={() => setQuery('')} edge="end">
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
        {(hasSearched || query.trim() !== '') && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button variant="outlined" onClick={handleClearSearch}>
                    Clear Search
                </Button>
            </Box>
        )}
    </Box>
);

export default SearchComponent;
