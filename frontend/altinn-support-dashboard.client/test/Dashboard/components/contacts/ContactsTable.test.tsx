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
    filterContacts: vi.fn((contacts, query) => {
        if (query.trim().length < 3) return contacts;
        return contacts.filter((c: PersonalContactAltinn3) => 
            c.name?.toLowerCase().includes(query.toLowerCase()) ||
            c.nationalIdentityNumber?.includes(query) ||
            c.phone?.includes(query) ||
            c.email?.toLowerCase().includes(query.toLowerCase())
        );
    }),
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

    it('should render table with correct headers', () => {
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

    it('should render contact data when available', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Test Person 1')).toBeInTheDocument();
        expect(screen.getByText('Test Person 2')).toBeInTheDocument();
    });

    it('should render "Vis" button for each contact', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const button = screen.getAllByRole('button', { name: 'Vis' });
        expect(button).toHaveLength(2);
    });

    it('should display empty message when no contact exists', () => {
        mockContactsData = [];
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Her var det tomt')).toBeInTheDocument();
    });
    
    it('should call setSelectedContact when "Vis" is pressed', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const button = screen.getAllByRole('button', { name: 'Vis' })[0];
        fireEvent.click(button);
        expect(mockSetSelectedContact).toHaveBeenCalledWith(mockContacts[0]);
    });

    it('should call setSelectedContact with correct contact when multiple contacts exist', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const buttons = screen.getAllByRole('button', { name: 'Vis' });
        fireEvent.click(buttons[1]);
        expect(mockSetSelectedContact).toHaveBeenCalledWith(mockContacts[1]);
    });

    it('should sort by name ascending when name header is clicked', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const nameHeader = screen.getByText('Navn');
        fireEvent.click(nameHeader);

        expect(nameHeader).toHaveAttribute('data-sort', 'ascending');
    });

    it('should sort by name descending when name header is clicked twice', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const nameHeader = screen.getByText('Navn');
        fireEvent.click(nameHeader);
        fireEvent.click(nameHeader);

        expect(nameHeader).toHaveAttribute('data-sort', 'descending');
    });

    it('should on 3 clicks on name header reset sort', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const nameHeader = screen.getByText('Navn');

        fireEvent.click(nameHeader);
        expect(nameHeader).toHaveAttribute('data-sort', 'ascending');

        fireEvent.click(nameHeader);
        expect(nameHeader).toHaveAttribute('data-sort', 'descending');

        fireEvent.click(nameHeader);
        expect(nameHeader).toHaveAttribute('data-sort', 'none');
    });

    it('should display no sort indicator when not sorted', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const nameHeader = screen.getByText('Navn');
        expect(nameHeader).toHaveAttribute('data-sort', 'none');
    });

    it('should reset previous sort when new header is clicked', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const nameHeader = screen.getByText('Navn');
        const emailHeader = screen.getByText('E-post');

        fireEvent.click(nameHeader);
        expect(nameHeader).toHaveAttribute('data-sort', 'ascending');

        fireEvent.click(emailHeader);
        expect(nameHeader).toHaveAttribute('data-sort', 'none');
        expect(emailHeader).toHaveAttribute('data-sort', 'ascending');
    });

    it('should sort by nationalIdentityNumber', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const ssnHeader = screen.getByText('Fødselsnummer');
        fireEvent.click(ssnHeader);

        expect(ssnHeader).toHaveAttribute('data-sort', 'ascending');
    });

    it('should sort by phone', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const phoneHeader = screen.getByText('Mobilnummer');
        fireEvent.click(phoneHeader);

        expect(phoneHeader).toHaveAttribute('data-sort', 'ascending');
    });

    it('should sort by email', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
             />
         );

        const emailHeader = screen.getByText('E-post');
        fireEvent.click(emailHeader);

        expect(emailHeader).toHaveAttribute('data-sort', 'ascending');
    });

    it('should render ContactInfoCell for phone and email', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
             />
         );

        const contactInfoCells = screen.getAllByTestId('contact-info-cell');
        expect(contactInfoCells).toHaveLength(4); // both contacts have phone and email
    });

    it('should render SsnCell component', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
             />
        );

        const ssnCells = screen.getAllByTestId('ssn-cell');
        expect(ssnCells).toHaveLength(2);
    });

    it('should handle contacts with missing fields', () => {
        const contactsWithMissing = [
            {
                nationalIdentityNumber: "12345678901",
                name: "Test Person 1",
                phone: "12345678",
                email: "",
                lastChanged: "2026-01-01T12:00:00Z",
                displayedSocialSecurityNumber: "123456*****",
                ssnToken: "token1",
            },
        ];

        mockContactsData = contactsWithMissing;
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Test Person 1')).toBeInTheDocument();
    });

    it('should handle multiple contacts with same ssn by using index as key suffix', () => {
        const contactsWithSameSsn = [
            {
                nationalIdentityNumber: "12345678901",
                name: "Test Person 1",
            },
            {
                nationalIdentityNumber: "12345678901",
                name: "Test Person 2",
            },
        ];

        mockContactsData = contactsWithSameSsn;
        const { container } = render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(2);
    });

    it('should handle undefined contactsQuery data', () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockContactsData = undefined as any;
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Her var det tomt')).toBeInTheDocument();
    });

    it('should have proper table border attribute', () => {
        render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const table = screen.getByRole('table');
        expect(table).toHaveAttribute('data-border', 'true');
    });

    it('should render all header cells', () => {
        const { container } = render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const headerCells = container.querySelectorAll('thead th');
        expect(headerCells).toHaveLength(5);
    });

    it('should render correct number of data rows', () => {
        const { container } = render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const dataRows = container.querySelectorAll('tbody tr');
        expect(dataRows).toHaveLength(mockContacts.length);
    });

    it('should filter contacts based on search query with 3+ characters', () => {
        render(
            <ContactsTable
                searchQuery="Test Person 1"
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );
        expect(screen.getByText('Test Person 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Person 2')).not.toBeInTheDocument();
    });

    it('should show "Fant ingen resultater" when search has no matches and query is longer than 2', () => {
        render(
            <ContactsTable
                searchQuery="Nonexistent"
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );
        expect(screen.getByText("Fant ingen resultater for 'Nonexistent'")).toBeInTheDocument();
    });

    it('should not filter when query is less than 3', () => {
        render(
            <ContactsTable
                searchQuery="Te"
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Test Person 1')).toBeInTheDocument();
        expect(screen.getByText('Test Person 2')).toBeInTheDocument();
    });

    it('should render empty cell message spanning 5 columns', () => {
        mockContactsData = [];
        const { container } = render(
            <ContactsTable
                searchQuery=""
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        const emptyCell = container.querySelector('td[colspan="5"]');
        expect(emptyCell).toBeInTheDocument();
    });

    it('should filter contacts by phonenumber', () => {
        render(
            <ContactsTable
                searchQuery="12345678"
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Test Person 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Person 2')).not.toBeInTheDocument();
    });

    it('should filter contacts by email', () => {
        render(
            <ContactsTable
                searchQuery="test@test.no"
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Test Person 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Person 2')).not.toBeInTheDocument();
    });

    it('should filter by ssn', () => {
        render(
            <ContactsTable
                searchQuery="12345678901"
                selectedOrg={mockSelectedOrg}
                setSelectedContact={mockSetSelectedContact}
            />
        );

        expect(screen.getByText('Test Person 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Person 2')).not.toBeInTheDocument();
    });
});