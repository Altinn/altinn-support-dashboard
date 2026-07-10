import { afterEach, beforeEach, expect, vi, describe, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import SsnText from "../src/components/SsnText";

let mockUnredactedSsn: string | null = null;
let mockRefetch = vi.fn();

vi.mock('../src/hooks/hooks', () => ({
    useSsnFromToken: vi.fn(() => ({
        data: mockUnredactedSsn,
        refetch: mockRefetch,
    })),
}));

describe('SsnText', () => {
    const mockContact = {
        displayedSocialSecurityNumber: "123456*****",
        ssnToken: "mock-token",
    };

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockUnredactedSsn = null;
        mockRefetch = vi.fn();
        consoleErrorSpy.mockClear();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('should render with redacted SSN initially', () => {
        render(<SsnText contact={mockContact} />);

        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });

    it('should show "Vis fullt fødselsnummer" title when redacted', () => {
        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");
        expect(span).toHaveAttribute("title", "Vis fullt fødselsnummer");
    });

    it('should apply cursor pointer style', () => {
        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");
        expect(span).toHaveStyle("cursor: pointer");
    });

    it('should render as a plain span', () => {
        render(<SsnText contact={mockContact} />);

        expect(screen.getByText("123456*****").tagName).toBe("SPAN");
    });

    it('should call refetch when clicked and no unredacted SSN exists', async () => {
        mockRefetch.mockResolvedValue({});

        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });

        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should show unredacted SSN after successful refetch', async () => {
        mockRefetch.mockResolvedValue({});

        const { rerender } = render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });

        expect(mockRefetch).toHaveBeenCalled();

        mockUnredactedSsn = "12345678901";
        rerender(<SsnText contact={mockContact} />);

        expect(screen.getByText("12345678901")).toBeInTheDocument();
    });

    it('should log error and keep redacted state when refetch fails', async () => {
        vi.useRealTimers();

        const testError = new Error("Test error");
        mockRefetch.mockRejectedValue(testError);

        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");
        fireEvent.click(span);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error fetching unredacted SSN:",
                testError
            );
        });

        expect(screen.getByText("123456*****")).toBeInTheDocument();

        vi.useFakeTimers();
    });

    it('should toggle to show unredacted SSN when clicked and data already exists', async () => {
        mockUnredactedSsn = "12345678901";

        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");
        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("12345678901")).toBeInTheDocument();
        expect(mockRefetch).not.toHaveBeenCalled();
    });

    it('should toggle back to redacted SSN when clicked again', async () => {
        mockUnredactedSsn = "12345678901";

        render(<SsnText contact={mockContact} />);

        let span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });
        expect(screen.getByText("12345678901")).toBeInTheDocument();

        span = screen.getByText("12345678901");
        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });

    it('should update title attribute when toggling', async () => {
        mockUnredactedSsn = "12345678901";

        render(<SsnText contact={mockContact} />);

        let span = screen.getByText("123456*****");

        expect(span).toHaveAttribute("title", "Vis fullt fødselsnummer");

        await act(async () => {
            fireEvent.click(span);
        });

        span = screen.getByText("12345678901");
        expect(span).toHaveAttribute("title", "Skjul fullt fødselsnummer");
    });

    it('should auto redact SSN after 15 seconds', async () => {
        mockUnredactedSsn = "12345678901";

        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("12345678901")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(15000);
        });

        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });

    it('should not auto-redact before 15 seconds', async () => {
        mockUnredactedSsn = "12345678901";

        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("12345678901")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(14000);
        });

        expect(screen.getByText("12345678901")).toBeInTheDocument();
    });

    it('should not set timeout when SSN is redacted', () => {
        render(<SsnText contact={mockContact} />);

        expect(vi.getTimerCount()).toBe(0);
        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });

    it('should clear timeout on unmount', async () => {
        mockUnredactedSsn = "12345678901";

        const { unmount } = render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("12345678901")).toBeInTheDocument();
        expect(vi.getTimerCount()).toBe(1);

        unmount();

        expect(vi.getTimerCount()).toBe(0);
    });

    it('should clear existing timeout when toggling redacted state', async () => {
        mockUnredactedSsn = "12345678901";

        render(<SsnText contact={mockContact} />);

        let span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("12345678901")).toBeInTheDocument();
        expect(vi.getTimerCount()).toBe(1);

        span = screen.getByText("12345678901");
        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("123456*****")).toBeInTheDocument();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('should handle missing ssnToken', async () => {
        const contactWithoutToken = { ...mockContact, ssnToken: undefined };

        render(<SsnText contact={contactWithoutToken} />);

        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });

    it('should handle null unredactedSsn from hook', async () => {
        mockUnredactedSsn = null;

        render(<SsnText contact={mockContact} />);

        const span = screen.getByText("123456*****");

        await act(async () => {
            fireEvent.click(span);
        });

        expect(screen.getByText("123456*****")).toBeInTheDocument();
        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string as environment', () => {
        render(<SsnText contact={mockContact} environment="" />);

        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });
});
