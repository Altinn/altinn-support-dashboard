import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as utils from "../../src/utils/utils";
import { 
    fetchAuthDetails,
} from "../../src/utils/ansattportenApi";


vi.mock("../../src/utils/utils");

describe("ansattportenApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(utils.getBaseUrl).mockReturnValue("http://localhost/api");
    });

    describe("fetchAuthDetails", ()  => {
        it("should return auth details on success", async () => {
            const mockAuthDetails = {
                isLoggedIn: true,
                name: "Test User",
                ansattportenActive: true,
                userPolicies: ["policy1", "policy2"],
                orgName: "Test Org",
            };

            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockAuthDetails),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            const result = await fetchAuthDetails();
            expect(result).toEqual(mockAuthDetails);
            expect(utils.authorizedFetch).toHaveBeenCalledWith(
                "http://localhost/api/auth/auth-status"
            );
        });

        it('should return default auth details when response is not ok', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            const result = await fetchAuthDetails();

            expect(result).toEqual({
                isLoggedIn: false,
                name: "",
                ansattportenActive: true,
                userPolicies: [],
                orgName: "",
            });
        });
    });

    describe('initiateSignIn', () => {
        beforeEach(() => {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any).location;
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).location = { href: "" };
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });
    })
})