import React from "react";
import { TopSearchBarTextField } from "./TopSearchBarTextField";
import { Heading } from "@digdir/designsystemet-react";
import { Organization } from "../../models/models";

type SearchComponentProps = {
  query: string;
  setQuery: (query: string) => void;
  setSelectedOrg: (selectedOrg: Organization | null) => void;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  query,
  setQuery,
  setSelectedOrg,
}) => (
  <div>
    <Heading level={1}>Søk etter Organisasjoner</Heading>
    <TopSearchBarTextField
      query={query}
      setQuery={setQuery}
      setSelectedOrg={setSelectedOrg}
    />
  </div>
);

export default SearchComponent;
