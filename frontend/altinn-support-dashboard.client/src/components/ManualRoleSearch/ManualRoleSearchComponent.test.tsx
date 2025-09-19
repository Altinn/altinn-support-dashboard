import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import '@testing-library/jest-dom';
import { ManualRoleSearchPage } from '../../pages/ManualRoleSearchPage';
import { UseManualRoleSearch } from '../../hooks/hooks';
import { Role } from '../../models/models';

vi.mock('../../hooks/hooks', () => ({
    ...vi.importActual('../../hooks/hooks'),
    UseManualRoleSearch: vi.fn(),
}));

describe('ManualRoleSearchComponent', () => {
    const mockFetchRoles = vi.fn();
    const defaultHookReturn = {
        fetchRoles: mockFetchRoles,
        roles: [] as Role[],
        isLoading: false,
        error: null as string | null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (UseManualRoleSearch as jest.Mock).mockReturnValue(defaultHookReturn);
    });

    it('renders the component with all elements', () => {
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        expect(screen.getByRole('heading', { name: /Manuelt Rollesøk/ })).toBeInTheDocument();
        expect(screen.getByLabelText(/Rollehaver/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Rollegiver/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Søk/ })).toBeInTheDocument();
    });

    it('disables the "Søk" button if Rollehaver or Rollegiver is missing', async () => {
        const user = userEvent.setup();
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        const rollehaverInput = screen.getByLabelText(/Rollehaver/);
        const rollegiverInput = screen.getByLabelText(/Rollegiver/);
        const searchButton = screen.getByRole('button', { name: /Søk/ });
        expect(searchButton).toBeDisabled();
        await user.type(rollehaverInput, '12345678901');
        expect(searchButton).toBeDisabled();
        await user.clear(rollehaverInput);
        await user.type(rollegiverInput, '999999999');
        expect(searchButton).toBeDisabled();
        await user.type(rollehaverInput, '12345678901');
        expect(searchButton).toBeEnabled();
    });

    it('disables the "Søk" button while loading', () => {
        (UseManualRoleSearch as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            isLoading: true,
        });
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        expect(screen.getByRole('button', { name: /Søk/ })).toBeDisabled();
    });

    it('calls fetchRoles when valid inputs are provided and "Søk" is clicked', async () => {
        const user = userEvent.setup();
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        const rollehaverInput = screen.getByLabelText(/Rollehaver/);
        const rollegiverInput = screen.getByLabelText(/Rollegiver/);
        const searchButton = screen.getByRole('button', { name: /Søk/ });
        await user.type(rollehaverInput, '12345678901');
        await user.type(rollegiverInput, '999999999');
        await user.click(searchButton);
        await waitFor(() => {
            expect(mockFetchRoles).toHaveBeenCalledTimes(1);
            expect(mockFetchRoles).toHaveBeenCalledWith('12345678901', '999999999');
        });
    });

    it('displays an error message when an error occurs', () => {
        (UseManualRoleSearch as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            error: 'En feil har oppstått',
        });
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        expect(screen.getByText(/En feil har oppstått/)).toBeInTheDocument();
    });

    it('shows loading text while isLoading is true', () => {
        (UseManualRoleSearch as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            isLoading: true,
        });
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        expect(screen.getByText(/Laster roller\.\.\./)).toBeInTheDocument();
    });

    it('shows "Ingen roller funnet" when search is done but no roles are returned', async () => {
        (UseManualRoleSearch as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            roles: [],
            isLoading: false,
            error: null,
        });
        const user = userEvent.setup();
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        await user.type(screen.getByLabelText(/Rollehaver/), '11111111111');
        await user.type(screen.getByLabelText(/Rollegiver/), '222222222');
        await user.click(screen.getByRole('button', { name: /Søk/ }));
        await waitFor(() => {
            expect(screen.getByText(/Ingen roller funnet\./)).toBeInTheDocument();
        });
    });

    it('displays a table when roles are returned', async () => {
        const mockRoles: Role[] = [
            {
                RoleType: 'Admin',
                RoleName: 'Administrator',
                RoleDescription: 'Full tilgang',
                RoleDefinitionCode: 'ADMIN',
                RoleDefinitionId: 1,
            },
            {
                RoleType: 'User',
                RoleName: 'Standard bruker',
                RoleDescription: 'Begrenset tilgang',
                RoleDefinitionCode: 'USER',
                RoleDefinitionId: 2,
            },
        ];
        (UseManualRoleSearch as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            roles: mockRoles,
            isLoading: false,
            error: null,
        });
        const user = userEvent.setup();
        render(<ManualRoleSearchPage baseUrl="http://mock-api" />);
        await user.type(screen.getByLabelText(/Rollehaver/), '12345678901');
        await user.type(screen.getByLabelText(/Rollegiver/), '987654321');
        await user.click(screen.getByRole('button', { name: /Søk/ }));
        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            expect(rows).toHaveLength(3);
            expect(rows[1]).toHaveTextContent('Admin');
            expect(rows[1]).toHaveTextContent('Administrator');
            expect(rows[1]).toHaveTextContent('Full tilgang');
            expect(rows[1]).toHaveTextContent('ADMIN');
            expect(rows[2]).toHaveTextContent('User');
            expect(rows[2]).toHaveTextContent('Standard bruker');
            expect(rows[2]).toHaveTextContent('Begrenset tilgang');
            expect(rows[2]).toHaveTextContent('USER');
        });
    });
});
