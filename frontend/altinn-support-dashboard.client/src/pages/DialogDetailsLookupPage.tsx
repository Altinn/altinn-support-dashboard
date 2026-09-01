import { Card, Heading, Spinner, Textfield } from "@digdir/designsystemet-react"
import styles from "./styles/DialogDetailsLookupPage.module.css";
import { useEffect, useMemo,  useState } from "react";
import { useAppStore } from "../stores/Appstore";
import { useDialogDetails} from "../hooks/hooks";
import { showPopup } from "../components/Popup";
import { useTextHighlightSearch } from "../hooks/useTextHighlightSearch";


export const DialogDetailsLookupPage = () => {
    const environment = useAppStore((state) => state.environment);
    const [input, setInput] = useState("");
    const [submittedId, setSubmittedId] = useState("");

    const { data: response, isLoading, isError, error } = useDialogDetails(submittedId, environment);

    useEffect(() => {
        if (isError) showPopup((error as Error)?.message, "error")
    }, [isError, error]);

    const jsonText = useMemo(() => JSON.stringify(response ?? {}, null, 2), [response]);

    const handleSearch = () => {
        if (input.trim()) setSubmittedId(input.trim());
    }

    const HIGHLIGHTED_FIELDS: {label: string, value: unknown}[] = response
        ? [
                {label: "ID", value: response.id},
                {label: "Deleted at", value: response.deletedAt}
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
                        onChange={(e) => setInput(e.target.value)}
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
                                    <span className={styles.fieldValue}>{String(field.value)}</span>
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