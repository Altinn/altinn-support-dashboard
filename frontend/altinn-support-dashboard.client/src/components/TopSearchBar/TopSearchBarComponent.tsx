import React from 'react';
import { TopSearchBarTextField } from './TopSearchBarTextField';
import { 
    Box, 
    Typography 
} from '@mui/material';

type SearchComponentProps = {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: () => void;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
    query,
    setQuery,
    handleSearch
}) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
            Søk etter Organisasjoner
        </Typography>
        <TopSearchBarTextField 
            query={query} 
            setQuery={setQuery} 
            handleSearch={handleSearch}
        />
    </Box>
);

export default SearchComponent;
