import { beforeEach, describe, vi, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import ContactsTable from "../../../../src/components/Dashboard/components/contacts/ContactsTable";
import { PersonalContactAltinn3, SelectedOrg } from "../../../../src/models/models";

// Mock data that we'll modify in tests
let mockContactsData: PersonalContactAltinn3[] = [];

// Mock the hooks
vi.mock('../../../../src/hooks/hooks', () => ({
    useOrgDetails: vi.fn(() => ({
        contactsQuery: {
            data: mockContactsData,
            isLoading: false,
            isError: false,
        },
    })),
}));

vi.mock('../../../../src/stores/Appstore', () => ({
    useAppStore: vi.fn((selector) => {
        const state = { environment: "PROD" };
        return selector ? selector(state) : state;
    }),
}));

vi.mock('../../../../src/components/Dashboard/utils/contactUtils', () => ({
    filterContacts: vi.fn((contacts) => contacts),
    sortContacts: vi.fn((contacts) => contacts),
}));

// Mock child components
vi.mock('../../../../src/components/Dashboard/components/contacts/ContactInfoCell', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ contact, contactLastChanged }: any) => (
        <div data-testid="contact-info-cell">
            {contact} - {contactLastChanged}
        </div>
    ),
}));

vi.mock('../../../../src/components/SsnCell', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ contact }: any) => (
        <td data-testid="ssn-cell">{contact.nationalIdentityNumber}</td>
    ),
}));

// Mock Designsystemet components
vi.mock('@digdir/designsystemet-react', () => ({
    Table: Object.assign(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ children, className, border, ...props }: any) => (
            <table className={className} data-border={border} {...props}>
                {children}
            </table>
        ),
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Head: ({ children }: any) => <thead>{children}</thead>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Body: ({ children }: any) => <tbody>{children}</tbody>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Row: ({ children }: any) => <tr>{children}</tr>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            HeaderCell: ({ children, className, sort, onClick }: any) => (
                <th className={className} data-sort={sort} onClick={onClick}>
                    {children}
                </th>
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Cell: ({ children, colSpan, className }: any) => (
                <td colSpan={colSpan} className={className}>
                    {children}
                </td>
            ),
        }
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Card: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
            {children}
        </div>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Button: ({ children, onClick, className, ...props }: any) => (
        <button className={className} onClick={onClick} {...props}>
            {children}
        </button>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paragraph: ({ children }: any) => <p>{children}</p>,
}));

describe('ContactsTable', () => {
    const mockSetSelectedContact = vi.fn();
    const mockSelectedOrg: SelectedOrg = {
        OrganizationNumber: "123456789",
        Name: "Test Org",
    };

    const mockContacts: PersonalContactAltinn3[] = [
        {
            nationalIdentityNumber: "12345678901",
            name: "Test Person 1",
            phone: "12345678",
            email: "test@test.no",
            lastChanged: "2026-01-01T12:00:00Z",
            displayedSocialSecurityNumber: "123456*****",
            ssnToken: "token1",
        },
        {
            nationalIdentityNumber: "10987654321",
            name: "Test Person 2",
            phone: "87654321",
            email: "test@eksempel.no",
            lastChanged: "2026-02-01T12:00:00Z",
            displayedSocialSecurityNumber: "109876*****",
            ssnToken: "token2",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockContactsData = mockContacts;
    });

    it('should rendert table with correct headers', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Navn')).toBeInTheDocument();
        expect(screen.getByText('Fødselsnummer')).toBeInTheDocument();
        expect(screen.getByText('Mobilnummer')).toBeInTheDocument();
        expect(screen.getByText('E-post')).toBeInTheDocument();
        expect(screen.getByText('Roller')).toBeInTheDocument();
    });

    it('should render table caption', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Din kontaktinformasjon')).toBeInTheDocument();
    });
})