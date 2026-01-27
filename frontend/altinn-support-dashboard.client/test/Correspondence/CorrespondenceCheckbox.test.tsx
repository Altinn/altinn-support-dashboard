import { describe, expect } from "vitest";
import CorrespondenceCheckbox from "../../src/components/Correspondence/CorrespondenceCheckbox";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";


describe('CorrespondenceCheckbox', () => {

    it('should render checkbox with legend and label', () => {
        render(
            <CorrespondenceCheckbox />
        );

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByText("Trengs det bekreftelse?")).toBeInTheDocument();
        expect(screen.getByText("Ja")).toBeInTheDocument();
    });

    it('should render as unchecked by default', () => {
        render(
            <CorrespondenceCheckbox />
        );

        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).not.toBeChecked();
    });

    it('the checkbox should be checkable', async () => {
        const user = userEvent.setup();
        render(
            <CorrespondenceCheckbox />
        );

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);
        expect(checkbox).toBeChecked();
    });
})