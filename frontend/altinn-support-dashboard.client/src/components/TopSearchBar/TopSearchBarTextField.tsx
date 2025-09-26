import { IconButton, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";

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
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Mobilnummer / E-post / Organisasjonsnummer"
      value={textFieldValue}
      onChange={(e) => setTextFieldValue(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {textFieldValue && (
              <IconButton onClick={() => setTextFieldValue("")} edge="end">
                <ClearIcon />
              </IconButton>
            )}
            <IconButton onClick={handleSearch} edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
