import { beforeEach, describe, expect, vi, it } from "vitest";
import { ERRoles } from "../../../src/models/models";
import { fireEvent, render, screen } from "@testing-library/react";
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

    it('should render table headers', () => {
        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Rolletype')).toBeInTheDocument();
        expect(screen.getByText('Person/Virksomhet')).toBeInTheDocument();
        expect(screen.getByText('Dato Endret')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render person role data', () => {
        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Formatted: 2026-01-01')).toBeInTheDocument();
        expect(screen.getByText('Aktiv')).toBeInTheDocument();
    });

    it('should render company role data', () => {
        const company: ERRoles[] = [ 
            {
                type: { kode: "ERole", beskrivelse: "ERole" },
                sistEndret: "2026-01-01",
                roller: [
                    {
                        type: { kode: "Admin", beskrivelse: "Admin" },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        person: undefined as any,
                        enhet: {
                            navn: ["Test Company"],
                            organisasjonsnummer: "987654321",
                            organisasjonsform: {kode: "AS", beskrivelse: "Aksjeselskap"},
                            erSlettet: false,
                        },
                        fratraadt: false,
                    },
                ],
            },
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgDetails as any).mockReturnValue({
            ERolesQuery: {
                data: company,
            },
        });

        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Test Company (987654321)')).toBeInTheDocument();
    });

    it('should display "Fratrådt" status for inactive roles', () => {
        const inactiveRole: ERRoles[] = [
            {
                type: { kode: "ERole", beskrivelse: "ERole" },
                sistEndret: "2026-01-01",
                roller: [
                    {
                        type: { kode: "Admin", beskrivelse: "Admin" },
                        person: {
                            navn: { fornavn: "Inactive", mellomnavn: "", etternavn: "User" },
                            erDoed: false,
                        },
                        fratraadt: true,
                    },
                ],
            },
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgDetails as any).mockReturnValue({
            ERolesQuery: {
                data: inactiveRole,
            },
        });

        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Fratrådt')).toBeInTheDocument();
    });

    it('should display "Død" for deceased persons', () => {
        const deceasedRole: ERRoles[] = [
            {
                type: { kode: "ERole", beskrivelse: "ERole" },
                sistEndret: "2026-01-01",
                roller: [
                    {
                        type: { kode: "Admin", beskrivelse: "Admin" },
                        person: {
                            navn: { fornavn: "Deceased", mellomnavn: "", etternavn: "User" },
                            erDoed: true,
                        },
                        fratraadt: false,
                    },
                ],
            },
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgDetails as any).mockReturnValue({
            ERolesQuery: {
                data: deceasedRole,
            },
        });

        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Aktiv (Død)')).toBeInTheDocument();
    });

    it('should display "Slettet" for deleted companies', () => {
        const deletedCompanyRole: ERRoles[] = [
            {
                type: { kode: "ERole", beskrivelse: "ERole" },
                sistEndret: "2026-01-01",
                roller: [
                    {
                        type: { kode: "Admin", beskrivelse: "Admin" },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        person: undefined as any,
                        enhet: {
                            navn: ["Deleted Company"],
                            organisasjonsnummer: "987654321",
                            organisasjonsform: {kode: "AS", beskrivelse: "Aksjeselskap"},
                            erSlettet: true,
                        },
                        fratraadt: false,
                    },
                ],
            },
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgDetails as any).mockReturnValue({
            ERolesQuery: {
                data: deletedCompanyRole,
            },
        });

        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Aktiv (Slettet)')).toBeInTheDocument();
    });

    it('should display "Ingen roller funnet" when there are no roles', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgDetails as any).mockReturnValue({
            ERolesQuery: {
                data: [],
            },
        });

        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Ingen roller funnet')).toBeInTheDocument();
    });

    it('should display "Ingen roller funnet" when ERoles is undefined', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgDetails as any).mockReturnValue({
            ERolesQuery: {
                data: undefined,
            },
        });

        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        expect(screen.getByText('Ingen roller funnet')).toBeInTheDocument();
    });

    it('should handle sorting by type', async () => {
        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        const typeHeader = screen.getByText('Rolletype');
        await fireEvent.click(typeHeader);
        
        expect(sortERRoles).toHaveBeenCalledWith(
            expect.any(Array),
            'type',
            'ascending'
        );
    });

    it('should cycle through sort directions on repeated clicks', async () => {
        render(<ERRolesTable selectedOrg={mockSelectedOrg} />);

        const typeHeader = screen.getByText('Rolletype');
        await fireEvent.click(typeHeader);
        expect(sortERRoles).toHaveBeenCalledWith(
            expect.any(Array),
            'type',
            'ascending'
        );

        await fireEvent.click(typeHeader);
        expect(sortERRoles).toHaveBeenCalledWith(
            expect.any(Array),
            'type',
            'descending'
        );

        await fireEvent.click(typeHeader);
        expect(sortERRoles).toHaveBeenCalledWith(
            expect.any(Array),
            null,
            undefined
        );
    });
})