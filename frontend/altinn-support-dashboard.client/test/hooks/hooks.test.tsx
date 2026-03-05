import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  useCurrentDateTime,
  useOrgSearch,
  useRoles,
  useSsnFromToken,
  useUserDetails,
  useCorrespondencePost,
} from "../../src/hooks/hooks";
import * as utils from "../../src/utils/utils";
import * as api from "../../src/utils/api";
import { Organization } from "../../src/models/models";
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useUserDetails", () => {
    it("should start with default values", () => {
      vi.mocked(utils.fetchUserDetails).mockResolvedValue({
        name: "Test User",
        email: "test@test.no",
      });

      const { result } = renderHook(() => useUserDetails());

      expect(result.current.userName).toBe("Du er ikke innlogget");
      expect(result.current.userEmail).toBe("");
    });

    it("should fetch and set user details", async () => {
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

  describe("useCurrentDateTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it("should return current date and time", () => {
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

    it("should update every second", () => {
      const initialDate = new Date("2026-01-01T12:00:00Z");

      vi.setSystemTime(initialDate);

      vi.mocked(utils.getFormattedDateTime)
        .mockReturnValueOnce({
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

      expect(result.current.currentDateTime).toEqual(
        new Date("2026-01-01T12:00:01Z"),
      );
      expect(result.current.formattedTime).toBe("12:00:01");
      expect(result.current.formattedDate).toBe("01.01.2026");
    });

    it("should cleanup interval on unmount", () => {
      const { unmount } = renderHook(() => useCurrentDateTime());

      expect(vi.getTimerCount()).toBe(1);

      unmount();

      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe("useOrgSearch", () => {
    const mockOrgs: Organization[] = [
      {
        name: "Test Org 1",
        organizationNumber: "123456789",
        unitType: "AS",
        isDeleted: false,
      },
      {
        name: "Test Org 2",
        organizationNumber: "987654321",
        unitType: "AS",
        isDeleted: false,
      },
    ];

    it("should not fetch when query is empty", () => {
      const { result } = renderHook(() => useOrgSearch("tt02", ""), {
        wrapper: createWrapper(),
      });

      expect(result.current.orgQuery.isFetching).toBe(false);
      expect(api.fetchOrganizations).not.toHaveBeenCalled();
    });

    it("should fetch organizations when query is provided", async () => {
      vi.mocked(api.fetchOrganizations).mockResolvedValue(mockOrgs);

      const { result } = renderHook(() => useOrgSearch("tt02", "TestOrg"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.orgQuery.isSuccess).toBe(true);
      });

      expect(result.current.orgQuery.data).toEqual(mockOrgs);
      expect(api.fetchOrganizations).toHaveBeenCalledWith("tt02", "TestOrg");
    });

    it("should set isError when fetch fails", async () => {
      vi.mocked(api.fetchOrganizations).mockRejectedValue(
        new Error("Network error"),
      );

      const { result } = renderHook(() => useOrgSearch("tt02", "TestOrg"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.orgQuery.isError).toBe(true);
      });

      expect(result.current.orgQuery.error?.message).toBe("Network error");
    });

    it("should refetch when query changes", async () => {
      const otherOrgs: Organization[] = [
        {
          name: "Other Org",
          organizationNumber: "111111111",
          unitType: "AS",
          isDeleted: false,
        },
      ];

      vi.mocked(api.fetchOrganizations)
        .mockResolvedValueOnce(mockOrgs)
        .mockResolvedValueOnce(otherOrgs);

      const { result, rerender } = renderHook(
        ({ query }) => useOrgSearch("tt02", query),
        { wrapper: createWrapper(), initialProps: { query: "TestOrg" } },
      );

      await waitFor(() => {
        expect(result.current.orgQuery.data).toEqual(mockOrgs);
      });

      rerender({ query: "OtherOrg" });

      await waitFor(() => {
        expect(result.current.orgQuery.data).toEqual(otherOrgs);
      });

      expect(api.fetchOrganizations).toHaveBeenCalledTimes(2);
      expect(api.fetchOrganizations).toHaveBeenNthCalledWith(
        1,
        "tt02",
        "TestOrg",
      );
      expect(api.fetchOrganizations).toHaveBeenNthCalledWith(
        2,
        "tt02",
        "OtherOrg",
      );
    });

    it("should refetch when environment changes", async () => {
      vi.mocked(api.fetchOrganizations).mockResolvedValue(mockOrgs);

      const { result, rerender } = renderHook(
        ({ environment }) => useOrgSearch(environment, "TestOrg"),
        { wrapper: createWrapper(), initialProps: { environment: "tt02" } },
      );

      await waitFor(() => {
        expect(result.current.orgQuery.isSuccess).toBe(true);
      });

      rerender({ environment: "prod" });

      await waitFor(() => {
        expect(api.fetchOrganizations).toHaveBeenCalledWith("prod", "TestOrg");
      });

      expect(api.fetchOrganizations).toHaveBeenCalledTimes(2);
    });

    it("should stop fetching when query becomes empty", async () => {
      vi.mocked(api.fetchOrganizations).mockResolvedValue(mockOrgs);

      const { result, rerender } = renderHook(
        ({ query }) => useOrgSearch("tt02", query),
        { wrapper: createWrapper(), initialProps: { query: "TestOrg" } },
      );

      await waitFor(() => {
        expect(result.current.orgQuery.isSuccess).toBe(true);
      });

      rerender({ query: "" });

      expect(result.current.orgQuery.fetchStatus).toBe("idle");
      expect(api.fetchOrganizations).toHaveBeenCalledTimes(1);
    });
  });

  describe("useRoles", () => {
    it("should not fetch when required parameters are missing", () => {
      const request = { partyFilter: [], value: "" };

      const { result } = renderHook(() => useRoles("test-env", request), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(api.fetchRolesForOrg).not.toHaveBeenCalled();
    });

    it("should fetch roles when valid request is provided", async () => {
      const request = {
        partyFilter: [{ value: "test-party" }],
        value: "some-value",
      };
      const mockRoles = [{ name: "Test Role", details: "Role details" }];

      vi.mocked(api.fetchRolesForOrg).mockResolvedValue(mockRoles);

      const { result } = renderHook(() => useRoles("test-env", request), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockRoles);
      });

      expect(api.fetchRolesForOrg).toHaveBeenCalledWith("test-env", request);
    });
  });

  describe("useSsnFromToken", () => {
    it("should not fetch automatically", () => {
      const { result } = renderHook(() => useSsnFromToken("test-env"), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(api.fetchSsnFromToken).not.toHaveBeenCalled();
    });

    it("should fetch SSN when refetch is called", async () => {
      vi.mocked(api.fetchSsnFromToken).mockResolvedValue("12345678901");

      const { result } = renderHook(
        () => useSsnFromToken("test-env", "test-token"),
        { wrapper: createWrapper() },
      );

      const refectResult = await result.current.refetch();

      await waitFor(() => {
        expect(refectResult.data).toBe("12345678901");
      });

      expect(api.fetchSsnFromToken).toHaveBeenCalledWith(
        "test-env",
        "test-token",
      );
    });
  });

  describe("useCorrespondencePost", () => {
    it("should show success toast on successful post", async () => {
      const correspondenceApi =
        await import("../../src/utils/correspondenceApi");

      const mockResponse = { status: "success" };
      vi.mocked(correspondenceApi.sendCorrespondence).mockResolvedValue(
        mockResponse,
      );

      const { result } = renderHook(() => useCorrespondencePost(), {
        wrapper: createWrapper(),
      });

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request = { data: "test data" } as any;
      result.current.mutate(request);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(toast.info).toHaveBeenCalledWith("Melding sendt");
    });

    it("should show error toast on failed post", async () => {
      const correspondenceApi =
        await import("../../src/utils/correspondenceApi");

      const mockError = new Error("Test error");
      vi.mocked(correspondenceApi.sendCorrespondence).mockRejectedValue(
        mockError,
      );

      const { result } = renderHook(() => useCorrespondencePost(), {
        wrapper: createWrapper(),
      });

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request = { data: "test data" } as any;
      result.current.mutate(request);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Feil under sending av melding Test error",
      );
    });
  });
});
