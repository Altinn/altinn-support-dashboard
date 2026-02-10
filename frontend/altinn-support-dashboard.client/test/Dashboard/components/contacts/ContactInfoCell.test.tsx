import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactInfoCell from "../../../../src/components/Dashboard/components/contacts/ContactInfoCell";
import { render, screen, waitFor } from "@testing-library/react";




let mockQuery = "";

vi.mock('../../../../src/stores/DashboardStore', () => ({
    useDashboardStore: vi.fn((selector) => {
        const state = { query: mockQuery };
        return selector ? selector(state) : state;
    }),
}));

vi.mock('../../../../src/components/Dashboard/utils/dateUtils', () => ({
    formatDate: vi.fn((date: string) => `Formatted: ${date}`),
}));

vi.mock('@digdir/designsystemet-react', () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    Tooltip: ({ children, content }: any) => (
        <div data-tooltip={content}>
            {children}
        </div>
    ),
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    Label: ({ children, className }: any) => (
        <span className={className}>{children}</span>
    ),
}));

describe('ContactInfoCell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockQuery = "";
    });

    it('should render contact text when contactLastChangedm exists', () => {
        render(
            <ContactInfoCell
                contact="Test Contact"
                contactLastChanged="2026-01-01T12:00:00Z"
            />
        );

        expect(screen.getByText("Test Contact")).toBeInTheDocument();
    });

    it('should display formatted date in tooltip', () => {
        const { container } = render(
            <ContactInfoCell
                contact="Test Contact"
                contactLastChanged="2026-01-01T12:00:00Z"
            />
        );
        const tooltip = container.querySelector('[data-tooltip]');
        expect(tooltip).toHaveAttribute('data-tooltip', 'Dato endret: Formatted: 2026-01-01T12:00:00Z');
    });

    it('should apply bold class when contact matches userInput', async () => {
        mockQuery = "Test Contact";

        render(
            <ContactInfoCell
                contact="Test Contact"
                contactLastChanged="2026-01-01T12:00:00Z"
            />
        );

        await waitFor(() => {
            const label = screen.getByText("Test Contact");
            expect(label.className).toContain("bold");
        });
    });

    it('should apply bold class case-insesitively', async () => {
        mockQuery = "TEST CONTACT";

        render(
            <ContactInfoCell
                contact="Test Contact"
                contactLastChanged="2026-01-01T12:00:00Z"
            />
        );

        await waitFor(() => {
            const label = screen.getByText("Test Contact");
            expect(label.className).toContain("bold");
        });
    });

    it('should apply bold class ignoring spaces', async () => {
        mockQuery = "TestContact";

        render(
            <ContactInfoCell
                contact="Test Contact"
                contactLastChanged="2026-01-01T12:00:00Z"
            />
        );

        await waitFor(() => {
            const label = screen.getByText("Test Contact");
            expect(label.className).toContain("bold");
        });
    });

    it('should not apply bold class when search query does not match', () => {
        mockQuery = "Non-matching Query";

        render(
            <ContactInfoCell
                contact="Test Contact"
                contactLastChanged="2026-01-01T12:00:00Z"
            />
        );

        const label = screen.getByText("Test Contact");
        expect(label.className).not.toContain("bold");
    });

    it('should handle empty contact value', () => {
        const { container } = render(
            <ContactInfoCell
                contact=""
                contactLastChanged="2026-01-01T12:00:00Z"
            />
        );

        const label = container.querySelector('span');
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent("");
    })
})