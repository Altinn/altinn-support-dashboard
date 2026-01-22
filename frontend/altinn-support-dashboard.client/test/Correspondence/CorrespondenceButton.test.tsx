import { describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import CorrespondenceButton from "../../src/components/Correspondence/CorrespondenceButton";


vi.mock("../../src/hooks/hooks", () => ({
    useCorrespondencePost: vi.fn()
}));

describe('CorrespondenceButton', () => {
    const recipients = [
        "123456789012",
        "987654321"
    ];
    const mockSetResponseMessage = vi.fn();

    it('should render button with correct label', () => {
        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                setResponseMessage={mockSetResponseMessage}
            />
        );

        expect(screen.getByRole('button', { name: /Send melding/i })).toBeInTheDocument();
    });

    it('should be disabled when no recipients are provided', () => {
        render(
            <CorrespondenceButton 
                recipients={[]}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                setResponseMessage={mockSetResponseMessage}
            />
        );

        expect(screen.getByRole('button', { name: /Send melding/i })).toBeDisabled();
    });
    
});