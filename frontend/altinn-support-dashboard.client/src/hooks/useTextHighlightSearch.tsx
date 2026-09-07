import { useMemo, useRef, useState } from "react";

interface HighlightClassNames {
  matchClassName: string;
  matchActiveClassName: string;
}

export function useTextHighlightSearch(text: string, { matchClassName, matchActiveClassName }: HighlightClassNames) {
  const [searchTerm, setSearchTermState] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  
  //One ref per match across the whole text, in the order they appear in the text.
  // Lets goToMatch scroll to specific match without re-searching the DOM
  const matchRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const lines = useMemo(() => text.split("\n"), [text]);

  // Count total matches in the text for the current search term
  const totalMatches = useMemo(() => {
    if (!searchTerm) return 0;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseText = text.toLowerCase();
    let matchCount = 0;
    let searchIndex = lowerCaseText.indexOf(lowerCaseSearchTerm);
    while (searchIndex !== -1) {
      matchCount++;
      searchIndex = lowerCaseText.indexOf(lowerCaseSearchTerm, searchIndex + lowerCaseSearchTerm.length);
    }
    return matchCount;
  }, [text, searchTerm]);

  // Reset once per render, then renderLine(line) appends this line's match refs in order.
  // Ref index == global match index only if renderLine is called for every line, in the
  // same order, on every render (e.g. don't skip lines via virtualization/conditional render).
  matchRefs.current = [];

  const renderLine = (line: string, lineIndex: number) => {
    if (!searchTerm) return <span>{line}</span>;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseLine = line.toLowerCase();
    const parts: React.ReactNode[] = [];
    let sliceStart = 0;
    let matchStart = lowerCaseLine.indexOf(lowerCaseSearchTerm);

    while (matchStart !== -1) {
      // Plain text between the last match and this match
      parts.push(line.slice(sliceStart, matchStart));

      const globalMatchIndex = matchRefs.current.length;
      matchRefs.current.push(null);
      parts.push(
        <span
          key={`${lineIndex}-${matchStart}`}
          ref={(el) => { matchRefs.current[globalMatchIndex] = el; }}
          className={globalMatchIndex === currentMatchIndex ? matchActiveClassName : matchClassName}
        >
          {line.slice(matchStart, matchStart + lowerCaseSearchTerm.length)}
        </span>
      );
      sliceStart = matchStart + lowerCaseSearchTerm.length;
      matchStart = lowerCaseLine.indexOf(lowerCaseSearchTerm, sliceStart);
    }
    parts.push(line.slice(sliceStart));
    return <span>{parts}</span>
  };

  const goToMatch = (direction: 1 | -1) => {
    if (totalMatches === 0) return;
    // Wrap around in both directions using modulo
    const next = (currentMatchIndex + direction + totalMatches) % totalMatches;
    setCurrentMatchIndex(next);
    matchRefs.current[next]?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const setSearchTerm = (value: string) => {
    setSearchTermState(value);
    setCurrentMatchIndex(0);
  };

  return { lines, searchTerm, setSearchTerm, currentMatch: currentMatchIndex, totalMatches, renderLine, goToMatch};
}