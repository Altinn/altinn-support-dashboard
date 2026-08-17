import React, { useState } from "react";
import { Textfield, Button, Search, Checkbox } from "@digdir/designsystemet-react";
import classes from "./styles/ResourceSearchSearchBar.module.css"
import { useResourceSearchStore } from "../../stores/ResourceSearchStore";

export const ResourceSearchSearchBar: React.FC = ()  => {

  const query = useResourceSearchStore((s) => s.query);
  const setQuery = useResourceSearchStore((s) => s.setQuery);
  const setSelectedResource = useResourceSearchStore((s) => s.setSelectedResource);
  const onlyDelegable = useResourceSearchStore((s) => s.onlyDelegable);
  const setOnlyDelegable = useResourceSearchStore((s) => s.setOnlyDelegable);
  const onlyVisible = useResourceSearchStore((s) => s.onlyVisible);
  const setOnlyVisible = useResourceSearchStore((s) => s.setOnlyVisible)
  const onlyAltinnApp = useResourceSearchStore((s) => s.onlyAltinnApp);
  const setOnlyAltinnApp = useResourceSearchStore((s) => s.setOnlyAltinnApp);

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
