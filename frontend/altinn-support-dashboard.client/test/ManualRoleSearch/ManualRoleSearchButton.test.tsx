import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchButton from "../../src/components/ManualRoleSearch/ManualRoleSearchButton";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";


describe('ManualRoleSearchButton', () => {
    
    it('renders button with correct text', () => {
        render(
            <SearchButton
                rollehaver = "123"
                rollegiver = "456"
                isLoading = {false}
                refetch = {vi.fn()}
                sethasSearched={vi.fn()}
            />
        );
        expect(screen.getByRole('button', { name: 'Søk' })).toBeInTheDocument();
    });

    it('calls refetch and sethasSearched when button is clicked', async () => {
        const user = userEvent.setup();
        const mockRefetch = vi.fn();
        const mockSethasSearched = vi.fn();

        render(
            <SearchButton
                rollehaver = "123"
                rollegiver = "456"
                isLoading = {false}
                refetch = {mockRefetch}
                sethasSearched={mockSethasSearched}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Søk' }));

        expect(mockRefetch).toHaveBeenCalled();
        expect(mockSethasSearched).toHaveBeenCalledWith(true);
    });

    it('disables button when isLoading is true', () => {
        render(
            <SearchButton
                rollehaver = "123"
                rollegiver = "456"
                isLoading = {true}
                refetch = {vi.fn()}
                sethasSearched={vi.fn()}
            />
        );
        expect(screen.getByRole('button', { name: 'Søk' })).toBeDisabled();
    });

    it('disables button when rollehaver is empty', () => {
        render(
            <SearchButton
                rollehaver = ""
                rollegiver = "456"
                isLoading = {false}
                refetch = {vi.fn()}
                sethasSearched={vi.fn()}
            />
        );
        expect(screen.getByRole('button', { name: 'Søk' })).toBeDisabled();
    });

    it('disables button when rollegiver is empty', () => {
        render(
            <SearchButton
                rollehaver = "123"
                rollegiver = ""
                isLoading = {false}
                refetch = {vi.fn()}
                sethasSearched={vi.fn()}
            />
        );
        expect(screen.getByRole('button', { name: 'Søk' })).toBeDisabled();
    });

    it ('enables button when isLoading is false and both rollehaver and rollegiver are provided', () => {
        render(
            <SearchButton
                rollehaver = "123"
                rollegiver = "456"
                isLoading = {false}
                refetch = {vi.fn()}
                sethasSearched={vi.fn()}
            />
        );
        expect(screen.getByRole('button', { name: 'Søk' })).toBeEnabled();
    });

    it('does not call handleSearch when button is disablked', () => {
        const user = userEvent.setup();
        const mockRefetch = vi.fn();
        const mockSethasSearched = vi.fn();

        render(
            <SearchButton
                rollehaver = ""
                rollegiver = "456"
                isLoading = {false}
                refetch = {mockRefetch}
                sethasSearched={mockSethasSearched}
            />
        );

        user.click(screen.getByRole('button', { name: 'Søk' }));

        expect(mockRefetch).not.toHaveBeenCalled();
        expect(mockSethasSearched).not.toHaveBeenCalled();
    });
})