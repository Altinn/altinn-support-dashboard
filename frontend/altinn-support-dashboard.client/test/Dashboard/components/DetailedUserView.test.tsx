import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserContactInformationAltinn3 } from "../../../src/models/models";
import DetailedUserView from "../../../src/components/Dashboard/components/DetailedUserView";
import "@testing-library/jest-dom";

vi.mock("../../../src/stores/Appstore", () => ({
  useAppStore: vi.fn(),
}));

vi.mock("../../../src/components/SsnText", () => ({
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ contact, environment }: any) => (
    <span data-testid="ssn-text">
      {contact.displayedSocialSecurityNumber} ({environment})
    </span>
  ),
}));

vi.mock(
  "../../../src/components/Dashboard/components/UserAuthorizedPartiesList",
  () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ onSelectParty }: any) => (
      <div data-testid="user-authorized-parties-list">
        <button
          onClick={() => onSelectParty({ name: "Test Party" })}
        >
          Vis
        </button>
      </div>
    ),
  }),
);

vi.mock("../../../src/components/Dashboard/components/RoleDetailsUser", () => ({
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  RoleDetailsUser: ({ selectedParty, onBack }: any) => (
    <div data-testid="role-details-user">
      RoleDetailsUser: {selectedParty.name}
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock("@digdir/designsystemet-react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Heading: ({ children, level, className, ...props }: any) => {
    const Tag = `h${level}`;
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Paragraph: ({ children, className, ...props }: any) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
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
      HeaderCell: ({ children }: any) => <th>{children}</th>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ children }: any) => <td>{children}</td>,
    },
  ),
}));

const { useAppStore } = await import("../../../src/stores/Appstore");

describe("DetailedUserView", () => {
  const mockUser: UserContactInformationAltinn3 = {
    name: "Test Person",
    isReserved: false,
    phoneNumber: "+4799115744",
    emailAddress: "test@test.no",
    phoneNumberLastUpdatedOrVerified: "2026-01-01T00:00:00Z",
    emailLastUpdatedOrVerified: "2026-02-01T00:00:00Z",
    displayedSocialSecurityNumber: "088469*****",
    ssnToken: "token-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAppStore as any).mockReturnValue("test");
  });

  it("should render nothing when selectedUser is null", () => {
    const { container } = render(<DetailedUserView selectedUser={null} />);
    expect(container.querySelector("h1")).not.toBeInTheDocument();
  });

  it("should render the user's name", () => {
    render(<DetailedUserView selectedUser={mockUser} />);
    expect(screen.getByText("Test Person")).toBeInTheDocument();
  });

  it('should render "Ukjent bruker" when name is missing', () => {
    const userWithoutName = { ...mockUser, name: undefined };
    render(<DetailedUserView selectedUser={userWithoutName} />);
    expect(screen.getByText("Ukjent bruker")).toBeInTheDocument();
  });

  it("should show Reservert: Ja when isReserved is true", () => {
    render(
      <DetailedUserView selectedUser={{ ...mockUser, isReserved: true }} />,
    );
    expect(screen.getByText("Reservert: Ja")).toBeInTheDocument();
  });

  it("should show Reservert: Nei when isReserved is false", () => {
    render(<DetailedUserView selectedUser={mockUser} />);
    expect(screen.getByText("Reservert: Nei")).toBeInTheDocument();
  });

  it("should render SsnText with the selected user's contact info", () => {
    render(<DetailedUserView selectedUser={mockUser} />);

    const ssnText = screen.getByTestId("ssn-text");
    expect(ssnText).toHaveTextContent("088469***** (test)");
  });

  it("should render the Kontaktinformasjon card with headers", () => {
    render(<DetailedUserView selectedUser={mockUser} />);

    expect(screen.getByText("Kontaktinformasjon")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Verdi")).toBeInTheDocument();
    expect(screen.getByText("Sist endret/bekreftet")).toBeInTheDocument();
  });

  it("should render phone number and its last-changed date", () => {
    render(<DetailedUserView selectedUser={mockUser} />);

    expect(screen.getByText("Mobilnummer")).toBeInTheDocument();
    expect(screen.getByText("+4799115744")).toBeInTheDocument();
  });

  it("should render email and its last-changed date", () => {
    render(<DetailedUserView selectedUser={mockUser} />);

    expect(screen.getByText("E-post")).toBeInTheDocument();
    expect(screen.getByText("test@test.no")).toBeInTheDocument();
  });

  it('should show "Ikke registrert" when phone number is missing', () => {
    const userWithoutPhone = { ...mockUser, phoneNumber: undefined };
    render(<DetailedUserView selectedUser={userWithoutPhone} />);

    const cells = screen.getAllByText("Ikke registrert");
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should show "Ikke registrert" when email is missing', () => {
    const userWithoutEmail = { ...mockUser, emailAddress: undefined };
    render(<DetailedUserView selectedUser={userWithoutEmail} />);

    const cells = screen.getAllByText("Ikke registrert");
    expect(cells.length).toBeGreaterThan(0);
  });
});
