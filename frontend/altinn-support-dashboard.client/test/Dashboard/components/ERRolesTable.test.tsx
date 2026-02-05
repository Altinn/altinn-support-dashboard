import { beforeEach, describe, expect, vi } from "vitest";
import { ERRoles } from "../../../src/models/models";
import { render, screen } from "@testing-library/react";
import ERRolesTable from "../../../src/components/Dashboard/components/ERRolesTable";





vi.mock("../../../src/hooks/hooks", () => ({
  useOrgDetails: vi.fn(),
}));

vi.mock("../../../src/stores/Appstore", () => ({
  useAppStore: vi.fn(),
}));

vi.mock("../../../src/components/Dashboard/utils/dateUtils", () => ({
  formatDate: vi.fn((date) => `Formatted: ${date}`),
}));

vi.mock("../../../src/components/Dashboard/utils/contactUtils", () => ({
  sortERRoles: vi.fn((roles) => roles),
}));

vi.mock("@digdir/designsystemet-react", () => ({
  Table: Object.assign(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ children, ...props }: any) => <table {...props}>{children}</table>,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Head: ({ children }: any) => <thead>{children}</thead>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Body: ({ children }: any) => <tbody>{children}</tbody>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Row: ({ children }: any) => <tr>{children}</tr>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      HeaderCell: ({ children, onClick, sort, ...props }: any) => (
        <th onClick={onClick} data-sort={sort} {...props}>{children}</th>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
    }
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Heading: ({ children, level, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = `h${level}` as any;
    return <Tag {...props}>{children}</Tag>;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Paragraph: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

const { useOrgDetails } = await import("../../../src/hooks/hooks");
const { useAppStore } = await import("../../../src/stores/Appstore");
const { sortERRoles } = await import("../../../src/components/Dashboard/utils/contactUtils");


describe('ERRolesTable', () => {
    const mockSelectedOrg = {
        OrganizationNumber: "123456789",
        Name: "Test Org",
    };

    const mockRoles: ERRoles[] = [
        {
            type: { kode: "ERole", beskrivelse: "ERole" },
            sistEndret: "2026-01-01",
            roller: [
                {
                    type: { kode: "Admin", beskrivelse: "Admin" },
                    person: {
                        navn: { fornavn: "Test", mellomnavn: "", etternavn: "User" },
                        erDoed: false,
                    },
                    fratraadt: false,
                },
            ],
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useAppStore as any).mockReturnValue({ environment: "test" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgDetails as any).mockReturnValue({
            ERolesQuery: {
                data: mockRoles,
            },
        });
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sortERRoles as any).mockImplementation((roles: any) => roles);
    });

    it('should render ER-roller heading', () => {
        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);
        expect(screen.getByText('ER-roller')).toBeInTheDocument();
    });
    
})