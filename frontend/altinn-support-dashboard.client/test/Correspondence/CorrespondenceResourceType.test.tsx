import { describe, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CorrespondenceResourceType from "../../src/components/Correspondence/CorrespondenceResourceType";
import { setLocalStorageValue } from "../../src/components/ManualRoleSearch/utils/storageUtils";


vi.mock("../../src/components/ManualRoleSearch/utils/storageUtils", () => ({
    setLocalStorageValue: vi.fn(),
}));


describe('CorrespondenceResourceType', () => {
    const mockSetResourceType = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render label', () => {
        render(
            <CorrespondenceResourceType
                resourceType="default"
                setResourceType={mockSetResourceType}
            />
        );

        expect(screen.getByText('Hvem skal kunne lese meldingen?')).toBeInTheDocument();
    });

    it('should render select with correct options', () => {
        render(
            <CorrespondenceResourceType
                resourceType="default"
                setResourceType={mockSetResourceType}
            />
        );

        expect(screen.getByRole('option', { name: 'Ordinær post' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Taushetsbelagt post' })).toBeInTheDocument();
    });

    it('should call setResourceType when option is selected', () => {
        render(
            <CorrespondenceResourceType
                resourceType="default"
                setResourceType={mockSetResourceType}
            />
        );
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'confidentiality' } });

        expect(mockSetResourceType).toHaveBeenCalledWith('confidentiality');
    });

    it('should save to localStorage when option is selected', () => {
        render(
            <CorrespondenceResourceType
                resourceType="default"
                setResourceType={mockSetResourceType}
            />
        );
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'confidentiality' } });

        expect(setLocalStorageValue).toHaveBeenCalledWith('resourceType', 'confidentiality');
    });

    it('should display correct initial value', () => {
        render(
            <CorrespondenceResourceType
                resourceType="confidentiality"
                setResourceType={mockSetResourceType}
            />
        );
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('confidentiality');
    });

});