import { describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import CorrespondenceButton from "../../src/components/Correspondence/CorrespondenceButton";
import { useCorrespondencePost } from "../../src/hooks/hooks";


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

    it('should call post mutation with correct data when button is clicked', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({ success: true});
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as any);

        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={true}
                setResponseMessage={mockSetResponseMessage}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: /Send melding/i }));

        expect(mockMutateAsync).toHaveBeenCalledWith({
            recipients: recipients,
            correspondence: {
                content: {
                    messageTitle: "Test",
                    messageSummary: "test",
                    messageBody: "test"
                },
                isConfirmationNeeded: true
            }
        });
    });

    it('should call setResponseMessage with response after successful post', async () => {
        const mockResponse = { success: true };
        const mockMutateAsync = vi.fn().mockResolvedValue(mockResponse);
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as any);

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

        await userEvent.click(screen.getByRole('button', { name: /Send melding/i }));

        expect(mockSetResponseMessage).toHaveBeenCalledWith(mockResponse);
    });

    it('should filter out empty strings from recipients', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as any);

        render(
            <CorrespondenceButton 
                recipients={["123456789012", "", "987654321", ""]}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                setResponseMessage={mockSetResponseMessage}
            />
        );

        await userEvent.click(screen.getByRole('button'));

        expect(mockMutateAsync).toHaveBeenCalledWith(
            expect.objectContaining({
                recipients: ["123456789012", "987654321"],
            })
        );
    });

    it('should not disable button during request', async () => {
        const mockMutateAsync = vi.fn().mockImplementation( 
            () => new Promise(resolve => setTimeout(() => resolve({}), 100))
        );
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as any);

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

        const button = screen.getByRole('button', { name: /Send melding/i });

        await userEvent.click(button);

        expect(button).not.toBeDisabled();
    });

    it('should send empty array when all recipients are empty strings', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as any);

        render(
            <CorrespondenceButton 
                recipients={["", "", ""]}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                setResponseMessage={mockSetResponseMessage}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: /Send melding/i }));
        
        expect(mockMutateAsync).toHaveBeenCalledWith(
            expect.objectContaining({
                recipients: [],
            })
        );
    });
});