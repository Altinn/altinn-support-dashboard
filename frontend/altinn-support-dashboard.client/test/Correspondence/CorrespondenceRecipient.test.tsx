import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CorrespondenceRecipient from "../../src/components/Correspondence/CorrespondenceRecipient";

describe("CorrespondenceRecipient", () => {
  const mockSetRecipientType = vi.fn();
  const mockSetRecipientIdentifier = vi.fn();

  beforeEach(() => {
    mockSetRecipientType.mockClear();
    mockSetRecipientIdentifier.mockClear();
    localStorage.clear();
  });

  it("renders recipient type and identifier fields", () => {
    render(
      <CorrespondenceRecipient
        recipientType="person"
        setRecipientType={mockSetRecipientType}
        recipientIdentifier=""
        setRecipientIdentifier={mockSetRecipientIdentifier}
      />
    );

    expect(screen.getByText("Mottaker")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("person");
    expect(screen.getByPlaceholderText("12345678901")).toBeInTheDocument();
  });

  it("shows validation error for invalid person identifier", async () => {
    const user = userEvent.setup();
    render(
      <CorrespondenceRecipient
        recipientType="person"
        setRecipientType={mockSetRecipientType}
        recipientIdentifier="123"
        setRecipientIdentifier={mockSetRecipientIdentifier}
      />
    );

    expect(
      screen.getByText("Fødselsnummer må være 11 siffer")
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText("12345678901");
    await user.clear(input);
    await user.type(input, "12345678901");

    expect(mockSetRecipientIdentifier).toHaveBeenCalled();
  });

  it("shows recipient urn preview when valid", () => {
    render(
      <CorrespondenceRecipient
        recipientType="organization"
        setRecipientType={mockSetRecipientType}
        recipientIdentifier="123456789"
        setRecipientIdentifier={mockSetRecipientIdentifier}
      />
    );

    expect(
      screen.getByText(/urn:altinn:organization:identifier-no:123456789/)
    ).toBeInTheDocument();
  });

  it("saves recipient values to localStorage", () => {
    render(
      <CorrespondenceRecipient
        recipientType="person"
        setRecipientType={mockSetRecipientType}
        recipientIdentifier="12345678901"
        setRecipientIdentifier={mockSetRecipientIdentifier}
      />
    );

    expect(localStorage.getItem("recipientType")).toBe("person");
    expect(localStorage.getItem("recipientIdentifier")).toBe("12345678901");
    expect(localStorage.getItem("recipient")).toBe(
      "urn:altinn:person:identifier-no:12345678901"
    );
  });
});
