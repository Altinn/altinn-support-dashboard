/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { NotificationSendPage } from "../../src/pages/NotificationSendPage";
import { useSendTestEmail } from "../../src/hooks/hooks";
import { useAppStore } from "../../src/stores/Appstore";

vi.mock("../../src/hooks/hooks", () => ({
  useSendTestEmail: vi.fn(),
}));

const mockHook = (mutateAsync = vi.fn(), isPending = false) => {
  vi.mocked(useSendTestEmail).mockReturnValue({
    mutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useSendTestEmail>);
  return mutateAsync;
};

// The email address is the only input on the page
const getEmailField = () => screen.getByRole("textbox");

const sendButton = () => screen.getByRole("button", { name: /Send e-post/i });

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  useAppStore.setState({ environment: "TT02" });
});

describe("NotificationSendPage", () => {
  it("should render email field, warning and a disabled button initially", () => {
    mockHook();
    render(<NotificationSendPage />);

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByText(/ekte mottaker/)).toBeInTheDocument();
    expect(sendButton()).toBeDisabled();
  });

  it("should show the fixed subject and body that will be sent", () => {
    mockHook();
    render(<NotificationSendPage />);

    expect(screen.getByText("Varsel test Altinn")).toBeInTheDocument();
    expect(screen.getByText(/Test varsel fra Altinn/)).toBeInTheDocument();
    expect(screen.getByText(/Denne mailen kan ikke besvares/)).toBeInTheDocument();
  });

  it("should show error and keep button disabled for invalid email", async () => {
    mockHook();
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "not-an-email");

    expect(screen.getByText("Ugyldig e-postadresse")).toBeInTheDocument();
    expect(sendButton()).toBeDisabled();
  });

  it("should enable button for valid email", async () => {
    mockHook();
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "test@example.com");

    expect(
      screen.queryByText("Ugyldig e-postadresse")
    ).not.toBeInTheDocument();
    expect(sendButton()).toBeEnabled();
  });

  it("should disable button while request is pending", async () => {
    mockHook(vi.fn(), true);
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "test@example.com");

    expect(sendButton()).toBeDisabled();
  });

  it("should call mutation with environment and trimmed email only", async () => {
    const mutateAsync = mockHook(
      vi.fn().mockResolvedValue({ statusCode: 201 })
    );
    useAppStore.setState({ environment: "PROD" });
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "  test@example.com  ");
    await userEvent.click(sendButton());

    expect(mutateAsync).toHaveBeenCalledWith({
      environment: "PROD",
      request: {
        emailAddress: "test@example.com",
        idempotencyId: expect.any(String),
      },
    });
  });

  it("should not store the email address", async () => {
    mockHook();
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "a@b.no");

    expect(localStorage.getItem("notifSendEmail")).toBeNull();
    expect(sessionStorage.getItem("notifSendEmail")).toBeNull();
  });

  it("should start with an empty email field", () => {
    mockHook();
    render(<NotificationSendPage />);

    expect(getEmailField()).toHaveValue("");
  });

  it("should show summary and store response after successful send", async () => {
    const response = {
      responseBody: "{}",
      responseHeader: "",
      requestHeader: "",
      requestBody: "{}",
      statusCode: 201,
      result: { notificationOrderId: "order-123" },
    };
    mockHook(vi.fn().mockResolvedValue(response));
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "test@example.com");
    await userEvent.click(sendButton());

    expect(await screen.findByText("E-post bestilt")).toBeInTheDocument();
    expect(screen.getByText("order-123")).toBeInTheDocument();
    expect(
      JSON.parse(sessionStorage.getItem("notifSendResponse")!)
    ).toEqual({ ...response, requestBody: "" });
  });

  it("should not store the recipient's email from requestBody in sessionStorage", async () => {
    const response = {
      responseBody: "{}",
      responseHeader: "",
      requestHeader: "",
      requestBody: JSON.stringify({
        recipientEmail: { emailAddress: "test@example.com" },
      }),
      statusCode: 201,
      result: { notificationOrderId: "order-123" },
    };
    mockHook(vi.fn().mockResolvedValue(response));
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "test@example.com");
    await userEvent.click(sendButton());

    await screen.findByText("E-post bestilt");
    const stored = sessionStorage.getItem("notifSendResponse");
    expect(stored).not.toBeNull();
    expect(stored).not.toContain("test@example.com");
  });

  it("should not throw or store a response when the request fails", async () => {
    const mutateAsync = mockHook(
      vi.fn().mockRejectedValue(new Error("Request failed (500)"))
    );
    render(<NotificationSendPage />);

    await userEvent.type(getEmailField(), "test@example.com");
    await userEvent.click(sendButton());

    expect(mutateAsync).toHaveBeenCalled();
    expect(sessionStorage.getItem("notifSendResponse")).toBeNull();
    expect(screen.queryByText("E-post bestilt")).not.toBeInTheDocument();
  });

  it("should restore previous response from sessionStorage", () => {
    mockHook();
    sessionStorage.setItem(
      "notifSendResponse",
      JSON.stringify({
        responseBody: "",
        responseHeader: "",
        requestHeader: "",
        requestBody: "",
        statusCode: 400,
        problem: { title: "Validation failed" },
      })
    );
    render(<NotificationSendPage />);

    expect(screen.getByText("Validation failed")).toBeInTheDocument();
  });

  it("should render and clear the stored response when it is not valid JSON", () => {
    mockHook();
    sessionStorage.setItem("notifSendResponse", "{not json");

    render(<NotificationSendPage />);

    expect(sendButton()).toBeInTheDocument();
    expect(sessionStorage.getItem("notifSendResponse")).toBeNull();
  });

  it("should ignore and clear a stored response with an unexpected shape", () => {
    mockHook();
    sessionStorage.setItem(
      "notifSendResponse",
      JSON.stringify({ foo: "bar", problem: { title: "Validation failed" } })
    );

    render(<NotificationSendPage />);

    expect(sendButton()).toBeInTheDocument();
    expect(screen.queryByText("Validation failed")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("notifSendResponse")).toBeNull();
  });
});
