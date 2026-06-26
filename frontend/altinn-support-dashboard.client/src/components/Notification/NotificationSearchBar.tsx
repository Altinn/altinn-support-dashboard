import { useState } from "react";
import { Button, Paragraph, Search, Textfield } from "@digdir/designsystemet-react";
import style from "./styles/NotificationSearchBar.module.css";

type NotificationSearchBarProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchType: "shipmentId" | "future";
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

  const today = new Date().toISOString().split("T")[0];

  return (
  <div className={style.container}>
    <div className={style.row}>
      <Textfield
        label={searchType === "shipmentId" ? "Shipment-ID" : "Future"}
        placeholder={searchType === "shipmentId" ? "Shipment-ID" : "Valid values: NIN"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
        className={style.textfield}
      />
      <Button onClick={handleSearch} variant="secondary" className={style.searchButton}>
        <Search />
      </Button>
      <Button onClick={handleClear} className={style.removeButton}>x</Button>
    </div>

    {searchType === "future" && (
      <div>
        <Paragraph className={style.paragraph}>If no values are present, it will default to the past 7 days</Paragraph>
        <div className={style.row}>
          <Textfield
            label="From date"
            type="date"
            max = {dateTo || today}
            value={dateFrom ?? ""}
            onChange={(e) => setDateFrom?.(e.target.value)}
            className={style.datefield}
          />
          <Textfield
            label="To dato"
            type="date"
            max={today}
            min={dateFrom}
            value={dateTo ?? ""}
            onChange={(e) => setDateTo?.(e.target.value)}
            className={style.datefield}
          />
        </div>
      </div>
    )}
  </div>
);
};

export default NotificationSearchBar;
