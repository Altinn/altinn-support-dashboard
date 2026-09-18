import { Button, Heading, Search, Spinner, Textfield } from "@digdir/designsystemet-react"
import { TrashIcon } from "@navikt/aksel-icons";
import { Button, Heading, Spinner, Textfield } from "@digdir/designsystemet-react"
import { MagnifyingGlassIcon } from "@navikt/aksel-icons"
import styles from "./styles/DialogDetailsLookupPage.module.css";
import { useEffect, useMemo,  useState } from "react";
import { useAppStore } from "../stores/Appstore";
import { useDialogDetails} from "../hooks/hooks";
import { showPopup } from "../components/Popup";
import HighlightedFields from "../components/DialogDetails/HighlightedFields";
import JsonPanel from "../components/DialogDetails/JsonPanel";
import DialogDeletePopup, {
    DialogDeleteOutcome,
} from "../components/DialogDetails/DialogDeletePopup";
import DialogDeleteResult from "../components/DialogDetails/DialogDeleteResult";


export const DialogDetailsLookupPage = () => {
    const environment = useAppStore((state) => state.environment);
    const [input, setInput] = useState(
        () => sessionStorage.getItem("dialogDeatilsLookup.input") || ""
    );
    const [submittedId, setSubmittedId] = useState(
        () => sessionStorage.getItem("dialogDetailsLookup.submittedId") || ""
    );
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [deleteOutcome, setDeleteOutcome] = useState<DialogDeleteOutcome | null>(null);
    const { data: response, isLoading, isError, error } = useDialogDetails(submittedId, environment);

    const revision = typeof response?.revision === "string" ? response.revision : undefined;

    useEffect(() => {
        if (isError) showPopup((error as Error)?.message, "error")
    }, [isError, error]);

    const jsonText = useMemo(() => JSON.stringify(response ?? {}, null, 2), [response]);

    const handleInputChange = (value: string) => {
        setInput(value);
        sessionStorage.setItem("dialogDeatilsLookup.input", value);
    };

    const handleSearch = () => {
        const trimmed = input.trim();
        if (trimmed) {
            setSubmittedId(trimmed);
            sessionStorage.setItem("dialogDetailsLookup.submittedId", trimmed);
            setDeleteOutcome(null);
        }
    };

    const HIGHLIGHTED_FIELDS: {label: string, value: unknown}[] = response
        ? [
                { label: "ID", value: response.id },
                { label: "Org", value: response.org },
                { label: "Service resource", value: response.serviceResource },
                { label: "Created at", value: response.createdAt },
                { label: "Updated at", value: response.updatedAt },
                { label: "Content updated at", value: response.contentUpdatedAt },
                { label: "Deleted at", value: response.deletedAt },
                { label: "End user context", value: response.endUserContext },
                { label: "Seen since last content update", value: response.seenSinceLastContentUpdate },
                { label: "Service owner context", value: response.serviceOwnerContext },
                { label: "Service owner labels", value: (response.serviceOwnerContext as { serviceOwnerLabels?: unknown })?.serviceOwnerLabels },
                { label: "Activity log", value: response.activities },
            ]
        : [];

        if (deleteOutcome) {
            return (
                <div>
                    <Heading>Dialog detaljer</Heading>
                    <DialogDeleteResult
                        outcome={deleteOutcome}
                        onBack={() => setDeleteOutcome(null)}
                    />
                </div>
            );
        }

        return (
            <div>
                <Heading>Dialog detaljer</Heading>

                <div className={styles.searchRow}>
                    <Textfield
                        label="Dialog-ID"
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className={styles.searchInput}
                    />
                    <Button
                        onClick={handleSearch}
                        variant="secondary"
                        className={styles.searchButton}
                    >
                        <MagnifyingGlassIcon />
                    </Button>
                    {response && (
                        <Button
                            onClick={() => setIsDeletePopupOpen(true)}
                            variant="secondary"
                            data-color="danger"
                        >
                            <TrashIcon aria-hidden />
                            Slett dialog
                        </Button>
                    )}
                </div>

                {isLoading && <Spinner aria-label="Laster" />}

                 {response && (
                    <div className={styles.resultLayout}>
                        <HighlightedFields fields={HIGHLIGHTED_FIELDS} />
                        <JsonPanel jsonText={jsonText} />
                    </div>
                )}

                {response && isDeletePopupOpen && (
                    <DialogDeletePopup
                        onClose={() => setIsDeletePopupOpen(false)}
                        dialogId={response.id}
                        revision={revision}
                        environment={environment}
                        onDeleted={setDeleteOutcome}
                    />
                )}
            </div>
        )

};