import { vi } from "vitest"
import React from 'react';
import { render, screen } from '@testing-library/react';
import NavItem from '../../src/components/Sidebar/NavItem';
import { MemoryRouter } from "react-router-dom";



vi.mock('@digdir/designsystemet-react', () => ({
    Tooltip: ({ children, content }: { children: React.ReactNode, content: string }) => {
        return React.createElement('div', { 'data-tooltip': content }, children);
    }
}));

const MockIcon = () => <svg data-testid="mock-icon"> Icon </svg>;

describe('NavItem', () => {

    it('should render title when not collapsed', () => {
        render(
            <MemoryRouter>
                <NavItem
                    to="/test"
                    title="Test Title"
                    icon={<MockIcon />}
                    isCollapsed={false}
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    it('should render icon with tooltip when collapsed', () => {
        render(
            <MemoryRouter>
                <NavItem
                    to="/test"
                    title="Test Title"
                    icon={<MockIcon />}
                    isCollapsed={true}
                />
            </MemoryRouter>
        );

        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon').parentElement).toHaveAttribute('data-tooltip', 'Test Title');
    });

    it('should render NavLink with correct href', () => {
        render(
            <MemoryRouter>
                <NavItem
                    to="/test-link"
                    title="Link Title"
                    icon={<MockIcon />}
                    isCollapsed={false}
                />
            </MemoryRouter>
        );

        const navLink = screen.getByRole('link');
        expect(navLink).toHaveAttribute('href', '/test-link');
    });

    it('should apply collapsed class when isCollapsed is true', () => {
        render(
            <MemoryRouter>
                <NavItem
                    to="/collapsed"
                    title="Collapsed Title"
                    icon={<MockIcon />}
                    isCollapsed={true}
                />
            </MemoryRouter>
        );

        const navLink = screen.getByRole('link');
        expect(navLink.className).toMatch(/navButtonCollapsed/);
    });

    it('should not apply collapsed class when isCollapsed is false', () => {
        render(
            <MemoryRouter>
                <NavItem
                    to="/not-collapsed"
                    title="Not Collapsed Title"
                    icon={<MockIcon />}
                    isCollapsed={false}
                />
            </MemoryRouter>
        );

        const navLink = screen.getByRole('link');
        expect(navLink.className).not.toMatch(/navButtonCollapsed/);
    });

    it('should apply selected class when NavLink is active', () => {
        render(
            //Have to 
            <MemoryRouter initialEntries={['/active']}>
                <NavItem
                    to="/active"
                    title="Active Title"
                    icon={<MockIcon />}
                    isCollapsed={false}
                />
            </MemoryRouter>
        );
        const navLink = screen.getByRole('link');
        expect(navLink.className).toMatch(/navButtonSelected/);
    });
});