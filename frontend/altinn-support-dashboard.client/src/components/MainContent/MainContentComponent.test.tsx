// src/components/MainContent/MainContentComponent.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, vi, beforeAll } from 'vitest';
import '@testing-library/jest-dom';
import MainContentComponent from './MainContentComponent';
import { Organization, Subunit, PersonalContact, ERRole } from '../../models/models';

// Mock the fetch function
global.fetch = vi.fn();

// Mock document.getAnimations
beforeAll(() => {
    if (typeof document.getAnimations === 'undefined') {
        (document as any).getAnimations = vi.fn().mockReturnValue([]);
    }
});

// Mock props with correct types
const mockProps: React.ComponentProps<typeof MainContentComponent> = {
    baseUrl: 'http://test.com',
    isLoading: false,
    organizations: [
        {
            organizationNumber: '123',
            name: 'Test Org',
            type: 'Test Type',
        } as Organization,
    ],
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
    isDarkMode: false,
    query: '',
    hasSearched: false,
};

describe('MainContentComponent', () => {
    it('renders without crashing', () => {
        render(<MainContentComponent {...mockProps} />);
        expect(screen.getByText('Test Org')).toBeInTheDocument();
    });

    it('displays loading skeleton when isLoading is true', () => {
        const loadingProps = { ...mockProps, isLoading: true };
        render(<MainContentComponent {...loadingProps} />);
        // Since the skeletons don't have a test ID, we can check for the number of skeleton elements
        const skeletons = screen.getAllByRole('progressbar');
        expect(skeletons.length).toBeGreaterThanOrEqual(1);
    });

    it('displays error message when there is an error', () => {
        const errorProps = {
            ...mockProps,
            error: { message: 'Test Error', response: null },
        };
        render(<MainContentComponent {...errorProps} />);
        expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    it('calls handleSelectOrg when an organization is clicked', () => {
        render(<MainContentComponent {...mockProps} />);
        screen.getByText('Test Org').click();
        expect(mockProps.handleSelectOrg).toHaveBeenCalledWith('123', 'Test Org');
    });

    it('displays selected organization details when an org is selected', () => {
        const selectedOrgProps = {
            ...mockProps,
            selectedOrg: { Name: 'Selected Org', OrganizationNumber: '456' },
            hasSearched: true, // Ensure hasSearched is true
        };

        render(<MainContentComponent {...selectedOrgProps} />);
        expect(screen.getByText('Selected Org')).toBeInTheDocument();
        expect(screen.getByText('Organisasjonsoversikt')).toBeInTheDocument();
    });

    it('filters contacts based on search query', () => {
        const selectedOrgProps = {
            ...mockProps,
            selectedOrg: { Name: 'Selected Org', OrganizationNumber: '456' },
            moreInfo: [
                {
                    personalContactId: '1',
                    name: 'John Doe',
                    socialSecurityNumber: '12345678901',
                    mobileNumber: '12345678',
                    eMailAddress: 'john.doe@example.com',
                } as PersonalContact,
                {
                    personalContactId: '2',
                    name: 'Jane Smith',
                    socialSecurityNumber: '10987654321',
                    mobileNumber: '87654321',
                    eMailAddress: 'jane.smith@example.com',
                } as PersonalContact,
            ],
            hasSearched: true, // Ensure hasSearched is true
        };

        render(<MainContentComponent {...selectedOrgProps} />);

        const searchInput = screen.getByPlaceholderText('Navn / SSN / Telefon / E-post');
        fireEvent.change(searchInput, { target: { value: 'John' } });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
});
