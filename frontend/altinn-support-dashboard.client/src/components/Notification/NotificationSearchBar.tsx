import { useState } from "react";
import { Button, Search, Textfield } from "@digdir/designsystemet-react";
import style from "./styles/NotificationSearchBar.module.css";

type NotificationSearchBarProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchType: "shipmentId" | "advanced";
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
  setDateTo,
}) => {
  const [inputValue, setInputValue] = useState(searchValue ?? "");
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom ?? "");
  const [localDateTo, setLocalDateTo] = useState(dateTo ?? "");

  const handleClear = () => {
    setInputValue("");
    setLocalDateFrom("");
    setLocalDateTo("");
    setSearchValue("");
    setDateFrom?.("");
    setDateTo?.("");
  };

  const handleSearch = () => {
    setSearchValue(inputValue);
    setDateFrom?.(localDateFrom);
    setDateTo?.(localDateTo);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={style.container}>
      <div className={style.row}>
        <Textfield
          label={searchType === "shipmentId" ? "Shipment-ID" : "Avansert søk"}
          placeholder={
            searchType === "shipmentId"
              ? "Shipment-ID"
              : "Nin, orgnr, partyid, partyuuid"
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={style.textfield}
        />
        <Button
          onClick={handleSearch}
          variant="secondary"
          className={style.searchButton}
        >
          <Search />
        </Button>
        <Button onClick={handleClear} className={style.removeButton}>
          x
        </Button>
      </div>

      {searchType === "advanced" && (
        <div>
          <div className={style.row}>
            <Textfield
              label="From date"
              type="date"
              description="Defaults to past 7 days if empty"
              max={localDateTo || today}
              value={localDateFrom}
              onChange={(e) => setLocalDateFrom(e.target.value)}
              onKeyDown={handleKeyDown}
              className={style.dateFieldFrom}
            />
            <Textfield
              label="To date"
              type="date"
              description={" "}
              max={today}
              min={localDateFrom}
              value={localDateTo}
              onChange={(e) => setLocalDateTo(e.target.value)}
              onKeyDown={handleKeyDown}
              className={style.dateFieldTo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSearchBar;
