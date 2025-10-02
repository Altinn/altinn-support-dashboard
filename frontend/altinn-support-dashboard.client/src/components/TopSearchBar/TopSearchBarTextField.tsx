import { useEffect, useState } from "react";
import { Textfield, Button, Search, } from "@digdir/designsystemet-react";
import styles from "./styles/TopSearchBarTextfieldComponent.module.css";

type Props = {
  query: string;
  setQuery: (query: string) => void;
};

export const TopSearchBarTextField: React.FC<Props> = ({ query, setQuery }) => {
  const [textFieldValue, setTextFieldValue] = useState("");
  const handleSearch = () => {
    //Ignores + for countrycodes for phonenumbers
    if (textFieldValue[0] === "+") {
      setQuery(textFieldValue.slice(1));
    } else {
      setQuery(textFieldValue);
    }
  };

  useEffect(() => {
    if (textFieldValue === "" && query != null) {
      setTextFieldValue(query);
    }
  }, []); 
  return (
    <div>
      <Textfield
        className={styles["TopSearchBarTextField"]}
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
      <Button variant="tertiary" onClick={handleSearch}>
        <Search />
      </Button>
    </div>
  );
};
