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
    };

    const renderSidebar = (props = {}) => {
        render(<Sidebar {...defaultProps} {...props} />);
    };

    it('renders the sidebar with logo and navigation', () => {
        renderSidebar();

        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Innstillinger')).toBeInTheDocument();
    });

    it('toggles the environment dropdown when clicked', async () => {
        renderSidebar({ isEnvDropdownOpen: true });

        const environmentSelector = screen.getByText('PROD');
        await userEvent.click(environmentSelector);

        expect(screen.getByText('TT02')).toBeInTheDocument();
    });

    it('calls handleEnvChange with the new environment', async () => {
        const mockHandleEnvChange = vi.fn();
        renderSidebar({
            isEnvDropdownOpen: true,
            handleEnvChange: mockHandleEnvChange,
        });

        const environmentSelector = screen.getByText('PROD');
        await userEvent.click(environmentSelector);

        const newEnv = screen.getByText('TT02');
        await userEvent.click(newEnv);

        expect(mockHandleEnvChange).toHaveBeenLastCalledWith('TT02');
    });
});
