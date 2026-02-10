import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import VersionDialogContent from "../../src/components/VersionDialog/VersionDialogContent";


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
    ),
    List: {
        Unordered: ({ children, className }: { children: React.ReactNode; className?: string }) => (
            <ul className={className}>{children}</ul>
        ),
        Item: ({ children, className }: { children: React.ReactNode; className?: string }) => (
            <li className={className}>{children}</li>
        )
    }
}));


describe('VersionDialogContent', () => {

    it('should render heading, description and details when changes exist', () => {
        const mockVersionInfo = {
            version: '1.0.0',
            releaseDate: '2024-01-01',
            changes: [
                {
                    title: 'New Features',
                    description: 'We have added new features.',
                    details: ['Feature 1', 'Feature 2']
                }
            ]
        };

        render(<VersionDialogContent versionInfo={mockVersionInfo} />);

        expect(screen.getByRole('heading', { name: 'New Features' })).toBeInTheDocument();
        expect(screen.getByText('We have added new features.')).toBeInTheDocument();
        expect(screen.getByText('Feature 1')).toBeInTheDocument();
        expect(screen.getByText('Feature 2')).toBeInTheDocument();
    });

    it('should not render details list when details array is empty', () => {
        const mockVersionInfo = {
            version: '1.0.0',
            releaseDate: '2024-01-01',
            changes: [
                {
                    title: 'Bug Fixes',
                    description: 'Several bugs have been fixed.',
                    details: []
                }
            ]
        };

        render(<VersionDialogContent versionInfo={mockVersionInfo} />);

        expect(screen.getByRole('heading', { name: 'Bug Fixes' })).toBeInTheDocument();
        expect(screen.getByText('Several bugs have been fixed.')).toBeInTheDocument();
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('should render nothing when versionInfo is null', () => {
        render(<VersionDialogContent versionInfo={null} />);

        expect(screen.queryByTestId('dialog-block')).toBeInTheDocument();
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should render nothing when changes array is empty', () => {
        const mockVersionInfo = {
            version: '1.0.0',
            releaseDate: '2024-01-01',
            changes: []
        };

        render(<VersionDialogContent versionInfo={mockVersionInfo} />);

        expect(screen.queryByTestId('dialog-block')).toBeInTheDocument();
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
})