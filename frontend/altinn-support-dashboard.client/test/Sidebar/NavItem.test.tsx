import { vi } from "vitest"
import React from 'react';
import { render, screen } from '@testing-library/react';
import NavItem from '../../src/components/Sidebar/NavItem';



vi.mock('@digdir/designsystemet-react', () => ({
    Tooltip: ({ children, content }: { children: React.ReactNode, content: string }) => (
        <div className="tooltip-mock" data-content={content}>
            {children}
        </div>
    )
}));

const MockIcon = () => <svg data-testid="mock-icon"> Icon </svg>;

describe('NavItem', () => {

    it('should render title when not collapsed', () => {
        render(
            <NavItem
                to="/test"
                title="Test Title"
                icon={<MockIcon />}
                isCollapsed={false}
            />
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });
});