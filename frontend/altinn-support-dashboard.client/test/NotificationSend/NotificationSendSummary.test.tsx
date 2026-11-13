/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NotificationSendSummary from "../../src/components/NotificationSend/NotificationSendSummary";
import { NotificationSendResponse } from "../../src/models/notificationSendModels";

const baseResponse: NotificationSendResponse = {
  responseBody: "",
  responseHeader: "",
  requestHeader: "",
  requestBody: "",
  statusCode: "201",
};

describe("NotificationSendSummary", () => {
  it("should render order and shipment details on success", () => {
    render(
      <NotificationSendSummary
        response={{
          ...baseResponse,
          result: {
            notificationOrderId: "order-123",
            notification: {
              shipmentId: "shipment-456",
              sendersReference: "ref-789",
            },
          },
        }}
      />
    );

    expect(screen.getByText("E-post bestilt")).toBeInTheDocument();
    expect(screen.getByText("order-123")).toBeInTheDocument();
    expect(screen.getByText("shipment-456")).toBeInTheDocument();
    expect(screen.getByText(/ref-789/)).toBeInTheDocument();
  });

  it("should not render shipment when notification is missing", () => {
    render(
      <NotificationSendSummary
        response={{
          ...baseResponse,
          result: { notificationOrderId: "order-123" },
        }}
      />
    );

    expect(screen.getByText("order-123")).toBeInTheDocument();
    expect(screen.queryByText(/Shipment-ID/)).not.toBeInTheDocument();
  });

  it("should render problem title, status, detail and field errors", () => {
    render(
      <NotificationSendSummary
        response={{
          ...baseResponse,
          statusCode: "400",
          problem: {
            title: "Validation failed",
            status: 400,
            detail: "Invalid request",
            errors: {
              "RecipientEmail.EmailAddress": ["Invalid format", "Too long"],
            },
          },
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: /Validation failed/ })
    ).toHaveTextContent("400");
    expect(screen.getByText("Invalid request")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText(/Invalid format/)).toBeInTheDocument();
    expect(screen.getByText(/Too long/)).toBeInTheDocument();
  });

  it("should fall back to default title when problem has no title", () => {
    render(
      <NotificationSendSummary
        response={{ ...baseResponse, statusCode: "500", problem: {} }}
      />
    );

    expect(screen.getByText("Bestilling feilet")).toBeInTheDocument();
  });

  it("should render nothing when there is neither result nor problem", () => {
    const { container } = render(
      <NotificationSendSummary response={baseResponse} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
