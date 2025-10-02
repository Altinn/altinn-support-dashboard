import React from "react";
import { TopSearchBarTextField } from "./TopSearchBarTextField";
import { Box } from "@mui/material";
import { Card, Heading } from "@digdir/designsystemet-react";

type SearchComponentProps = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  query,
  setQuery,
}) => (
  <Card data-color="neutral">
    <Heading level={1} style={{ marginBottom: "0.5rem" }}>
      Søk etter Organisasjoner
    </Heading>
    <TopSearchBarTextField query={query} setQuery={setQuery} />
  </Card>
);

export default SearchComponent;
 