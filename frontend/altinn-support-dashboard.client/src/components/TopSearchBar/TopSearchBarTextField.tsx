import { 
    IconButton, 
    TextField, 
    InputAdornment 
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Clear as ClearIcon 
} from '@mui/icons-material';


type Props = {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: () => void;
};

export const TopSearchBarTextField: React.FC<Props> = ({
    query,
    setQuery,
    handleSearch
}) => {

    return (
        <TextField
            fullWidth
            variant = "outlined"
            placeholder = "Mobilnummer / E-post / Organisasjonsnummer"
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
                            <IconButton onClick = {() => setQuery('')} edge = "end">
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
    );
};