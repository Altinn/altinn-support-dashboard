import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, vi, expect } from "vitest";
import * as ansattportenApi from "../../src/utils/ansattportenApi";
import { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuthDetails } from "../../src/hooks/ansattportenHooks";




vi.mock("../../src/utils/ansattportenApi");

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

describe("useAuthDetails", () => {
    it('should fetch auth details successfully', async () => {
        const mockAuthDetails = {
            isLoggedIn: true,
            name: "Test User",
            orgName: "Test Org",
            ansattportenActive: true,
            userPolicies: ["policy1", "policy2"],
        };

        vi.mocked(ansattportenApi.fetchAuthDetails).mockResolvedValue(mockAuthDetails);

        const { result } = renderHook(() => useAuthDetails(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockAuthDetails);
        expect(ansattportenApi.fetchAuthDetails).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        const mockError = new Error("Failed to fetch auth details");
        vi.mocked(ansattportenApi.fetchAuthDetails).mockRejectedValue(mockError);

        const { result } = renderHook(() => useAuthDetails(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(mockError);
    });

    it('should start in loading state', async () => {
        vi.mocked(ansattportenApi.fetchAuthDetails).mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(() => useAuthDetails(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
    }); 
})