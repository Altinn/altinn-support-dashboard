import { fireEvent, render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import SidebarEnvToggle from "../../src/components/Sidebar/SidebarEnvToggle";



vi.mock('../../src/stores/Appstore', () => ({
    useAppStore: vi.fn()
}));

vi.mock('../../src/hooks/ansattportenHooks', () => ({
    useAuthDetails: vi.fn()
}));

describe('SidebarEnvToggle', () => {
    const mockSetEnvironment = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render select with current environment', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'PROD',
            setEnvironment: mockSetEnvironment
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: false,
                userPolicies: [],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('PROD');
    });

    it('should call setEnvironment on environment change', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'PROD',
            setEnvironment: mockSetEnvironment
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: false,
                userPolicies: [],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'TT02' } });

        expect(mockSetEnvironment).toHaveBeenCalledWith('TT02');
    });

    it('should show both options when ansattportenActive is false', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'PROD',
            setEnvironment: mockSetEnvironment
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: false,
                userPolicies: [],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(screen.getByRole('option', { name: 'PROD' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'TT02' })).toBeInTheDocument();
    });

    it('should only show PROD when user has only ProductionAuthenticated policy', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'PROD',
            setEnvironment: mockSetEnvironment
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: true,
                userPolicies: ['ProductionAuthenticated'],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(screen.getByRole('option', { name: 'PROD' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'TT02' })).not.toBeInTheDocument();
    });

    it('should only show TT02 when user only has TT02Authenticated policy', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'TT02',
            setEnvironment: mockSetEnvironment
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: true,
                userPolicies: ['TT02Authenticated'],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(screen.queryByRole('option', { name: 'PROD' })).not.toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'TT02' })).toBeInTheDocument();
    });

    it('should show neither option when user has no relevant policies', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'PROD',
            setEnvironment: mockSetEnvironment
        }));

        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: true,
                userPolicies: ['SomeOtherPolicy'],  
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(screen.queryByRole('option', { name: 'PROD' })).not.toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'TT02' })).not.toBeInTheDocument();
    });

    it('should show both options if user has both policies', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'PROD',
            setEnvironment: mockSetEnvironment
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: true,
                userPolicies: ['ProductionAuthenticated', 'TT02Authenticated'],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(screen.getByRole('option', { name: 'PROD' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'TT02' })).toBeInTheDocument();
    });

    it('should switch to PROD if on TT02 without TT02Athenticated', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        let currentEnvironment = 'TT02';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            get environment() {
                return currentEnvironment;
            },
            setEnvironment: (env: string) => {
                currentEnvironment = env;
                mockSetEnvironment(env);
            }
        }));

        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: true,
                userPolicies: ['ProductionAuthenticated'],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(mockSetEnvironment).toHaveBeenCalledWith('PROD');
    });

    it('should switch to TT02 if on PROD without ProductionAuthenticated', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');
        let currentEnvironment = 'PROD';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            get environment() {
                return currentEnvironment;
            },
            setEnvironment: (env: string) => {
                currentEnvironment = env;
                mockSetEnvironment(env);
            }
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: true,
                userPolicies: ['TT02Authenticated'],
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(mockSetEnvironment).toHaveBeenCalledWith('TT02');
    });

    it('should not switch environment when userPolicies is null', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            environment: 'TT02',
            setEnvironment: mockSetEnvironment
        }));
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                ansattportenActive: true,
                userPolicies: null,
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org'
            },
            isLoading: false
        }as unknown as ReturnType<typeof useAuthDetails>);

        render(<SidebarEnvToggle />);

        expect(mockSetEnvironment).not.toHaveBeenCalled();
    });
});