import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendCorrespondence } from "../../src/utils/correspondenceApi";

describe("correspondenceApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("authToken", "test-token");
  });

  describe("sendCorrespondence", () => {
    it("should return JSON response on success", async () => {
      const mockResponse = { id: "123", status: "sent" };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const request = {
        recipients: ["urn:altinn:person:identifier-no:12345678901"],
        correspondence: { resourceType: "default" },
      };
      const attachments = [
        new File(["content"], "test.txt", { type: "text/plain" }),
      ];

      const result = await sendCorrespondence({ request, attachments });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "api/correspondence/upload",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: "Basic test-token",
          },
        })
      );

      const formData = vi.mocked(fetch).mock.calls[0][1]?.body as FormData;
      expect(formData.get("request")).toBe(JSON.stringify(request));
      expect(formData.getAll("attachments")).toHaveLength(1);
    });

    it("should throw error with message from response body", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: "Bad Request" }),
      } as unknown as Response);

      const request = {
        recipients: ["urn:altinn:person:identifier-no:12345678901"],
        correspondence: { resourceType: "default" },
      };
      const attachments = [
        new File(["content"], "test.txt", { type: "text/plain" }),
      ];

      await expect(sendCorrespondence({ request, attachments })).rejects.toThrow(
        "Bad Request"
      );
    });

    it("should throw error with status when no message in body", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      const request = {
        recipients: ["urn:altinn:person:identifier-no:12345678901"],
        correspondence: { resourceType: "default" },
      };
      const attachments = [
        new File(["content"], "test.txt", { type: "text/plain" }),
      ];

      await expect(sendCorrespondence({ request, attachments })).rejects.toThrow(
        "Request failed (500)"
      );
    });
  });
});
