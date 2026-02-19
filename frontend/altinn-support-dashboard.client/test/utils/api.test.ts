import { beforeEach, describe, expect, it, vi } from "vitest";
import * as utils from "../../src/utils/utils";
import { 
    fetchOrganizations,
    fetchRolesForOrg,
    fetchSubunits,
    fetchPersonalContacts,
    fetchERoles,
    fetchOfficialContacts,
    fetchSsnFromToken,
    fetchNotificationAddresses,
} from "../../src/utils/api";


vi.mock("../../src/utils/utils");

describe("api", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(utils.getBaseUrl).mockReturnValue("http://localhost/api");
    });

    describe("fetchOrganizations", () => {
        it('should fetch and return organizations array', async () => {
            const mockData = [{ orgNumber: "123", name: "Test Org" }];
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchOrganizations("TEST", "Test query");

            expect(result).toEqual(mockData);
            expect(utils.authorizedFetch).toHaveBeenCalledWith(
                expect.stringContaining("query=Testquery")
            );
        });

        it('should wrap single object in array', async () => {
            const mockData = { orgNumber: "123", name: "Test Org" };
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchOrganizations("TEST", "Test query");

            expect(result).toEqual([mockData]);
        });

        it('should return empty array on 404', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 404,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchOrganizations("TEST", "Test query");

            expect(result).toEqual([]);
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            await expect(fetchOrganizations("TEST", "Test query")).rejects.toThrow("Internal Server Error");
        });
    });

    describe('fetchRolesForOrg', () => {
        it('should fetch and return roles array', async () => {
            const mockData = [{ role: "Admin" }];
            vi.mocked(utils.authorizedPost).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const request = { partyFilter: [{ value: "123" }], value: "test" } as any;
            const result = await fetchRolesForOrg("TEST", request);

            expect(result).toEqual(mockData);
            expect(utils.authorizedPost).toHaveBeenCalledWith(
                expect.stringContaining("/roles"),
                request
            );
        });

        it('should wrap single object in array', async () => {
            const mockData = { role: "Admin" };
            vi.mocked(utils.authorizedPost).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const request = { partyFilter: [{ value: "123" }], value: "test" } as any;
            const result = await fetchRolesForOrg("TEST", request);

            expect(result).toEqual([mockData]);
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedPost).mockResolvedValue({
                ok: false,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            await expect(fetchRolesForOrg("TEST", {} as any)).rejects.toThrow();
        });
    });

    describe('fetchSubunits', () => {
        it('should fetch and transform subunits', async () => {
            const mockData = {
                _embedded: {
                    underenheter: [
                        {
                            navn: "Test org",
                            organisasjonsnummer: "123",
                            overordnetEnhet: "456",
                            organisasjonsform: { kode: "AS" },
                        },
                    ],
                },
            };
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchSubunits("TEST", "123");
            expect(result).toEqual([{
                navn: "Test org",
                organisasjonsnummer: "123",
                overordnetEnhet: "456",
                type: "AS",
            }]);
        });

        it('should return empty array when no embedded data', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue({}),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchSubunits("TEST", "123");
            expect(result).toEqual([]);
        });

        it('should return empty array on 404', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 404,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchSubunits("TEST", "123");
            expect(result).toEqual([]);
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            await expect(fetchSubunits("TEST", "123")).rejects.toThrow("Internal Server Error");
        });
    });

    describe('fetchPersonalContacts', () => {
        it('should fetch and return personal contacts array', async () => {
            const mockData = [{ name: "Test Contact" }];
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchPersonalContacts("TEST", "123");

            expect(result).toEqual(mockData);
        });

        it('should wrap single object in array', async () => {
            const mockData = { name: "Test Contact" };
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchPersonalContacts("TEST", "123");

            expect(result).toEqual([mockData]);
        });

        it('should return empty array on 404', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 404,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchPersonalContacts("TEST", "123");

            expect(result).toEqual([]);
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            await expect(fetchPersonalContacts("TEST", "123")).rejects.toThrow("Internal Server Error");
        });
    });

    describe('fetchERoles', () => {
        it('should fetch and return rollegrupper', async () => {
            const mockData = { rollegrupper: [{ name: "Test Role" }] };
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchERoles("TEST", "123");

            expect(result).toEqual(mockData.rollegrupper);
        });

        it('should return empty array on 404', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 404,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchERoles("TEST", "123");

            expect(result).toEqual([]);
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            await expect(fetchERoles("TEST", "123")).rejects.toThrow("Internal Server Error");
        });
    });

    describe('fetchOfficialContacts', () => {
        it('should fetch and return official contacts array', async () => {
            const mockData = [{ name: "Test Contact" }];
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchOfficialContacts("TEST", "123");

            expect(result).toEqual(mockData);
        });

        it('should wrap single object in array', async () => {
            const mockData = { name: "Test Contact" };
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchOfficialContacts("TEST", "123");

            expect(result).toEqual([mockData]);
        });

        it('should return empty array on 404', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 404,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchOfficialContacts("TEST", "123");

            expect(result).toEqual([]);
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            await expect(fetchOfficialContacts("TEST", "123")).rejects.toThrow("Internal Server Error");
        });
    });

    describe('fetchSsnFromToken', () => {
        it('should fetch and return ssn', async () => {
            const mockData = { socialSecurityNumber: "12345678901" };
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchSsnFromToken("TEST", "token");

            expect(result).toEqual("12345678901");
            expect(utils.authorizedFetch).toHaveBeenCalledWith(
                expect.stringContaining("/personalcontacts/token/ssn")
            );
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            await expect(fetchSsnFromToken("TEST", "token")).rejects.toThrow("Internal Server Error");
        });
    });

    describe('fetchNotificationAddresses', () => {
        it('should fetch and return notification addresses array', async () => {
            const mockData = [{ address: "test@test.no" }];
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchNotificationAddresses("TEST", "123");

            expect(result).toEqual(mockData);
        });

        it('should wrap single object in array', async () => {
            const mockData = { address: "test@test.no" };
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(mockData),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchNotificationAddresses("TEST", "123");

            expect(result).toEqual([mockData]);
        });

        it('should return empty array on 404', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 404,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            const result = await fetchNotificationAddresses("TEST", "123");

            expect(result).toEqual([]);
        });

        it('should throw error on failure', async () => {
            vi.mocked(utils.authorizedFetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValue("Internal Server Error"),
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            }as any);

            await expect(fetchNotificationAddresses("TEST", "123")).rejects.toThrow("Internal Server Error");
        });
    })
})