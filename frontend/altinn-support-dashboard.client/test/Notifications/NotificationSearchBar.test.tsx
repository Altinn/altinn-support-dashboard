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

  describe("orderId mode", () => {
    it("should render Ordre-ID label and placeholder", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="orderId"
        />
      );
      expect(screen.getByText("Ordre-ID")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Skriv inn ordre-ID")).toBeInTheDocument();
    });

    it("should not show date fields", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="orderId"
        />
      );
      expect(screen.queryByText("Fra dato")).not.toBeInTheDocument();
      expect(screen.queryByText("Til dato")).not.toBeInTheDocument();
    });
  });

  describe("nin mode", () => {
    it("should render NIN label and placeholder", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="nin"
        />
      );
      expect(screen.getByText("NIN")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Skriv inn NIN")).toBeInTheDocument();
    });

    it("should show date fields", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="nin"
        />
      );
      expect(screen.getByText("Fra dato")).toBeInTheDocument();
      expect(screen.getByText("Til dato")).toBeInTheDocument();
    });

    it("should call setDateFrom when Fra dato changes", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="nin"
          dateFrom=""
          setDateFrom={mockSetDateFrom}
          dateTo=""
          setDateTo={mockSetDateTo}
        />
      );
      const inputs = screen.getAllByDisplayValue("");
      fireEvent.change(inputs[1], { target: { value: "2025-01-01" } });
      expect(mockSetDateFrom).toHaveBeenCalledWith("2025-01-01");
    });

    it("should call setDateTo when Til dato changes", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="nin"
          dateFrom=""
          setDateFrom={mockSetDateFrom}
          dateTo=""
          setDateTo={mockSetDateTo}
        />
      );
      const inputs = screen.getAllByDisplayValue("");
      fireEvent.change(inputs[2], { target: { value: "2025-06-01" } });
      expect(mockSetDateTo).toHaveBeenCalledWith("2025-06-01");
    });

    it("should display provided dateFrom and dateTo values", () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="nin"
          dateFrom="2025-01-01"
          setDateFrom={mockSetDateFrom}
          dateTo="2025-06-01"
          setDateTo={mockSetDateTo}
        />
      );
      expect(screen.getByDisplayValue("2025-01-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2025-06-01")).toBeInTheDocument();
    });
  });

  describe("search behavior", () => {
    it("should initialize with provided searchValue", () => {
      render(
        <NotificationSearchBar
          searchValue="existing-id"
          setSearchValue={mockSetSearchValue}
          searchType="orderId"
        />
      );
      expect(screen.getByPlaceholderText("Skriv inn ordre-ID")).toHaveValue("existing-id");
    });

    it("should update input value as user types", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="orderId"
        />
      );
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText("Skriv inn ordre-ID");
      await user.type(input, "abc-123");
      expect(input).toHaveValue("abc-123");
    });

    it("should call setSearchValue with typed value on search button click", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="orderId"
        />
      );
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText("Skriv inn ordre-ID");
      await user.type(input, "order-42");
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);
      expect(mockSetSearchValue).toHaveBeenCalledWith("order-42");
    });

    it("should call setSearchValue on Enter key press", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="orderId"
        />
      );
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText("Skriv inn ordre-ID");
      await user.type(input, "order-99{Enter}");
      expect(mockSetSearchValue).toHaveBeenCalledWith("order-99");
    });

    it("should clear input and call setSearchValue with empty string on clear click", async () => {
      render(
        <NotificationSearchBar
          searchValue=""
          setSearchValue={mockSetSearchValue}
          searchType="orderId"
        />
      );
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText("Skriv inn ordre-ID");
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
          searchType="nin"
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
