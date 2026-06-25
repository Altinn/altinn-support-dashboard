import { useState } from "react";
import { Button, Search, Textfield } from "@digdir/designsystemet-react";
import style from "./styles/NotificationSearchBar.module.css";

type NotificationSearchBarProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchType: "orderId" | "nin";
  dateFrom?: string;
  setDateFrom?: (v: string) => void;
  dateTo?: string;
  setDateTo?: (v: string) => void;
};

const NotificationSearchBar: React.FC<NotificationSearchBarProps> = ({
  searchValue,
  setSearchValue,
  searchType,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo
}) => {
  const [inputValue, setInputValue] = useState(searchValue ?? "");

  const handleClear = () => {
    setInputValue("");
    setSearchValue("");
    setDateFrom?.("");
    setDateTo?.("");
  };

  const handleSearch = () => {
    setSearchValue(inputValue);
  };

  return (
    <div className={style.container}>
      <Textfield
        label="Shipment ID"
        placeholder="Skriv inn shipment-id"
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
        onClick={handleClear}
        className={style.removeButton}
      >
        x
      </Button>

      {searchType === "nin" && (
        <div className={style.row}>
          <Textfield
            label="Fra dato"
            type="date"
            value={dateFrom ?? ""}
            onChange={(e) => setDateFrom?.(e.target.value)}
            className={style.textfield}
          />
          <Textfield
            label="Til dato"
            type="date"
            value={dateTo ?? ""}
            onChange={(e) => setDateTo?.(e.target.value)}
            className={style.textfield}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationSearchBar;
