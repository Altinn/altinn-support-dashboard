import { beforeEach, describe, expect, vi, it } from "vitest";
import { NotificationAdresses } from "../../../../src/models/models";
import { render, screen } from "@testing-library/react";
import NotificationContactCell from "../../../../src/components/Dashboard/components/contacts/NotificationContactCell";


const mockUseDashboardStore = vi.fn();

vi.mock('../../../../stores/DashboardStore', () => ({
    useDashboardStore: mockUseDashboardStore, 
}));

vi.mock('@digdir/designsystemet-react', () => ({
    Table: {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: ({ children, className, style }: any) => (
            <td className={className} style={style}>
                {children}
            </td>
        ),
    },
}));


describe('NotificationContactCell', () => {
    const mockContact: NotificationAdresses = {
        notificationAddressId: 1,
        email: "test@test.no",
        phone: "12345678",
        countryCode: "+47",
        lastChanged: "2026-01-01T12:00:00Z",
        sourceOrgNumber: "123456789",
        requestedOrgNumber: "123456789",
    };

    beforeEach(() => {
        mockUseDashboardStore.mockReturnValue({ query: "" });
    });

    it('should render email field', () => {
        render(
            <NotificationContactCell
                contact={mockContact}
                field = "email"
            />
        );

        expect(screen.getByText("test@test.no")).toBeInTheDocument();
    });

    it('should render phone field with country code', () => {
        render(
            <NotificationContactCell
                contact={mockContact}
                field = "phone"
            />
        );

        expect(screen.getByText("+47 12345678")).toBeInTheDocument();
    });

    it('should render phone without country code when countryCode is missing', () => {
        const contactWithoutCountryCode = { ...mockContact, countryCode: undefined };
        render(
            <NotificationContactCell
                contact={contactWithoutCountryCode}
                field = "phone"
            />
        );

        expect(screen.getByText("12345678")).toBeInTheDocument();
    });

    it('should render empty string when field value is empty string', () => {
        const contactWithNullEmail = { ...mockContact, email: "" };
        render(
            <NotificationContactCell
                contact={contactWithNullEmail}
                field = "email"
             />
        );

        const cell = screen.getByRole('cell');
        expect(cell).toHaveTextContent("");
    });

    it('should apply bold style when query matches cell value', () => {
        mockUseDashboardStore.mockReturnValue({ query: "test@test.no" });

        render(
            <NotificationContactCell
                contact={mockContact}
                field = "email"
             />
        );

        const cell = screen.getByRole('cell');
        expect(cell).toHaveStyle('font-weight: bold');
    });
    
    it('should apply bold style when query matches with different case', () => {
        mockUseDashboardStore.mockReturnValue({ query: "TEST" });

        render(
            <NotificationContactCell
                contact={mockContact}
                field = "email"
             />
        );

        const cell = screen.getByRole('cell');
        expect(cell).toHaveStyle('font-weight: bold');
    });

    it('should apply nbolc style when query matches wth spaces removed', () => {
        mockUseDashboardStore.mockReturnValue({ query: "test @ test.no" });

        render(
            <NotificationContactCell
                contact={mockContact}
                field = "email"
            />
        );

        const cell = screen.getByRole('cell');
        expect(cell).toHaveStyle('font-weight: bold');
    });

    it('should apply bold style for phone number when query matches', () => {
        mockUseDashboardStore.mockReturnValue({ query: "1234" });

        render(
            <NotificationContactCell
                contact={mockContact}
                field = "phone"
            />
        );

        const cell = screen.getByRole('cell');
        expect(cell).toHaveStyle('font-weight: bold');
    });

    it('should apply bold when query matches country code', () => {
        mockUseDashboardStore.mockReturnValue({ query: "+47" });

        render(
            <NotificationContactCell
                contact={mockContact}
                field = "phone"
            />
        );

        const cell = screen.getByRole('cell');
        expect(cell).toHaveStyle('font-weight: bold');
    });

    it('should handle phone field with undefined value', () => {
        const contactWithUndefinedPhone = { ...mockContact, phone: undefined };

        render(
            <NotificationContactCell
                contact={contactWithUndefinedPhone}
                field = "phone"
            />
        );

        const cell = screen.getByRole('cell');
        expect(cell).toHaveTextContent("");
    });
})