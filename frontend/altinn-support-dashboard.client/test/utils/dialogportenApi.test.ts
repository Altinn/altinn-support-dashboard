import { beforeEach, describe, expect, it, vi } from "vitest";
import * as utils from "../../src/utils/utils";
import { fetchDialogDetails } from "../../src/utils/dialogportenApi";

vi.mock("../../src/utils/utils");

describe("dialogportenApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(utils.getBaseUrl).mockReturnValue("http://localhost/api/TT02");
  });

  describe("fetchDialogDetails", () => {
    it("should fetch and return dialog details on success", async () => {
      const mockData = { id: "d1", deletedAt: null };
      vi.mocked(utils.authorizedFetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockData),
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await fetchDialogDetails("TT02", "d1");

      expect(result).toEqual(mockData);
      expect(utils.authorizedFetch).toHaveBeenCalledWith(
        "http://localhost/api/TT02/dialogporten/dialogs/d1"
      );
    });

    it("should throw a not-found message on 404", async () => {
      vi.mocked(utils.authorizedFetch).mockResolvedValue({
        ok: false,
        status: 404,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      await expect(fetchDialogDetails("TT02", "d1")).rejects.toThrow(
        "Fant ingen dialog med denne IDen"
      );
    });

    it("should throw response text on other errors", async () => {
      vi.mocked(utils.authorizedFetch).mockResolvedValue({
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue("Internal error"),
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      await expect(fetchDialogDetails("TT02", "d1")).rejects.toThrow(
        "Internal error"
      );
    });

    it("should throw a fallback message when the error body is empty", async () => {
      vi.mocked(utils.authorizedFetch).mockResolvedValue({
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue(""),
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      await expect(fetchDialogDetails("TT02", "d1")).rejects.toThrow(
        "Feil ved henting av dialog"
      );
    });
  });
});
