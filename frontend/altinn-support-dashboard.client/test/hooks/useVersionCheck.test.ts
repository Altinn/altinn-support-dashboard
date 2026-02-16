import { afterEach, describe, vi, beforeEach, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { VersionInfo, useVersionCheck } from "../../src/hooks/useVersionCheck";


const mockVersionData: VersionInfo = {
    version: "1.0.0",
    releaseDate: "2026-01-01",
    changes: [
        {
            title: "Ny funksjon",
            description: "Beskrivelse av den nye funksjonen",
            details: ["Detalj 1", "Detalj 2"]
        }
    ]
};

describe('useVersionCheck', () => {
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        localStorageMock = {};

        Storage.prototype.getItem = vi.fn((key: string) => localStorageMock[key] || null);
        Storage.prototype.setItem = vi.fn((key: string, value: string) => {
            localStorageMock[key] = value;
        });

        vi.spyOn(console, 'error').mockImplementation(() => {});

        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should start with loading state', () => {
        vi.mocked(globalThis.fetch).mockImplementation(() =>
            new Promise(() => {})
        );

        const { result } = renderHook(() => useVersionCheck());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.shouldShowDialog).toBe(false);
        expect(result.current.versionInfo).toBeNull();
    });
    
    it('should fetch version info and show dialog when no stored version exists', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: true,
            json: async () => mockVersionData,
        } as Response);

        const { result } = renderHook(() => useVersionCheck());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.versionInfo).toEqual(mockVersionData);
        expect(result.current.shouldShowDialog).toBe(true);
        expect(result.current.error).toBeNull();
        expect(globalThis.fetch).toHaveBeenCalledWith('/version.json');
    });

    it('should show dialog when stored version differs from fetched version', async () => {
        localStorageMock['altinn_support_dashboard_version'] = '0.9.0';

        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: true,
            json: async () => mockVersionData,
        } as Response);

        const { result } = renderHook(() => useVersionCheck());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.versionInfo).toEqual(mockVersionData);
        expect(result.current.shouldShowDialog).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('should not show dialog when stored version matches fetched version', () => {
        localStorageMock['altinn_support_dashboard_version'] = '1.0.0';

        const { result } = renderHook(() => useVersionCheck());

        expect(result.current.shouldShowDialog).toBe(false);
    });

    it('should handle fetch error when response is not okay', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: false,
        } as Response);

        const { result } = renderHook(() => useVersionCheck());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe('Kunne ikke laste versjonsinformasjon');
        expect(result.current.versionInfo).toBeNull();
        expect(result.current.shouldShowDialog).toBe(false);
        expect(console.error).toHaveBeenCalledWith(
            'Feil ved henting av versjonsinformasjon:',
            expect.any(Error)
        );
    });

    it('should handle network error', async () => {
        const networkError = new Error('Network error');
        vi.mocked(globalThis.fetch).mockRejectedValue(networkError);

        const { result } = renderHook(() => useVersionCheck());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe('Network error');
        expect(result.current.versionInfo).toBeNull();
        expect(result.current.shouldShowDialog).toBe(false);
        expect(console.error).toHaveBeenCalledWith(
            'Feil ved henting av versjonsinformasjon:',
            networkError
        );
    })
})