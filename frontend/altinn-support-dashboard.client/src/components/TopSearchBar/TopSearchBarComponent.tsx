import React from "react";
import { TopSearchBarTextField } from "./TopSearchBarTextField";
import { Heading } from "@digdir/designsystemet-react";
import { SelectedCard } from "../../models/models";

type SearchComponentProps = {
  query: string;
  setQuery: (query: string) => void;
  setSelectedCard: (selectedCard: SelectedCard | null) => void;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  query,
  setQuery,
  setSelectedCard,
}) => (
  <div>
    <Heading level={1}>Søk etter Organisasjoner</Heading>
    <TopSearchBarTextField
      query={query}
      setQuery={setQuery}
      setSelectedCard={setSelectedCard}
    />
  </div>
);

export default SearchComponent;
