import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DialogDetailsLookupPage } from "../../src/pages/DialogDetailsLookupPage";
import { useDialogDetails } from "../../src/hooks/hooks";
import { useAppStore } from "../../src/stores/Appstore";
import { showPopup } from "../../src/components/Popup";

vi.mock("../../src/hooks/hooks", () => ({
  useDialogDetails: vi.fn(),
}));

vi.mock("../../src/stores/Appstore", () => ({
  useAppStore: vi.fn(),
}));

vi.mock("../../src/components/Popup", () => ({
  showPopup: vi.fn(),
}));

describe("DialogDetailsLookupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAppStore as any).mockReturnValue("TT02");
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useDialogDetails as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    });
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("should render heading and dialog-id input", () => {
    render(<DialogDetailsLookupPage />);

    expect(screen.getByText("Dialog detaljer")).toBeInTheDocument();
    expect(screen.getByLabelText("Dialog-ID")).toBeInTheDocument();
  });

  it("should show a spinner while loading", () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useDialogDetails as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<DialogDetailsLookupPage />);

    expect(screen.getByRole("img", { name: "Laster" })).toBeInTheDocument();
  });

  it("should show the highlighted fields when data is returned", () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useDialogDetails as any).mockReturnValue({
      data: { id: "d1", deletedAt: null },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<DialogDetailsLookupPage />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("d1")).toBeInTheDocument();
    expect(screen.getByText("Deleted at")).toBeInTheDocument();
  });

  it("should show an error popup when the query fails", () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useDialogDetails as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Fant ingen dialog med denne IDen"),
    });

    render(<DialogDetailsLookupPage />);

    expect(showPopup).toHaveBeenCalledWith("Fant ingen dialog med denne IDen", "error");
  });

  it("should submit the trimmed dialog-id on Enter", () => {
    render(<DialogDetailsLookupPage />);

    const input = screen.getByLabelText("Dialog-ID");
    fireEvent.change(input, { target: { value: "  d1  " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(useDialogDetails).toHaveBeenLastCalledWith("d1", "TT02");
    expect(sessionStorage.getItem("dialogDetailsLookup.submittedId")).toBe("d1");
  });

  it("should not submit when the trimmed dialog-id is empty", () => {
    render(<DialogDetailsLookupPage />);

    const input = screen.getByLabelText("Dialog-ID");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(sessionStorage.getItem("dialogDetailsLookup.submittedId")).toBeNull();
  });

  it("should copy the JSON output to the clipboard", async () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useDialogDetails as any).mockReturnValue({
      data: { id: "d1", deletedAt: null },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<DialogDetailsLookupPage />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify({ id: "d1", deletedAt: null }, null, 2)
      );
    });
  });
});
