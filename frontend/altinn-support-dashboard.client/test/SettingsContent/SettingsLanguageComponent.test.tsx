import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SettingsLanguageComponent from "../../src/components/SettingsContent/SettingsLanguageComponent";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";



describe('SettingsLanguageComponent', () => {

    it('should render heading and select', () => {
        render(<SettingsLanguageComponent />);

        expect(screen.getByText('Språkvalg')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should have Norsk Bokmål as default', () => {
        render(<SettingsLanguageComponent />);

        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('nb');
    });

    it('should show language option', () => {
        render(<SettingsLanguageComponent />);

        const option = screen.getByRole('option', { name: 'Norsk Bokmål' });
        expect(option).toBeInTheDocument();
    });

    it('should change language when a new option is selected', async () => {
        const user = userEvent.setup();
        render(<SettingsLanguageComponent />);

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'nb');

        //Just selecting the only option available for now to test functionality
        expect(select).toHaveValue('nb');
    });
})