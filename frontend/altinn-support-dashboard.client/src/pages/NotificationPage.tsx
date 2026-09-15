import {
  Alert,
  Heading,
  Skeleton,
  ToggleGroup,
} from "@digdir/designsystemet-react";
import { useEffect, useMemo, useState } from "react";
import NotificationSearchBar from "../components/Notification/NotificationSearchBar";
import { useNotifications, useNotificationsAdvanced } from "../hooks/hooks";
import NotificationCard from "../components/Notification/NotificationCard";
import style from "./styles/NotificationPage.module.css";
import { showPopup } from "../components/Popup";
import { useAppStore } from "../stores/Appstore";
import NotificationShipmentCard from "../components/Notification/NIN-search/NotificationShipmentCard";
import NotificationFilterDropdown from "../components/Notification/NotificationFilterDropdown";
import usePersistedArray from "../hooks/usePersistedArray";
import { collectUnique } from "../utils/utils";

type SearchType = "shipmentId" | "advanced";

const toggleValue = (
  setter: React.Dispatch<React.SetStateAction<string[]>>,
  value: string
) => {
  setter((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );
};

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

  const [selectedCreators, setSelectedCreators] = usePersistedArray(
    "notif_selectedCreators"
  );
  const [selectedChannels, setSelectedChannels] = usePersistedArray(
    "notif_selectedChannels"
  );
  const [selectedResults, setSelectedResults] = usePersistedArray(
    "notif_selectedResults"
  );
  const [selectedResources, setSelectedResources] = usePersistedArray(
    "notif_selectedResources"
  );

  useEffect(() => {
    sessionStorage.setItem("notif_searchType", searchType);
  }, [searchType]);
  useEffect(() => {
    sessionStorage.setItem("notif_searchValue", searchValue);
  }, [searchValue]);
  useEffect(() => {
    sessionStorage.setItem("notif_dateFrom", dateFrom);
  }, [dateFrom]);
  useEffect(() => {
    sessionStorage.setItem("notif_dateTo", dateTo);
  }, [dateTo]);

  const orderQuery = useNotifications(
    searchType === "shipmentId" ? searchValue : "",
    environment
  );
  const advancedQuery = useNotificationsAdvanced(
    searchType === "advanced" ? searchValue : "",
    environment,
    dateFrom || undefined,
    dateTo || undefined
  );

  const activeQuery = searchType === "shipmentId" ? orderQuery : advancedQuery;

  useEffect(() => {
    if (activeQuery?.isError) {
      showPopup(activeQuery.error.message, "error");
    }
  }, [activeQuery]);

  const [creatorNames, channelNames, resultNames, resourceIds] = useMemo(
    () =>
      collectUnique(
        advancedQuery.data,
        (shipment) => shipment.creatorName,
        (shipment) =>
          shipment.deliveryAttempts.map((attempt) => attempt.channel),
        (shipment) =>
          shipment.deliveryAttempts.map((attempt) => attempt.result),
        (shipment) => shipment.resourceId
      ),
    [advancedQuery.data]
  );

  useEffect(() => {
    if (!advancedQuery.data) return;
    setSelectedCreators((prev) =>
      prev.filter((value) => creatorNames.includes(value))
    );
    setSelectedChannels((prev) =>
      prev.filter((value) => channelNames.includes(value))
    );
    setSelectedResults((prev) =>
      prev.filter((value) => resultNames.includes(value))
    );
    setSelectedResources((prev) =>
      prev.filter((value) => resourceIds.includes(value))
    );
  }, [
    advancedQuery.data,
    creatorNames,
    channelNames,
    resultNames,
    resourceIds,
    setSelectedCreators,
    setSelectedChannels,
    setSelectedResults,
    setSelectedResources,
  ]);

  const filteredShipments = useMemo(() => {
    if (!advancedQuery.data) return advancedQuery.data;
    return advancedQuery.data.filter((shipment) => {
      if (
        selectedCreators.length > 0 &&
        !(
          shipment.creatorName &&
          selectedCreators.includes(shipment.creatorName)
        )
      )
        return false;
      if (
        (selectedChannels.length > 0 || selectedResults.length > 0) &&
        !shipment.deliveryAttempts.some(
          (attempt) =>
            (selectedChannels.length === 0 ||
              (attempt.channel &&
                selectedChannels.includes(attempt.channel))) &&
            (selectedResults.length === 0 ||
              (attempt.result && selectedResults.includes(attempt.result)))
        )
      )
        return false;
      if (
        selectedResults.length > 0 &&
        !shipment.deliveryAttempts.some(
          (attempt) =>
            attempt.result && selectedResults.includes(attempt.result)
        )
      )
        return false;
      if (
        selectedResources.length > 0 &&
        !(
          shipment.resourceId && selectedResources.includes(shipment.resourceId)
        )
      )
        return false;
      return true;
    });
  }, [
    advancedQuery.data,
    selectedCreators,
    selectedChannels,
    selectedResults,
    selectedResources,
  ]);

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
            onToggle={(value) => toggleValue(setSelectedCreators, value)}
          />
          <NotificationFilterDropdown
            label="Channel"
            options={channelNames}
            selected={selectedChannels}
            onToggle={(value) => toggleValue(setSelectedChannels, value)}
          />
          <NotificationFilterDropdown
            label="Result"
            options={resultNames}
            selected={selectedResults}
            onToggle={(value) => toggleValue(setSelectedResults, value)}
          />
          <NotificationFilterDropdown
            label="Resource"
            options={resourceIds}
            selected={selectedResources}
            onToggle={(value) => toggleValue(setSelectedResources, value)}
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

      {!orderQuery.isFetching &&
        !orderQuery.isError &&
        searchType === "shipmentId" &&
        orderQuery.data?.length === 0 && (
          <Alert data-color="info">No shipments found.</Alert>
        )}

      {!advancedQuery.isFetching &&
        !advancedQuery.isError &&
        searchType === "advanced" &&
        advancedQuery.data &&
        filteredShipments?.length === 0 && (
          <Alert data-color="info">
            {advancedQuery.data.length === 0
              ? "No shipments found."
              : "No shipments found for the selected filter(s)."}
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
          <NotificationShipmentCard
            key={i}
            shipment={shipment}
            selectedResults={selectedResults}
            selectedChannels={selectedChannels}
          />
        ))}
    </div>
  );
};
