import { describe, it, expect } from "vitest";
import { NotificationOrderResponse } from "../../src/models/notificationModels";
import { render, screen } from "@testing-library/react";
import NotificationCard from "../../src/components/Notification/NotificationCard";
import "@testing-library/jest-dom/vitest";



describe("NotificationOrderSummary", () => {
    const baseOrder: NotificationOrderResponse = {
        orderId: "abc-123",
        sendersReference: "ref-456",
        generated: 3,
        succeeded: 2,
        notifications: [],
    };

    it("should render order details", () => {
        render(<NotificationCard order={baseOrder} />);

        expect(screen.getByText("Order id: abc-123")).toBeInTheDocument();
        expect(screen.getByText("Avsenders referanse: ref-456")).toBeInTheDocument();
        expect(screen.getByText("Generert: 3")).toBeInTheDocument();
        expect(screen.getByText("Vellykket: 2")).toBeInTheDocument();
    });

    it("should show 'Ordredetaljer' when there are no notifications", () => {
        render(<NotificationCard order={baseOrder} />);

        expect(screen.getByText("Ordredetaljer")).toBeInTheDocument();
    });

    it("should show 'E-post when the first notification is an email", () => {
        const emailOrder: NotificationOrderResponse = {
            ...baseOrder,
            notifications: [
                {
                    id: "notif-1",
                    succeeded: true,
                    recipient: { emailAddress: "test@test.no"},
                    sendStatus: { status: "SENT", description: "Sendt", lastUpdate: "2026-01-01T00:00:00Z" },
                },
            ],
        };

        render(<NotificationCard order={emailOrder} />);

        expect(screen.getByRole("heading", { name: "E-post" })).toBeInTheDocument();
    });

    it("should show 'SMS' when the first notification is an SMS", () => {
        const smsOrder: NotificationOrderResponse = {
            ...baseOrder,
            notifications: [
                {
                    id: "notif-2",
                    succeeded: true,
                    recipient: { mobileNumber: "12345678"},
                    sendStatus: { status: "SENT", description: "Sendt", lastUpdate: "2026-01-01T00:00:00Z" },
                },
            ],
        };

        render(<NotificationCard order={smsOrder} />);

        expect(screen.getByRole("heading", { name: "SMS" })).toBeInTheDocument();
    });
})