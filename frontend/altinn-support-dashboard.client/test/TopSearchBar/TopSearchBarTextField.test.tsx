import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import { TopSearchBarTextField } from "../../src/components/TopSearchBar/TopSearchBarTextField";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";




describe('TopSearchBarTextField', () => {

    it('should render correctly', () => {
        render(
            <TopSearchBarTextField
                query = ""
                setQuery = {() => {}}
                setSelectedOrg = {() => {}}
            />
        );

        expect(screen.getByPlaceholderText('Mobilnummer / E-post / Organisasjonsnummer')).toBeInTheDocument();
    });

    it('should render with correct value', () => {
        render(
            <TopSearchBarTextField
                query = "Test Query"
                setQuery = {() => {}}
                setSelectedOrg = {() => {}}
            />
        );

        expect(screen.getByDisplayValue('Test Query')).toBeInTheDocument();
    });

    it('should call onChange when input value changes', async () => {
        const user = userEvent.setup();
        const mockSetQuery = vi.fn();
        const mockSetSelectedOrg = vi.fn();
        render(
            <TopSearchBarTextField
                query = ""
                setQuery = {mockSetQuery}
                setSelectedOrg = {mockSetSelectedOrg}
            />
        );

        const input = screen.getByPlaceholderText('Mobilnummer / E-post / Organisasjonsnummer');

        await user.type(input, 'New Query');
        await user.keyboard('{Enter}');

        expect(mockSetQuery).toHaveBeenCalledTimes(1); // Only called once bc it is first called when Enter is pressed
        expect(mockSetQuery).toHaveBeenLastCalledWith('New Query'); // The call will have the full value
    });

    it('should clear input when X button is clicked', async () => {
        const user = userEvent.setup();
        const mockSetQuery = vi.fn();
        render(
            <TopSearchBarTextField
                query = "To Be Cleared"
                setQuery = {mockSetQuery}
                setSelectedOrg = {() => {}}
            />
        );

        const clearButton = screen.getByRole('button', { name: 'X' });

        await user.click(clearButton);

        expect(mockSetQuery).toHaveBeenCalledWith('');
    });

    it('should trigger search when search button is clicked', async () => {
        const user = userEvent.setup();
        const mockSetQuery = vi.fn();
        const mockSetSelectedOrg = vi.fn();
        render(
            <TopSearchBarTextField
                query = ""
                setQuery = {mockSetQuery}
                setSelectedOrg = {mockSetSelectedOrg}
            />
        );

        const input = screen.getByPlaceholderText('Mobilnummer / E-post / Organisasjonsnummer');
        const searchButton = screen.getByRole('button', { name: '' }); // Search button has no accessible name

        await user.type(input, 'Search Query');
        await user.click(searchButton);

        expect(mockSetQuery).toHaveBeenCalledWith('Search Query');
    });

    it('should call setSelectedOrg with null when query changes', async () => {
        const user = userEvent.setup();
        const mockSetQuery = vi.fn();
        const mockSetSelectedOrg = vi.fn();
        render(
            <TopSearchBarTextField
                query = "Initial Query"
                setQuery = {mockSetQuery}
                setSelectedOrg = {mockSetSelectedOrg}
            />
        );

        const input = screen.getByPlaceholderText('Mobilnummer / E-post / Organisasjonsnummer');
        const searchButton = screen.getByRole('button', { name: '' }); // Search button has no accessible name

        await user.clear(input);
        await user.type(input, 'Different Query');
        await user.click(searchButton);

        expect(mockSetSelectedOrg).toHaveBeenCalledWith(null);
    });

    it('should not trigger search on non-Enter key press', async () => {
        const user = userEvent.setup();
        const mockSetQuery = vi.fn();

        render(
            <TopSearchBarTextField
                query = ""
                setQuery = {mockSetQuery}
                setSelectedOrg = {() => {}}
            />
        );

        const input = screen.getByPlaceholderText('Mobilnummer / E-post / Organisasjonsnummer');

        await user.type(input, 'Test');
        await user.keyboard('{Tab}');

        expect(mockSetQuery).not.toHaveBeenCalled();
    });

    it('should not call setSelectedOrg when query is unchanged', async () => {
        const user = userEvent.setup();
        const mockSetQuery = vi.fn();
        const mockSetSelectedOrg = vi.fn();

        render(
            <TopSearchBarTextField
                query = "Same Query"
                setQuery = {mockSetQuery}
                setSelectedOrg = {mockSetSelectedOrg}
            />
        );

        const input = screen.getByPlaceholderText('Mobilnummer / E-post / Organisasjonsnummer');
        const searchButton = screen.getByRole('button', { name: '' }); // Search button has no accessible name

        await user.clear(input);
        await user.type(input, 'Same Query');
        await user.click(searchButton);

        expect(mockSetSelectedOrg).not.toHaveBeenCalled();

    });
})