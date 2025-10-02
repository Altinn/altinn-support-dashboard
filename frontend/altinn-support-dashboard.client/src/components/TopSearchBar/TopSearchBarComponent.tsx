import React from "react";
import { TopSearchBarTextField } from "./TopSearchBarTextField";
import { Box } from "@mui/material";
import { Heading } from "@digdir/designsystemet-react";

type SearchComponentProps = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  query,
  setQuery,
}) => (
  <Box sx={{ mb: 3 }}>
    <Heading level={1}>
      Søk etter Organisasjoner
    </Heading>
    <TopSearchBarTextField query={query} setQuery={setQuery} />
  </Box>
);

export default SearchComponent;
 