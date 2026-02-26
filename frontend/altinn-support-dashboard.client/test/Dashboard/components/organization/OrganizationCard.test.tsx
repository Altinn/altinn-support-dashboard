import { describe, expect, vi, it, beforeEach } from "vitest";
import { Organization } from "../../../../src/models/models";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrganizationCard } from "../../../../src/components/Dashboard/components/organizations/OrganizationCard";
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
  Button: ({ children, onClick, className, ...props }: any) => (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
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

vi.mock("@navikt/aksel-icons", () => ({
  ChevronUpIcon: () => <span data-testid="chevron-up-icon">↑</span>,
  ChevronDownIcon: () => <span data-testid="chevron-down-icon">↓</span>,
}));

describe("OrganizationCard", () => {
  const mockSetSelectedOrg = vi.fn();

  const mockOrg: Organization = {
    name: "Test Organization",
    organizationNumber: "123456789",
    unitType: "AS",
    isDeleted: false,
  };

  const mockSubUnits: Organization[] = [
    {
      name: "Subunit 1",
      organizationNumber: "11111111111",
      unitType: "BEDR",
      isDeleted: false,
      headUnit: mockOrg,
    },
    {
      name: "Subunit 2",
      organizationNumber: "22222222222",
      unitType: "BEDR",
      isDeleted: false,
      headUnit: mockOrg,
    },
  ];

  const mockOrgWithSubUnits: Organization = {
    ...mockOrg,
    subUnits: mockSubUnits,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render organization card with name and org number", () => {
    render(
      <OrganizationCard org={mockOrg} setSelectedOrg={mockSetSelectedOrg} />,
    );

    expect(screen.getByText(mockOrg.name)).toBeInTheDocument();
    expect(
      screen.getByText(`Org Nr: ${mockOrg.organizationNumber}`),
    ).toBeInTheDocument();
  });

  it("should call setSelectedOrg with the org when card is clicked", () => {
    render(
      <OrganizationCard org={mockOrg} setSelectedOrg={mockSetSelectedOrg} />,
    );

    const card = screen.getByRole("article");
    fireEvent.click(card);

    expect(mockSetSelectedOrg).toHaveBeenCalledWith(mockOrg);
  });

  it("should show tinted variant when org is selected", () => {
    render(
      <OrganizationCard
        org={mockOrg}
        selectedOrg={mockOrg}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("data-variant", "tinted");
  });

  it("should show default variant when org is not selected", () => {
    render(
      <OrganizationCard
        org={mockOrg}
        selectedOrg={null}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("data-variant", "default");
  });

  it("should show subunit expand button when org has subunits", () => {
    render(
      <OrganizationCard
        org={mockOrgWithSubUnits}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button");
    expect(button.length).toBeGreaterThan(0);
    expect(screen.getByTestId("chevron-up-icon")).toBeInTheDocument();
  });

  it("should not show subunit expand button when org has no subunits", () => {
    render(
      <OrganizationCard org={mockOrg} setSelectedOrg={mockSetSelectedOrg} />,
    );

    expect(screen.queryByTestId("chevron-up-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("chevron-down-icon")).not.toBeInTheDocument();
  });

  it("should expand and show subunits when expand button is clicked", () => {
    render(
      <OrganizationCard
        org={mockOrgWithSubUnits}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    expect(screen.queryByText(mockSubUnits[0].name)).not.toBeInTheDocument();

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    expect(screen.getByText(mockSubUnits[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockSubUnits[1].name)).toBeInTheDocument();
  });

  it("should toggle subunits visibility when expand button is clicked twice", () => {
    render(
      <OrganizationCard
        org={mockOrgWithSubUnits}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);
    expect(screen.getByText(mockSubUnits[0].name)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText(mockSubUnits[0].name)).not.toBeInTheDocument();
  });

  it("should call setSelectedOrg with the subunit when subunit card is clicked", () => {
    render(
      <OrganizationCard
        org={mockOrgWithSubUnits}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    const subunitCard = screen.getByText(mockSubUnits[0].name).closest("div");
    fireEvent.click(subunitCard!);

    expect(mockSetSelectedOrg).toHaveBeenCalledWith(mockSubUnits[0]);
  });

  it("should show tinted variant for selected subunit", () => {
    render(
      <OrganizationCard
        org={mockOrgWithSubUnits}
        selectedOrg={mockSubUnits[0]}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    const subunitCard = screen.getByText(mockSubUnits[0].name).closest("div");
    expect(subunitCard).toHaveAttribute("data-variant", "tinted");
  });

  it("should show head unit expand button when org has a head unit", () => {
    const orgWithHeadUnit: Organization = {
      ...mockOrg,
      headUnit: {
        name: "Head Unit",
        organizationNumber: "33333333333",
        isDeleted: false,
        unitType: "AS",
      },
    };

    render(
      <OrganizationCard
        org={orgWithHeadUnit}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button")[0];
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("chevron-down-icon")).toBeInTheDocument();
  });

  it("should expand and show head unit when head expand button is clicked", () => {
    const orgWithHeadUnit: Organization = {
      ...mockOrg,
      headUnit: {
        name: "Head Unit",
        organizationNumber: "33333333333",
        isDeleted: false,
        unitType: "AS",
      },
    };

    render(
      <OrganizationCard
        org={orgWithHeadUnit}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    expect(
      screen.queryByText(orgWithHeadUnit.headUnit!.name),
    ).not.toBeInTheDocument();

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    expect(
      screen.getByText(orgWithHeadUnit.headUnit!.name),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Org Nr: ${orgWithHeadUnit.headUnit!.organizationNumber}`,
      ),
    ).toBeInTheDocument();
  });

  it("should call setSelectedOrg with the head unit when head unit card is clicked", () => {
    const orgWithHeadUnit: Organization = {
      ...mockOrg,
      headUnit: {
        name: "Head Unit",
        organizationNumber: "33333333333",
        isDeleted: false,
        unitType: "AS",
      },
    };

    render(
      <OrganizationCard
        org={orgWithHeadUnit}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    const headUnitCard = screen
      .getByText(orgWithHeadUnit.headUnit!.name)
      .closest("div");
    fireEvent.click(headUnitCard!);

    expect(mockSetSelectedOrg).toHaveBeenCalledWith(orgWithHeadUnit.headUnit);
  });

  it("should show tinted variant for selected head unit", () => {
    const orgWithHeadUnit: Organization = {
      ...mockOrg,
      headUnit: {
        name: "Head Unit",
        organizationNumber: "33333333333",
        isDeleted: false,
        unitType: "AS",
      },
    };

    render(
      <OrganizationCard
        org={orgWithHeadUnit}
        selectedOrg={orgWithHeadUnit.headUnit}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    const headUnitCard = screen
      .getByText(orgWithHeadUnit.headUnit!.name)
      .closest("div");
    expect(headUnitCard).toHaveAttribute("data-variant", "tinted");
  });

  it("should only show subunits that belong to this org", () => {
    const otherSubUnit: Organization = {
      name: "Other Subunit",
      organizationNumber: "44444444444",
      unitType: "BEDR",
      isDeleted: false,
      headUnit: {
        name: "Other Org",
        organizationNumber: "987654321",
        unitType: "AS",
        isDeleted: false,
      },
    };

    const orgWithMixedSubunits: Organization = {
      ...mockOrg,
      subUnits: [...mockSubUnits, otherSubUnit],
    };

    render(
      <OrganizationCard
        org={orgWithMixedSubunits}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    expect(screen.getByText(mockSubUnits[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockSubUnits[1].name)).toBeInTheDocument();
    expect(screen.queryByText(otherSubUnit.name)).not.toBeInTheDocument();
  });

  it("should change chevron icon when subunit section is toggled", () => {
    render(
      <OrganizationCard
        org={mockOrgWithSubUnits}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    expect(screen.getByTestId("chevron-up-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("chevron-down-icon")).not.toBeInTheDocument();

    const button = screen.getAllByRole("button")[0];
    fireEvent.click(button);

    expect(screen.getByTestId("chevron-down-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("chevron-up-icon")).not.toBeInTheDocument();
  });

  it("should show both headunit and subunit expand buttons when org has both", () => {
    const orgWithBoth: Organization = {
      ...mockOrg,
      headUnit: {
        name: "Head Unit",
        organizationNumber: "33333333333",
        unitType: "AS",
        isDeleted: false,
      },
      subUnits: mockSubUnits,
    };

    render(
      <OrganizationCard
        org={orgWithBoth}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
    expect(screen.getByTestId("chevron-down-icon")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-up-icon")).toBeInTheDocument();
  });

  it("should expand head unit and subunits independently", () => {
    const orgWithBoth: Organization = {
      ...mockOrg,
      headUnit: {
        name: "Head Unit",
        organizationNumber: "33333333333",
        unitType: "AS",
        isDeleted: false,
      },
      subUnits: mockSubUnits,
    };

    render(
      <OrganizationCard
        org={orgWithBoth}
        setSelectedOrg={mockSetSelectedOrg}
      />,
    );

    const [headbutton, subbutton] = screen.getAllByRole("button");

    fireEvent.click(headbutton);
    expect(screen.getByText(orgWithBoth.headUnit!.name)).toBeInTheDocument();
    expect(screen.queryByText(mockSubUnits[0].name)).not.toBeInTheDocument();

    fireEvent.click(subbutton);
    expect(screen.getByText(mockSubUnits[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockSubUnits[1].name)).toBeInTheDocument();
    expect(screen.getByText(orgWithBoth.headUnit!.name)).toBeInTheDocument();
  });
});
