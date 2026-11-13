import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendTestEmail } from "../../src/utils/notificationSendApi";

describe("notificationSendApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("authToken", "test-token");
  });

  const request = {
    emailAddress: "test@example.com",
    subject: "Subject",
    body: "Body",
  };

  describe("sendTestEmail", () => {
    it("should POST to the environment-specific URL and return JSON", async () => {
      const mockResponse = {
        statusCode: "201",
        result: { notificationOrderId: "abc" },
      };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await sendTestEmail({ environment: "TT02", request });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "/api/TT02/notification-send/email",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify(request),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Basic test-token",
          }),
        })
      );
    });

    it("should map PROD to the Production route", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      await sendTestEmail({ environment: "PROD", request });

      expect(vi.mocked(fetch).mock.calls[0][0]).toBe(
        "/api/Production/notification-send/email"
      );
    });

    it("should throw error with message from response body", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: "Not a valid email" }),
      } as unknown as Response);

      await expect(
        sendTestEmail({ environment: "TT02", request })
      ).rejects.toThrow("Not a valid email");
    });

    it("should throw error with status when body has no message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      await expect(
        sendTestEmail({ environment: "TT02", request })
      ).rejects.toThrow("Request failed (500)");
    });

    it("should throw error with status when body is not JSON", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 502,
        json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
      } as unknown as Response);

      await expect(
        sendTestEmail({ environment: "TT02", request })
      ).rejects.toThrow("Request failed (502)");
    });
  });
});
