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

// MessageInputField labels are not linked to inputs, so fields are picked by order
const getFields = () => {
  const [email, subject, body] = screen.getAllByRole("textbox");
  return { email, subject, body };
};

const sendButton = () => screen.getByRole("button", { name: /Send e-mail/i });

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  useAppStore.setState({ environment: "TT02" });
});

describe("NotificationSendPage", () => {
  it("should render fields, warning and a disabled button initially", () => {
    mockHook();
    render(<NotificationSendPage />);

    expect(screen.getAllByRole("textbox")).toHaveLength(3);
    expect(screen.getByText(/ekte mottaker/)).toBeInTheDocument();
    expect(sendButton()).toBeDisabled();
  });

  it("should show error and keep button disabled for invalid email", async () => {
    mockHook();
    render(<NotificationSendPage />);

    await userEvent.type(getFields().email, "not-an-email");

    expect(screen.getByText("Ugyldig e-postadresse")).toBeInTheDocument();
    expect(sendButton()).toBeDisabled();
  });

  it("should enable button for valid email", async () => {
    mockHook();
    render(<NotificationSendPage />);

    await userEvent.type(getFields().email, "test@example.com");

    expect(
      screen.queryByText("Ugyldig e-postadresse")
    ).not.toBeInTheDocument();
    expect(sendButton()).toBeEnabled();
  });

  it("should disable button while request is pending", () => {
    mockHook(vi.fn(), true);
    localStorage.setItem("notifSendEmail", "test@example.com");
    render(<NotificationSendPage />);

    expect(sendButton()).toBeDisabled();
  });

  it("should call mutation with environment and trimmed request", async () => {
    const mutateAsync = mockHook(
      vi.fn().mockResolvedValue({ statusCode: "201" })
    );
    useAppStore.setState({ environment: "PROD" });
    render(<NotificationSendPage />);

    const { email, subject, body } = getFields();
    await userEvent.type(email, "  test@example.com  ");
    await userEvent.type(subject, "Hello");
    await userEvent.type(body, "World");
    await userEvent.click(sendButton());

    expect(mutateAsync).toHaveBeenCalledWith({
      environment: "PROD",
      request: {
        emailAddress: "test@example.com",
        subject: "Hello",
        body: "World",
      },
    });
  });

  it("should persist input values to localStorage", async () => {
    mockHook();
    render(<NotificationSendPage />);

    const { email, subject, body } = getFields();
    await userEvent.type(email, "a@b.no");
    await userEvent.type(subject, "S");
    await userEvent.type(body, "B");

    expect(localStorage.getItem("notifSendEmail")).toBe("a@b.no");
    expect(localStorage.getItem("notifSendSubject")).toBe("S");
    expect(localStorage.getItem("notifSendBody")).toBe("B");
  });

  it("should prefill fields from localStorage", () => {
    mockHook();
    localStorage.setItem("notifSendEmail", "saved@example.com");
    localStorage.setItem("notifSendSubject", "Saved subject");
    localStorage.setItem("notifSendBody", "Saved body");
    render(<NotificationSendPage />);

    const { email, subject, body } = getFields();
    expect(email).toHaveValue("saved@example.com");
    expect(subject).toHaveValue("Saved subject");
    expect(body).toHaveValue("Saved body");
  });

  it("should show summary and store response after successful send", async () => {
    const response = {
      responseBody: "{}",
      responseHeader: "",
      requestHeader: "",
      requestBody: "{}",
      statusCode: "201",
      result: { notificationOrderId: "order-123" },
    };
    mockHook(vi.fn().mockResolvedValue(response));
    localStorage.setItem("notifSendEmail", "test@example.com");
    render(<NotificationSendPage />);

    await userEvent.click(sendButton());

    expect(await screen.findByText("E-post bestilt")).toBeInTheDocument();
    expect(screen.getByText("order-123")).toBeInTheDocument();
    expect(
      JSON.parse(sessionStorage.getItem("notifSendResponse")!)
    ).toEqual(response);
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
        statusCode: "400",
        problem: { title: "Validation failed" },
      })
    );
    render(<NotificationSendPage />);

    expect(screen.getByText("Validation failed")).toBeInTheDocument();
  });
});
