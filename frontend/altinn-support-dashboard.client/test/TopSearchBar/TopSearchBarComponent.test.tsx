import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchComponent from "../../src/components/TopSearchBar/TopSearchBarComponent";


vi.mock("../../src/components/TopSearchBar/TopSearchBarTextField", () => ({
    
    TopSearchBarTextField: ({ query }: {query: string}) => (
        <div data-testid="mock-top-search-bar-text-field">
            <span>Query: {query}</span>
        </div>
    )
}));

describe('TopSearchBarComponent', async () => {

    it('should render heading', () => {
        render(
            <SearchComponent
                query = ""
                setQuery = {() => {}}
                setSelectedOrg = {() => {}}
            />
        );

        expect(screen.getByRole('heading', { name: 'Søk etter Organisasjoner' })).toBeInTheDocument();
    });

    it('should render TopSearchBarTextField Component', () => {
        render(
            <SearchComponent
                query = "Test Query"
                setQuery = {() => {}}
                setSelectedOrg = {() => {}}
            />
        );

        expect(screen.getByTestId('mock-top-search-bar-text-field')).toBeInTheDocument();
    });

    it('should pass correct props to TopSearchBarTextField', () => {
        const mockSetQuery = vi.fn();
        const mockSetSelectedOrg = vi.fn();
        render(
            <SearchComponent
                query = "Test Query"
                setQuery = {mockSetQuery}
                setSelectedOrg = {mockSetSelectedOrg}
            />
        );

        expect(screen.getByText('Query: Test Query')).toBeInTheDocument();
        expect(screen.getByTestId('mock-top-search-bar-text-field')).toBeInTheDocument();
    });

})