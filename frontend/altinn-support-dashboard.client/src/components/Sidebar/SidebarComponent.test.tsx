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
        currentPage: 'dashboard' as 'dashboard' | 'settings',  // Fix the type issue here
        setCurrentPage: vi.fn(),
    };

    const renderSidebar = (props = {}) => {
        render(<Sidebar {...defaultProps} {...props} />);
    };

    it('renders the sidebar with navigation buttons', () => {
        renderSidebar();

        // Ensure both buttons are rendered with correct labels
        expect(screen.getByText('Oppslag')).toBeInTheDocument();
        expect(screen.getByText('Innstillinger')).toBeInTheDocument();
    });

    it('calls setCurrentPage with "dashboard" when Oppslag is clicked', async () => {
        const mockSetCurrentPage = vi.fn();
        renderSidebar({
            setCurrentPage: mockSetCurrentPage,
            currentPage: 'settings',  // Set the other option to test navigation
        });

        const oppslagButton = screen.getByText('Oppslag');
        await userEvent.click(oppslagButton);

        // Ensure setCurrentPage is called with 'dashboard' when Oppslag is clicked
        expect(mockSetCurrentPage).toHaveBeenCalledWith('dashboard');
    });

    it('calls setCurrentPage with "settings" when Innstillinger is clicked', async () => {
        const mockSetCurrentPage = vi.fn();
        renderSidebar({
            setCurrentPage: mockSetCurrentPage,
            currentPage: 'dashboard',  // Set the other option to test navigation
        });

        const innstillingerButton = screen.getByText('Innstillinger');
        await userEvent.click(innstillingerButton);

        // Ensure setCurrentPage is called with 'settings' when Innstillinger is clicked
        expect(mockSetCurrentPage).toHaveBeenCalledWith('settings');
    });

    it('highlights the correct button based on currentPage', () => {
        // Render with 'dashboard' selected
        renderSidebar({ currentPage: 'dashboard' });
        expect(screen.getByText('Oppslag')).toHaveClass('selected');
        expect(screen.getByText('Innstillinger')).not.toHaveClass('selected');

        // Render with 'settings' selected
        renderSidebar({ currentPage: 'settings' });
        expect(screen.getByText('Innstillinger')).toHaveClass('selected');
        expect(screen.getByText('Oppslag')).not.toHaveClass('selected');
    });
});
