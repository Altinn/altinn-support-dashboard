import { useEffect, useState } from "react";
import { Textfield, Button, Search } from "@digdir/designsystemet-react";
import styles from "./styles/TopSearchBarTextfield.module.css";
import { SelectedOrg } from "../../models/models";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  setSelectedOrg: (selectedOrg: SelectedOrg) => void;
};

export const TopSearchBarTextField: React.FC<Props> = ({
  query,
  setQuery,
  setSelectedOrg,
}) => {
  const [textFieldValue, setTextFieldValue] = useState("");
  const handleSearch = () => {
    //Ignores + for countrycodes for phonenumbers
    if (textFieldValue != query) {
      setSelectedOrg(null);
    }
    setQuery(textFieldValue);
  };

  useEffect(() => {
    if (textFieldValue === "" && query != null) {
      setTextFieldValue(query);
    }
  }, []);
  return (
    <div className={styles["Container"]}>
      <Textfield
        label=""
        placeholder="Mobilnummer / E-post / Organisasjonsnummer"
        value={textFieldValue}
        onChange={(e) => setTextFieldValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Button
        onClick={() => {
          setTextFieldValue("");
          setQuery("");
        }}
        className={styles.emptySearchButton}
      >
        X
      </Button>
      <Button
        onClick={handleSearch}
        variant="tertiary"
        className={styles.searchButton}
      >
        <Search />
      </Button>
    </div>
  );
};
