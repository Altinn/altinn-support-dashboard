import { useState } from "react";
import { Textfield, Button, Search } from "@digdir/designsystemet-react";
import styles from "./styles/TopSearchBarTextfield.module.css";
import { Organization } from "../../models/models";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  setSelectedOrg: (selectedOrg: Organization | null) => void;
};

export const TopSearchBarTextField: React.FC<Props> = ({
  query,
  setQuery,
  setSelectedOrg,
}) => {
  const [textFieldValue, setTextFieldValue] = useState(() => {
    if (query != null && query !== "") return query;
    return "";
  });
  const handleSearch = () => {
    if (textFieldValue != query) {
      setSelectedOrg(null);
    }
    setQuery(textFieldValue);
  };

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
