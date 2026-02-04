import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import VersionDialogTitle from "../../src/components/VersionDialog/VersionDialogTitle";

vi.mock('../../src/components/VersionDialog/utils/formatDateutils', () => ({
    default: (date: string) => date ? `formatted: ${date}` : ''
}));

vi.mock('@digdir/designsystemet-react', () => ({
    Dialog: {
        Block: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="dialog-block">{children}</div>
        )
    },
    Heading: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <h2 className={className}>{children}</h2>
    ),
    Paragraph: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <p className={className}>{children}</p>
    )
}));


describe('VersionDialogTitle', () => {

    it('should render version heading with version number', () => {
        const versionInfo = {
            version: '1.2.3',
            releaseDate: '2026-01-01',
            changes: []
        };

        render(<VersionDialogTitle versionInfo={versionInfo} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ny versjon: 1.2.3');
    });

    it('should render version paragraph with version and formatted date', () => {
        const versionInfo = {
            version: '1.2.3',
            releaseDate: '2026-01-01',
            changes: []
        };

        render(<VersionDialogTitle versionInfo={versionInfo} />);

        expect(screen.getByText(/Versjon 1.2.3 ble lansert formatted: 2026-01-01/)).toBeInTheDocument();
    });

    it('should handle null versionInfo gracefully', () => {
        render(<VersionDialogTitle versionInfo={null} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ny versjon: 🎉🥳');
        expect(screen.getByText('Versjon ble lansert')).toBeInTheDocument();
    });
})