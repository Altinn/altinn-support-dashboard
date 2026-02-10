import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchContactsBar from "../../../../src/components/Dashboard/components/contacts/ContactsSearchBar";



vi.mock('@digdir/designsystemet-react', () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    Textfield: ({ label, value, onChange, placeholder, className}: any) => (
        <div>
            <label htmlFor="search-input">{label}</label>
            <input
                id="search-input"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
            />
        </div>
    ),
}));

describe('SearchContactsBar', () => {
    const mockSetSearchQuery = vi.fn();
    const mockHandleClearSearch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render textfield with correct label', () => {
        render(
            <SearchContactsBar
                searchQuery=""
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        expect(screen.getByText("Søk i kontakter")).toBeInTheDocument();
    });

    it('should display correct placeholder', () => {
        render(
            <SearchContactsBar
                searchQuery=""
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const input = screen.getByPlaceholderText("Navn / Fødselsnummer / Telefon / E-post");
        expect(input).toBeInTheDocument();
    });

    it('should display current search value', () => {
        render(
            <SearchContactsBar
                searchQuery="Test search"
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const input = screen.getByDisplayValue("Test search");
        expect(input).toBeInTheDocument();
    });

    it('should call setSearchQuery when user types', () => {
        render(
            <SearchContactsBar
                searchQuery=""
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const input = screen.getByPlaceholderText("Navn / Fødselsnummer / Telefon / E-post");
        fireEvent.change(input, { target: { value: "New search" } });

        expect(mockSetSearchQuery).toHaveBeenCalledWith("New search");
    });

    it('should update when searchQuery prop changes', () => {
        const { rerender } = render(
            <SearchContactsBar
                searchQuery="First search"
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        expect(screen.getByDisplayValue("First search")).toBeInTheDocument();

        rerender(
            <SearchContactsBar
                searchQuery="Second search"
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        expect(screen.getByDisplayValue("Second search")).toBeInTheDocument();
    });

    it('should handle empty string', () => {
        render(
            <SearchContactsBar
                searchQuery=""
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const input = screen.getByPlaceholderText("Navn / Fødselsnummer / Telefon / E-post");
        expect(input).toHaveValue("");
    });

    it('should handle special characters in input', () => {
        render(
            <SearchContactsBar
                searchQuery=""
                setSearchQuery={mockSetSearchQuery}
                handleClearSearch={mockHandleClearSearch}
            />
        );
        const input = screen.getByPlaceholderText("Navn / Fødselsnummer / Telefon / E-post");
        fireEvent.change(input, { target: { value: "!@#$%^&*()_+" } });

        expect(mockSetSearchQuery).toHaveBeenCalledWith("!@#$%^&*()_+");
    });
});