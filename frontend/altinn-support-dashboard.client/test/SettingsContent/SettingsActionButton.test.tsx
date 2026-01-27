import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsActionButtons from "../../src/components/SettingsContent/SettingsActionButtons";



vi.mock("../../src/utils/ansattportenApi", () => ({
  initiateSignOut: vi.fn(),
}));

describe('SettingsActionButtons', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render both buttons', () => {
        render(<SettingsActionButtons />);

        expect(screen.getByRole('button', { name: /Last inn på nytt/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logg ut/i })).toBeInTheDocument();
    });

    it('should reload the page when the reaload button is clicked', async () => {
        const user = userEvent.setup();
        const reloadSpy = vi.fn();

        Object.defineProperty(window, 'location', {
            value: {
                reload: reloadSpy,
            },
            writable: true,
        });

        render(<SettingsActionButtons />);

        const reloadButton = screen.getByRole('button', { name: /Last inn på nytt/i });
        await user.click(reloadButton);

        expect(reloadSpy).toHaveBeenCalled();
    });
})