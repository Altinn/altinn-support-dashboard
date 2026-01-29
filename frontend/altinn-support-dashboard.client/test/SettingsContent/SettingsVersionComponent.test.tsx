import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import SettingsVersionComponent from "../../src/components/SettingsContent/SettingsVersionComponent";




vi.mock('../../src/components/SettingsContent/utils/versionUtils', () => ({          
    getVersionInfo: vi.fn(),
    fetchVersionData: vi.fn(),
}));

vi.mock('../../src/stores/Appstore', () => ({
    useAppStore: vi.fn(),
}));

describe('SettingsVersionComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render version information correctly', async () => {
        const { getVersionInfo, fetchVersionData } = await import('../../src/components/SettingsContent/utils/versionUtils');
        const { useAppStore } = await import('../../src/stores/Appstore');

        vi.mocked(getVersionInfo).mockReturnValue({
            versionNumber: '1.0.0',
            versionName: 'Test App',
            releaseDate: '2024-01-01',
            changes: [{
                title: 'Initial Release',
                description: 'First version of the app',
                details: [],
            }],
        });
        vi.mocked(fetchVersionData).mockResolvedValue(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'Test Environment',
        }));

        render(<SettingsVersionComponent />);

        expect(screen.getByText('Applikasjonsinformasjon: Test App - Versjon 1.0.0')).toBeInTheDocument();
        expect(screen.getByText('Utgivelsesdato: 2024-01-01')).toBeInTheDocument();
    });

    it('should render fetched version data when available', async () => {
        const { getVersionInfo, fetchVersionData } = await import('../../src/components/SettingsContent/utils/versionUtils');
        const { useAppStore } = await import('../../src/stores/Appstore');

        vi.mocked(getVersionInfo).mockReturnValue({
            versionNumber: '1.0.0',
            versionName: 'Test App',
            releaseDate: '2024-01-01',
            changes: [{
                title: 'Initial Release',
                description: 'First version of the app',
                details: [],
            }],
        });

        vi.mocked(fetchVersionData).mockResolvedValue({
            version: '2.0.0',
            releaseDate: '2024-06-01',
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'Test Environment',
        }));

        render(<SettingsVersionComponent />);


    });


})