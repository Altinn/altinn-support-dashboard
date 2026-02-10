import { render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import VersionDialogButton from "../../src/components/VersionDialog/VersionDialogButton";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";



vi.mock('@digdir/designsystemet-react', () => ({
    Button: ({ children, onClick, className, variant }: {
        children: React.ReactNode;
        onClick: () => void;
        className: string;
        variant: string;
    }) => (
        <button onClick={onClick} className={className} data-variant={variant}>
            {children}
        </button>
    )
}));


describe('VersionDialogButton', () => {
    it('should render button with correct text', () => {
        render(<VersionDialogButton onClose={() => {}} />);

        expect(screen.getByRole('button', { name: 'Ikke vis igjen' })).toBeInTheDocument();
    });

    it('should call onClose when button is clicked', async () => {
        const mockOnClose = vi.fn();
        const user = userEvent.setup();

        render(<VersionDialogButton onClose={mockOnClose} />);

        const button = screen.getByRole('button', { name: 'Ikke vis igjen' });
        await user.click(button);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should render with primary variant', () => {
        render(<VersionDialogButton onClose={() => {}} />);
        const button = screen.getByRole('button', { name: 'Ikke vis igjen' });

        expect(button).toHaveAttribute('data-variant', 'primary');
    });
})