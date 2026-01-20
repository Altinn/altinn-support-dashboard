import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RoleTable from "../../src/components/ManualRoleSearch/ManualRoleSearchTable";
import { Role } from "../../src/models/models";


describe('ManualRoleSearchTable', () => {
    // Tests to be implemented
    const mockRoles: Role[] = [
        {
            roleType: "ALTINN",
            roleDefinitionId: 1,
            roleName: "Test 1",
            roleDescription: "Description 1",
            roleDefinitionCode: "TEST1"
        },
        {
            roleType: "ER",
            roleDefinitionId: 2,
            roleName: "Test 2",
            roleDescription: "Description 2",
            roleDefinitionCode: "TEST2"
        }
    ]

    it('renders correct table headers', () => {
        render(<RoleTable roles={[]} />);

        expect(screen.getByText('Rolletype')).toBeInTheDocument();
        expect(screen.getByText('Rollenavn')).toBeInTheDocument();
        expect(screen.getByText('Beskrivelse')).toBeInTheDocument();
        expect(screen.getByText('Rolledefinisjonskode')).toBeInTheDocument();        
    });

    it('renders role data correctly', () => {
        render(<RoleTable roles={mockRoles} />);

        expect(screen.getByText('Test 1')).toBeInTheDocument();
        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('TEST1')).toBeInTheDocument();

        expect(screen.getByText('Test 2')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();
        expect(screen.getByText('TEST2')).toBeInTheDocument();
    });

    it('renders correct amount of roles based on props', () => {
        render(<RoleTable roles={mockRoles} />);

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3);
    })
})