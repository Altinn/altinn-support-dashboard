import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import NotificationList from "../../src/components/Notification/NotificationList";
import { NotificationItem } from "../../src/models/notificationModels";


const emailNotification: NotificationItem = {
    id: "notif-1",
    succeeded: true,
    recipient: { emailAddress: "test@test.no"},
    sendStatus: { status: "Delivered", description: "Delivered successfully", lastUpdate: "2026-01-01T00:00:00Z" },
};

const smsNotification: NotificationItem = {
    id: "notif-2",
    succeeded: false,
    recipient: { mobileNumber: "12345678"},
    sendStatus: { status: "Failed", description: "Failed to deliver", lastUpdate: "2026-01-01T00:00:00Z" },
};

describe("NotificationList", () => {
    it("should render table headers", () => {
        render(<NotificationList notifications={[]} />);

        expect(screen.getByText("Mottaker")).toBeInTheDocument();
        expect(screen.getByText("Type")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Notifikasjons id")).toBeInTheDocument();
    });

    it("should render email notifications row", () => {
        render(<NotificationList notifications={[emailNotification]} />);

        expect(screen.getByText("test@test.no")).toBeInTheDocument();
        expect(screen.getByText("E-post")).toBeInTheDocument();
        expect(screen.getByText("Delivered - Delivered successfully")).toBeInTheDocument();
        expect(screen.getByText("notif-1")).toBeInTheDocument();
    });

    it("should render SMS notifications row", () => {
        render(<NotificationList notifications={[smsNotification]} />);

        expect(screen.getByText("12345678")).toBeInTheDocument();
        expect(screen.getByText("SMS")).toBeInTheDocument();
        expect(screen.getByText("Failed - Failed to deliver")).toBeInTheDocument();
        expect(screen.getByText("notif-2")).toBeInTheDocument();
    });

    it("should render multiple notifications", () => {
        render(<NotificationList notifications={[emailNotification, smsNotification]} />);

        expect(screen.getByText("test@test.no")).toBeInTheDocument();
        expect(screen.getByText("12345678")).toBeInTheDocument();
    });

    it("should filter notifications by id", async () => {
        render(<NotificationList notifications={[emailNotification, smsNotification]} />);
        const user = userEvent.setup();

        const searchInput = screen.getByPlaceholderText("Skriv inn notifikasjons id");
        await user.type(searchInput, "notif-1");

        expect(screen.getByText("test@test.no")).toBeInTheDocument();
        expect(screen.queryByText("12345678")).not.toBeInTheDocument();
    });

    it("should show all notifications when search is cleared", async () => {
        render(<NotificationList notifications={[emailNotification, smsNotification]} />);
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText("Skriv inn notifikasjons id");

        await user.type(searchInput, "notif-1");
        expect(screen.queryByText("12345678")).not.toBeInTheDocument();

        await user.clear(searchInput);
        expect(screen.getByText("12345678")).toBeInTheDocument();
    });

    it("should show no rows if search matches nothing", async () => {
        render(<NotificationList notifications={[emailNotification, smsNotification]} />);
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText("Skriv inn notifikasjons id");

        await user.type(searchInput, "non-existent-id");

        expect(screen.queryByText("test@test.no")).not.toBeInTheDocument();
        expect(screen.queryByText("12345678")).not.toBeInTheDocument();
    });
})