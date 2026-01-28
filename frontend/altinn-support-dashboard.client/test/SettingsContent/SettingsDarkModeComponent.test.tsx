import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import SettingsDarkModeComponent from "../../src/components/SettingsContent/SettingsDarkModeComponent";
import userEvent from "@testing-library/user-event";



vi.mock('../../src/stores/Appstore', () => ({
    useAppStore: vi.fn(),
}));

describe('SettingsDarkModeComponent', () => {
    const mockSetIsDarkMode = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render heading and switch', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            isDarkMode: false,
            setIsDarkMode: mockSetIsDarkMode,
        }));

        render(<SettingsDarkModeComponent />);

        expect(screen.getByText('Darkmode')).toBeInTheDocument();
        expect(screen.getByRole('switch', { name: /enable dark mode/i })).toBeInTheDocument();
    });

    it('should show switch as unchecked when darkMode is false', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            isDarkMode: false,
            setIsDarkMode: mockSetIsDarkMode,
        }));

        render(<SettingsDarkModeComponent />);

        const darkModeSwitch = screen.getByRole('switch', { name: /enable dark mode/i });
        expect(darkModeSwitch).not.toBeChecked();
    });

    it('should show switch as checked when darkMode is true', async () => {
        const { useAppStore } = await import('../../src/stores/Appstore');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            isDarkMode: true,
            setIsDarkMode: mockSetIsDarkMode,
        }));

        render(<SettingsDarkModeComponent />);

        const darkModeSwitch = screen.getByRole('switch', { name: /enable dark mode/i });
        expect(darkModeSwitch).toBeChecked();
    });

    it('should call setIsDarkMode with true when switch is toggled on', async () => {
        const user = userEvent.setup();
        const { useAppStore } = await import('../../src/stores/Appstore');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            isDarkMode: false,
            setIsDarkMode: mockSetIsDarkMode,
        }));

        render(<SettingsDarkModeComponent />);

        const darkModeSwitch = screen.getByRole('switch', { name: /enable dark mode/i });
        await user.click(darkModeSwitch);

        expect(mockSetIsDarkMode).toHaveBeenCalledWith(true);
    });

    it('should call setIsDarkMode with false when switch is toggled off', async () => {
        const user = userEvent.setup();
        const { useAppStore } = await import('../../src/stores/Appstore');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useAppStore).mockImplementation((selector: any) => selector({
            isDarkMode: true,
            setIsDarkMode: mockSetIsDarkMode,
        }));

        render(<SettingsDarkModeComponent />);

        const darkModeSwitch = screen.getByRole('switch', { name: /enable dark mode/i });
        await user.click(darkModeSwitch);

        expect(mockSetIsDarkMode).toHaveBeenCalledWith(false);
    });
})