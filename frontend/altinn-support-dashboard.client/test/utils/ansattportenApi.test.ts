import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as utils from "../../src/utils/utils";
import { 
    fetchAuthDetails,
    initiateAiDevSignIn,
    initiateSignIn,
    initiateSignOut,
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

        it('should return default auth details on error', async () => {
            vi.mocked(utils.authorizedFetch).mockRejectedValue(
                new Error("Network error")
            );

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

        it('should redirect to login when ansattportenActive is true', async () => {
            const mockAuthDetails = {
                isLoggedIn: false,
                name: "",
                ansattportenActive: true,
                userPolicies: [],
                orgName: "",
            };

            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockAuthDetails),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            await initiateSignIn("/dashboard");

            expect(window.location.href).toBe(
                "http://localhost/api/auth/login?redirectTo=/dashboard"
            );
        });

        it('should not redirect when ansattportenActive is false', async () => {
            const mockAuthDetails = {
                isLoggedIn: false,
                name: "",
                ansattportenActive: false,
                userPolicies: [],
                orgName: "",
            };

            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockAuthDetails),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            await initiateSignIn("/dashboard");

            expect(window.location.href).toBe("");
        });
    });

    describe('initiateAiDevSignIn', () => {
    //should we remove this? since aiDev is removed?
        beforeEach(() => {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any).location;
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).location = { href: "" };
        });

        it('should redirect to AAD logout', async () => {
            await initiateAiDevSignIn("/dashboard");

            expect(window.location.href).toBe(
                "/.auth/login/aad?post_login_redirect_uri=/dashboard"
            );
        });
    });

    describe('initiateSignOut', () => {
        beforeEach(() => {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any).location;
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).location = { href: "" };
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should redirect to logout when ansattportenActive is true', async () => {
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

            await initiateSignOut("/");

            expect(window.location.href).toBe(
                "http://localhost/api/auth/logout?redirectTo=/"
            );
        });

        it('should redirect to AAD logout when ansattportenActive is false', async () => {
            const mockAuthDetails = {
                isLoggedIn: true,
                name: "Test User",
                ansattportenActive: false,
                userPolicies: ["policy1", "policy2"],
                orgName: "Test Org",
            };

            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockAuthDetails),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            await initiateSignOut("/");

            expect(window.location.href).toBe(
                "/.auth/logout?post_logout_redirect_uri=/.auth/login/aad?post_login_redirect_uri=/dashboard"
            );
        });
    });
})