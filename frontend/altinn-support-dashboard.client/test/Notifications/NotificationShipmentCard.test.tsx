import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import NotificationShipmentCard from "../../src/components/Notification/NIN-search/NotificationShipmentCard";
import {
  NotificationShipmentResponse,
  DeliveryAttempt,
} from "../../src/models/notificationModels";

const makeShipment = (
  overrides?: Partial<NotificationShipmentResponse>
): NotificationShipmentResponse => ({
  shipmentId: "ship-001",
  creatorName: "Test Creator",
  resourceId: "res-123",
  sendersReference: "ref-abc",
  requestedSendTime: "2026-01-15T10:00:00Z",
  notificationChannel: "email",
  notificationType: "reminder",
  deliveryAttempts: [],
  ...overrides,
});

const makeAttempt = (
  overrides?: Partial<DeliveryAttempt>
): DeliveryAttempt => ({
  displayedNationalIdentityNumber: undefined,
  organizationNumber: undefined,
  channel: "email",
  emailAddress: "test@example.com",
  mobileNumber: null,
  result: "Delivered",
  resultTime: "2026-01-15T10:05:00Z",
  ...overrides,
});

const renderCard = (shipment: NotificationShipmentResponse) =>
  render(
    <MemoryRouter>
      <NotificationShipmentCard shipment={shipment} />
    </MemoryRouter>
  );

describe("NotificationShipmentCard", () => {
  it("should render shipment metadata", () => {
    renderCard(makeShipment());
    expect(screen.getByText(/ship-001/)).toBeInTheDocument();
    expect(screen.getByText(/ref-abc/)).toBeInTheDocument();
    expect(screen.getByText(/res-123/)).toBeInTheDocument();
  });

  it("should render table headers", () => {
    renderCard(makeShipment());
    expect(screen.getByText("Recipient")).toBeInTheDocument();
    expect(screen.getByText("Channel")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("should display masked NIN for a person recipient", () => {
    const shipment = makeShipment({
      deliveryAttempts: [
        makeAttempt({ displayedNationalIdentityNumber: "010190*****" }),
      ],
    });
    renderCard(shipment);
    expect(screen.getByText("010190*****")).toBeInTheDocument();
  });

  it("should display organization number for an organization recipient", () => {
    const shipment = makeShipment({
      deliveryAttempts: [makeAttempt({ organizationNumber: "987654321" })],
    });
    renderCard(shipment);
    expect(screen.getByText("987654321")).toBeInTheDocument();
  });

  it("should render E-post for email channel", () => {
    const shipment = makeShipment({ deliveryAttempts: [makeAttempt()] });
    renderCard(shipment);
    expect(screen.getByText("E-post")).toBeInTheDocument();
  });

  it("should render SMS for non-email channel", () => {
    const shipment = makeShipment({
      deliveryAttempts: [
        makeAttempt({
          channel: "sms",
          emailAddress: null,
          mobileNumber: "+4712345678",
        }),
      ],
    });
    renderCard(shipment);
    expect(screen.getByText("SMS")).toBeInTheDocument();
  });

  it("should display email address for email delivery", () => {
    const shipment = makeShipment({
      deliveryAttempts: [makeAttempt({ emailAddress: "user@example.com" })],
    });
    renderCard(shipment);
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  it("should display mobile number for SMS delivery", () => {
    const shipment = makeShipment({
      deliveryAttempts: [
        makeAttempt({
          channel: "sms",
          emailAddress: null,
          mobileNumber: "+4799999999",
        }),
      ],
    });
    renderCard(shipment);
    expect(screen.getByText("+4799999999")).toBeInTheDocument();
  });

  it("should apply success color for delivered result", () => {
    const shipment = makeShipment({
      deliveryAttempts: [makeAttempt({ result: "Delivered" })],
    });
    renderCard(shipment);
    expect(screen.getByText("Delivered")).toHaveAttribute(
      "data-color",
      "success"
    );
  });

  it("should apply danger color for failed result", () => {
    const shipment = makeShipment({
      deliveryAttempts: [makeAttempt({ result: "Failed" })],
    });
    renderCard(shipment);
    expect(screen.getByText("Failed")).toHaveAttribute("data-color", "danger");
  });

  it("should show empty string when resultTime is null", () => {
    const shipment = makeShipment({
      deliveryAttempts: [makeAttempt({ resultTime: null })],
    });
    renderCard(shipment);
    const cells = screen.getAllByRole("cell");
    const timeCells = cells.filter((_, i) => (i + 1) % 5 === 0);
    expect(timeCells[0]).toHaveTextContent("");
  });

  it("should render multiple delivery attempts", () => {
    const shipment = makeShipment({
      deliveryAttempts: [
        makeAttempt({ emailAddress: "first@example.com" }),
        makeAttempt({
          channel: "sms",
          emailAddress: null,
          mobileNumber: "+4711111111",
        }),
      ],
    });
    renderCard(shipment);
    expect(screen.getByText("first@example.com")).toBeInTheDocument();
    expect(screen.getByText("+4711111111")).toBeInTheDocument();
  });

  it("should render only the header row when there are no delivery attempts", () => {
    renderCard(makeShipment({ deliveryAttempts: [] }));
    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});
