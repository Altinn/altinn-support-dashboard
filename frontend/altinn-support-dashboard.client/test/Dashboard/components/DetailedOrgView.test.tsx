import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Organization } from "../../../src/models/models";
import DetailedOrgView from "../../../src/components/Dashboard/components/DetailedOrgView";
import "@testing-library/jest-dom";

vi.mock("../../../src/hooks/hooks", () => ({
  useOrgDetails: vi.fn(),
}));

vi.mock("../../../src/stores/Appstore", () => ({
  useAppStore: vi.fn(),
}));

vi.mock("../../../src/components/Dashboard/components/ERRolesTable", () => ({
  default: ({ selectedOrg }: { selectedOrg: Organization }) => (
    <div data-testid="er-roles-table">ERRolesTable: {selectedOrg.name}</div>
  ),
}));

vi.mock("../../../src/components/Dashboard/components/RoleDetails", () => ({
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  RoleDetails: ({ selectedContact, onBack }: any) => (
    <div data-testid="role-details">
      RoleDetails: {selectedContact.name}
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock(
  "../../../src/components/Dashboard/components/contacts/ContactsSearchBar",
  () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ searchQuery, setSearchQuery, handleClearSearch }: any) => (
      <div data-testid="contacts-search-bar">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
        />
        <button onClick={handleClearSearch}>Clear</button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../src/components/Dashboard/components/contacts/ContactsTable",
  () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ setSelectedContact }: any) => (
      <div data-testid="contacts-table">
        <button
          onClick={() =>
            setSelectedContact({
              name: "Test Contact",
              ssnToken: "token123",
            })
          }
        >
          Select Contact
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../src/components/Dashboard/components/contacts/NotificationContactTable",
  () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ title, field }: any) => (
      <div data-testid={`notification-table-${field}`}>{title}</div>
    ),
  }),
);

vi.mock("@digdir/designsystemet-react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

const { useOrgDetails } = await import("../../../src/hooks/hooks");
const { useAppStore } = await import("../../../src/stores/Appstore");

describe("DetailedOrgView", () => {
  const mockSelectedOrg: Organization = {
    organizationNumber: "123456789",
    name: "Test Organization",
    isDeleted: false,
    unitType: "test",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAppStore as any).mockReturnValue({ environment: "test" });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgDetails as any).mockReturnValue({
      notificationAdressesQuery: {
        data: [],
      },
    });
  });

  it("should render nothing when selectedOrg is null", () => {
    const { container } = render(<DetailedOrgView selectedOrg={null} />);
    expect(container.querySelector("h2")).not.toBeInTheDocument();
  });

  it("should render organization details when selectedOrg is provided", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);
    expect(
      screen.getByText(`Org Nr: ${mockSelectedOrg.organizationNumber}`),
    ).toBeInTheDocument();
    expect(screen.getByText(mockSelectedOrg.name)).toBeInTheDocument();
  });

  it("should render ContactsSearchBar", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);
    expect(screen.getByTestId("contacts-search-bar")).toBeInTheDocument();
  });

  it("should render ContactsTable", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);
    expect(screen.getByTestId("contacts-table")).toBeInTheDocument();
  });

  it("should render NotificationContactTable for notification addresses", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    expect(
      screen.getByText("Varslingsadresser for virksomheten"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mobilnummer")).toBeInTheDocument();
    expect(screen.getByText("E-post")).toBeInTheDocument();
    expect(screen.getByTestId("notification-table-phone")).toBeInTheDocument();
    expect(screen.getByTestId("notification-table-email")).toBeInTheDocument();
  });

  it("should render ERRolesTable", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    expect(screen.getByTestId("er-roles-table")).toBeInTheDocument();
    expect(
      screen.getByText(`ERRolesTable: ${mockSelectedOrg.name}`),
    ).toBeInTheDocument();
  });

  it("should allow searching contacts", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Test" } });
    expect(searchInput).toHaveValue("Test");
  });

  it("should clear search when the clear button is clicked", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    const searchInput = screen.getByPlaceholderText("Search");
    const clearButton = screen.getByText("Clear");

    fireEvent.change(searchInput, { target: { value: "Test" } });
    expect(searchInput).toHaveValue("Test");

    fireEvent.click(clearButton);
    expect(searchInput).toHaveValue("");
  });

  it("should show RoleDetails when contact is selected", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    const selectContactButton = screen.getByText("Select Contact");
    fireEvent.click(selectContactButton);

    expect(screen.getByTestId("role-details")).toBeInTheDocument();
    expect(screen.getByText("RoleDetails: Test Contact")).toBeInTheDocument();
  });

  it("should hide ContactsTable, ContactsSearchBar, ERRolesTable and NotificationContactTable when contact is selected", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    const selectContactButton = screen.getByText("Select Contact");
    fireEvent.click(selectContactButton);

    expect(screen.queryByTestId("contacts-table")).not.toBeInTheDocument();
    expect(screen.queryByTestId("contacts-search-bar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("er-roles-table")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("notification-table-phone"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("notification-table-email"),
    ).not.toBeInTheDocument();
  });

  it("should go back to org details when back button in RoleDetails is clicked", () => {
    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    const selectContactButton = screen.getByText("Select Contact");
    fireEvent.click(selectContactButton);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(screen.queryByTestId("role-details")).not.toBeInTheDocument();
    expect(screen.getByTestId("contacts-table")).toBeInTheDocument();
    expect(screen.getByTestId("er-roles-table")).toBeInTheDocument();
  });

  it("should clear search and selected contact when selectedOrg changes", () => {
    const { rerender } = render(
      <DetailedOrgView selectedOrg={mockSelectedOrg} />,
    );

    const newOrg: Organization = {
      organizationNumber: "987654321",
      name: "New Organization",
      isDeleted: false,
      unitType: "test",
    };

    rerender(<DetailedOrgView selectedOrg={newOrg} />);

    const searchInput = screen.getByPlaceholderText("Search");
    expect(searchInput).toHaveValue("");
    expect(
      screen.getByText(`Org Nr: ${newOrg.organizationNumber}`),
    ).toBeInTheDocument();
    expect(screen.getByText(newOrg.name)).toBeInTheDocument();
  });

  it("should pass notification data to NotificationContactTable", () => {
    const mockNotificationData = [
      { phone: "12345678", email: "test@test.no", lastChanged: "2026-01-01" },
    ];

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useOrgDetails as any).mockReturnValue({
      notificationAdressesQuery: {
        data: mockNotificationData,
      },
    });

    render(<DetailedOrgView selectedOrg={mockSelectedOrg} />);

    expect(screen.getByTestId("notification-table-phone")).toBeInTheDocument();
    expect(screen.getByTestId("notification-table-email")).toBeInTheDocument();
  });
});

