import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import CorrespondenceDueDate from "../../src/components/Correspondence/CorrespondenceDueDate";
import { setLocalStorageValue } from "../../src/components/ManualRoleSearch/utils/storageUtils";

describe('CorrespondenceDueDate', () => {

    vi.mock("../../src/components/ManualRoleSearch/utils/storageUtils", () => ({
        setLocalStorageValue: vi.fn(),
    }));

    const mockSetSelectedDateTime = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render label', () => {
        render(
            <CorrespondenceDueDate
                SelectedDateTime=""
                SetSelectedDateTime={mockSetSelectedDateTime}
            />
        );

        const label = document.querySelector('label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent('Frist');
    });

    it('should render date input with correct value', () => {
        render(
            <CorrespondenceDueDate
                SelectedDateTime="2026-01-26"
                SetSelectedDateTime={mockSetSelectedDateTime}
            />
        );

        const input  = screen.getByDisplayValue('2026-01-26');
        expect(input).toHaveAttribute('type', 'date');
    });

    it('should set min date to tomorrow', () => {
        render(
            <CorrespondenceDueDate
                SelectedDateTime=""
                SetSelectedDateTime={mockSetSelectedDateTime}
            />
        );
        const input  = document.querySelector('input[type="date"]') as HTMLInputElement;
        const validDate = new Date();
        validDate.setDate(validDate.getDate() + 1);
        const minDate = validDate.toISOString().split("T")[0];
        expect(input).toHaveAttribute('min', minDate);
    });

    it('should call SetSelectedDateTime when date changes', () => {
        render(
            <CorrespondenceDueDate
                SelectedDateTime="2026-01-26"
                SetSelectedDateTime={mockSetSelectedDateTime}
            />
        );
        
        const input  = screen.getByDisplayValue('2026-01-26');

        fireEvent.change(input, { target: { value: '2026-02-15' } });

        expect(mockSetSelectedDateTime).toHaveBeenCalledWith('2026-02-15');
    });

    it('should save to localStorage when date changes', () => {
        render(
            <CorrespondenceDueDate
                SelectedDateTime="2026-01-26"
                SetSelectedDateTime={mockSetSelectedDateTime}
            />
        );

        const input  = screen.getByDisplayValue('2026-01-26');

        fireEvent.change(input, { target: { value: '2026-02-15' } });

        expect(setLocalStorageValue).toHaveBeenCalledWith('dueDate', '2026-02-15');
    });

})