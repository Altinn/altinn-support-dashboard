import { Heading, ToggleGroup } from "@digdir/designsystemet-react";
import { useEffect, useState } from "react";
import NotificationSearchBar from "../components/Notification/NotificationSearchBar";
import { useNotifications } from "../hooks/hooks";
import NotificationCard from "../components/Notification/NotificationCard";
import style from "./styles/NotificationPage.module.css";
import { showPopup } from "../components/Popup";
import NotificationShipmentCard from "../components/Notification/NIN search/NotificationShipmentCard";

type SearchType = "orderId" | "nin";

export const NotificationPage = () => {
  const [searchType, setSearchType] = useState<SearchType>("orderId");
  const [searchValue, setSearchValue] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const orderQuery = useNotifications(searchType === "orderId" ? searchValue : "");
  const ninQuery = "";

  const activeQuery = searchType === "orderId" ? orderQuery : null;

  useEffect(() => {
    if (activeQuery?.isError) {
      showPopup(activeQuery.error.message, "error");
    }
  }, [activeQuery]);

  return (
    <div className={style.container}>
      <Heading level={1} data-size="sm" className={style.heading}>
        Søk etter varsling
      </Heading>

      <ToggleGroup
        value={searchType}
        onChange={(val) => { 
          setSearchType(val as SearchType); setSearchValue(""); 
          setSearchValue("")
          setDateFrom("")
          setDateTo("")
        }}
        data-size="sm"
      >
        <ToggleGroup.Item value="orderId">Order-Id</ToggleGroup.Item>
        <ToggleGroup.Item value="nin">NIN</ToggleGroup.Item>
      </ToggleGroup>

      <NotificationSearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchType={searchType}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      {/* Filters out the notifications with 0 (shows only email if sms was 0 f.ex.) */}
      {/* Different result view based on what type of search it is */}
      {searchType === "orderId" && 
        orderQuery.data
          ?.filter((o) => o.notifications.length > 0)
          .map((order, i) => <NotificationCard key={i} order={order}/>)}

      {searchType === "nin" &&
        ninQuery.data?.map((shipment, i) => (
          <NotificationShipmentCard key={i} shipment={shipment}/> 
        ))}
    </div>
  );
};
