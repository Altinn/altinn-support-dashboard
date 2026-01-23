import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InputComponent from "../../src/components/ManualRoleSearch/ManualRoleSearchInput";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";


describe('ManualRoleSearchInput', () => {

    it('renders both input fields with correct labels', () => {
        render(<InputComponent />);

        expect(screen.getByLabelText('Tilganger fra')).toBeInTheDocument();
        expect(screen.getByLabelText('Tilganger til')).toBeInTheDocument();
    });

    it('displays initial values correctly', () => {
        render(<InputComponent rollegiver="123456789" rollehaver="987654321" />);

        expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
        expect(screen.getByDisplayValue('987654321')).toBeInTheDocument();
    });

    it('on input change, calls setRollehaver', async () => {
        const mockSetRollehaver = vi.fn();
        const user = userEvent.setup();
        render(
            <InputComponent 
                setRollehaver={mockSetRollehaver} 
                rollehaver=""
            />
        );

        const input = screen.getByLabelText('Tilganger til');
        await user.type(input, '12345');

        expect(mockSetRollehaver).toHaveBeenCalledTimes(5);
        expect(mockSetRollehaver).toHaveBeenLastCalledWith('5');
    });

    it('on input change, calls setRollegiver', async () => {
        const mockSetRollegiver = vi.fn();
        const user = userEvent.setup();
        render(
            <InputComponent 
                setRollegiver={mockSetRollegiver} 
                rollegiver=""
            />
        );

        const input = screen.getByLabelText('Tilganger fra');
        await user.type(input, '98765');

        expect(mockSetRollegiver).toHaveBeenCalledTimes(5);
        expect(mockSetRollegiver).toHaveBeenLastCalledWith('5');
    });

    it('when both change handlers are provided, both are called on respective input changes', async () => {
        const mockSetRollehaver = vi.fn();
        const mockSetRollegiver = vi.fn();
        const user = userEvent.setup();
        render(
            <InputComponent 
                setRollehaver={mockSetRollehaver} 
                setRollegiver={mockSetRollegiver}
                rollehaver=""
                rollegiver=""
            />
        );

        const inputRollehaver = screen.getByLabelText('Tilganger til');
        const inputRollegiver = screen.getByLabelText('Tilganger fra');
        await user.type(inputRollehaver, '111');
        await user.type(inputRollegiver, '222');

        expect(mockSetRollehaver).toHaveBeenCalledTimes(3);
        expect(mockSetRollehaver).toHaveBeenLastCalledWith('1');
        expect(mockSetRollegiver).toHaveBeenCalledTimes(3);
        expect(mockSetRollegiver).toHaveBeenLastCalledWith('2');
    });
})