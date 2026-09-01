import { useMemo, useRef, useState } from "react";

interface HighlightClassNames {
  matchClassName: string;
  matchActiveClassName: string;
}

export function useTextHighlightSearch(text: string, { matchClassName, matchActiveClassName }: HighlightClassNames) {
  const [searchTerm, setSearchTermState] = useState("") ;
  const [currentMatch, setCurrentMatch] = useState(0);
  const matchRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const lines = useMemo(() => text.split("\n"), [text]);

  const totalMatches = useMemo(() => {
    if (!searchTerm) return 0;
    const term = searchTerm.toLowerCase();
    const lower = text.toLowerCase();
    let count = 0;
    let idx = lower.indexOf(term);
    while (idx !== -1) {
      count ++;
      idx = lower.indexOf(term, idx + term.length);
    }
    return count;
  }, [text, searchTerm]);

  matchRefs.current = [];

  const renderLine = (line: string, lineIndex: number) => {
    if (!searchTerm) return <span>{line}</span>;

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
          key ={`${lineIndex}-${idx}`}
          ref={(el) => { matchRefs.current[matchIndex] = el; }}
          className={matchIndex === currentMatch ? matchActiveClassName : matchClassName}
        >
          {line.slice(idx, idx + term.length)}
        </span>
      );
      cursor = idx + term.length;
      idx = lower.indexOf(term, cursor);
    }
    parts.push(line.slice(cursor));
    return <span>{parts}</span>
  };

  const goToMatch = (direction: 1 | -1) => {
    if (totalMatches === 0) return;
    const next = (currentMatch + direction + totalMatches) % totalMatches;
    setCurrentMatch(next);
    matchRefs.current[next]?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const setSearchTerm = (value: string) => {
    setSearchTermState(value);
    setCurrentMatch(0);
  };

  return { lines, searchTerm, setSearchTerm, currentMatch, totalMatches, renderLine, goToMatch};
}