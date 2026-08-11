import { useEffect, useState } from "react";
import { useAppStore } from "../stores/Appstore"



export const NotificationLogPage = () => {
    const environment = useAppStore((state) => state.environment);

    const [dialogId, setDialogId] = useState(
        () => sessionStorage.getItem("notif_log_dialogId") || ""
    );
    
    const [transmissionIs, setTransmissionId] = useState(
        () => sessionStorage.getItem("notif_log_transmissionId") || ""
    );

    const [submittedDialogId, setSubmittedDialogId] = useState("");
    const [submittedTransmissionId, setSubmittedTransmissionId] = useState("");

    useEffect(() => { sessionStorage})
}