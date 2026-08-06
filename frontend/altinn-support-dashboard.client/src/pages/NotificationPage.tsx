import { Alert, Heading, Skeleton, Textfield, ToggleGroup } from "@digdir/designsystemet-react";
import { useEffect, useMemo, useState } from "react";
import NotificationSearchBar from "../components/Notification/NotificationSearchBar";
import { useNotifications, useNotificationsAdvanced } from "../hooks/hooks";
import NotificationCard from "../components/Notification/NotificationCard";
import style from "./styles/NotificationPage.module.css";
import { showPopup } from "../components/Popup";
import { useAppStore } from "../stores/Appstore";
import NotificationShipmentCard from "../components/Notification/NIN-search/NotificationShipmentCard";
import NotificationFilterDropdown from "../components/Notification/NotificationFilterDropdown";

type SearchType = "shipmentId" | "advanced";

function usePersistedArray(key: string) {
  const [value, setValue] = useState<string[]>(() => {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

const toggleValue = (
  setter: React.Dispatch<React.SetStateAction<string[]>>,
  value: string,
) => {
  setter((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );
}

export const NotificationPage = () => {
  const environment = useAppStore((state) => state.environment);
  const [searchType, setSearchType] = useState<SearchType>(
    () =>
      (sessionStorage.getItem("notif_searchType") as SearchType) || "shipmentId"
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
  
  const [selectedCreators, setSelectedCreators] = usePersistedArray("notif_selectedCreators");
  const  [selectedChannels, setSelectedChannels] = usePersistedArray("notif_selectedChannels");
  const [selectedResults, setSelectedResults] = usePersistedArray("notif_selectedResults");
  const [selectedResources, setSelectedResources] = usePersistedArray("notif_selectedResources");
  const [sendersReferenceFilter, setSendersReferenceFilter] = useState(
    () => sessionStorage.getItem("notif_sendersReferenceFilter") || ""
  );

  useEffect(() => { sessionStorage.setItem("notif_searchType", searchType); }, [searchType]);
  useEffect(() => { sessionStorage.setItem("notif_searchValue", searchValue); }, [searchValue]);
  useEffect(() => { sessionStorage.setItem("notif_dateFrom", dateFrom); }, [dateFrom]);
  useEffect(() => { sessionStorage.setItem("notif_dateTo", dateTo); }, [dateTo]);
  useEffect(() => {
    sessionStorage.setItem("notif_sendersReferenceFilter", sendersReferenceFilter); 
  }, [sendersReferenceFilter]);


  const orderQuery = useNotifications(
    searchType === "shipmentId" ? searchValue : "",
    environment
  );
  const ninQuery = useNotificationsAdvanced(
    searchType === "advanced" ? searchValue : "",
    environment,
    dateFrom || undefined,
    dateTo || undefined
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

  const channelNames = useMemo(() => {
    const values = new Set<string>();
    ninQuery.data?.forEach((shipment) => { if (shipment.notificationChannel) values.add(shipment.notificationChannel); });
    return Array.from(values).sort();
  }, [ninQuery.data]);

  const ResultNames = useMemo(() => {
    const values = new Set<string>();
    ninQuery.data?.forEach((shipment) =>
      shipment.deliveryAttempts.forEach((attempt) => { if (attempt.result) values.add(attempt.result); })
    );
    return Array.from(values).sort();
  }, [ninQuery.data]);

  const resourceIds = useMemo(() => {
    const values = new Set<string>();
    ninQuery.data?.forEach((shipment) => { if (shipment.resourceId) values.add(shipment.resourceId); });
    return Array.from(values).sort();
  }, [ninQuery.data]);

  useEffect(() => {
    if (!ninQuery.data) return;
    setSelectedCreators((prev) => prev.filter((value) => creatorNames.includes(value)));
    setSelectedChannels((prev) => prev.filter((value) => channelNames.includes(value)));
    setSelectedResults((prev) => prev.filter((value) => ResultNames.includes(value)));
    setSelectedResources((prev) => prev.filter((value) => resourceIds.includes(value)));
  }, [ninQuery.data, creatorNames, channelNames, ResultNames, resourceIds]);

  const filteredShipments = useMemo(() => {
    if (!ninQuery.data) return ninQuery.data;
    const reference = sendersReferenceFilter.trim().toLowerCase();
    return ninQuery.data.filter((shipment) => {
      if (selectedCreators.length > 0 && !(shipment.creatorName && selectedCreators.includes(shipment.creatorName))) return false;
      if (selectedChannels.length > 0 && !(shipment.notificationChannel && selectedChannels.includes(shipment.notificationChannel))) return false;
      if (selectedResults.length > 0 && !shipment.deliveryAttempts.some((attempt) => attempt.result && selectedResults.includes(attempt.result))) return false;
      if (selectedResources.length > 0 && !(shipment.resourceId && selectedResources.includes(shipment.resourceId))) return false;
      if (reference && !(shipment.sendersReference && shipment.sendersReference.toLowerCase().includes(reference))) return false;
      return true;
    })
  }, [ninQuery.data, selectedCreators, selectedChannels, selectedResults, selectedResources, sendersReferenceFilter]);

  const hasActiveFilters = 
    selectedCreators.length > 0 || 
    selectedChannels.length > 0 || 
    selectedResults.length > 0 ||
    selectedResources.length > 0 ||
    sendersReferenceFilter.trim().length > 0;

  return (
    <div className={style.container}>
      <Heading level={1} data-size="sm" className={style.heading}>
        Søk etter varsling
      </Heading>

      <ToggleGroup
        value={searchType}
        data-toggle-group="Søketype"
        onChange={(val) => {
          setSearchType(val as SearchType);
          setSearchValue("");
          setDateFrom("");
          setDateTo("");
        }}
        data-size="sm"
      >
        <ToggleGroup.Item value="shipmentId">Shipment-Id</ToggleGroup.Item>
        <ToggleGroup.Item value="advanced">Avansert søk</ToggleGroup.Item>
      </ToggleGroup>

      <NotificationSearchBar
        key={searchType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchType={searchType}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      {searchType === "advanced" && creatorNames.length > 0 && (
        <div className={style.filterRow}>
          <NotificationFilterDropdown
            label="Creator"
            options={creatorNames}
            selected={selectedCreators}
            onToggle={(value) => toggleValue(setSelectedCreators, value )}
          />
          <NotificationFilterDropdown
            label="Channel"
            options={channelNames}
            selected={selectedChannels}
            onToggle={(value) => toggleValue(setSelectedChannels, value )}
          />
          <NotificationFilterDropdown
            label="Result"
            options={ResultNames}
            selected={selectedResults}
            onToggle={(value) => toggleValue(setSelectedResults, value )}
          /> 
          <NotificationFilterDropdown
            label="Resource"
            options={resourceIds}
            selected={selectedResources}
            onToggle={(value) => toggleValue(setSelectedResources, value )}
          />
          <Textfield
            label="Sender's reference"
            value={sendersReferenceFilter}
            onChange={(e) => setSendersReferenceFilter(e.target.value)}
            className={style.sendersReferenceFilter}
          />
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

      {!ninQuery.isFetching && !ninQuery.isError && searchType === "advanced" && ninQuery.data && filteredShipments?.length === 0 && (
        <Alert data-color="info">
          {ninQuery.data.length === 0
            ? "No shipments found."
            : "No shipments found for the selected filter(s)."
          }
        </Alert>
      )}

      {/* Filters out the notifications with 0 (shows only email if sms was 0 f.ex.) */}
      {/* Different result view based on what type of search it is */}
      {searchType === "shipmentId" &&
        orderQuery.data
          ?.filter((o) => o.notifications.length > 0)
          .map((order, i) => <NotificationCard key={i} order={order} />)}

      {searchType === "advanced" &&
        filteredShipments?.map((shipment, i) => (
          <NotificationShipmentCard key={i} shipment={shipment} />
        ))}
    </div>
  );
};
