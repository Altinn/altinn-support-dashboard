import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
    useCurrentDateTime,
    useOrgDetails,
    useOrgSearch,
    useRoles,
    useSsnFromToken,
    useUserDetails,
    useCorrespondencePost
} from "../../src/hooks/hooks";
import * as utils from "../../src/utils/utils";
import * as api from "../../src/utils/api";
import { beforeEach, describe, vi, expect, afterEach, it } from "vitest";
import { toast } from "react-toastify";




vi.mock("../../src/utils/utils");
vi.mock("../../src/utils/api");
vi.mock("../../src/utils/correspondenceApi");
vi.mock("react-toastify");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("hooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("useUserDetails", () => {
        it('should start with default values', () => {

            vi.mocked(utils.fetchUserDetails).mockResolvedValue({
                name: "Test User",
                email: "test@test.no",
            });

            const { result } = renderHook(() => useUserDetails());

            expect(result.current.userName).toBe("Du er ikke innlogget");
            expect(result.current.userEmail).toBe("");
        });

        it('should fetch and set user details', async () => {

            vi.mocked(utils.fetchUserDetails).mockResolvedValue({
                name: "Test User",
                email: "test@test.no",
            });

            const { result } = renderHook(() => useUserDetails());

            await waitFor(() => {
                expect(result.current.userName).toBe("Test User");
                expect(result.current.userEmail).toBe("test@test.no");
            });

            expect(utils.fetchUserDetails).toHaveBeenCalledTimes(1);
        });
    });

    describe('useCurrentDateTime', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        it('should return current date and time', () => {
            const mockDate = new Date("2026-01-01T12:00:00Z");
            vi.setSystemTime(mockDate);

            vi.mocked(utils.getFormattedDateTime).mockReturnValue({
                formattedTime: "12:00:00",
                formattedDate: "01.01.2026",
            });

            const { result } = renderHook(() => useCurrentDateTime());

            expect(result.current.currentDateTime).toEqual(mockDate);
            expect(result.current.formattedTime).toBe("12:00:00");
            expect(result.current.formattedDate).toBe("01.01.2026");
        });

        it('should update every second', () => {
            const initialDate = new Date("2026-01-01T12:00:00Z");

            vi.setSystemTime(initialDate);

            vi.mocked(utils.getFormattedDateTime).
                mockReturnValueOnce({
                    formattedTime: "12:00:00",
                    formattedDate: "01.01.2026",
                })
                .mockReturnValueOnce({
                    formattedTime: "12:00:01",
                    formattedDate: "01.01.2026",
                });

            const { result } = renderHook(() => useCurrentDateTime());

            expect(result.current.currentDateTime).toEqual(initialDate);
            expect(result.current.formattedTime).toBe("12:00:00");
            expect(result.current.formattedDate).toBe("01.01.2026");

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(result.current.currentDateTime).toEqual(new Date("2026-01-01T12:00:01Z"));
            expect(result.current.formattedTime).toBe("12:00:01");
            expect(result.current.formattedDate).toBe("01.01.2026");
        });

        it('should cleanup interval on unmount', () => {
            const { unmount } = renderHook(() => useCurrentDateTime());

            expect(vi.getTimerCount()).toBe(1);

            unmount();

            expect(vi.getTimerCount()).toBe(0);
        });
    });

    describe('useOrgSearch', () => {
        it('should not run query when query string is empty', () => {
            const { result } = renderHook(
                () => useOrgSearch("test-env", ""),
                { wrapper: createWrapper() }
            );

            expect(result.current.orgQuery.isLoading).toBe(false);
            expect(result.current.orgQuery.data).toBeUndefined();
            expect(api.fetchOrganizations).not.toHaveBeenCalled();
        });

        it('should fetch organizations when query is provided', async () => {
            const mockOrgs = [
                { organizationNumber: "123456789", name: "Test Org" },
            ];

            vi.mocked(api.fetchOrganizations).mockResolvedValue(mockOrgs);

            const { result } = renderHook(
                () => useOrgSearch("test-env", "Test"),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.orgQuery.isLoading).toBe(false);
                expect(result.current.orgQuery.data).toEqual(mockOrgs);
            });
        });

        it('should fetch subunits after organizations are loaded', async () => {
            const mockOrgs = [
                { organizationNumber: "123456789", name: "Test Org" },
            ];
            const mockSubunits = [
                { organizationNumber: "987654321", name: "Test Subunit" },
            ];

            vi.mocked(api.fetchOrganizations).mockResolvedValue(mockOrgs);
            vi.mocked(api.fetchSubunits).mockResolvedValue(mockSubunits);

            const { result } = renderHook(
                () => useOrgSearch("test-env", "Test"),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.orgQuery.isLoading).toBe(false);
                expect(result.current.orgQuery.data).toEqual(mockOrgs);
                expect(result.current.subunitQuery.isLoading).toBe(false);
                expect(result.current.subunitQuery.data).toEqual(mockSubunits);
            });
        });

        it('should filter out types from main units', async () => {
            const mockOrgs = [
                { organizationNumber: "123456789", name: "Test Org", type: "BEDR" },
                { organizationNumber: "987654321", name: "Test Org 2", type: "AAFY" },
                { organizationNumber: "555555555", name: "Test Org 3" },
            ];

            vi.mocked(api.fetchOrganizations).mockResolvedValue(mockOrgs);
            vi.mocked(api.fetchSubunits).mockResolvedValue([]);

            const { result } = renderHook(
                () => useOrgSearch("test-env", "Test"),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.subunitQuery.data).toBeDefined();
            })

            expect(api.fetchSubunits).toHaveBeenCalledTimes(1);
            expect(api.fetchSubunits).toHaveBeenCalledWith("test-env", "555555555");
        });
    });

    describe('useOrgDetails', () => {
        it('should not fetch when orgNumber is not provided', () => {
            const { result } = renderHook(
                () => useOrgDetails("test-env"),
                { wrapper: createWrapper() }
            );

            expect(result.current.contactsQuery.isLoading).toBe(false);
            expect(api.fetchPersonalContacts).not.toHaveBeenCalled();
        });

        it('should fetch all org details when orgNumber is provided', async () => {
            vi.mocked(api.fetchPersonalContacts).mockResolvedValue([]);
            vi.mocked(api.fetchERoles).mockResolvedValue([]);
            vi.mocked(api.fetchOfficialContacts).mockResolvedValue([]);
            vi.mocked(api.fetchNotificationAddresses).mockResolvedValue([]);

            const { result } = renderHook(
                () => useOrgDetails("test-env", "123456789"),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.contactsQuery.data).toBeDefined();
            });

            expect(api.fetchPersonalContacts).toHaveBeenCalledWith("test-env", "123456789");
            expect(api.fetchERoles).toHaveBeenCalledWith("test-env", "123456789");
            expect(api.fetchOfficialContacts).toHaveBeenCalledWith("test-env", "123456789");
            expect(api.fetchNotificationAddresses).toHaveBeenCalledWith("test-env", "123456789");
        });
    });

    describe('useRoles', () => {
        it('should not fetch when required parameters are missing', () => {
            const request = { partyFilter: [], value: ""};

            const { result } = renderHook(
                () => useRoles("test-env", request),
                { wrapper: createWrapper() }
            );
            
            expect(result.current.isLoading).toBe(false);
            expect(api.fetchRolesForOrg).not.toHaveBeenCalled();
        });

        it('should fetch roles when valid request is provided', async () => {
            const request = {
                partyFilter: [{ value: "test-party" }],
                value: "some-value",
            };
            const mockRoles = [{ name: "Test Role", details: "Role details" }];

            vi.mocked(api.fetchRolesForOrg).mockResolvedValue(mockRoles);

            const { result } = renderHook(
                () => useRoles("test-env", request),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.data).toEqual(mockRoles);
            });

            expect(api.fetchRolesForOrg).toHaveBeenCalledWith("test-env", request);
        });
    });

    describe('useSsnFromToken', () => {
        it('should not fetch automatically', () => {
            const { result } = renderHook(
                () => useSsnFromToken("test-env"),
                { wrapper: createWrapper() }
            );

            expect(result.current.isLoading).toBe(false);
            expect(api.fetchSsnFromToken).not.toHaveBeenCalled();
        });

        it('should fetch SSN when refetch is called', async () => {
            vi.mocked(api.fetchSsnFromToken).mockResolvedValue("12345678901");

            const { result } = renderHook(
                () => useSsnFromToken("test-env", "test-token"),
                { wrapper: createWrapper() }
            );

            const refectResult = await result.current.refetch();

            await waitFor(() => {
                expect(refectResult.data).toBe("12345678901");
            })

            expect(api.fetchSsnFromToken).toHaveBeenCalledWith("test-env", "test-token");
        });
    });

    describe('useCorrespondencePost', () => {
        it('should show success toast on successful post', async () => {
            const correspondenceApi = await import("../../src/utils/correspondenceApi");

            const mockResponse = { status: "success" };
            vi.mocked(correspondenceApi.sendCorrespondence).mockResolvedValue(mockResponse);

            const { result } = renderHook(
                () => useCorrespondencePost(), 
                { wrapper: createWrapper() }
            );

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const request = { data: "test data" } as any;
            result.current.mutate(request);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(toast.info).toHaveBeenCalledWith("Melding sendt");
        });

        it('should show error toast on failed post', async () => {
            const correspondenceApi = await import("../../src/utils/correspondenceApi");

            const mockError = new Error("Test error");
            vi.mocked(correspondenceApi.sendCorrespondence).mockRejectedValue(mockError);

            const { result } = renderHook(
                () => useCorrespondencePost(), 
                { wrapper: createWrapper() }
            );

            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const request = { data: "test data" } as any;
            result.current.mutate(request);

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(toast.error).toHaveBeenCalledWith('Feil under sending av melding Test error');
        })
    });
})