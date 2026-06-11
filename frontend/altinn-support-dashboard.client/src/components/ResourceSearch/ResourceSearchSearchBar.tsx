import React, { useState } from "react";
import { Textfield, Button, Search } from "@digdir/designsystemet-react";
import { Resource } from "../../models/resourceModels";
import classes from "./styles/ResourceSearchSearchBar.module.css"

type ResourceSearchSearchBarProps = {
  query: string;
  setQuery: (query: string) => void;
  setSelectedResource: (resource: Resource | null) => void;
};

export const ResourceSearchSearchBar: React.FC<ResourceSearchSearchBarProps> = ({
  query,
  setQuery,
  setSelectedResource,
}) => {
  const [textFieldValue, setTextFieldValue] = useState(() =>
    query != null && query !== "" ? query : ""
  );

  const handleSearch = () => {
    if (textFieldValue !== query) {
      setSelectedResource(null);
    }
    setQuery(textFieldValue);
  };

  return (
    <div className={classes.container}>
      <Textfield
        label=""
        placeholder="Søk etter ressurser..."
        value={textFieldValue}
        onChange={(e) => setTextFieldValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Button
        onClick={() => {
          setTextFieldValue("");
          setQuery("");
        }}
        className={classes.emptySearchButton}
      >
        X
      </Button>
      <Button
        onClick={handleSearch}
        className={classes.searchButton}
      >
        <Search />
      </Button>
    </div>
  );
};
