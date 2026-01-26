import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CorrespondenceRecipientsList from "../../src/components/Correspondence/CorrespondenceRecipientsList";
import { toast } from "react-toastify";



describe('CorrespondenceRecipientsList', () => {
    const recipients = [
        "123456789012",
        "987654321"
    ];
    const mockRecipients = vi.fn();

    beforeEach(() => {
        mockRecipients.mockClear();
        localStorage.clear();
    });

    it('should render all recipients with labels', () => {
        render(
            <CorrespondenceRecipientsList
                recipients={recipients}
                setRecipients={mockRecipients}
            />
        );

        expect(screen.getByText("Recipient 1")).toBeInTheDocument();
        expect(screen.getByDisplayValue("123456789012")).toBeInTheDocument();
        expect(screen.getByText("Recipient 2")).toBeInTheDocument();
        expect(screen.getByDisplayValue("987654321")).toBeInTheDocument();
    });

    it('should render add recipeint button', () => {
        render(
            <CorrespondenceRecipientsList
                recipients={recipients}
                setRecipients={mockRecipients}
            />
        );

        expect(screen.getByRole('button', { name: /Add recipient/i })).toBeInTheDocument();
    });

    it('should call setRecipients to add new recipient when button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <CorrespondenceRecipientsList
                recipients={recipients}
                setRecipients={mockRecipients}
            />
        );
        const addButton = screen.getByRole('button', { name: /Add recipient/i });
        await user.click(addButton);

        expect(mockRecipients).toHaveBeenCalledTimes(1);
    });

    it('should call setRecipients to remove recipient when x is clicked', async () => {
        const user = userEvent.setup();
        render(
            <CorrespondenceRecipientsList
                recipients={recipients}
                setRecipients={mockRecipients}
            />
        );
        const removeButtons = screen.getAllByRole('button', { name: /X/i });
        await user.click(removeButtons[0]);

        expect(mockRecipients).toHaveBeenCalledTimes(1);
    });

    it('should call setRecipients when input value is changed', async () => {
        const user = userEvent.setup();
        render(
            <CorrespondenceRecipientsList
                recipients={recipients}
                setRecipients={mockRecipients}
            />
        );
        const inputField = screen.getByDisplayValue("123456789012");
        await user.clear(inputField);
        await user.type(inputField, '0');

        expect(mockRecipients).toHaveBeenCalledTimes(2);
        //One for clear and one for typing '0'
    });

    it('should render remove button for all recipients', () => {
        render(
            <CorrespondenceRecipientsList
                recipients={recipients}
                setRecipients={mockRecipients}
            />
        );
        const removeButtons = screen.getAllByRole('button', { name: /X/i });
        expect(removeButtons.length).toBe(recipients.length);
    });

    it('should not remove recipient if only one left', async () => {
        const user = userEvent.setup();
        render(
            <CorrespondenceRecipientsList
                recipients={["123456789012"]}
                setRecipients={mockRecipients}
            />
        );
        const removeButton = screen.getByRole('button', { name: /X/i });
        await user.click(removeButton);
        expect(mockRecipients).toHaveBeenCalledTimes(0);
    });

    it('should save recipients to localStorage when changed', async () => {
        const { rerender } = render(
            <CorrespondenceRecipientsList
                recipients={recipients}
                setRecipients={mockRecipients}
            />
        );

        expect(localStorage.getItem("recipients")).toBe(JSON.stringify(recipients));

        const newRecipients = [
            "111111111",
            "222222222"
        ];

        rerender(
            <CorrespondenceRecipientsList
                recipients={newRecipients}
                setRecipients={mockRecipients}
            />
        );

        expect(localStorage.getItem("recipients")).toBe(JSON.stringify(newRecipients));
    });

    it('should show warning toast when trying to remove the only recipient', async () => {
        const user = userEvent.setup();
        const toastWarningSpy = vi.spyOn(toast, 'warning');

        render(
            <CorrespondenceRecipientsList
                recipients={["123456789012"]}
                setRecipients={mockRecipients}
            />
        );
        const removeButton = screen.getByRole('button', { name: /X/i });
        await user.click(removeButton);

        expect(toastWarningSpy).toHaveBeenCalledWith("You need at least one recipient to create a correspondence" );

        toastWarningSpy.mockRestore();
    });

});