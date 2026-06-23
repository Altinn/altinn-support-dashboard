import { useState } from "react";
import { Button, Search, Textfield } from "@digdir/designsystemet-react";
import style from "./styles/NotificationSearchBar.module.css";

type NotificationSearchBarProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchType: "orderId" | "nin";
};

const NotificationSearchBar: React.FC<NotificationSearchBarProps> = ({
  searchValue,
  setSearchValue,
  searchType
}) => {
  const [inputValue, setInputValue] = useState(searchValue ?? "");

  const handleSearch = () => {
    setSearchValue(inputValue);
  };

  return (
    <div className={style.container}>
      <Textfield
        label={searchType === "orderId" ? "Ordre-ID" : "NIN"}
        placeholder={searchType === "orderId" ? "Skriv inn ordre-ID" : "Skriv inn NIN"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className={style.textfield}
      />
      <Button
        onClick={handleSearch}
        variant="secondary"
        className={style.searchButton}
      >
        <Search />
      </Button>
      <Button
        onClick={() => {
          setInputValue("");
          setSearchValue("");
        }}
        className={style.removeButton}
      >
        x
      </Button>
    </div>
  );
};

export default NotificationSearchBar;
