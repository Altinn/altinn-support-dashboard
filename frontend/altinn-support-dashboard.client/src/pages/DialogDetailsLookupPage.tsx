import { Button, Card, Heading, Spinner, Textfield } from "@digdir/designsystemet-react"
import styles from "./styles/DialogDetailsLookupPage.module.css";
import { useEffect, useMemo,  useState } from "react";
import { useAppStore } from "../stores/Appstore";
import { useDialogDetails} from "../hooks/hooks";
import { showPopup } from "../components/Popup";
import { useTextHighlightSearch } from "../hooks/useTextHighlightSearch";
import { ClipboardCheckmarkIcon, ClipboardIcon } from "@navikt/aksel-icons";


export const DialogDetailsLookupPage = () => {
    const environment = useAppStore((state) => state.environment);
    const [input, setInput] = useState(
        () => sessionStorage.getItem("dialogDeatilsLookup.input") || ""
    );
    const [submittedId, setSubmittedId] = useState(
        () => sessionStorage.getItem("dialogDetailsLookup.submittedId") || ""
    );
    const [copied, setCopied] = useState(false);

    const { data: response, isLoading, isError, error } = useDialogDetails(submittedId, environment);

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
        }
    };

    const handleCopyJson = async () => {
        await navigator.clipboard.writeText(jsonText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const formatFieldValue = (value: unknown): string => {
        if (value === null || value === undefined || value === "") return "-";
        if (typeof value === "object") return JSON.stringify(value, null, 2);
        return String(value);
    }

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
    
        const {
        lines,
        searchTerm,
        setSearchTerm,
        totalMatches,
        currentMatch,
        renderLine,
        goToMatch,
    } = useTextHighlightSearch(jsonText,  {
        matchClassName: styles.match,
        matchActiveClassName: styles.matchActive,
    });

        return (
            <div>
                <Heading>Dialog detaljer</Heading>

                <div className={styles.searchRow}>
                    <Textfield
                        label="Dialog-ID"
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                {isLoading && <Spinner aria-label="Laster" />}

                 {response && (
                    <div className={styles.resultLayout}>
                        <Card data-color="neutral" className={styles.highlightedFields}>
                            {HIGHLIGHTED_FIELDS.map((field) => (
                                <div key={field.label} className={styles.fieldRow}>
                                    <span className={styles.fieldLabel}>{field.label}</span>
                                    <span className={styles.fieldValue}>{formatFieldValue(field.value)}</span>
                                </div>
                            ))}
                        </Card>
                        <div className={styles.jsonPanel}>
                            <div className={styles.findBar}>
                                <Textfield
                                    label="Søk i JSON"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                    }}
                                />
                                {searchTerm && (
                                    <div className={styles.matchNav}>
                                        <button type="button" onClick={() => goToMatch(-1)}>&uarr;</button>
                                        <span>{totalMatches > 0 ? `${currentMatch + 1} / ${totalMatches}` : "0 / 0"}</span>
                                        <button type="button" onClick={() => goToMatch(1)}>&darr;</button>
                                    </div>
                                )}
                                <Button
                                    variant="tertiary"
                                    data-size="sm"
                                    aria-label=""
                                    onClick={handleCopyJson}
                                >
                                    {copied ? <ClipboardCheckmarkIcon /> : <ClipboardIcon />}
                                </Button>
                            </div>

                            <pre className={styles.jsonOutput}>
                                {lines.map((line, i) => (
                                    <div key={i}>{renderLine(line, i)}</div>
                                ))}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        )

};