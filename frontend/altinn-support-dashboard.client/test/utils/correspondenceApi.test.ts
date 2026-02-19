import { beforeEach, describe, expect, it, vi } from "vitest";
import * as utils from "../../src/utils/utils";
import { sendCorrespondence } from "../../src/utils/correspondenceApi";


vi.mock("../../src/utils/utils");

describe("correspondenceApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("sendCorrespondence", () => {
        it("should return JSON response on success", async () => {
            const mockResponse = { id: "123", status: "sent" };
            const mockRes = {
                ok: true,
                json: vi.fn().mockResolvedValue(mockResponse),
            };

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            vi.mocked(utils.authorizedPost).mockResolvedValue(mockRes as any);

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = { message: "test" } as any;
            const result = await sendCorrespondence(data);

            expect(result).toEqual(mockResponse);
            expect(utils.authorizedPost).toHaveBeenCalledWith(
                "api/correspondence/upload", data
            );
        });

        it("should throw error with message from response body", async () => {
            const mockRes = {
                ok: false,
                status: 400,
                json: vi.fn().mockResolvedValue({ message: "Bad Request" }),
            };

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            vi.mocked(utils.authorizedPost).mockResolvedValue(mockRes as any);

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = { message: "test" } as any;

            await expect(sendCorrespondence(data)).rejects.toThrow("Bad Request");
        });


        it("should throw error with status when no message in body", async () => {
            const mockRes = {
                ok: false,
                status: 500,
                json: vi.fn().mockResolvedValue({}),
            };

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            vi.mocked(utils.authorizedPost).mockResolvedValue(mockRes as any);

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = { message: "test" } as any;

            await expect(sendCorrespondence(data)).rejects.toThrow("Request failed (500)");
        });
    });
})