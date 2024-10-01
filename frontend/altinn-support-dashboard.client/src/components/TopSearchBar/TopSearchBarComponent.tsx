// SearchComponent.tsx

import React from 'react';
import { Search } from '@digdir/designsystemet-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

type SearchComponentProps = {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: () => void;
};

const SearchComponent: React.FC<SearchComponentProps> = ({ query, setQuery, handleSearch }) => (
    <div className="search-container">
        <label htmlFor="searchbar" className="search-label">
            Mobilnummer / E-post / Organisasjonsnummer:
        </label>
        <form
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <Search
                id="searchbar"
                label="Søk etter innhold"
                clearButtonLabel="Fjern søkeinnhold"
                searchButtonLabel={<MagnifyingGlassIcon fontSize="1.5em" title="Search" />}
                variant="primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery('')} 
                onSearchClick={handleSearch}
            />
        </form>
    </div>
);

export default SearchComponent;
