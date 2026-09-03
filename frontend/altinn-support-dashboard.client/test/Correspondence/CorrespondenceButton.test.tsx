/**
 * @vitest-environment jsdom
 */
import { describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import CorrespondenceButton from "../../src/components/Correspondence/CorrespondenceButton";
import {
  CorrespondenceUploadRequest,
  NotificationChannel,
} from "../../src/models/correspondenceModels";
import { useCorrespondencePost } from "../../src/hooks/hooks";

vi.mock("../../src/hooks/hooks", () => ({
  useCorrespondencePost: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

const validAttachment = new File(["content"], "test.txt", { type: "text/plain" });

const defaultProps = {
  recipientType: "person" as const,
  recipientIdentifier: "12345678901",
  title: "Test",
  summary: "test",
  body: "test",
  confirmationNeeded: false,
  notificationChannel: NotificationChannel.None,
  resourceType: "",
  dueDate: "",
  attachments: [validAttachment],
  setResponseMessage: vi.fn(),
};

describe("CorrespondenceButton", () => {
  it("should render button with correct label", () => {
    const mockMutateAsync = vi.fn();
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    render(<CorrespondenceButton {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /Send melding/i })
    ).toBeInTheDocument();
  });

  it("should call post mutation with correct data when button is clicked", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({ success: true });
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    render(
      <CorrespondenceButton
        {...defaultProps}
        title="Test"
        summary="Test"
        body="Test"
        confirmationNeeded={true}
        notificationChannel={NotificationChannel.EmailAndSms}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Send melding/i })
    );

    const payload: CorrespondenceUploadRequest = {
      recipients: ["urn:altinn:person:identifier-no:12345678901"],
      correspondence: {
        dueDateTime: undefined,
        isConfirmationNeeded: true,
        resourceType: "",
        notification: {
          notificationTemplate: "GenericAltinnMessage",
          notificationChannel: NotificationChannel.EmailAndSms,
        },
        content: {
          messageTitle: "Test",
          messageBody: "Test",
          messageSummary: "Test",
        },
      },
    };

    expect(mockMutateAsync).toHaveBeenCalledWith({
      request: payload,
      attachments: [validAttachment],
    });
  });

  it("should call setResponseMessage with response after successful post", async () => {
    const mockResponse = { success: true };
    const mockMutateAsync = vi.fn().mockResolvedValue(mockResponse);
    const mockSetResponseMessage = vi.fn();
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    render(
      <CorrespondenceButton
        {...defaultProps}
        setResponseMessage={mockSetResponseMessage}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Send melding/i })
    );

    expect(mockSetResponseMessage).toHaveBeenCalledWith(mockResponse);
  });

  it("should disable button when recipient is invalid", () => {
    const mockMutateAsync = vi.fn();
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    render(
      <CorrespondenceButton
        {...defaultProps}
        recipientIdentifier=""
      />
    );

    expect(
      screen.getByRole("button", { name: /Send melding/i })
    ).toBeDisabled();
  });

  it("should disable button when attachments are missing", () => {
    const mockMutateAsync = vi.fn();
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    render(
      <CorrespondenceButton
        {...defaultProps}
        attachments={[]}
      />
    );

    expect(
      screen.getByRole("button", { name: /Send melding/i })
    ).toBeDisabled();
  });

  it("should include resourceType in the request", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    render(
      <CorrespondenceButton
        {...defaultProps}
        resourceType="confidentiality"
        dueDate="2026-01-26"
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Send melding/i })
    );

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({
          correspondence: expect.objectContaining({
            resourceType: "confidentiality",
          }),
        }),
      })
    );
  });

  it("should include dueDate in the request", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    render(
      <CorrespondenceButton
        {...defaultProps}
        resourceType="default"
        dueDate="2026-01-26"
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Send melding/i })
    );

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({
          correspondence: expect.objectContaining({
            dueDateTime: "2026-01-26",
          }),
        }),
      })
    );
  });

  it("should save response to sessionStorage", async () => {
    const mockResponse = { success: true };
    const mockMutateAsync = vi.fn().mockResolvedValue(mockResponse);
    vi.mocked(useCorrespondencePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useCorrespondencePost>);

    const setItemSpy = vi.spyOn(window.sessionStorage.__proto__, "setItem");

    render(<CorrespondenceButton {...defaultProps} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Send melding/i })
    );

    expect(setItemSpy).toHaveBeenCalledWith(
      "responseMessage",
      JSON.stringify(mockResponse)
    );

    setItemSpy.mockRestore();
  });
});
