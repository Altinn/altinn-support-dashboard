import React, { useState } from "react";
import { Textfield, Button, Search, Checkbox } from "@digdir/designsystemet-react";
import classes from "./styles/ResourceSearchSearchBar.module.css"
import { ResourceSearchResult } from "../../models/resourceModels";


interface ResourceSearchSearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  setSelectedResource: (r: ResourceSearchResult | null) => void;
  onlyDelegable: boolean;
  setOnlyDelegable: (v: boolean) => void;
  onlyVisible: boolean;
  setOnlyVisible: (v: boolean) => void;
  onlyAltinnApp: boolean;
  setOnlyAltinnApp: (v: boolean) => void;
}


export const ResourceSearchSearchBar: React.FC<ResourceSearchSearchBarProps> =  ({
  query,
  setQuery,
  setSelectedResource,
  onlyDelegable,
  setOnlyDelegable,
  onlyVisible,
  setOnlyVisible,
  onlyAltinnApp,
  setOnlyAltinnApp
}) => {

  const [textFieldValue, setTextFieldValue] = useState(query)

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
            setSelectedResource(null);
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
          value="delegable"
          checked={onlyDelegable}
          onChange={(e) => setOnlyDelegable(e.target.checked)}
        />
        <Checkbox
          label="Kun synlige"
          value="visible"
          checked={onlyVisible}
          onChange={(e) => setOnlyVisible(e.target.checked)}
        />
        <Checkbox
          label="Kun AltinnApp"
          value="altinnApp"
          checked={onlyAltinnApp}
          onChange={(e) => setOnlyAltinnApp(e.target.checked)}
        />

      </div>
    </div>
  );
};
