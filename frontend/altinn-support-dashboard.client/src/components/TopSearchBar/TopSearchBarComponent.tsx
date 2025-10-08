import React from "react";
import { TopSearchBarTextField } from "./TopSearchBarTextField";
import { Card, Heading } from "@digdir/designsystemet-react";

type SearchComponentProps = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  query,
  setQuery,
}) => (
  <div>
    <Heading level={1}>Søk etter Organisasjoner</Heading>
    <TopSearchBarTextField query={query} setQuery={setQuery} />
  </div>
);

export default SearchComponent;

