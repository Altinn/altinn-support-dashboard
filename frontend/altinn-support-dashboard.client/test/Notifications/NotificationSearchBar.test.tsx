import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import NotificationSearchBar from "../../src/components/Notification/NotificationSearchBar";

describe("NotificationSearchBar", () => {
    it("should render input and buttons", () => {
        render(<NotificationSearchBar orderId="" setOrderId={vi.fn()} />);

        expect(screen.getByPlaceholderText("Skriv inn ordre-id")).toBeInTheDocument();
        expect(screen.getByText("x")).toBeInTheDocument();
    });

    it("should update input value on typing", async () => {
        render(<NotificationSearchBar orderId="" setOrderId={vi.fn()} />);
        const user = userEvent.setup();

        const input = screen.getByPlaceholderText("Skriv inn ordre-id");
        await user.type(input, "abc-123");

        expect(input).toHaveValue("abc-123");
    });

    it("should call setOrderId on search button click", async () => {
        const setOrderId = vi.fn();
        render(<NotificationSearchBar orderId="" setOrderId={setOrderId} />);
        const user = userEvent.setup();

        const input = screen.getByPlaceholderText("Skriv inn ordre-id");
        await user.type(input, "order-42");
        const buttons = screen.getAllByRole("button");
        await user.click(buttons[0]);

        expect(setOrderId).toHaveBeenCalledWith("order-42");
    });

    it("should call setOrderId on Enter key", async () => {
        const setOrderId = vi.fn();
        render(<NotificationSearchBar orderId="" setOrderId={setOrderId} />);
        const user = userEvent.setup();

        const input = screen.getByPlaceholderText("Skriv inn ordre-id");
        await user.type(input, "order-99{Enter}");

        expect(setOrderId).toHaveBeenCalledWith("order-99");
    });

    it("should clear input and call setOrderId with empty string on clear button click", async () => {
        const setOrderId = vi.fn();
        render(<NotificationSearchBar orderId="" setOrderId={setOrderId} />);
        const user = userEvent.setup();

        const input = screen.getByPlaceholderText("Skriv inn ordre-id");
        await user.type(input, "some-value");
        await user.click(screen.getByText("x"));

        expect(input).toHaveValue("");
        expect(setOrderId).toHaveBeenCalledWith("");
    });

    it("should initialize input with provided orderId", () => {
        render(<NotificationSearchBar orderId="existing-id" setOrderId={vi.fn()} />);

        expect(screen.getByPlaceholderText("Skriv inn ordre-id")).toHaveValue("existing-id");
    });
});