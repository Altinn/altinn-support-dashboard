import { beforeEach, describe, it, vi, expect } from "vitest";
import { RoleDetails } from "../../../src/components/Dashboard/components/RoleDetails";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonalContactAltinn3 } from "../../../src/models/models";





vi.mock("@digdir/designsystemet-react", () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Heading: ({ children, level, ...props }: any) => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = `h${level}` as any;
    return <Tag {...props}>{children}</Tag>;
  },
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock("../../../src/components/ManualRoleSearch/RoleTable", () => ({
  default: ({ subject, reportee }: { subject: string; reportee: string }) => (
    <div data-testid="role-table" data-subject={subject} data-reportee={reportee}>
      RoleTable Mock
    </div>
  ),
}));


describe('RoleDetails', () => {
    const mockContact: PersonalContactAltinn3 = {
        orgNr: "123456789",
        nationalIdentityNumber: "98765432101",
        name: "Test User",
        email: "test@test.no",
        phone: "12345678",
        displayedSocialSecurityNumber: "987654*****",
        ssnToken: "token123",
    };

    const mockOnBack = vi.fn();

    beforeEach(() => {
        mockOnBack.mockClear();
    })

    it('should render contact name in heading', () => {
        render(
            <RoleDetails
                selectedContact={mockContact}
                organizationNumber="123456789"
                onBack={mockOnBack}
            />
        );

        expect(screen.getByText(`Roller knyttet til ${mockContact.name}`)).toBeInTheDocument();
    });

    it('should render back button', () => {
        render(
            <RoleDetails
                selectedContact={mockContact}
                organizationNumber="123456789"
                onBack={mockOnBack}
            />
        );

        const backButton = screen.getByText('Tilbake til oversikt');

        expect(backButton).toBeInTheDocument();
    });

    it('should call onBack when back button is clicked', () => {
        render(
            <RoleDetails
                selectedContact={mockContact}
                organizationNumber="123456789"
                onBack={mockOnBack}
            />
        );

        const backButton = screen.getByText('Tilbake til oversikt');

        fireEvent.click(backButton);

        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should render RoleTable with correct props', () => {
        render(
            <RoleDetails
                selectedContact={mockContact}
                organizationNumber="123456789"
                onBack={mockOnBack}
            />
        );

        const roleTable = screen.getByTestId('role-table');

        expect(roleTable).toBeInTheDocument();
        expect(roleTable).toHaveAttribute('data-subject', mockContact.ssnToken);
        expect(roleTable).toHaveAttribute('data-reportee', '123456789');
    });

    it('should render Card component', () => {
        const { container } = render(
            <RoleDetails
                selectedContact={mockContact}
                organizationNumber="123456789"
                onBack={mockOnBack}
            />
        );

        expect(container.querySelector('div[data-color="neutral"]')).toBeInTheDocument();
    });

    it('should handle contact with missing name', () => {
        const contactWithoutName = { ...mockContact, name: "" };

        render(
            <RoleDetails
                selectedContact={contactWithoutName}
                organizationNumber="123456789"
                onBack={mockOnBack}
            />
        );

        expect(screen.getByText('Roller knyttet til')).toBeInTheDocument();
    })
})