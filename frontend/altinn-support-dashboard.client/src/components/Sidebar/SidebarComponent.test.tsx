import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Sidebar from './SidebarComponent';

describe('Sidebar', () => {
    const defaultProps = {
        environment: 'PROD',
        isEnvDropdownOpen: false,
        toggleEnvDropdown: vi.fn(),
        handleEnvChange: vi.fn(),
        currentPage: 'dashboard' as 'dashboard' | 'settings',
        setCurrentPage: vi.fn(),
        userName: 'Test User',
        userEmail: 'test@example.com',
        formattedTime: '12:00',
        formattedDate: '2024-11-15',
    };

    const renderSidebar = (props = {}) => {
        render(<Sidebar {...defaultProps} {...props} />);
    };

    it('renders the sidebar with navigation buttons', () => {
        renderSidebar();

        expect(screen.getByText('Oppslag')).toBeInTheDocument();
        expect(screen.getByText('Innstillinger')).toBeInTheDocument();
    });

    it('calls setCurrentPage with "dashboard" when Oppslag is clicked', async () => {
        const mockSetCurrentPage = vi.fn();
        renderSidebar({
            setCurrentPage: mockSetCurrentPage,
            currentPage: 'settings',
        });

        const oppslagButton = screen.getByText('Oppslag');
        await userEvent.click(oppslagButton);

        expect(mockSetCurrentPage).toHaveBeenCalledWith('dashboard');
    });

    it('calls setCurrentPage with "settings" when Innstillinger is clicked', async () => {
        const mockSetCurrentPage = vi.fn();
        renderSidebar({
            setCurrentPage: mockSetCurrentPage,
            currentPage: 'dashboard',
        });

        const innstillingerButton = screen.getByText('Innstillinger');
        await userEvent.click(innstillingerButton);

        expect(mockSetCurrentPage).toHaveBeenCalledWith('settings');
    });

    it('highlights the correct button based on currentPage', () => {
        renderSidebar({ currentPage: 'dashboard' });
        expect(screen.getByText('Oppslag')).toHaveClass('selected');
        expect(screen.getByText('Innstillinger')).not.toHaveClass('selected');

        renderSidebar({ currentPage: 'settings' });
        expect(screen.getByText('Innstillinger')).toHaveClass('selected');
        expect(screen.getByText('Oppslag')).not.toHaveClass('selected');
    });
});
