/**
 * @vitest-environment jsdom
 */
//Had to add the above line to make sure the test runs in our pipline
import { describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import CorrespondenceButton from "../../src/components/Correspondence/CorrespondenceButton";
import { useCorrespondencePost } from "../../src/hooks/hooks";


vi.mock("../../src/hooks/hooks", () => ({
    useCorrespondencePost: vi.fn()
}));

beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
});

describe('CorrespondenceButton', () => {
    const recipients = [
        "123456789012",
        "987654321"
    ];
    const mockSetResponseMessage = vi.fn();

    it('should render button with correct label', () => {
        const mockMutateAsync = vi.fn();
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as unknown as ReturnType<typeof useCorrespondencePost>);
        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType=""
                dueDate=""
                setResponseMessage={mockSetResponseMessage}
            />
        );

        expect(screen.getByRole('button', { name: /Send melding/i })).toBeInTheDocument();
    });

    it('should call post mutation with correct data when button is clicked', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({ success: true});
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={true}
                resourceType=""
                dueDate=""
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
                isConfirmationNeeded: true,
                resourceType: "",
                dueDateTime: undefined
            }
        });
    });

    it('should call setResponseMessage with response after successful post', async () => {
        const mockResponse = { success: true };
        const mockMutateAsync = vi.fn().mockResolvedValue(mockResponse);
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType=""
                dueDate=""
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
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={["123456789012", "", "987654321", ""]}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType=""
                dueDate=""
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
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType=""
                dueDate=""
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
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={["", "", ""]}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType=""
                dueDate=""
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

    it('should include resourceType in the request', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType="confidentiality"
                dueDate="2026-01-26"
                setResponseMessage={mockSetResponseMessage}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: /Send melding/i }));

        expect(mockMutateAsync).toHaveBeenCalledWith(
            expect.objectContaining({
                correspondence: expect.objectContaining({
                    resourceType: "confidentiality"
                })
            })
        );
    });

    it('should include dueDate in the request', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType="default"
                dueDate="2026-01-26"
                setResponseMessage={mockSetResponseMessage}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: /Send melding/i }));

        expect(mockMutateAsync).toHaveBeenCalledWith(
            expect.objectContaining({
                correspondence: expect.objectContaining({
                    dueDateTime: "2026-01-26"
                })
            })
        );
    });

    it('should save response to sessionStorage', async () => {
        const mockResponse = { success: true };
        const mockMutateAsync = vi.fn().mockResolvedValue(mockResponse);
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        const setItemSpy = vi.spyOn(window.sessionStorage.__proto__, 'setItem'); // Spy on sessionStorage.setItem to check if it's called

        render(
            <CorrespondenceButton 
                recipients={recipients}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType=""
                dueDate=""
                setResponseMessage={mockSetResponseMessage}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: /Send melding/i }));

        expect(setItemSpy).toHaveBeenCalledWith('responseMessage', JSON.stringify(mockResponse));

        setItemSpy.mockRestore();//clean up
    });

    it('should disable button when recipients array is empty', () => {
        const mockMutateAsync = vi.fn();
        vi.mocked(useCorrespondencePost).mockReturnValue({
            mutateAsync: mockMutateAsync,
        } as unknown as ReturnType<typeof useCorrespondencePost>);

        render(
            <CorrespondenceButton 
                recipients={[]}
                title="Test"
                summary="test"
                body="test"
                checked={false}
                resourceType=""
                dueDate=""
                setResponseMessage={mockSetResponseMessage}
            />
        );

        expect(screen.getByRole('button', { name: /Send melding/i })).toBeDisabled();
    });
});