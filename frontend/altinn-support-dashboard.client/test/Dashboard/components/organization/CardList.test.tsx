import { beforeEach, describe, vi, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CardList } from "../../../../src/components/Dashboard/components/organizations/CardList";

vi.mock("../../../../src/hooks/hooks", () => ({
  useOrgSearch: vi.fn(),
  useUserContactInfoByNin: vi.fn(),
}));

vi.mock("../../../../src/stores/Appstore", () => ({
  useAppStore: vi.fn(),
}));

vi.mock("../../../../src/components/Popup", () => ({
  showPopup: vi.fn(),
}));

vi.mock(
  "../../../../src/components/Dashboard/components/organizations/OrganizationCard",
  () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    OrganizationCard: ({ org }: any) => (
      <div data-testid={`org-card-${org.organizationNumber}`}>{org.name}</div>
    ),
  })
);

vi.mock(
  "../../../../src/components/Dashboard/components/organizations/UserCard",
  () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    UserCard: ({ user }: any) => (
      <div data-testid={`user-card-${user.ssnToken}`}>
        {user.displayedSocialSecurityNumber}
      </div>
    ),
  })
);

vi.mock("@digdir/designsystemet-react", () => ({
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Skeleton: ({ height, ...props }: any) => (
    <div data-testid="skeleton" data-height={height} {...props}>
      Loading....
    </div>
  ),
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Alert: ({ children, ...props }: any) => (
    <div role="alert" {...props}>
      {children}
    </div>
  ),
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Heading: ({ children, level, ...props }: any) => {
    const Tag = `h${level}`;
    return <Tag {...props}>{children}</Tag>;
  },
}));

const { useOrgSearch, useUserContactInfoByNin } =
  await import("../../../../src/hooks/hooks");
const { useAppStore } = await import("../../../../src/stores/Appstore");
const { showPopup } = await import("../../../../src/components/Popup");

describe("CardList", () => {
  const mockSetSelectedCard = vi.fn();

  const mockOrganizations = [
    { name: "Org 1", organizationNumber: "111111111", type: "BEDR" },
    { name: "Org 2", organizationNumber: "222222222", type: "AS" },
  ];

  const mockUser = {
    isReserved: false,
    phoneNumber: "+4799115744",
    emailAddress: "test@test.no",
    displayedSocialSecurityNumber: "088469*****",
    ssnToken: "token-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAppStore as any).mockReturnValue({ environment: "test" });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: {
        data: mockOrganizations,
        isLoading: false,
        isError: false,
        error: null,
      },
    });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContactInfoByNin as any).mockReturnValue({
      userQuery: {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      },
    });
  });

  it("should render loading skeleton when org data is loading", () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: {
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="test"
      />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it('should render "Ingen organisasjoner eller brukere funnet" when nothing matches the query', () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: { data: [], isLoading: false, isError: false, error: null },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="test"
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("Ingen organisasjoner eller brukere funnet")
    ).toBeInTheDocument();
  });

  it("should not render alert when query is empty", () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: { data: [], isLoading: false, isError: false, error: null },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query=""
      />
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should render organization cards when data is loaded", () => {
    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="test"
      />
    );

    expect(screen.getByTestId("org-card-111111111")).toBeInTheDocument();
    expect(screen.getByTestId("org-card-222222222")).toBeInTheDocument();
    expect(screen.getByText("Org 1")).toBeInTheDocument();
    expect(screen.getByText("Org 2")).toBeInTheDocument();
  });

  it("should filter out subunits when parent is in list", () => {
    const orgsWithSubunits = [
      { name: "Org 1", organizationNumber: "111111111", type: "BEDR" },
      {
        name: "Subunit 1",
        organizationNumber: "333333333",
        subUnits: [],
      },
      { name: "Org 2", organizationNumber: "222222222", type: "AS" },
    ];
    orgsWithSubunits[0] = {
      ...orgsWithSubunits[0],
      subUnits: [{ organizationNumber: "333333333" }],
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: {
        data: orgsWithSubunits,
        isLoading: false,
        isError: false,
        error: null,
      },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="test"
      />
    );

    expect(screen.getByTestId("org-card-111111111")).toBeInTheDocument();
    expect(screen.getByTestId("org-card-222222222")).toBeInTheDocument();
    expect(screen.queryByTestId("org-card-333333333")).not.toBeInTheDocument();
  });

  it("should render a user card alongside organization cards when a user is found", () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContactInfoByNin as any).mockReturnValue({
      userQuery: {
        data: mockUser,
        isLoading: false,
        isError: false,
        error: null,
      },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="08846999362"
      />
    );

    expect(screen.getByTestId("user-card-token-123")).toBeInTheDocument();
    expect(screen.getByText("088469*****")).toBeInTheDocument();
    expect(screen.getByTestId("org-card-111111111")).toBeInTheDocument();
    expect(screen.getByTestId("org-card-222222222")).toBeInTheDocument();
  });

  it("should not render a user card when no user is found", () => {
    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="test"
      />
    );

    expect(screen.queryByTestId(/user-card-/)).not.toBeInTheDocument();
  });

  it("should render only the user card when no organizations match but a user does", () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: { data: [], isLoading: false, isError: false, error: null },
    });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContactInfoByNin as any).mockReturnValue({
      userQuery: {
        data: mockUser,
        isLoading: false,
        isError: false,
        error: null,
      },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="08846999362"
      />
    );

    expect(screen.getByTestId("user-card-token-123")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should show error popup when org query fails", async () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: {
        data: null,
        isLoading: false,
        isError: true,
        error: { message: "Failed to fetch organizations" },
      },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="test"
      />
    );

    await waitFor(() => {
      expect(showPopup).toHaveBeenCalledWith(
        "Failed to fetch organizations",
        "error"
      );
    });
  });

  it('should show "Ukjent feil oppstod" popup when query fails without error message', async () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgSearch as any).mockReturnValue({
      orgQuery: {
        data: null,
        isLoading: false,
        isError: true,
        error: null,
      },
    });

    render(
      <CardList
        setSelectedCard={mockSetSelectedCard}
        selectedCard={null}
        query="test"
      />
    );

    await waitFor(() => {
      expect(showPopup).toHaveBeenCalledWith("Ukjent feil oppstod", "error");
    });
  });
});
