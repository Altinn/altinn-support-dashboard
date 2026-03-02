import { beforeEach, describe, it, vi, expect } from "vitest";
import { RoleDetails } from "../../../src/components/Dashboard/components/RoleDetails";
import { render, screen, fireEvent } from "@testing-library/react";
import { Organization, PersonalContactAltinn3 } from "../../../src/models/models";

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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Select: Object.assign(({ children, ...props }: any) => (
    <select {...props}>{children}</select>
  ), {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    Option: ({ children, ...props }: any) => <option {...props}>{children}</option>,
  }),
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

  const mockOrg: Organization = {
    name: "Test Org",
    organizationNumber: "123456789",
    unitType: "AS",
    isDeleted: false,
  };

  const mockOnBack = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  it('should render contact name in heading', () => {
    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={mockOrg}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(`Roller knyttet til ${mockContact.name}`)).toBeInTheDocument();
  });

  it('should render back button', () => {
    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={mockOrg}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('Tilbake til oversikt')).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={mockOrg}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Tilbake til oversikt'));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should render RoleTable with correct props', () => {
    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={mockOrg}
        onBack={mockOnBack}
      />
    );

    const roleTable = screen.getByTestId('role-table');

    expect(roleTable).toBeInTheDocument();
    expect(roleTable).toHaveAttribute('data-subject', mockContact.ssnToken);
    expect(roleTable).toHaveAttribute('data-reportee', mockOrg.organizationNumber);
  });

  it('should render Card component', () => {
    const { container } = render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={mockOrg}
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
        selectedOrg={mockOrg}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('Roller knyttet til')).toBeInTheDocument();
  });

  it('should disable select when there is only one option', () => {
    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={mockOrg}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should enable select when org has a head unit', () => {
    const orgWithHeadUnit: Organization = {
      ...mockOrg,
      headUnit: { name: "Head Org", organizationNumber: "999999999", unitType: "AS", isDeleted: false },
    };

    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={orgWithHeadUnit}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByRole('combobox')).not.toBeDisabled();
    expect(screen.getByText('999999999 (hovedenhet)')).toBeInTheDocument();
  });

  it('should enable select and show sub units when org has sub units', () => {
    const orgWithSubUnits: Organization = {
      ...mockOrg,
      subUnits: [
        { name: "Sub Org 1", organizationNumber: "111111111", unitType: "BEDR", isDeleted: false },
        { name: "Sub Org 2", organizationNumber: "222222222", unitType: "BEDR", isDeleted: false },
      ],
    };

    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={orgWithSubUnits}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByRole('combobox')).not.toBeDisabled();
    expect(screen.getByText('111111111 (underenhet)')).toBeInTheDocument();
    expect(screen.getByText('222222222 (underenhet)')).toBeInTheDocument();
  });

  it('should update RoleTable reportee when a different org is selected', () => {
    const orgWithSubUnits: Organization = {
      ...mockOrg,
      subUnits: [
        { name: "Sub Org 1", organizationNumber: "111111111", unitType: "BEDR", isDeleted: false },
      ],
    };

    render(
      <RoleDetails
        selectedContact={mockContact}
        selectedOrg={orgWithSubUnits}
        onBack={mockOnBack}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: "111111111" } });

    expect(screen.getByTestId('role-table')).toHaveAttribute('data-reportee', '111111111');
  });
});
