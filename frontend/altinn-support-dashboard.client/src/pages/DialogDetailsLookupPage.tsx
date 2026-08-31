import { Card, Heading, Spinner, Textfield } from "@digdir/designsystemet-react"
import styles from "./styles/DialogDetailsLookupPage.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "../stores/Appstore";
import { useDialogDetails } from "../hooks/hooks";
import { showPopup } from "../components/Popup";


type SearchMode = "highlight" | "filter";


export const DialogDetailsLookupPage = () => {
    const environment = useAppStore((state) => state.environment);
    const [input, setInput] = useState("");
    const [submittedId, setSubmittedId] = useState("");

    const { data: response, isLoading, isError, error } = useDialogDetails(submittedId, environment);

    useEffect(() => {
        if (isError) showPopup((error as Error)?.message, "error")
    }, [isError, error]);

    const jsonText = useMemo(() => JSON.stringify(response ?? {}, null, 2), [response]);
    const lines = useMemo(() => jsonText.split("\n"), [jsonText]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentMatch, setCurrentMatch] = useState(0);
    const matchRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const handleSearch = () => {
        if (input.trim()) setSubmittedId(input.trim());
    }

    const HIGHLIGHTED_FIELDS: {label: string, value: unknown}[] = response
        ? [
                {label: "ID", value: response.id},
                {label: "Deleted at", value: response.deletedAt}
            ]
        : [];
    
        const totalMatches = useMemo(() => {
            if (!searchTerm) return 0;
            const term = searchTerm.toLowerCase();
            const lower = jsonText.toLowerCase();
            let count = 0;
            let idx = lower.indexOf(term);
            while (idx !== -1) {
                count ++;
                idx = lower.indexOf(term, idx + term.length);
            }
            return count;
        }, [jsonText, searchTerm]);

        matchRefs.current = [];

        const renderLine = (line: string, lineIndex: number) => {
            if (!searchTerm)  {
                return <span>{line}</span>
            }

            const term = searchTerm.toLowerCase();
            const lower = line.toLowerCase();
            const parts: React.ReactNode[] = [];
            let cursor = 0;
            let idx = lower.indexOf(term);

            while (idx !== -1) {
                parts.push(line.slice(cursor, idx));
                const matchIndex = matchRefs.current.length;
                matchRefs.current.push(null);
                parts.push(
                    <span
                        key={`${lineIndex}-${idx}`}
                        ref={(el) => { matchRefs.current[matchIndex] = el; }}
                        className={matchIndex === currentMatch ? styles.matchActive : styles.match}
                    >
                        {line.slice(idx, idx + term.length)}
                    </span>
                );
                cursor = idx + term.length;
                idx = lower.indexOf(term, cursor);
            }
            parts.push(line.slice(cursor));
            return <span>{parts}</span>
        }

        const goToMatch = (direction: 1 | -1) => {
            if  (totalMatches === 0) return true;
            const next = (currentMatch + direction + totalMatches) % totalMatches;
            setCurrentMatch(next);
            matchRefs.current[next]?.scrollIntoView({ block: "center", behavior: "smooth"});
        };

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
                                        setCurrentMatch(0);
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