import { Card, Heading, Textfield } from "@digdir/designsystemet-react"
import styles from "./styles/DialogDetailsLookupPage.module.css";
import detailsMock from "../models/dialogDetailsMock.json";
import { useMemo, useRef, useState } from "react";


type SearchMode = "highlight" | "filter";

const HIGHLIGHTED_FIELDS: {label: string, value: unknown} [] = [
    {label: "ID", value: detailsMock.id },
    {label: "Deleted at", value: detailsMock.deletedAt}
]


export const DialogDetailsLookupPage = () => {
    const response = detailsMock;
    const jsonText = useMemo(() => JSON.stringify(response, null, 2), [response]);
    const lines = useMemo(() => jsonText.split("\n"), [jsonText]);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchMode, setSearchMode] = useState<SearchMode>("highlight")
    const [currentMatch, setCurrentMatch] = useState(0);
    const matchRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const filteredLines = useMemo(() => {
        if (searchMode !== "filter" || !searchTerm) return lines;
        const term = searchTerm.toLowerCase();
        return lines.filter((line) => line.toLowerCase().includes(term));
    }, [lines, searchMode, searchTerm]);

    const totalMatches = useMemo(() => {
        if(searchMode !=="highlight" || !searchTerm) return 0;
        const term = searchTerm.toLowerCase();
        const lower = jsonText.toLowerCase();
        let count = 0;
        let idx = lower.indexOf(term);
        while (idx !== -1) {
            count ++;
            idx = lower.indexOf(term, idx + term.length);
        }
        return count;
    }, [jsonText, searchMode, searchTerm]);

    if (searchMode === "highlight") {
        matchRefs.current = [];
    }

    const renderLine = (line: string, lineIndex: number) => {
        if (searchMode !== "highlight" || !searchTerm) {
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
        if (totalMatches === 0) return true;
        const next = (currentMatch + direction + totalMatches) % totalMatches;
        setCurrentMatch(next);
        matchRefs.current[next]?.scrollIntoView({ block: "center", behavior: "smooth"});
    };


    return (
        <div>
            <Heading>Dialog detaljer</Heading>

            <div className={styles.searchRow}>
                <Textfield label="Dialog-Id" />
            </div>

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
                        {searchMode === "highlight" && searchTerm && (
                            <div className={styles.matchNav}>
                                <button type="button" onClick={() => goToMatch(-1)}>&uarr;</button>
                                <span>{totalMatches > 0 ? `${currentMatch + 1} / ${totalMatches}` : "0 / 0"}</span>
                                <button type="button" onClick={() => goToMatch(1)}>&darr;</button>
                            </div>
                        )}
                        <div className={styles.modeToggle}>
                            <label>
                                <input
                                    type="radio"
                                    name="searchMode"
                                    checked={searchMode === "highlight"}
                                    onChange={() => setSearchMode("highlight")}
                                />
                                Highlight treff
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="searchMode"
                                    checked={searchMode === "filter"}
                                    onChange={() => setSearchMode("filter")}
                                />
                                Filtrer linjer
                            </label>
                        </div>
                    </div>

                    <pre className={styles.jsonOutput}>
                        {filteredLines.map((line, i) => (
                            <div key={i}>{renderLine(line, i)}</div>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    );
};