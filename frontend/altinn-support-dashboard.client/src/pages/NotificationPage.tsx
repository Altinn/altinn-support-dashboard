import { Alert, Heading, Skeleton, Textfield, ToggleGroup } from "@digdir/designsystemet-react";
import { useEffect, useState } from "react";
import NotificationSearchBar from "../components/Notification/NotificationSearchBar";
import { useNotifications, useNotificationsByNin } from "../hooks/hooks";
import NotificationCard from "../components/Notification/NotificationCard";
import style from "./styles/NotificationPage.module.css";
import { showPopup } from "../components/Popup";
import { useAppStore } from "../stores/Appstore";
import NotificationShipmentCard from "../components/Notification/NIN-search/NotificationShipmentCard";

type SearchType = "shipmentId" | "future";

export const NotificationPage = () => {
  const environment = useAppStore((state) => state.environment);
  const [searchType, setSearchType] = useState<SearchType>(
    () => (sessionStorage.getItem("notif_searchType") as SearchType) || "shipmentId"
  );
  const [searchValue, setSearchValue] = useState(
    () => sessionStorage.getItem("notif_searchValue") || ""
  );
  const [dateFrom, setDateFrom] = useState(
    () => sessionStorage.getItem("notif_dateFrom") || ""
  );
  const [dateTo, setDateTo] = useState(
    () => sessionStorage.getItem("notif_dateTo") || ""
  );
  const [creatorFilter, setCreatorFilter] = useState(
    () => sessionStorage.getItem("notif_creatorFilter") || ""
  );

  useEffect(() => { sessionStorage.setItem("notif_searchType", searchType); }, [searchType]);
  useEffect(() => { sessionStorage.setItem("notif_searchValue", searchValue); }, [searchValue]);
  useEffect(() => { sessionStorage.setItem("notif_dateFrom", dateFrom); }, [dateFrom]);
  useEffect(() => { sessionStorage.setItem("notif_dateTo", dateTo); }, [dateTo]);
  useEffect(() => { sessionStorage.setItem("notif_creatorFilter", creatorFilter); }, [creatorFilter]);

  const orderQuery = useNotifications(
    searchType === "shipmentId" ? searchValue : "",
    environment
  );
  const ninQuery = useNotificationsByNin(
    searchType === "future" ? searchValue : "",
    environment,
    dateFrom || undefined,
    dateTo || undefined,
  );

  const activeQuery = searchType === "shipmentId" ? orderQuery : ninQuery;

  useEffect(() => {
    if (activeQuery?.isError) {
      showPopup(activeQuery.error.message, "error");
    }
  }, [activeQuery]);

  return (
    <div className={style.container}>
      <Heading level={1} data-size="sm" className={style.heading}>
        Notification search
      </Heading>

      <ToggleGroup
        value={searchType}
        data-toggle-group="Søketype"
        onChange={(val) => { 
          setSearchType(val as SearchType);
          setSearchValue("")
          setDateFrom("")
          setDateTo("")
          setCreatorFilter("")
        }}
        data-size="sm"
      >
        <ToggleGroup.Item value="shipmentId">Shipment-Id</ToggleGroup.Item>
        <ToggleGroup.Item value="future">Future</ToggleGroup.Item>
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

      {searchType === "future" && (
        <Textfield 
          label="Creator name filter"
          value={creatorFilter}
          onChange={(e) => setCreatorFilter(e.target.value)}
          data-size="sm"
          className={style.creatorFilter}
        />
      )}

      {activeQuery.isFetching && (
        <>
          <Skeleton variant="rectangle" height="6rem" />
          <Skeleton variant="rectangle" height="6rem" />
          <Skeleton variant="rectangle" height="6rem" />
        </>
      )}

      {!activeQuery.isFetching && !activeQuery.isError && activeQuery.data !== undefined && activeQuery.data?.length === 0 && (
        <Alert data-color="info">Ingen resultater funnet.</Alert>
      )}


      {/* Filters out the notifications with 0 (shows only email if sms was 0 f.ex.) */}
      {/* Different result view based on what type of search it is */}
      {searchType === "shipmentId" && 
        orderQuery.data
          ?.filter((o) => o.notifications.length > 0)
          .map((order, i) => <NotificationCard key={i} order={order}/>)}

      {searchType === "future" &&
        ninQuery.data
          ?.filter((shipment) =>{
            /*If the creatorname is empty, it will still show with an empty filter*/
            const term = creatorFilter.trim().toLowerCase();
            if (!term) return true;
            return shipment.creatorName?.toLowerCase().includes(term)
          })
        .map((shipment, i) => (
          <NotificationShipmentCard key={i} shipment={shipment}/> 
        ))}
    </div>
  );
};
