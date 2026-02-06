import { beforeEach, afterEach, describe, it, vi } from "vitest";
import { fetchVersionData, getVersionInfo } from "../../../src/components/SettingsContent/utils/versionUtils";


const originalEnv = process.env.REACT_APP_ENV_NAME;

describe('versionUtils', () => {
    beforeEach(() => {
        sessionStorage.clear();
        global.fetch = vi.fn();
        vi.clearAllMocks();
    });

    afterEach(() => {
        process.env.REACT_APP_ENV_NAME = originalEnv;
        vi.restoreAllMocks();
    });

    describe('fetchVersionData', () => {
        it('should return cached data from sessionStorage', async () => {
            const mockData = {
                version: '1.0.0',
                releaseDate: '2024-01-01',
                changes: [{
                    title: 'Initial Release',
                    description: 'First version of the app',
                    details: [],
                }]
            };
            sessionStorage.setItem('versionData', JSON.stringify(mockData));

            const data = await fetchVersionData();

            expect(data).toEqual(mockData);
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should fetch from /version.json when cache is empty', async () => {
            const mockData = {
                version: '1.0.0',
                releaseDate: '2024-01-01',
                changes: [{
                    title: 'Initial Release',
                    description: 'First version of the app',
                    details: [],
                }]
            };
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global.fetch as any).mockResolvedValueOnce(new Response(JSON.stringify(mockData), { status: 200 }));

            const data = await fetchVersionData();

            expect(data).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledWith('/version.json');
            const cachedData = sessionStorage.getItem('versionData');
            expect(cachedData).toEqual(JSON.stringify(mockData));
        });

        it('should return default values on fetch error', async () => {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global.fetch as any).mockResolvedValueOnce(new Response('Not Found', { status: 404 }));

            const data = await fetchVersionData();

            expect(data).toEqual({
                version: '0.0.0',
                releaseDate: '',
                changes: []
            });
        });

        it('should handle JSON parse error from fetch', async () => {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global.fetch as any).mockResolvedValueOnce(new Response('Invalid JSON', { status: 200 }));

            const data = await fetchVersionData();

            expect(data).toEqual({
                version: '0.0.0',
                releaseDate: '',
                changes: []
            });

            expect(global.fetch).toHaveBeenCalledWith('/version.json');
        });

        it('should return default values on network error', async () => {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global.fetch as any).mockRejectedValueOnce(new Error('Network Error'));

            const data = await fetchVersionData();

            expect(data).toEqual({
                version: '0.0.0',
                releaseDate: '',
                changes: []
            });
        });

        it('should return default values when cache has malformed JSON', async () => {
            sessionStorage.setItem('versionData', 'Invalid JSON');

            const data = await fetchVersionData();

            expect(data).toEqual({
                version: '0.0.0',
                releaseDate: '',
                changes: []
            });
        });
    });

    describe('getVersionInfo', () => {
        it('should return default values when sessionStorage is empty', () => {
            const info = getVersionInfo();

            expect(info).toEqual({
                versionNumber: '0.0.0',
                versionName: 'Miljø',
                releaseDate: '',
                changes: []
            });
        });

        it('should return cached version data from sessionStorage', () => {
            const mockData = {
                version: '1.0.0',
                releaseDate: '2024-01-01',
                changes: [{
                    title: 'Initial Release',
                    description: 'First version of the app',
                    details: [],
                }]
            };
            sessionStorage.setItem('versionData', JSON.stringify(mockData));

            const info = getVersionInfo();

            expect(info).toEqual({
                versionNumber: '1.0.0',
                versionName: 'Miljø',
                releaseDate: '2024-01-01',
                changes: mockData.changes
            });
        });

        it('should set versionName to "Produksjonsmiljø" when environment is production', () => {
            process.env.REACT_APP_ENV_NAME = 'production';
            const info = getVersionInfo();

            expect(info.versionName).toBe('Produksjonsmiljø');
        });

        it('should set versionName to "Testmiljø" when environment is test', () => {
            process.env.REACT_APP_ENV_NAME = 'test';
            const info = getVersionInfo();
            expect(info.versionName).toBe('Testmiljø');
        });

        it('should set versionName to "Miljø" for unknown environments', () => {
            process.env.REACT_APP_ENV_NAME = 'staging';
            const info = getVersionInfo();
            expect(info.versionName).toBe('Miljø');
        });

        it('should handle JSON parse error in sessionStorage', () => {
            sessionStorage.setItem('versionData', 'Invalid JSON');
            const info = getVersionInfo();

            expect(info).toEqual({
                versionNumber: '0.0.0',
                versionName: 'Miljø',
                releaseDate: '',
                changes: []
            });
        });

        it('should handle missing process.env gracefully', () => {

            const originalProcess = global.process;

            // @ts-expect-error - Testing behaviour when process global is undefined 
            delete global.process;

            const info = getVersionInfo();

            expect(info.versionName).toBe('Miljø'); 

            global.process = originalProcess;
        });
    })

})