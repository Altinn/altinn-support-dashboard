import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import UserContactInfoTableRow from "../../../src/components/Dashboard/components/UserContactInfoTableRow";
import "@testing-library/jest-dom";

vi.mock("../../../src/components/Dashboard/utils/dateUtils", () => ({
  formatDate: vi.fn((date: string) => `Formatted: ${date}`),
}));

vi.mock("@digdir/designsystemet-react", () => ({
  Table: Object.assign(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ children }: any) => <table>{children}</table>,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Row: ({ children }: any) => <tr>{children}</tr>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ children }: any) => <td>{children}</td>,
    },
  ),
}));

describe("UserContactInfoTableRow", () => {
  it("should render the label and value", () => {
    render(
      <table>
        <tbody>
          <UserContactInfoTableRow label="Mobilnummer" value="+4799115744" />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Mobilnummer")).toBeInTheDocument();
    expect(screen.getByText("+4799115744")).toBeInTheDocument();
  });

  it('should show "Ikke registrert" when value is missing', () => {
    render(
      <table>
        <tbody>
          <UserContactInfoTableRow label="E-post" />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Ikke registrert")).toBeInTheDocument();
  });

  it("should render the formatted last-updated date", () => {
    render(
      <table>
        <tbody>
          <UserContactInfoTableRow
            label="E-post"
            value="test@test.no"
            lastUpdatedOrVerified="2026-02-01T00:00:00Z"
          />
        </tbody>
      </table>,
    );

    expect(
      screen.getByText("Formatted: 2026-02-01T00:00:00Z"),
    ).toBeInTheDocument();
  });
});
