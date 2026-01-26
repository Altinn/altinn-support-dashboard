import { vi, expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ManualRoleSearchTextField from '../../src/components/ManualRoleSearch/ManualRoleSearchTextfield';


describe('ManualRoleSearchTextfield', () => {

    it('renders with correct label', () => {
        render(
            <ManualRoleSearchTextField
                label = "Test"
                value = ""
                onChange = {vi.fn()}
            />
        );
        expect(screen.getByLabelText('Test')).toBeInTheDocument();
    });

    it('renders with correct value', () => {
        render(
            <ManualRoleSearchTextField
                label = ""
                value = "Test Value"
                onChange = {vi.fn()}
            />
        );
        expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
    });

    it('renders both label and value correctly', () => {
        render (
            <ManualRoleSearchTextField
                label = "Test label"
                value = "Test value"
                onChange = {vi.fn()}
            />
        );
        expect(screen.getByLabelText('Test label')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
    });

    it('calls onChange when input value changes', async () => {
        const mockOnChange = vi.fn();
        const user = userEvent.setup();

        render (
            <ManualRoleSearchTextField
                label = "Change Test"
                value = ""
                onChange = {mockOnChange}
            />
        );

        const input = screen.getByLabelText('Change Test');
        await user.type(input, 'New Value'); //Mocks typing 'New Value' into the input field

        expect(mockOnChange).toHaveBeenCalledTimes(9); // Called for everytime a character is typed, here 9 characters (8 letters and one space)
        expect(mockOnChange).toHaveBeenLastCalledWith('e'); // Last call will just be 'e' bc the parent component controls the value
    });

    it('updates value when prop changes', () => {
        const { rerender } = render (
            <ManualRoleSearchTextField
                label = "Prop Change Test"
                value = "Initial Value"
                onChange = {vi.fn()}
            />
        );

        expect(screen.getByDisplayValue('Initial Value')).toBeInTheDocument();

        //Rerender with new prop value
        rerender(
            <ManualRoleSearchTextField
                label = "Prop Change Test"
                value = "Updated Value"
                onChange = {vi.fn()}
            />
        );
        expect(screen.getByDisplayValue('Updated Value')).toBeInTheDocument();
    })
})