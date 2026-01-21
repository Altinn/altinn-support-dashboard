import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageInputField from "../../src/components/Correspondence/MessageInputField";



describe('MessageInputField', () => {

    it('should render with correct label text', () => {

        render(<MessageInputField
            labelText="Test Label"
            value=""
            onChange={() => {}}
        />);

        expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it('should display the provided value', () => {

        render(<MessageInputField
            labelText="Test Label"
            value="Initial Value"
            onChange={() => {}}
        />);
        expect(screen.getByDisplayValue("Initial Value")).toBeInTheDocument();
    });

    it('should call onChange when textarea value changes', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<MessageInputField
            labelText="Test Label"
            value=""
            onChange={handleChange}
        />);
        const textarea = screen.getByRole('textbox');

        await user.type(textarea, 'abc');

        expect(handleChange).toHaveBeenCalledTimes(3);
        expect(handleChange).toHaveBeenCalledWith('a');
        expect(handleChange).toHaveBeenCalledWith('b');
        expect(handleChange).toHaveBeenCalledWith('c');
    });

    it('should update value when prop changes', () => {

        const { rerender } = render(<MessageInputField
            labelText="Test Label"
            value="First Value"
            onChange={() => {}}
        />);

        expect(screen.getByDisplayValue("First Value")).toBeInTheDocument();

        rerender(<MessageInputField
            labelText="Test Label"
            value="Second Value"
            onChange={() => {}}
        />);
        expect(screen.getByDisplayValue("Second Value")).toBeInTheDocument();
    });

    it('should handle empty value', () => {
        render(<MessageInputField
            labelText="Test Label"
            value=""
            onChange={() => {}}
        />);
        const valueElement = screen.getByRole('textbox');
        expect(valueElement).toHaveValue('');
    });

    it('should apply custom className if provided', () => {

        const { container } = render(
            <MessageInputField
                labelText="Test Label"
                value=""
                onChange={() => {}}
                className="custom-class"
            />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

});