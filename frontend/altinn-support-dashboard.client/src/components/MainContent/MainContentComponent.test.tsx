import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainContent from './MainContentComponent';
import { Organization, Subunit, PersonalContact, ERRole } from '../../models/models';

// Mock the fetch function
global.fetch = vi.fn();

// Mock document.getAnimations
beforeAll(() => {
    if (typeof document.getAnimations === 'undefined') {
        document.getAnimations = vi.fn().mockReturnValue([]);
    }
});

// Mock props with correct types
const mockProps: React.ComponentProps<typeof MainContent> = {
    baseUrl: 'http://test.com',
    isLoading: false,
    organizations: [{ organizationNumber: '123', name: 'Test Org', type: 'Test Type' } as Organization],
    subUnits: [] as Subunit[],
    selectedOrg: null,
    moreInfo: [] as PersonalContact[],
    rolesInfo: [] as ERRole[],
    expandedOrg: null,
    handleSelectOrg: vi.fn(),
    handleExpandToggle: vi.fn(),
    error: { message: '', response: null },
    erRolesError: null,
    formattedTime: '12:00',
    formattedDate: '2024-11-15',
};

describe('MainContent', () => {
    it('renders without crashing', () => {
        render(<MainContent {...mockProps} />);
        expect(screen.getByText('Test Org')).toBeDefined();
    });

    it('displays loading skeleton when isLoading is true', () => {
        const loadingProps = { ...mockProps, isLoading: true };
        render(<MainContent {...loadingProps} />);

        const skeletons = screen.getAllByTestId('skeleton');
        expect(skeletons).toHaveLength(3);
    });

    it('displays error message when there is an error', () => {
        const errorProps = { ...mockProps, error: { message: 'Test Error', response: null } };
        render(<MainContent {...errorProps} />);
        expect(screen.getByText('Test Error')).toBeDefined();
    });

    it('calls handleSelectOrg when an organization is clicked', () => {
        render(<MainContent {...mockProps} />);
        screen.getByText('Test Org').click();
        expect(mockProps.handleSelectOrg).toHaveBeenCalledWith('123', 'Test Org');
    });

    it('displays selected organization details when an org is selected', () => {
        const selectedOrgProps = {
            ...mockProps,
            selectedOrg: { Name: 'Selected Org', OrganizationNumber: '456' },
        };
        render(<MainContent {...selectedOrgProps} />);
        expect(screen.getByText('Selected Org')).toBeDefined();
        expect(screen.getByText('Organisasjonsoversikt')).toBeDefined();
    });
});
