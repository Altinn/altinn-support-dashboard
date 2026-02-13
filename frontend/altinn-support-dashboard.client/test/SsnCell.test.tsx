import { afterEach, beforeEach, expect, vi } from "vitest";
import { PersonalContactAltinn3 } from "../src/models/models";
import { render, screen } from "@testing-library/react";
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
    })
})