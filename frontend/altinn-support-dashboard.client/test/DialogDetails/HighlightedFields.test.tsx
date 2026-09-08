import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import HighlightedFields from "../../src/components/DialogDetails/HighlightedFields";

describe("HighlightedFields", () => {
  it("should render a label and value for each field", () => {
    render(
      <HighlightedFields
        fields={[
          { label: "ID", value: "d1" },
          { label: "Org", value: "ttd" },
        ]}
      />
    );

    expect(screen.getByText("ID:")).toBeInTheDocument();
    expect(screen.getByText("d1")).toBeInTheDocument();
    expect(screen.getByText("Org:")).toBeInTheDocument();
    expect(screen.getByText("ttd")).toBeInTheDocument();
  });

  it("should render a dash when the value is null", () => {
    render(<HighlightedFields fields={[{ label: "Deleted at", value: null }]} />);

    expect(screen.getByText("Deleted at:")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render a dash when the value is undefined", () => {
    render(<HighlightedFields fields={[{ label: "Deleted at", value: undefined }]} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render a dash when the value is an empty string", () => {
    render(<HighlightedFields fields={[{ label: "Org", value: "" }]} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should stringify object values as formatted JSON", () => {
    render(
      <HighlightedFields
        fields={[{ label: "Service owner labels", value: { priority: true } }]}
      />
    );

    // getByText normalizes whitespace, collapsing the pretty-printed JSON's newlines/indentation to single spaces
    expect(screen.getByText('{ "priority": true }')).toBeInTheDocument();
  });

  it("should convert non-string primitive values to strings", () => {
    render(
      <HighlightedFields
        fields={[
          { label: "Seen since last content update", value: false },
          { label: "Minimum authentication level", value: 3 },
        ]}
      />
    );

    expect(screen.getByText("false")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render no field rows when given an empty list", () => {
    const { container } = render(<HighlightedFields fields={[]} />);

    expect(container.querySelectorAll("[class*='fieldRow']")).toHaveLength(0);
  });
});
