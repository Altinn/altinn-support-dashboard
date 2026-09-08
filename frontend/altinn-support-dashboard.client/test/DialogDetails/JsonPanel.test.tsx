import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import JsonPanel from "../../src/components/DialogDetails/JsonPanel";

describe("JsonPanel", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("should render each line of the JSON text", () => {
    render(<JsonPanel jsonText={'{\n  "id": "d1"\n}'} />);

    expect(screen.getByText("{")).toBeInTheDocument();
    expect(screen.getByText('"id": "d1"')).toBeInTheDocument();
    expect(screen.getByText("}")).toBeInTheDocument();
  });

  it("should not show the match navigator when there is no search term", () => {
    render(<JsonPanel jsonText={'{"id": "d1"}'} />);

    expect(screen.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument();
  });

  it("should show the match count when searching for a term that exists", () => {
    render(<JsonPanel jsonText={'{"id": "d1", "org": "d1"}'} />);

    fireEvent.change(screen.getByLabelText("Søk i JSON"), { target: { value: "d1" } });

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("should show 0 / 0 when searching for a term that does not exist", () => {
    render(<JsonPanel jsonText={'{"id": "d1"}'} />);

    fireEvent.change(screen.getByLabelText("Søk i JSON"), { target: { value: "xyz" } });

    expect(screen.getByText("0 / 0")).toBeInTheDocument();
  });

  it("should advance to the next match when clicking the down arrow", () => {
    render(<JsonPanel jsonText={'{"id": "d1", "org": "d1"}'} />);

    fireEvent.change(screen.getByLabelText("Søk i JSON"), { target: { value: "d1" } });
    fireEvent.click(screen.getByText("↓"));

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("should wrap to the last match when clicking the up arrow from the first match", () => {
    render(<JsonPanel jsonText={'{"id": "d1", "org": "d1"}'} />);

    fireEvent.change(screen.getByLabelText("Søk i JSON"), { target: { value: "d1" } });
    fireEvent.click(screen.getByText("↑"));

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("should copy the JSON text to the clipboard when the copy button is clicked", async () => {
    const jsonText = '{"id": "d1"}';
    render(<JsonPanel jsonText={jsonText} />);

    fireEvent.click(screen.getByRole("button", { name: "Kopier JSON" }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(jsonText);
    });
  });
});
