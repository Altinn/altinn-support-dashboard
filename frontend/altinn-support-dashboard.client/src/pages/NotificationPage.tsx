import { Alert, Checkbox,  Dropdown, Heading, Skeleton, ToggleGroup } from "@digdir/designsystemet-react";
import { useEffect, useMemo, useState } from "react";
import NotificationSearchBar from "../components/Notification/NotificationSearchBar";
import { useNotifications, useNotificationsByNin } from "../hooks/hooks";
import NotificationCard from "../components/Notification/NotificationCard";
import style from "./styles/NotificationPage.module.css";
import { showPopup } from "../components/Popup";
import { useAppStore } from "../stores/Appstore";
import NotificationShipmentCard from "../components/Notification/NIN-search/NotificationShipmentCard";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";

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
  const [selectedCreators, setSelectedCreators] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("notif_selectedCreators");
    return saved ? JSON.parse(saved) : [];
  })
  const [isCreatorFilterOpen, setIsCreatorFilterOpen] = useState(false);

  useEffect(() => { sessionStorage.setItem("notif_searchType", searchType); }, [searchType]);
  useEffect(() => { sessionStorage.setItem("notif_searchValue", searchValue); }, [searchValue]);
  useEffect(() => { sessionStorage.setItem("notif_dateFrom", dateFrom); }, [dateFrom]);
  useEffect(() => { sessionStorage.setItem("notif_dateTo", dateTo); }, [dateTo]);
  useEffect(() => {
    sessionStorage.setItem("notif_selectedCreators", JSON.stringify(selectedCreators));
  }, [selectedCreators]);

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

  const creatorNames = useMemo(() => {
    const names = new Set<string>();
    ninQuery.data?.forEach((shipment) => { if (shipment.creatorName) names.add(shipment.creatorName); });
    return Array.from(names).sort();
  }, [ninQuery.data]);

  useEffect(() => {
    if (!ninQuery.data) return;
    setSelectedCreators((prev) => prev.filter((creator) => creatorNames.includes(creator)));
  }, [creatorNames, ninQuery.data]);

  const filteredShipments = useMemo(() => {
    if (!ninQuery.data) return ninQuery.data;
    if (selectedCreators.length === 0) return ninQuery.data;
    return ninQuery.data.filter((shipment) => shipment.creatorName ? selectedCreators.includes(shipment.creatorName) : false);
  }, [ninQuery.data, selectedCreators]);

  const toggleCreator = (name: string) => {
    setSelectedCreators((prev) => 
      prev.includes(name) ? prev.filter((creator) => creator !== name) : [...prev, name]
    )
  }

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

      {searchType === "future" && creatorNames.length > 0 && (
        <div className={style.creatorFilter}>
          <Dropdown.TriggerContext>
            <Dropdown.Trigger>
              Filter by creator
              {selectedCreators.length > 0 ? ` (${selectedCreators.length})` : ""}
              {isCreatorFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Dropdown.Trigger>
            <Dropdown 
            data-size="sm"
            onOpen={() => setIsCreatorFilterOpen(true)}
            onClose={() => setIsCreatorFilterOpen(false)}
            >
              <Dropdown.List>
                {creatorNames.map((name) => (
                  <Dropdown.Item key={name}>
                    <Checkbox 
                      label={name}
                      checked={selectedCreators.includes(name)}
                      onChange={() => toggleCreator(name)}
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.List>
            </Dropdown>
          </Dropdown.TriggerContext>
        </div>
      )}

      {activeQuery.isFetching && (
        <>
          <Skeleton variant="rectangle" height="6rem" />
          <Skeleton variant="rectangle" height="6rem" />
          <Skeleton variant="rectangle" height="6rem" />
        </>
      )}


      {!orderQuery.isFetching && !orderQuery.isError && searchType === "shipmentId" && orderQuery.data?.length === 0 && (
        <Alert data-color="info">No shipments found.</Alert>
      )}

      {!ninQuery.isFetching && !ninQuery.isError && searchType === "future" && ninQuery.data && filteredShipments?.length === 0 && (
        <Alert data-color="info">
          {ninQuery.data.length === 0
            ? "No shipments found."
            : "No shipments found for the selected creator(s)."}
        </Alert>
      )}

      {/* Filters out the notifications with 0 (shows only email if sms was 0 f.ex.) */}
      {/* Different result view based on what type of search it is */}
      {searchType === "shipmentId" &&
        orderQuery.data
          ?.filter((o) => o.notifications.length > 0)
          .map((order, i) => <NotificationCard key={i} order={order}/>)
      }

      {searchType === "future" &&
        filteredShipments?.map((shipment, i) => (
          <NotificationShipmentCard key={i} shipment={shipment}/>
        ))}
    </div>
  );
};
