import { useEffect, useState } from "react";
import { Textfield, Button, Search, } from "@digdir/designsystemet-react";
import styles from "./styles/TopSearchBarTextfield.module.css";

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
    <div className={styles["TopSearchBarTextField"]}>
      <Textfield
        className={styles["TopSearchBarTextField-input"]}
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
        onClick={handleSearch}
        variant="tertiary"
        className={styles["TopSearchBarTextField-button"]}>
        <Search />
      </Button>
    </div>
  );
};
