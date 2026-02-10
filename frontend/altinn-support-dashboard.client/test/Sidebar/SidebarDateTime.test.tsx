import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SideBarDateTime from "../../src/components/Sidebar/SidebarDateTime";


vi.mock('../../src/hooks/hooks', () => ({
    useCurrentDateTime: vi.fn()
}));


describe('SideBarDateTime', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render formatted time and date', async () => {
        const { useCurrentDateTime } = await import('../../src/hooks/hooks');
        vi.mocked(useCurrentDateTime).mockReturnValue({
            currentDateTime: new Date(),
            formattedDate: '01.01.2024',
            formattedTime: '12:00'
        });

        render(<SideBarDateTime />);

        expect(screen.getByText('12:00')).toBeInTheDocument();
        expect(screen.getByText('01.01.2024')).toBeInTheDocument();
    });

    it('should render time as level 5 heading and date as level 6 heading', async () => {
        const { useCurrentDateTime } = await import('../../src/hooks/hooks');
        vi.mocked(useCurrentDateTime).mockReturnValue({
            currentDateTime: new Date(),
            formattedDate: '02.02.2024',
            formattedTime: '14:30'
        });

        render(<SideBarDateTime />);

        const timeHeading = screen.getByText('14:30');
        const dateHeading = screen.getByText('02.02.2024');

        expect(timeHeading.tagName).toBe('H5');
        expect(dateHeading.tagName).toBe('H6');
    });
})