import { useMemo, useRef, useState } from "react";

interface HighlightClassNames {
  matchClassName: string;
  matchActiveClassName: string;
}

export function useTextHighlightSearch(text: string, { matchClassName, matchActiveClassName }: HighlightClassNames) {
  const [searchTerm, setSearchTermState] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  
  // One ref per match across the whole text, keyed by the match's index in the
  // order they appear in the text. Lets goToMatch scroll to a specific match
  // without re-searching the DOM. Populated/cleared via ref callbacks (commit
  // phase) rather than mutated during render.
  const matchRefs = useRef<Map<number, HTMLSpanElement>>(new Map());

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

  // globalMatchIndex == index within the whole text only if renderLine is called for
  // every line, in the same order, on every render (e.g. don't skip lines via
  // virtualization/conditional render).
  let globalMatchIndex = 0;

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

      const matchIndex = globalMatchIndex++;
      parts.push(
        <span
          key={`${lineIndex}-${matchStart}`}
          ref={(el) => {
            if (el) matchRefs.current.set(matchIndex, el);
            return () => {
              matchRefs.current.delete(matchIndex);
            };
          }}
          className={matchIndex === currentMatchIndex ? matchActiveClassName : matchClassName}
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
    matchRefs.current.get(next)?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const setSearchTerm = (value: string) => {
    setSearchTermState(value);
    setCurrentMatchIndex(0);
  };

  return { lines, searchTerm, setSearchTerm, currentMatch: currentMatchIndex, totalMatches, renderLine, goToMatch};
}