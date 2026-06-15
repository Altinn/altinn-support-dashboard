import React, { useState } from "react";
import { Textfield, Button, Search, Checkbox } from "@digdir/designsystemet-react";
import { Resource } from "../../models/resourceModels";
import classes from "./styles/ResourceSearchSearchBar.module.css"

type ResourceSearchSearchBarProps = {
  query: string;
  setQuery: (query: string) => void;
  setSelectedResource: (resource: Resource | null) => void;
  onlyDelegable: boolean;
  setOnlyDelegable: (value: boolean) => void;
  onlyVisible: boolean;
  setOnlyVisible: (value: boolean) => void;
};

export const ResourceSearchSearchBar: React.FC<ResourceSearchSearchBarProps> = ({
  query,
  setQuery,
  setSelectedResource,
  onlyDelegable,
  setOnlyDelegable,
  onlyVisible,
  setOnlyVisible
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
      <div className={classes.searchRow}>
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
      <div className={classes.filters}>
        <Checkbox
          label = "Kun delegerbare"
          className={classes.checkbox}
          value="delegable"
          checked={onlyDelegable}
          onChange={(e) => setOnlyDelegable(e.target.checked)}
        />
        <Checkbox
          label="Kun synlige"
          className={classes.checkbox}
          value="visible"
          checked={onlyVisible}
          onChange={(e) => setOnlyVisible(e.target.checked)}
        />
      </div>
    </div>
  );
};
