import { beforeEach, describe, vi, expect, it } from "vitest";
import { SelectedOrg } from "../../../../src/models/models";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { OrganizationList } from "../../../../src/components/Dashboard/components/organizations/OrganizationList";


vi.mock('../../../../src/hooks/hooks', () => ({
    useOrgSearch: vi.fn(),
}));

vi.mock('../../../../src/stores/Appstore', () => ({
    useAppStore: vi.fn(),
}));

vi.mock('../../../../src/components/Popup', () => ({
    showPopup: vi.fn(),
}));

vi.mock('../../../../src/components/Dashboard/components/organizations/OrganizationCard', () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    OrganizationCard: ({ org }: any) => (
        <div data-testid={`org-card-${org.organizationNumber}`}>
            {org.name}
        </div>
    ),
}));

vi.mock('@digdir/designsystemet-react', () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    Skeleton: ({ height, ...props }: any) => (
        <div data-testid="skeleton" data-height={height} {...props}>Loading....</div>
    ),
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    Alert: ({ children, ...props }: any) => (
    <div role="alert" {...props}>{children}</div>
    ),
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    Heading: ({ children, level, ...props }: any) => {
        const Tag = `h${level}`;
        return <Tag {...props}>{children}</Tag>
    },
}));

const { useOrgSearch } = await import('../../../../src/hooks/hooks');
const { useAppStore } = await import('../../../../src/stores/Appstore');
const { showPopup } = await import('../../../../src/components/Popup');

describe('OrganizationList', () => {
    const mockSetSelectedOrg = vi.fn();
    const mockSelectedOrg: SelectedOrg = {
        Name: 'Test Org',
        OrganizationNumber: '123456789',
    };

    const mockOrganizations = [
        { name: 'Org 1', organizationNumber: '111111111', type: 'BEDR' },
        { name: 'Org 2', organizationNumber: '222222222', type: 'AS' },
    ];

    beforeEach(() => [
        vi.clearAllMocks(),
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useAppStore as any).mockReturnValue({ environment: 'test' }),
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgSearch as any).mockReturnValue({
            orgQuery: {
                data: mockOrganizations,
                isLoading: false,
                isError: false,
                error: null,
            },
            subunitQuery: {
                data: [],
            },
        }),
    ]);

    it('should render loading skeleton when data is loading', () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgSearch as any).mockReturnValue({
            orgQuery: {
                data: null,
                isLoading: true,
                isError: false,
                error: null,
            },
            subunitQuery: {
                data: null,
                isLoading: false,
                isError: false,
                error: null,
            },
        });

        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query="test"
            />
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('should render "Ingen organisasjoner funnet" when no organization match the query', () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgSearch as any).mockReturnValue({
            orgQuery: {
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            },
            subunitQuery: {
                data: [],
            },
        });

        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query="test"
            />
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Ingen organisasjoner funnet')).toBeInTheDocument();
    });

    it('should not render alert when query is empty', () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgSearch as any).mockReturnValue({
            orgQuery: {
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            },
            subunitQuery: {
                data: [],
            },
        });

        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query=""
            />
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should render organization cards when data is loaded', () => {
        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query="test"
            />
        );

        expect(screen.getByTestId('org-card-111111111')).toBeInTheDocument();
        expect(screen.getByTestId('org-card-222222222')).toBeInTheDocument();
        expect(screen.getByText('Org 1')).toBeInTheDocument();
        expect(screen.getByText('Org 2')).toBeInTheDocument();
    });

    it('should filter out BEDR subunits when parent is in list', () => {
        const orgsWithSubunits = [
            { name: 'Org 1', organizationNumber: '111111111', type: 'BEDR' },
            { name: 'Subunit 1', organisasjonsnummer: '333333333', overordnetEnhet: '111111111', type: 'BEDR' },
            { name: 'Org 2', organizationNumber: '222222222', type: 'AS' },
        ];

        const subUnits = [
            { navn: 'Subunit 1', organisasjonsnummer: '333333333', overordnetEnhet: '111111111', type: 'BEDR' },
        ];

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgSearch as any).mockReturnValue({
            orgQuery: {
                data: orgsWithSubunits,
                isLoading: false,
                isError: false,
                error: null,
            },
            subunitQuery: {
                data: subUnits,
                isLoading: false,                
                isError: false,
                error: null,
            },
        });

        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query="test"
            />
        );

        expect(screen.getByTestId('org-card-111111111')).toBeInTheDocument();
        expect(screen.getByTestId('org-card-222222222')).toBeInTheDocument();
        expect(screen.queryByTestId('org-card-333333333')).not.toBeInTheDocument();
     });

     it('should render BEDR org if not in subunit list', () => {
        const orgsWithBEDR = [
            { name: 'Org 1', organizationNumber: '111111111', type: 'BEDR' },
            { name: 'Org 2', organizationNumber: '222222222', type: 'AS' },
        ];

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgSearch as any).mockReturnValue({
            orgQuery: {
                data: orgsWithBEDR,
                isLoading: false,
                isError: false,
                error: null,
            },
            subunitQuery: {
                data: [],
            },
        });

        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query="test"
            />
        );

        expect(screen.getByTestId('org-card-111111111')).toBeInTheDocument();
        expect(screen.getByTestId('org-card-222222222')).toBeInTheDocument();
     });

     it('should show error popup when query fails', async () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useOrgSearch as any).mockReturnValue({
            orgQuery: {
                data: null,
                isLoading: false,
                isError: true,
                error: { message: 'Failed to fetch organizations' },
            },
            subunitQuery: {
                data: [],
            },
        });
        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query="test"
            />
        );

        await waitFor(() => {
            expect(showPopup).toHaveBeenCalledWith('Failed to fetch organizations', 'error');
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
            subunitQuery: {
                data: [],
            },
        });
        render(
            <OrganizationList
                setSelectedOrg={mockSetSelectedOrg}
                selectedOrg={mockSelectedOrg}
                query="test"
            />
        );

        await waitFor(() => {
            expect(showPopup).toHaveBeenCalledWith('Ukjent feil oppstod', 'error');
        });
    });
})

