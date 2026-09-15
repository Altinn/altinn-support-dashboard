import { useState } from "react";
import { useTextHighlightSearch } from "../../hooks/useTextHighlightSearch";
import { Button, Textfield } from "@digdir/designsystemet-react";
import { ClipboardCheckmarkIcon, ClipboardIcon } from "@navikt/aksel-icons";
import styles from "./JsonPanel.module.css";


type JsonPanelProps = {
    jsonText: string;
};

const JsonPanel: React.FC<JsonPanelProps> = ({ jsonText }) => {
    const [copied, setCopied] = useState(false);

    const {
        lines,
        searchTerm,
        setSearchTerm,
        totalMatches,
        currentMatch,
        renderLine,
        goToMatch,
    } = useTextHighlightSearch(jsonText, {
        matchClassName: styles.match,
        matchActiveClassName: styles.matchActive,
    });

    const handleCopyJson = async () => {
        await navigator.clipboard.writeText(jsonText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

     return (
            <div className={styles.jsonPanel}>
                <div className={styles.findBar}>
                    <Textfield 
                        label="Søk i JSON"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        aria-label="Kopier JSON"
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
        )
}

export default JsonPanel;