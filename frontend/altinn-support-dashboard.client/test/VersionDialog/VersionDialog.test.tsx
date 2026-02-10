import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { VersionDialog } from "../../src/components/VersionDialog/VersionDialog";


vi.mock('../../src/components/VersionDialog/VersionDialogBox', () => ({
    default: ({ versionInfo, open }: {versionInfo: { version: string}, open: boolean}) => (
        <div data-testid="version-dialog-box">
            VersionDialogBox Mock - Version: {versionInfo.version}, Open: {open.toString()}
        </div>
    )
}))

describe('VersionDialog', () => {
    it('should render VersionDialogBox when versionInfo is provided and open is true', () => {
        render(
            <VersionDialog
                versionInfo={{ version: '1.0.0', releaseDate: '2024-01-01', changes: [] }}
                open={true}
                onClose={() => {}}
            />
        );

        expect(screen.getByTestId('version-dialog-box')).toBeInTheDocument();

    });

    it('should not render anything when versionInfo is null', () => {
        const { container } = render(
            <VersionDialog
                versionInfo={null}
                open={true}
                onClose={() => {}}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('should not render anything when open is false', () => {
        const { container } = render(
            <VersionDialog
                versionInfo={{ version: '1.0.0', releaseDate: '2024-01-01', changes: [] }}
                open={false}
                onClose={() => {}}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('should pass correct props to VersionDialogBox', () => {
        const mockOnClose = vi.fn();
        render(
            <VersionDialog
                versionInfo={{ version: '2.0.0', releaseDate: '2024-02-01', changes: [] }}
                open={true}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByTestId('version-dialog-box')).toHaveTextContent('Version: 2.0.0');
        expect(screen.getByTestId('version-dialog-box')).toHaveTextContent('Open: true');
    });

})