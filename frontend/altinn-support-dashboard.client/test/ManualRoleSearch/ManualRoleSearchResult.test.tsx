import { describe, expect, it } from "vitest";
import { Role } from "../../src/models/models";
import { render, screen } from "@testing-library/react";
import ManualRoleSearchResult from "../../src/components/ManualRoleSearch/ManualRoleSearchResult";



describe('ManualRoleSearchResult', () => {
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

    it('displays correct header when loading', () => {
        render(
            <ManualRoleSearchResult
                error = {null}
                isLoading = {true}
                hasSearched = {false}
                roles = {[]}
            />
        );
        expect(screen.getByText('Laster roller...')).toBeInTheDocument();
    })

    it('displays error message when error occurs', () => {
        render(
            <ManualRoleSearchResult
                error = {new Error('Test error')}
                isLoading = {false}
                hasSearched = {false}
                roles = {[]}
            />
        );
        expect(screen.getByText('Test error')).toBeInTheDocument();
    })

    it('displays no roles found, when search has no result', () => {
        render(
            <ManualRoleSearchResult
                error = {null}
                isLoading = {false}
                hasSearched = {true}
                roles = {[]}
            />
        );
        expect(screen.getByText('Ingen roller funnet.')).toBeInTheDocument();
    })

    it('displays role table when roles are found', () => {
        render(
            <ManualRoleSearchResult
                error = {null}
                isLoading = {false}
                hasSearched = {true}
                roles = {mockRoles}
            />
        );
        expect(screen.getByRole('table')).toBeInTheDocument();
    })

    it('does not display "Ingen roller funnet" when not searched yet', () => {
        render(
            <ManualRoleSearchResult
                error = {null}
                isLoading = {false}
                hasSearched = {false}
                roles = {[]}
            />
        );
        expect(screen.queryByText('Ingen roller funnet.')).not.toBeInTheDocument();
    })
})