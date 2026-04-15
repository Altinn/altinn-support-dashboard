import { NotificationItem } from "../../src/models/notificationModels";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import NotificationStatusCode from "../../src/components/Notification/NotificationStatusCode";






const makeNotifications = (status: string, description: string, succeeded: boolean): NotificationItem => ({
    id: "notif-1",
    succeeded,
    recipient: { emailAddress: "test@test.no"},
    sendStatus: { status, description, lastUpdate: "2026-01-01T00:00:00Z" },
});

describe("NotificationStatusCode", () => {
    it("should render status and description", () => {
        const notification = makeNotifications("Delivered", "Delivered successfully", true);
        render(<NotificationStatusCode notification={notification} />);

        expect(screen.getByText("Delivered - Delivered successfully")).toBeInTheDocument();
    });

    it("should use success color for delievred status", () => {
        const notification = makeNotifications("Delivered", "Delivered successfully", true);
        render(<NotificationStatusCode notification={notification} />);

        expect(screen.getByText("Delivered - Delivered successfully")).toHaveAttribute("data-color", "success");
    })

    it("should use danger color for failed status", () => {
        const notification = makeNotifications("Failed", "Failed to deliver", false);
        render(<NotificationStatusCode notification={notification} />);

        expect(screen.getByText("Failed - Failed to deliver")).toHaveAttribute("data-color", "danger");
    });

    it("should use warning color for new status", () => {
        const notification = makeNotifications("New", "Pending", false);
        render(<NotificationStatusCode notification={notification} />);

        expect(screen.getByText("New - Pending")).toHaveAttribute("data-color", "warning");
    });

    it("should use ifo color for unknown status", () => {
        const notification = makeNotifications("Unknown", "Unknown status", false);
        render(<NotificationStatusCode notification={notification} />);

        expect(screen.getByText("Unknown - Unknown status")).toHaveAttribute("data-color", "info");
    });

    it("should be case insensitive for status matching", () => {
        const notification = makeNotifications("deLIVereD", "Delivered successfully", true);
        render(<NotificationStatusCode notification={notification} />);

        expect(screen.getByText("deLIVereD - Delivered successfully")).toHaveAttribute("data-color", "success");
    });
})