import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import Sidebar from "../../src/components/Sidebar/Sidebar";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";


vi.mock('../../src/assets/logo.png', () => ({
    default: 'logo.png'
}));

vi.mock('/asd_128_white.png', () => ({
    default: 'asd_128_white.png'
}));

vi.mock('../../src/components/Sidebar/hooks/useSidebarDrag', () => ({
    useSidebarDrag: vi.fn()
}));

vi.mock('../../src/hooks/hooks', () => ({
    useUserDetails: vi.fn()
}));

vi.mock('../../src/hooks/ansattportenHooks', () => ({
    useAuthDetails: vi.fn()
}));

vi.mock('../../src/utils/ansattportenApi', () => ({
    initiateSignOut: vi.fn()
}));

vi.mock('../../src/components/Sidebar/NavItem', () => ({
    default: ({ title, isCollapsed }: { title: string, isCollapsed: boolean }) => (
        isCollapsed ? null : <div>{title}</div>
    )
}));

vi.mock('../../src/components/Sidebar/SidebarDateTime', () => ({
    default: () => <div>DateTime</div>
}));

vi.mock('../../src/components/Sidebar/SidebarEnvToggle', () => ({
    default: () => <div>EnvToggle</div>
}));

describe('Sidebar', () => {
    const mockToggleCollapse = vi.fn(); 
    const mockHandleDragStart = vi.fn();

    beforeEach(async () => {
        vi.clearAllMocks();

        const { useSidebarDrag } = await import('../../src/components/Sidebar/hooks/useSidebarDrag');
        const { useUserDetails } = await import('../../src/hooks/hooks');
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');

        vi.mocked(useSidebarDrag).mockReturnValue({
            isCollapsed: false,
            toggleCollapse: mockToggleCollapse,
            handleDragStart: mockHandleDragStart
        });

        vi.mocked(useUserDetails).mockReturnValue({
            userName: 'Old User',
            userEmail: 'test@test.no'
        });
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                isLoggedIn: true,
                name: 'Test User',
                orgName: 'Test Org',
                ansattportenActive: true,
                userPolicies: []
            },
            isLoading: false
        } as unknown as ReturnType<typeof useAuthDetails>);
    });

    it('should not render when not logged in', async () => {
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                isLoggedIn: false
            },
            isLoading: false
        } as unknown as ReturnType<typeof useAuthDetails>);

        const { container } = render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(container.firstChild).toBeNull();
    });

    it('should not render when loading', async () => {
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                isLoggedIn: true
            },
            isLoading: true
        } as unknown as ReturnType<typeof useAuthDetails>);

        const { container } = render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(container.firstChild).toBeNull();
    });

    it('should render all navItems when expanded', () => {

        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Oppslag')).toBeInTheDocument();
        expect(screen.getByText('Manuelt rollesøk')).toBeInTheDocument();
        expect(screen.getByText('Melding')).toBeInTheDocument();
        expect(screen.getByText('Innstillinger')).toBeInTheDocument();   
    });

    it('should show collapse button correctly when expanded', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Minimer sidepanel')).toBeInTheDocument();
    });

    it('should not show titles when collapsed', async () => {
        const { useSidebarDrag } = await import('../../src/components/Sidebar/hooks/useSidebarDrag');
        vi.mocked(useSidebarDrag).mockReturnValue({
            isCollapsed: true,
            toggleCollapse: mockToggleCollapse,
            handleDragStart: mockHandleDragStart
        });

        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.queryByText('Oppslag')).not.toBeInTheDocument();
        expect(screen.queryByText('Manuelt rollesøk')).not.toBeInTheDocument();
        expect(screen.queryByText('Melding')).not.toBeInTheDocument();
        expect(screen.queryByText('Innstillinger')).not.toBeInTheDocument();   
        expect(screen.queryByText('Minimer sidepanel')).not.toBeInTheDocument();
    });

    it('should call toggleCollapse when collapse is clicked', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const collapseButton = screen.getByRole('button', { name: /Minimer sidepanel/i });
        await user.click(collapseButton);

        expect(mockToggleCollapse).toHaveBeenCalled();
    });

    it('should show auth name when expanded', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should not show user info when collapsed', async () => {
        const { useSidebarDrag } = await import('../../src/components/Sidebar/hooks/useSidebarDrag');
        vi.mocked(useSidebarDrag).mockReturnValue({
            isCollapsed: true,
            toggleCollapse: mockToggleCollapse,
            handleDragStart: mockHandleDragStart
        });

        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    it('should show old userName when auth name is unavailable', async () => {
        const { useAuthDetails } = await import('../../src/hooks/ansattportenHooks');
        vi.mocked(useAuthDetails).mockReturnValue({
            data: {
                isLoggedIn: true,
                name: undefined,
                orgName: 'Test Org',
                ansattportenActive: true,
                userPolicies: []
            },
            isLoading: false
        } as unknown as ReturnType<typeof useAuthDetails>);

        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Old User')).toBeInTheDocument();
    });

    it('should not show SidebarEnvToggle when collapsed', async () => {
        const { useSidebarDrag } = await import('../../src/components/Sidebar/hooks/useSidebarDrag');
        vi.mocked(useSidebarDrag).mockReturnValue({
            isCollapsed: true,
            toggleCollapse: mockToggleCollapse,
            handleDragStart: mockHandleDragStart
        });

        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.queryByText('EnvToggle')).not.toBeInTheDocument();
    });

    it('should show SidebarEnvToggle when expanded', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('EnvToggle')).toBeInTheDocument();
    });

    it('should not show DateTime and Logout when collapsed', async () => {
        const { useSidebarDrag } = await import('../../src/components/Sidebar/hooks/useSidebarDrag');
        vi.mocked(useSidebarDrag).mockReturnValue({
            isCollapsed: true,
            toggleCollapse: mockToggleCollapse,
            handleDragStart: mockHandleDragStart
        });

        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.queryByText('DateTime')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Logg ut/i })).not.toBeInTheDocument();
    });

    it('should show DateTime and Logout when expanded', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('DateTime')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logg ut/i })).toBeInTheDocument();
    });

    it('should call initiateSignOut when logout is clicked', async () => {
        const user = userEvent.setup();
        const { initiateSignOut } = await import('../../src/utils/ansattportenApi');

        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const logoutButton = screen.getByRole('button', { name: /Logg ut/i });
        await user.click(logoutButton);

        expect(initiateSignOut).toHaveBeenCalledWith('/signin');
    });

    it('should show correct logo when collapsed', async () => {
        const { useSidebarDrag } = await import('../../src/components/Sidebar/hooks/useSidebarDrag');
        vi.mocked(useSidebarDrag).mockReturnValue({
            isCollapsed: true,
            toggleCollapse: mockToggleCollapse,
            handleDragStart: mockHandleDragStart
        });

        const { container } = render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', expect.stringContaining('asd_128_white.png'));
    });

    it('should show correct logo when expanded', () => {
        const { container } = render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', expect.stringContaining('logo.png'));
    });

    it('should call handleDragStart when dragged', async () => {
        const { container } = render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const dragHandle = container.querySelector('[class*="dragHandle"]');
        fireEvent.mouseDown(dragHandle!);

        expect(mockHandleDragStart).toHaveBeenCalled();
    });

    it('should show org name when expanded', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Org')).toBeInTheDocument();
    });
});