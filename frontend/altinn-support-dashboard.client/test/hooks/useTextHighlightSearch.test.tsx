import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTextHighlightSearch } from "../../src/hooks/useTextHighlightSearch";

const classNames = {
  matchClassName: "match",
  matchActiveClassName: "matchActive",
};

describe("useTextHighlightSearch", () => {
  it("should split text into lines", () => {
    const { result } = renderHook(() =>
      useTextHighlightSearch("line1\nline2\nline3", classNames)
    );

    expect(result.current.lines).toEqual(["line1", "line2", "line3"]);
  });

  it("should report zero matches when there is no search term", () => {
    const { result } = renderHook(() =>
      useTextHighlightSearch("hello world", classNames)
    );

    expect(result.current.totalMatches).toBe(0);
  });

  it("should count case-insensitive matches across the whole text", () => {
    const { result } = renderHook(() =>
      useTextHighlightSearch("Hello hello HELLO world", classNames)
    );

    act(() => {
      result.current.setSearchTerm("hello");
    });

    expect(result.current.totalMatches).toBe(3);
  });

  it("should reset currentMatch to 0 when the search term changes", () => {
    const { result } = renderHook(() => useTextHighlightSearch("a a a", classNames));

    act(() => result.current.setSearchTerm("a"));
    act(() => result.current.goToMatch(1));
    expect(result.current.currentMatch).toBe(1);

    act(() => result.current.setSearchTerm("a"));
    expect(result.current.currentMatch).toBe(0);
  });

  it("should wrap around to the last match when going backwards from the first", () => {
    const { result } = renderHook(() => useTextHighlightSearch("a a a", classNames));

    act(() => result.current.setSearchTerm("a"));
    act(() => result.current.goToMatch(-1));

    expect(result.current.currentMatch).toBe(2);
  });

  it("should do nothing when there are no matches", () => {
    const { result } = renderHook(() => useTextHighlightSearch("hello world", classNames));

    act(() => result.current.setSearchTerm("xyz"));
    act(() => result.current.goToMatch(1));

    expect(result.current.currentMatch).toBe(0);
  });

  it("should render plain text when there is no search term", () => {
    const { result } = renderHook(() => useTextHighlightSearch("hello world", classNames));

    render(<>{result.current.renderLine("hello world", 0)}</>);

    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("should highlight matches and mark the active one", () => {
    const { result } = renderHook(() => useTextHighlightSearch("foo bar foo", classNames));

    act(() => result.current.setSearchTerm("foo"));

    const { container } = render(<>{result.current.renderLine("foo bar foo", 0)}</>);
    const highlighted = container.querySelectorAll(
      `.${classNames.matchClassName}, .${classNames.matchActiveClassName}`
    );

    expect(highlighted).toHaveLength(2);
    expect(highlighted[0]).toHaveClass(classNames.matchActiveClassName);
    expect(highlighted[1]).toHaveClass(classNames.matchClassName);
  });
});
