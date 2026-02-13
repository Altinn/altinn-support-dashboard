import { beforeEach, describe, expect, vi } from "vitest";
import { authorizedFetch } from "../../../../src/utils/utils";


globalThis.fetch = vi.fn();

describe('authorizedFetch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    it('should add auth token from localStorage to request', async () => {
        localStorage.setItem('authToken', 'local-token');
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        await authorizedFetch('/test-endpoint');

        expect(globalThis.fetch).toHaveBeenCalledWith(
            '/test-endpoint',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Basic local-token',
                }),
            })
        );
    });

    it('should handle missing auth token', async () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        await authorizedFetch('/test-endpoint');

        expect(globalThis.fetch).toHaveBeenCalledWith(
            '/test-endpoint',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Basic null',
                }),
            })
        );
    });

    it('should pass through request options', async () => {
        localStorage.setItem('authToken', 'local-token');

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        await authorizedFetch('/test-endpoint', {
            method: 'POST',
            body: JSON.stringify({ key: 'value' }),
        });

        expect(globalThis.fetch).toHaveBeenCalledWith(
            '/test-endpoint',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ key: 'value' }),
                headers: expect.objectContaining({
                    Authorization: 'Basic local-token',
                    'Content-Type': 'application/json',
                }),
            })
        );
    });

    it('should prefer localStorage over sessionStorage token', async () => {
        localStorage.setItem('authToken', 'local-token');
        sessionStorage.setItem('authToken', 'session-token');

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        await authorizedFetch('/test-endpoint');

        expect(globalThis.fetch).toHaveBeenCalledWith(
            '/test-endpoint',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Basic local-token',
                }),
            })
        );
    });

    it('should return the response on success', async () => {
        localStorage.setItem('authToken', 'local-token');

        const mockResponse = {
            ok: true,
            json: async () => ({ data: 'test' }),
        };

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis.fetch as any).mockResolvedValue(mockResponse);

        const response = await authorizedFetch('/test-endpoint');

        expect(response).toBe(mockResponse);
    });

    it('should use sessionStorage token when localStorage is empty', async () => {
        sessionStorage.setItem('authToken', 'session-token');

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        await authorizedFetch('/test-endpoint');

        expect(globalThis.fetch).toHaveBeenCalledWith(
            '/test-endpoint',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Basic session-token',
                }),
            })
        );
    });

    it('should merge custom headers with auth headers', async () => {
        localStorage.setItem('authToken', 'local-token');

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        await authorizedFetch('/test-endpoint', {
            headers: { 'X-Custom-Header': 'custom-value' },
        });

        expect(globalThis.fetch).toHaveBeenCalledWith(
            '/test-endpoint',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Basic local-token',
                    'X-Custom-Header': 'custom-value',
                }),
            })
        );
    });
})