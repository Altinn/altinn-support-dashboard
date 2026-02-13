import { afterEach, beforeEach, expect, vi } from "vitest";
import { PersonalContactAltinn3 } from "../src/models/models";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SsnCell from "../src/components/SsnCell";



let mockUnredactedSsn: string | null = null;
let mockRefetch = vi.fn();

vi.mock('../src/hooks/hooks', () => ({
    useSsnFromToken: vi.fn(() => ({
        data: mockUnredactedSsn,
        refetch: mockRefetch,
    })),
}));

vi.mock('@digdir/designsystemet-react', () => ({
    Table: {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: ({ children, onClick, style, title }: any) => (
            <td
                onClick={onClick}
                style={style}
                title={title}
                data-testid="table-cell"
            >
                {children}
            </td>
        ),
    },
}));


describe('SsnCell', () => {
    const mockContact: PersonalContactAltinn3 = {
        nationalIdentityNumber: "12345678901",
        name: "Test User",
        phone: "12345678",
        email: "test@test.no",
        lastChanged: "2026-01-01T00:00:00Z",
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
        render(<SsnCell contact={mockContact} />);

        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });

    it('should show "Vis fullt fødselsnummer" title when redacted', () => {
        render(<SsnCell contact={mockContact} />);

        const cell = screen.getByTestId("table-cell");
        expect(cell).toHaveAttribute("title", "Vis fullt fødselsnummer");
    });

    it('should apply cursor pointer style', () => {
        render(<SsnCell contact={mockContact} />);

        const cell = screen.getByTestId("table-cell");
        expect(cell).toHaveStyle("cursor: pointer");
    });

    it('should render as Table.Cell component', () => {
        render(<SsnCell contact={mockContact} />);

        expect(screen.getByTestId("table-cell")).toBeInTheDocument();
    });

    it('should call refetch when clicked and no unredacted SSN exists', async () => {
        mockRefetch.mockResolvedValue({});

        render(<SsnCell contact={mockContact} />);

        const cell = screen.getByTestId("table-cell");

        await act(async () => {
            fireEvent.click(cell);
        });

        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should show unredacted SSN after successful refetch', async () => {
        mockRefetch.mockResolvedValue({});

        const { rerender } = render(<SsnCell contact={mockContact} />);

        const cell = screen.getByTestId("table-cell");

        await act(async () => {
            fireEvent.click(cell);
        });

        expect(mockRefetch).toHaveBeenCalled();

        mockUnredactedSsn = "12345678901";
        rerender(<SsnCell contact={mockContact} />);

        expect(screen.getByText("12345678901")).toBeInTheDocument();
    });

    it('should log error and keep redacted state when refetch fails', async () => {
        vi.useRealTimers();

        const testError = new Error("Test error");
        mockRefetch.mockRejectedValue(testError);

        render(<SsnCell contact={mockContact} />);

        const cell = screen.getByTestId("table-cell");
        fireEvent.click(cell);

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

        render(<SsnCell contact={mockContact} />);

        const cell = screen.getByTestId("table-cell");
        await act(async () => {
            fireEvent.click(cell);
        });

        expect(screen.getByText("12345678901")).toBeInTheDocument();
        expect(mockRefetch).not.toHaveBeenCalled();
    });

    it('should toggle back to redacted SSN when clicked again', async () => {
        mockUnredactedSsn = "12345678901";

        render(<SsnCell contact={mockContact} />);

        const cell = screen.getByTestId("table-cell");

        await act(async () => {
            fireEvent.click(cell);
        });
        expect(screen.getByText("12345678901")).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(cell);
        });

        expect(screen.getByText("123456*****")).toBeInTheDocument();
    });
})