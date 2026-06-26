import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import NotificationSearchBar from "../../src/components/Notification/NotificationSearchBar";

describe("NotificationSearchBar", () => {
  const mockSetSearchValue = vi.fn();
  const mockSetDateFrom = vi.fn();
  const mockSetDateTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("shipmentId mode", () => {
    it("should render Shipment-ID label and placeholder", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="shipmentId"
        />
      );
      expect(screen.getByLabelText("Shipment-ID")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Shipment-ID")).toBeInTheDocument();
    });

    it("should not show date fields", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="shipmentId"
        />
      );
      expect(screen.queryByLabelText("From date")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("To date")).not.toBeInTheDocument();
    });
  });

  describe("future mode", () => {
    it("should render Future label and placeholder", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="future"
        />
      );
      expect(screen.getByLabelText("Future")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Valid values: NIN")).toBeInTheDocument();
    });

    it("should show date fields", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="future"
        />
      );
      expect(screen.getByLabelText("From date")).toBeInTheDocument();
      expect(screen.getByLabelText("To date")).toBeInTheDocument();
    });

    it("should call setDateFrom when From date changes", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="future"
          dateFrom=""
          setDateFrom={mockSetDateFrom}
          dateTo=""
          setDateTo={mockSetDateTo}
        />
      );
      fireEvent.change(screen.getByLabelText("From date"), { target: { value: "2025-01-01" } });
      expect(mockSetDateFrom).toHaveBeenCalledWith("2025-01-01");
    });

    it("should call setDateTo when To date changes", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="future"
          dateFrom=""
          setDateFrom={mockSetDateFrom}
          dateTo=""
          setDateTo={mockSetDateTo}
        />
      );
      fireEvent.change(screen.getByLabelText("To date"), { target: { value: "2025-06-01" } });
      expect(mockSetDateTo).toHaveBeenCalledWith("2025-06-01");
    });

    it("should display provided dateFrom and dateTo values", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="future"
          dateFrom="2025-01-01"
          setDateFrom={mockSetDateFrom}
          dateTo="2025-06-01"
          setDateTo={mockSetDateTo}
        />
      );
      expect(screen.getByLabelText("From date")).toHaveValue("2025-01-01");
      expect(screen.getByLabelText("To date")).toHaveValue("2025-06-01");
    });
  });

  describe("search behavior", () => {
    it("should initialize with provided searchValue", () => {
      render(
        <NotificationSearchBar
          searchValue="existing-id"
          setSearchValue={mockSetSearchValue}
          searchType="shipmentId"
        />
      );
      expect(screen.getByLabelText("Shipment-ID")).toHaveValue("existing-id");
    });

    it("should update input value as user types", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="shipmentId"
        />
      );
      const user = userEvent.setup();
      const input = screen.getByLabelText("Shipment-ID");
      await user.type(input, "abc-123");
      expect(input).toHaveValue("abc-123");
    });

    it("should call setSearchValue with typed value on search button click", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="shipmentId"
        />
      );
      const user = userEvent.setup();
      await user.type(screen.getByLabelText("Shipment-ID"), "order-42");
      await user.click(screen.getAllByRole("button")[0]);
      expect(mockSetSearchValue).toHaveBeenCalledWith("order-42");
    });

    it("should call setSearchValue on Enter key press", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="shipmentId"
        />
      );
      const user = userEvent.setup();
      await user.type(screen.getByLabelText("Shipment-ID"), "order-99{Enter}");
      expect(mockSetSearchValue).toHaveBeenCalledWith("order-99");
    });

    it("should clear input and call setSearchValue with empty string on clear click", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="shipmentId"
        />
      );
      const user = userEvent.setup();
      const input = screen.getByLabelText("Shipment-ID");
      await user.type(input, "some-value");
      await user.click(screen.getByText("x"));
      expect(input).toHaveValue("");
      expect(mockSetSearchValue).toHaveBeenCalledWith("");
    });

    it("should call setDateFrom and setDateTo with empty string on clear", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="future"
          dateFrom="2025-01-01"
          setDateFrom={mockSetDateFrom}
          dateTo="2025-06-01"
          setDateTo={mockSetDateTo}
        />
      );
      const user = userEvent.setup();
      await user.click(screen.getByText("x"));
      expect(mockSetDateFrom).toHaveBeenCalledWith("");
      expect(mockSetDateTo).toHaveBeenCalledWith("");
    });
  });
});
