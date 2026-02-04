import { describe, expect, vi } from "vitest";
import VersionDialogBox from "../../src/components/VersionDialog/VersionDialogBox";
import { render, screen } from "@testing-library/react";



vi.mock('../../src/components/VersionDialog/VersionDialogTitle', () => ({
    default: () => <div data-testid="version-dialog-title">Title Mock</div>
}));

vi.mock('../../src/components/VersionDialog/VersionDialogContent', () => ({
    default: () => <div data-testid="version-dialog-content">Content Mock</div>
}));

vi.mock('../../src/components/VersionDialog/VersionDialogButton', () => ({
    default: () => <div data-testid="version-dialog-button">Button Mock</div>
}));

vi.mock('@digdir/designsystemet-react', () => ({
    Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
        open ? <div data-testid="dialog">{children}</div> : null
    )
}));

describe('VersionDialogBox', () => {
    const mockVersionInfo = { 
        version: '1.0.0', 
        releaseDate: '2026-01-01', 
        changes: [] 
    };

    it('should render Dialog with all child components when open is true', () => {
        render(
            <VersionDialogBox
                versionInfo={mockVersionInfo}
                open={true}
                onClose={() => {}}
            />
        );

        expect(screen.getByTestId('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('version-dialog-title')).toBeInTheDocument();
        expect(screen.getByTestId('version-dialog-content')).toBeInTheDocument();
        expect(screen.getByTestId('version-dialog-button')).toBeInTheDocument();
    });

    it('should not render anything when versionInfo is null', () => {
        const { container } = render(
            <VersionDialogBox
                versionInfo={null}
                open={true}
                onClose={() => {}}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('should not render anything when open is false', () => {
        const { container } = render(
            <VersionDialogBox
                versionInfo={mockVersionInfo}
                open={false}
                onClose={() => {}}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

})