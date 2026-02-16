import { describe, expect, vi, it, beforeEach } from "vitest";
import { Organization, SelectedOrg, Subunit } from "../../../../src/models/models";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrganizationCard } from "../../../../src/components/Dashboard/components/organizations/OrganizationCard";
import '@testing-library/jest-dom';




vi.mock('@digdir/designsystemet-react', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Card: ({ children, onClick, variant, className, ...props }: any) => (
        <div role="article" data-variant={variant} className={className} onClick={onClick} {...props}>
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
        return <Tag className={className} {...props}>{children}</Tag>;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paragraph: ({ children, className, ...props }: any) => (
        <p className={className} {...props}>{children}</p>
    ),
}));

vi.mock('@navikt/aksel-icons', () => ({
    ChevronUpIcon: () => <span data-testid="chevron-up-icon">↑</span>,
    ChevronDownIcon: () => <span data-testid="chevron-down-icon">↓</span>,
}));

describe('OrganizationCard', () => {
    const mockSetSelectedOrg = vi.fn();

    const mockOrg: Organization = {
        name: "Test Organization",
        organizationNumber: "123456789",
    };

    const mockSubUnits: Subunit[] = [
        {
            navn: "Subunit 1",
            organisasjonsnummer: "11111111111",
            overordnetEnhet: "123456789",
        },
        {
            navn: "Subunit 2",
            organisasjonsnummer: "22222222222",
            overordnetEnhet: "123456789",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render organization card with name and org number', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        expect(screen.getByText(mockOrg.name)).toBeInTheDocument();
        expect(screen.getByText(`Org Nr: ${mockOrg.organizationNumber}`)).toBeInTheDocument();
    });

    it('should call setSelectedOrg with correct data when card is clicked', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const card = screen.getByRole('article');
        fireEvent.click(card);

        expect(mockSetSelectedOrg).toHaveBeenCalledWith({
            Name: mockOrg.name,
            OrganizationNumber: mockOrg.organizationNumber,
        });
    });

    it('should show tinted variant when org is selected', () => {
        const selectedOrg: SelectedOrg = {
            Name: mockOrg.name,
            OrganizationNumber: mockOrg.organizationNumber,
        };

        render(
            <OrganizationCard
                org={mockOrg}
                selectedOrg={selectedOrg}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const card = screen.getByRole('article');
        expect(card).toHaveAttribute('data-variant', 'tinted');
    });

    it('should show default variant when org is not selected', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                selectedOrg={null}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const card = screen.getByRole('article');
        expect(card).toHaveAttribute('data-variant', 'default');
    });

    it('should show subunit expand button when org has subunits', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={mockSubUnits}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button');
        expect(button.length).toBeGreaterThan(0);
        expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
    });

    it('should not show subunit expand button when org has no subunits', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();
    });

    it('should expand and show subunits when expand button is clicked', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={mockSubUnits}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        expect(screen.queryByText(mockSubUnits[0].navn)).not.toBeInTheDocument();

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        expect(screen.getByText(mockSubUnits[0].navn)).toBeInTheDocument();
        expect(screen.getByText(mockSubUnits[1].navn)).toBeInTheDocument();
    });

    it('should toggle subunits visibility when expand button is clicked twice', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={mockSubUnits}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);
        expect(screen.getByText(mockSubUnits[0].navn)).toBeInTheDocument();

        fireEvent.click(button);
        expect(screen.queryByText(mockSubUnits[0].navn)).not.toBeInTheDocument();
    });

    it('should call setSelectedOrg with correct data when subunit card is clicked', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={mockSubUnits}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        const subunitCard = screen.getByText(mockSubUnits[0].navn).closest('div');
        fireEvent.click(subunitCard!);

        expect(mockSetSelectedOrg).toHaveBeenCalledWith({
            Name: mockSubUnits[0].navn,
            OrganizationNumber: mockSubUnits[0].organisasjonsnummer,
        });
    });

    it('should show tinted variant for selected subunit', () => {
        const selectedOrg: SelectedOrg = {
            Name: mockSubUnits[0].navn,
            OrganizationNumber: mockSubUnits[0].organisasjonsnummer,
        };

        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={mockSubUnits}
                selectedOrg={selectedOrg}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        const subunitCard = screen.getByText(mockSubUnits[0].navn).closest('div');
        expect(subunitCard).toHaveAttribute('data-variant', 'tinted');
    });

    it('should show head unit with expand button when org has head unit', () => {
        const orgWithHeadUnit: Organization = {
            ...mockOrg,
            headUnit: {
                name: "Head Unit",
                organizationNumber: "33333333333",
            },
        };

        render(
            <OrganizationCard
                org={orgWithHeadUnit}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button')[0];
        expect(button).toBeInTheDocument();
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('should expand and show head unit when head expand button is clicked', () => {
        const orgWithHeadUnit: Organization = {
            ...mockOrg,
            headUnit: {
                name: "Head Unit",
                organizationNumber: "33333333333",
            },
        };

        render(
            <OrganizationCard
                org={orgWithHeadUnit}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        expect(screen.queryByText(orgWithHeadUnit.headUnit!.name)).not.toBeInTheDocument();

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        expect(screen.getByText(orgWithHeadUnit.headUnit!.name)).toBeInTheDocument();
        expect(screen.getByText(`Org Nr: ${orgWithHeadUnit.headUnit!.organizationNumber}`)).toBeInTheDocument();
    });

    it('should call setSelectedOrg when head unit card is clicked', () => {
        const orgWithHeadUnit: Organization = {
            ...mockOrg,
            headUnit: {
                name: "Head Unit",
                organizationNumber: "33333333333",
            },
        };
        
        render(
            <OrganizationCard
                org={orgWithHeadUnit}
                subUnits={[]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        const headUnitCard = screen.getByText(orgWithHeadUnit.headUnit!.name).closest('div');
        fireEvent.click(headUnitCard!);

        expect(mockSetSelectedOrg).toHaveBeenCalledWith({
            Name: orgWithHeadUnit.headUnit!.name,
            OrganizationNumber: orgWithHeadUnit.headUnit!.organizationNumber,
        });
    });

    it('should show tinted variant for selected head unit', () => {
        const orgWithHeadUnit: Organization = {
            ...mockOrg,
            headUnit: {
                name: "Head Unit",
                organizationNumber: "33333333333",
            },
        };

        const selectedOrg: SelectedOrg = {
            Name: orgWithHeadUnit.headUnit!.name,
            OrganizationNumber: orgWithHeadUnit.headUnit!.organizationNumber,
        };

        render(
            <OrganizationCard
                org={orgWithHeadUnit}
                subUnits={[]}
                selectedOrg={selectedOrg}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        const headUnitCard = screen.getByText(orgWithHeadUnit.headUnit!.name).closest('div');
        expect(headUnitCard).toHaveAttribute('data-variant', 'tinted');
    });

    it('should only show subunits that belong to this org', () => {
        const otherSubUnit: Subunit = {
            navn: "Other Subunit",
            organisasjonsnummer: "44444444444",
            overordnetEnhet: "987654321",
        };

        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={[...mockSubUnits, otherSubUnit]}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        expect(screen.getByText(mockSubUnits[0].navn)).toBeInTheDocument();
        expect(screen.getByText(mockSubUnits[1].navn)).toBeInTheDocument();
        expect(screen.queryByText(otherSubUnit.navn)).not.toBeInTheDocument();
    });

    it('should change chevron icon when subunit section is toggled', () => {
        render(
            <OrganizationCard
                org={mockOrg}
                subUnits={mockSubUnits}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();

        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);

        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
    });

    it('should show both headunit and subunit expand buttons when org has both', () => {
        const orgWithBoth: Organization = {
            ...mockOrg,
            headUnit: {
                name: "Head Unit",
                organizationNumber: "33333333333",
            },
        };

        render(
            <OrganizationCard
                org={orgWithBoth}
                subUnits={mockSubUnits}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(2);
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
        expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
    });

    it('should expand head unit and subunits independently', () => {
        const orgWithBoth: Organization = {
            ...mockOrg,
            headUnit: {
                name: "Head Unit",
                organizationNumber: "33333333333",
            },
        };

        render(
            <OrganizationCard
                org={orgWithBoth}
                subUnits={mockSubUnits}
                setSelectedOrg={mockSetSelectedOrg}
            />
        );

        const [headbutton, subbutton] = screen.getAllByRole('button');

        fireEvent.click(headbutton);
        expect(screen.getByText(orgWithBoth.headUnit!.name)).toBeInTheDocument();
        expect(screen.queryByText(mockSubUnits[0].navn)).not.toBeInTheDocument();

        fireEvent.click(subbutton);
        expect(screen.getByText(mockSubUnits[0].navn)).toBeInTheDocument();
        expect(screen.getByText(mockSubUnits[1].navn)).toBeInTheDocument();
        expect(screen.getByText(orgWithBoth.headUnit!.name)).toBeInTheDocument();
    });
})