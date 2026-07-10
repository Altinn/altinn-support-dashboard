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
                setSelectedCard = {() => {}}
            />
        );

        expect(screen.getByRole('heading', { name: 'Søk etter Organisasjoner' })).toBeInTheDocument();
    });

    it('should render TopSearchBarTextField Component', () => {
        render(
            <SearchComponent
                query = "Test Query"
                setQuery = {() => {}}
                setSelectedCard = {() => {}}
            />
        );

        expect(screen.getByTestId('mock-top-search-bar-text-field')).toBeInTheDocument();
    });

    it('should pass correct props to TopSearchBarTextField', () => {
        const mockSetQuery = vi.fn();
        const mockSetSelectedCard = vi.fn();
        render(
            <SearchComponent
                query = "Test Query"
                setQuery = {mockSetQuery}
                setSelectedCard = {mockSetSelectedCard}
            />
        );

        expect(screen.getByText('Query: Test Query')).toBeInTheDocument();
        expect(screen.getByTestId('mock-top-search-bar-text-field')).toBeInTheDocument();
    });

})