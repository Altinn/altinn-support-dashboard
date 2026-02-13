import { beforeEach, describe, vi, it, expect } from "vitest";
import NotificationContactTable from "../../../../src/components/Dashboard/components/contacts/NotificationContactTable";
import { NotificationAdresses } from "../../../../src/models/models";
import { render, screen } from "@testing-library/react";



vi.mock('../../../../src/components/Dashboard/utils/dateUtils', () => ({
    formatDate: vi.fn((date: string) => date ? `Formatted: ${date}` : ''),
}));

vi.mock('../../../../src/components/Dashboard/components/contacts/NotificationContactCell', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ contact, field }: any) => (
        <td data-testid={`cell-${field}`}>
            {contact[field] || 'N/A'}
        </td>
    ),
}));

vi.mock('@digdir/designsystemet-react', () => ({
    Table: Object.assign(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ children, className }: any) => (
            <table className={className}>{children}</table>
        ),
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Head: ({ children }: any) => <thead>{children}</thead>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Body: ({ children }: any) => <tbody>{children}</tbody>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Row: ({ children }: any) => <tr>{children}</tr>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            HeaderCell: ({ children, className }: any) => (
                <th className={className}>{children}</th>
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Cell: ({ children, colSpan, className }: any) => (
                <td colSpan={colSpan} className={className}>{children}</td>
            ),
        }
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paragraph: ({ children, className }: any) => (
        <p className={className}>{children}</p>
    ),
}));

describe('NotificationContactTable', () => {
    const mockContacts: NotificationAdresses[] = [
        {
            notificationAddressId: 1,
            email: "test@test.no",
            phone: "12345678",
            countryCode: "+47",
            lastChanged: "2026-01-01T12:00:00Z",
            sourceOrgNumber: "123456789",
            requestedOrgNumber: "123456789",
        },
        {
            notificationAddressId: 2,
            email: "test@eksempel.no",
            phone: "87654321",
            countryCode: "+47",
            lastChanged: "2026-02-01T12:00:00Z",
            sourceOrgNumber: "123456789",
            requestedOrgNumber: "123456789",
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render table with title headers', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={mockContacts}
            />
        );

        expect(screen.getByText('E-post')).toBeInTheDocument();
        expect(screen.getByText('Endret E-post')).toBeInTheDocument();
    });

    it('should render contacts that have the specified field', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={mockContacts}
            />
        );

        expect(screen.getAllByTestId('cell-email')).toHaveLength(2);
    });
    
    it('should render formatted changed date for each contact', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={mockContacts}
            />
        );

        expect(screen.getByText('Formatted: 2026-01-01T12:00:00Z')).toBeInTheDocument();
        expect(screen.getByText('Formatted: 2026-02-01T12:00:00Z')).toBeInTheDocument();
    })

    it('should filter out contacts without the specified field', () => {
        const contactsWithMissing: NotificationAdresses[] = [
            {
                notificationAddressId: 1,
                email: "test@test.no",
                phone: "",
                lastChanged: "2026-01-01T12:00:00Z",
                sourceOrgNumber: "123456789",
                requestedOrgNumber: "123456789",
            },
            {
                notificationAddressId: 2,
                email: "",
                phone: "87654321",
                lastChanged: "2026-02-01T12:00:00Z",
                sourceOrgNumber: "123456789",
                requestedOrgNumber: "123456789",
            }
        ];

        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={contactsWithMissing}
            />
        );
        expect(screen.queryAllByTestId('cell-email')).toHaveLength(1);
    });

    it('should render "Her var det tomt" when no contacts have the specified field', () => {
        const contactsWithMissing: NotificationAdresses[] = [
            {
                notificationAddressId: 1,
                email: "",
                phone: "12345678",
                lastChanged: "2026-01-01T12:00:00Z",
                sourceOrgNumber: "123456789",
                requestedOrgNumber: "123456789",
            },
        ];

        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={contactsWithMissing}
            />
        );

        expect(screen.getByText('Her var det tomt')).toBeInTheDocument();
    });

    it('should render "Her var det tomt" when contacts array is empty', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={[]}
            />
        );

        expect(screen.getByText('Her var det tomt')).toBeInTheDocument();
    });

    it('should handle undefined contacts array', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                contacts={undefined as any}
            />
        );

        expect(screen.getByText('Her var det tomt')).toBeInTheDocument();
    });

    it('should render phone field when specified', () => {
        render(
            <NotificationContactTable
                title="Mobilnummer"
                field="phone"
                changedField="lastChanged"
                contacts={mockContacts}
            />
        );

        expect(screen.getAllByTestId('cell-phone')).toHaveLength(2);
        expect(screen.getByText('Mobilnummer')).toBeInTheDocument();
        expect(screen.getByText('Endret Mobilnummer')).toBeInTheDocument();
    });

    it('should pass correct field to NotificationContactCell', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={mockContacts}
            />
        );

        const emailCells = screen.getAllByTestId('cell-email');
        expect(emailCells).toHaveLength(2);
        expect(emailCells[0]).toHaveTextContent('test@test.no');
        expect(emailCells[1]).toHaveTextContent('test@eksempel.no');
    });

    it('should render colSpan 2 for empty message cell', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                contacts={[]}
            />
        );

        const emptyCell = screen.getByText('Her var det tomt');
        expect(emptyCell).toBeInTheDocument();
        expect(emptyCell.closest('td')).toHaveAttribute('colspan', '2');
    });

    it('should handle null contacts array', () => {
        render(
            <NotificationContactTable
                title="E-post"
                field="email"
                changedField="lastChanged"
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                contacts={null as any}
            />
        );

        expect(screen.getByText('Her var det tomt')).toBeInTheDocument();
    })
})