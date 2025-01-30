import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import '@testing-library/jest-dom';
import ManualRoleSearchComponent from './ManualRoleSearchComponent';
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
        (UseManualRoleSearch as vi.Mock).mockReturnValue(defaultHookReturn);
    });

    it('renders the component with all elements', () => {
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        expect(screen.getByRole('heading', { name: /manuelt rollesøk/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/rollehaver/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/rollegiver/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /søk/i })).toBeInTheDocument();
    });

    it('disables the "Søk" button if rollehaver or rollegiver is missing', () => {
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        const rollehaverInput = screen.getByLabelText(/rollehaver/i);
        const rollegiverInput = screen.getByLabelText(/rollegiver/i);
        const searchButton = screen.getByRole('button', { name: /søk/i });
        expect(searchButton).toBeDisabled();
        fireEvent.change(rollehaverInput, { target: { value: '12345678901' } });
        expect(searchButton).toBeDisabled();
        fireEvent.change(rollehaverInput, { target: { value: '' } });
        fireEvent.change(rollegiverInput, { target: { value: '999999999' } });
        expect(searchButton).toBeDisabled();
        fireEvent.change(rollehaverInput, { target: { value: '12345678901' } });
        expect(searchButton).toBeEnabled();
    });

    it('disables the "Søk" button while loading', () => {
        (UseManualRoleSearch as vi.Mock).mockReturnValue({
            ...defaultHookReturn,
            isLoading: true,
        });
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        expect(screen.getByRole('button', { name: /søk/i })).toBeDisabled();
    });

    it('calls fetchRoles when valid inputs are provided and "Søk" is clicked', async () => {
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        const rollehaverInput = screen.getByLabelText(/rollehaver/i);
        const rollegiverInput = screen.getByLabelText(/rollegiver/i);
        const searchButton = screen.getByRole('button', { name: /søk/i });
        fireEvent.change(rollehaverInput, { target: { value: '12345678901' } });
        fireEvent.change(rollegiverInput, { target: { value: '999999999' } });
        fireEvent.click(searchButton);
        await waitFor(() => {
            expect(mockFetchRoles).toHaveBeenCalledTimes(1);
            expect(mockFetchRoles).toHaveBeenCalledWith('12345678901', '999999999');
        });
    });

    it('displays an error message when an error occurs', () => {
        (UseManualRoleSearch as vi.Mock).mockReturnValue({
            ...defaultHookReturn,
            error: 'En feil har oppstått',
        });
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        expect(screen.getByText(/en feil har oppstått/i)).toBeInTheDocument();
    });

    it('shows loading text while isLoading is true', () => {
        (UseManualRoleSearch as vi.Mock).mockReturnValue({
            ...defaultHookReturn,
            isLoading: true,
        });
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        expect(screen.getByText(/laster roller\.\.\./i)).toBeInTheDocument();
    });

    it('shows "Ingen roller funnet" when search is done but no roles are returned', async () => {
        (UseManualRoleSearch as vi.Mock).mockReturnValue({
            ...defaultHookReturn,
            roles: [],
            isLoading: false,
            error: null,
        });
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        fireEvent.change(screen.getByLabelText(/rollehaver/i), { target: { value: '11111111111' } });
        fireEvent.change(screen.getByLabelText(/rollegiver/i), { target: { value: '222222222' } });
        fireEvent.click(screen.getByRole('button', { name: /søk/i }));
        await waitFor(() => {
            expect(screen.getByText(/ingen roller funnet\./i)).toBeInTheDocument();
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
        (UseManualRoleSearch as vi.Mock).mockReturnValue({
            ...defaultHookReturn,
            roles: mockRoles,
            isLoading: false,
            error: null,
        });
        render(<ManualRoleSearchComponent baseUrl="http://mock-api" />);
        fireEvent.change(screen.getByLabelText(/rollehaver/i), { target: { value: '12345678901' } });
        fireEvent.change(screen.getByLabelText(/rollegiver/i), { target: { value: '987654321' } });
        fireEvent.click(screen.getByRole('button', { name: /søk/i }));
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
