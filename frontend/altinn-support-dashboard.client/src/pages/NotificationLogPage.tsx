import { useEffect, useState } from "react";
import { useAppStore } from "../stores/Appstore"
import { useNotificationLog } from "../hooks/hooks";
import { showPopup } from "../components/Popup";
import { Alert, Button, Heading, Textfield } from "@digdir/designsystemet-react";
import NotificationLogList from "../components/Notification/NotificationLogList";
import style from "./styles/NotificationLogPage.module.css";



export const NotificationLogPage = () => {
    const environment = useAppStore((state) => state.environment);

    const [dialogId, setDialogId] = useState(
        () => sessionStorage.getItem("notif_log_dialogId") || ""
    );
    
    const [transmissionId, setTransmissionId] = useState(
        () => sessionStorage.getItem("notif_log_transmissionId") || ""
    );

    const [submittedDialogId, setSubmittedDialogId] = useState(
        () => sessionStorage.getItem("notif_log_dialogId") || ""
    );
    const [submittedTransmissionId, setSubmittedTransmissionId] = useState(
        () => sessionStorage.getItem("notif_log_transmissionId") || ""
    );

    useEffect(() => { sessionStorage.setItem("notif_log_dialogId", dialogId); }, [dialogId]);
    useEffect(() => { sessionStorage.setItem("notif_log_transmissionId", transmissionId); }, [transmissionId]);

    const logQuery = useNotificationLog(submittedDialogId, submittedTransmissionId, environment);

    useEffect(() => {
        if (logQuery.isError) {
            showPopup(logQuery.error.message, "error");
        }
    }, [logQuery.isError, logQuery.error]);

    const handleSubmit = () => {
        setSubmittedDialogId(dialogId);
        setSubmittedTransmissionId(transmissionId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && (dialogId || transmissionId)) {
            handleSubmit()
        }
    };

    return (
        <div>
            <Heading level={1} data-size="sm">
                Varslingslogg
            </Heading>
            <div className={style.searchRow}>
                <Textfield
                    label="Dialog-ID"
                    value={dialogId}
                    onChange={(e) => setDialogId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={style.searchField}
                />
                <Textfield
                    label="Transmission-ID"
                    value={transmissionId}
                    onChange={(e) => setTransmissionId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={style.searchField}
                /> 
                <Button onClick={handleSubmit} disabled={!dialogId && !transmissionId} className={style.searchButton}>
                    Søk
                </Button>   
            </div>

            {!logQuery.isFetching && !logQuery.isError && logQuery.data?.length === 0 && (
                <Alert data-color="info">No log entries found</Alert>
            )}

            {logQuery.data && logQuery.data.length > 0 && (
                <NotificationLogList entries={logQuery.data} />
            )}
        </div>
    )
}