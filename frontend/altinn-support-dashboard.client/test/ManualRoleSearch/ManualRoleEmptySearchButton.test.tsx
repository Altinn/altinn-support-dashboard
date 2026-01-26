import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import EmptySearchButton from "../../src/components/ManualRoleSearch/ManualRoleEmptySearchButton";

describe('ManualRoleEmptySearchButton', () => {

    it('renders button with correct text', () => {
        render(
            <EmptySearchButton
                sethasSearched={vi.fn()}
                setRollehaver={vi.fn()}
                setRollegiver={vi.fn()}
            />
        );
        expect(screen.getByRole('button', { name: 'Tøm søk' })).toBeInTheDocument();
    });

    it('calls sethasSearched, setRollehaver and setRollegiver when button is clicked', async () => {
        const user = userEvent.setup();
        const mockSethasSearched = vi.fn();
        const mockSetRollehaver = vi.fn();
        const mockSetRollegiver = vi.fn();

        render(
            <EmptySearchButton
                sethasSearched={mockSethasSearched}
                setRollehaver={mockSetRollehaver}
                setRollegiver={mockSetRollegiver}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Tøm søk' }));

        expect(mockSethasSearched).toHaveBeenCalledWith(false);
        expect(mockSetRollehaver).toHaveBeenCalledWith('');
        expect(mockSetRollegiver).toHaveBeenCalledWith('');
    });
})