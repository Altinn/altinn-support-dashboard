import { describe, expect, vi, it, beforeEach } from "vitest";
import { UserContactInformationAltinn3 } from "../../../../src/models/models";
import { fireEvent, render, screen } from "@testing-library/react";
import { UserCard } from "../../../../src/components/Dashboard/components/organizations/UserCard";
import "@testing-library/jest-dom";

vi.mock("@digdir/designsystemet-react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, onClick, variant, className, ...props }: any) => (
    <div
      role="article"
      data-variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  ),
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
  Paragraph: ({ children, className, ...props }: any) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
}));

describe("UserCard", () => {
  const mockSetSelectedCard = vi.fn();

  const mockUser: UserContactInformationAltinn3 = {
    name: "Test Person",
    isReserved: false,
    phoneNumber: "+4799115744",
    emailAddress: "test@test.no",
    displayedSocialSecurityNumber: "123456*****",
    ssnToken: "token-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the user's name and displayed SSN", () => {
    render(<UserCard user={mockUser} setSelectedCard={mockSetSelectedCard} />);

    expect(screen.getByText(mockUser.name!)).toBeInTheDocument();
    expect(
      screen.getByText(mockUser.displayedSocialSecurityNumber!),
    ).toBeInTheDocument();
  });

  it('should render "Ukjent bruker" when name is missing', () => {
    const userWithoutName = { ...mockUser, name: undefined };
    render(
      <UserCard
        user={userWithoutName}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    expect(screen.getByText("Ukjent bruker")).toBeInTheDocument();
  });

  it('should render "Ukjent nin" when displayedSocialSecurityNumber is missing', () => {
    const userWithoutSsn = {
      ...mockUser,
      displayedSocialSecurityNumber: undefined,
    };
    render(
      <UserCard user={userWithoutSsn} setSelectedCard={mockSetSelectedCard} />,
    );

    expect(screen.getByText("Ukjent nin")).toBeInTheDocument();
  });

  it("should call setSelectedCard with the user when card is clicked", () => {
    render(<UserCard user={mockUser} setSelectedCard={mockSetSelectedCard} />);

    const card = screen.getByRole("article");
    fireEvent.click(card);

    expect(mockSetSelectedCard).toHaveBeenCalledWith(mockUser);
  });

  it("should show tinted variant when this user is selected", () => {
    render(
      <UserCard
        user={mockUser}
        selectedCard={mockUser}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("data-variant", "tinted");
  });

  it("should show default variant when a different user is selected", () => {
    const otherUser: UserContactInformationAltinn3 = {
      ...mockUser,
      ssnToken: "other-token",
    };

    render(
      <UserCard
        user={mockUser}
        selectedCard={otherUser}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("data-variant", "default");
  });

  it("should show default variant when selectedCard is an organization", () => {
    const org = {
      name: "Test Org",
      organizationNumber: "123456789",
      unitType: "AS",
      isDeleted: false,
    };

    render(
      <UserCard
        user={mockUser}
        selectedCard={org}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("data-variant", "default");
  });

  it("should show default variant when selectedCard is null", () => {
    render(
      <UserCard
        user={mockUser}
        selectedCard={null}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("data-variant", "default");
  });
});
