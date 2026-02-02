import { afterEach, beforeEach, describe, vi } from "vitest";
import { authorizedFetch } from "../../../src/components/SettingsContent/utils/apiUtils";



describe('authorizedFetch', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should add authorization header from localStorage', async () => {
        localStorage.setItem('authToken', 'localStorageToken');

        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));

        await authorizedFetch('/test-endpoint');

        expect(global.fetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'Basic localStorageToken',
                'Content-Type': 'application/json',
            })
        }));
    });
    it('should add authorization header from sessionStorage when localStorage is empty', async () => {
        sessionStorage.setItem('authToken', 'sessionStorageToken');

        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));

        await authorizedFetch('/test-endpoint');

        expect(global.fetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'Basic sessionStorageToken',
                'Content-Type': 'application/json',
            })
        }));
    });

    it('should prefer localStorage token over sessionStorage token', async () => {
        localStorage.setItem('authToken', 'localStorageToken');
        sessionStorage.setItem('authToken', 'sessionStorageToken');
        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));

        await authorizedFetch('/test-endpoint');

        expect(global.fetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'Basic localStorageToken',
                'Content-Type': 'application/json',
            })
        }));
    });

    it('should merge custom headers with default headers', async () => {
        localStorage.setItem('authToken', 'localStorageToken');

        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));

        await authorizedFetch('/test-endpoint', {
            headers: {
                'Custom-Header': 'CustomValue'
            }
        });

        expect(global.fetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'Basic localStorageToken',
                'Content-Type': 'application/json',
                'Custom-Header': 'CustomValue'
            })
        }));
    });

    it('should return response on successful fetch', async () => {
        localStorage.setItem('authToken', 'localStorageToken');
        const mockResponse = new Response('{"data":"test"}', { status: 200 });

        vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

        const response = await authorizedFetch('/test-endpoint');

        expect(response).toBe(mockResponse);
        expect(response.status).toBe(200);
    });

    it('should throw error when response is not ok', async () => {
        localStorage.setItem('authToken', 'localStorageToken');

        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('Not Found', { status: 404, statusText: 'Not Found' }));

        await expect(authorizedFetch('/test-endpoint')).rejects.toThrow('Not Found: Not Found');
    });

    it('should handle 401 unauthorized error', async () => {
        localStorage.setItem('authToken', 'invalidToken');

        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' }));

        await expect(authorizedFetch('/test-endpoint')).rejects.toThrow('Unauthorized: Unauthorized');
    });

    it('should handle 500 server error', async () => {
        localStorage.setItem('authToken', 'localStorageToken');

        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('Server Error', { status: 500, statusText: 'Internal Server Error' }));

        await expect(authorizedFetch('/test-endpoint')).rejects.toThrow('Internal Server Error: Server Error');
    });

    it('should pass through request options', async () => {
        localStorage.setItem('authToken', 'localStorageToken');

        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));

        await authorizedFetch('/test-endpoint', {
            method: 'POST',
            body: JSON.stringify({ key: 'value' }),
        });

        expect(global.fetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ key: 'value' }),
        }));
    });

    it('should still make request when no auth token exists', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));

        await authorizedFetch('/test-endpoint');

        expect(global.fetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'Basic null',
                'Content-Type': 'application/json',
            })
        }));
    });

    it('should propagate network errors', async () => {
        localStorage.setItem('authToken', 'localStorageToken');

        vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network Error'));

        await expect(authorizedFetch('/test-endpoint')).rejects.toThrow('Network Error');
    })
})