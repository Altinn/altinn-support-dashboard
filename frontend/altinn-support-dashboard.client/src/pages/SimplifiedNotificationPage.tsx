import { useEffect, useState } from "react";
import { useAppStore } from "../stores/Appstore"
import { useNotificationsAdvanced } from "../hooks/hooks";
import { showPopup } from "../components/Popup";
import { Alert, Heading, Skeleton } from "@digdir/designsystemet-react";
import NotificationSearchBar from "../components/Notification/NotificationSearchBar";
import NotificationShipmentCard from "../components/Notification/NIN-search/NotificationShipmentCard";
import styles from "./styles/NotificationPage.module.css"



export const SimplifiedNotificationPage = () => {
    const environment = useAppStore((state) => state.environment);
    const [searchValue, setSearchValue] = useState(
        () => sessionStorage.getItem("simplifiedNotif_searchValue") || ""
    );
    const [dateFrom, setDateFrom] = useState(
        () => sessionStorage.getItem("simplifiedNotif_dateFrom") || ""
    );
    const [dateTo, setDateTo] = useState(
        () => sessionStorage.getItem("simplifiedNotif_dateTo") || ""
    );

    useEffect(() => {
        sessionStorage.setItem("simplifiedNotif_dateFrom", dateFrom)
    }, [dateFrom]);
    useEffect(() => {
        sessionStorage.setItem("simplifiedNotif_dateTo", dateTo)
    }, [dateTo]);

    useEffect(() => {
        sessionStorage.setItem("simplifiedNotif_searchValue", searchValue)
    }, [searchValue]);

    const { data, isFetching, isError, error } = useNotificationsAdvanced(
        searchValue,
        environment,
        dateFrom || undefined,
        dateTo || undefined
    );

    useEffect(() => {
        if (isError) showPopup(error.message, "error");
    }, [isError, error]);

    return (
        <div className = {styles.container}>
            <Heading level={1} data-size="sm" className={styles.heading}>
                Søk etter varsling
            </Heading>

            <NotificationSearchBar 
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                searchType="simple"
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
            />

            {isFetching && (
                <>
                    <Skeleton variant="rectangle" height="6rem" />
                    <Skeleton variant="rectangle" height="6rem" />
                    <Skeleton variant="rectangle" height="6rem" />
                </>
            )}

            {!isFetching && !isError && data?.length === 0 && (
                <Alert data-color="info">Fant ingen varslinger</Alert>
            )}

            {data?.map((shipment,  i) => (
                <NotificationShipmentCard 
                    key={i}
                    shipment={shipment}
                    selectedResults={[]}
                    selectedChannels={[]}
                    compact
                />
            ))}
        </div>
    );
};

export default SimplifiedNotificationPage;