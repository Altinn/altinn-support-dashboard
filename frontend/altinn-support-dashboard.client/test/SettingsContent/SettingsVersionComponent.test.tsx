import { render, screen, waitFor } from "@testing-library/react";
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
        vi.mocked(fetchVersionData).mockResolvedValue({
            version: '1.0.0',
            releaseDate: '',
            changes: [{
                title: 'Initial Release',
                description: 'First version of the app',
                details: [],
            }]
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'Test Environment',
        }));

        render(<SettingsVersionComponent />);

        expect(screen.getByText('Applikasjonsinformasjon: Test App - Versjon 1.0.0')).toBeInTheDocument();
        expect(screen.getByText('Utgivelsesdato: 2024-01-01')).toBeInTheDocument();
    });

    it('should display environment from store', async () => {
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
            version: '1.0.0',
            releaseDate: '',
            changes: []
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'Test Environment',
        }));

        render(<SettingsVersionComponent />);

        expect(screen.getByText('Valgt miljø: Test Environment')).toBeInTheDocument();
    });

    it('should display "Ikke tilgjengelig" when no release date is provided', async () => {
        const { getVersionInfo, fetchVersionData } = await import('../../src/components/SettingsContent/utils/versionUtils');
        const { useAppStore } = await import('../../src/stores/Appstore');

        vi.mocked(getVersionInfo).mockReturnValue({
            versionNumber: '1.0.0',
            versionName: 'Test App',
            releaseDate: '',
            changes: [{
                title: 'Initial Release',
                description: 'First version of the app',
                details: [],
            }],
        });
        vi.mocked(fetchVersionData).mockResolvedValue({
            version: '1.0.0',
            releaseDate: '',
            changes: []
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'Test Environment',
        }));

        render(<SettingsVersionComponent />);

        expect(screen.getByText('Utgivelsesdato: Ikke tilgjengelig')).toBeInTheDocument();
    });

    it('should render links correctly', async () => {
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
            version: '1.0.0',
            releaseDate: '',
            changes: []
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'Test Environment',
        }));

        render(<SettingsVersionComponent />);

        const documentation = screen.getByText('Dokumentasjon').closest('a');
        const contactUs = screen.getByText('Kontakt oss på Slack').closest('a');

        expect(documentation).toHaveAttribute('href', '#');
        expect(contactUs).toHaveAttribute('href', 'https://digdir.slack.com/archives/C07AJ5NQE9E');
    });

    it('should prioritize fetched version over local version', async () => {
        const { getVersionInfo, fetchVersionData } = await import('../../src/components/SettingsContent/utils/versionUtils');
        const { useAppStore } = await import('../../src/stores/Appstore');

        vi.mocked(getVersionInfo).mockReturnValue({
            versionNumber: '1.0.0',
            versionName: 'Test App',
            releaseDate: '2024-01-01',
            changes: []
        });

        vi.mocked(fetchVersionData).mockResolvedValue({
            version: '3.0.0',
            releaseDate: '2024-12-01',
            changes: []
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'Test Environment',
        }));

        render(<SettingsVersionComponent />);

        expect (screen.getByText('Applikasjonsinformasjon: Test App - Versjon 1.0.0')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Applikasjonsinformasjon: Test App - Versjon 3.0.0')).toBeInTheDocument();
            expect(screen.getByText('Utgivelsesdato: 2024-12-01')).toBeInTheDocument();
        });
    })
})