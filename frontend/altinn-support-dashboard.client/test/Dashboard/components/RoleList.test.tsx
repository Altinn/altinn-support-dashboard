import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RoleList from "../../../src/components/Dashboard/components/RoleList";





vi.mock("@digdir/designsystemet-react", () => ({
  Table: {
    Row: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    Cell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  },
}));


describe('RoleList', () => {
    it('should render roles with type', () => {
        const roles = ['Admin', 'User'];
        render(<RoleList roles={roles} type="ERole" />);

        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getAllByText('ERole').length).toBe(2);
    });

    it('should render single role', () => {
        const roles = ['Admin'];
        render(<RoleList roles={roles} type="ERole" />);

        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('ERole')).toBeInTheDocument();
    });

    it('should render nothing when roles is undefined', () => {
        const { container } = render(<RoleList roles={undefined} type="ERole" />);

        expect(container.firstChild).toBeNull();
    });

    it('should render nothing when roles is empty array', () => {
        const { container } = render(<RoleList roles={[]} type="ERole" />);

        expect(screen.queryByText('ERole')).not.toBeInTheDocument();
        expect(container.firstChild).toBeNull();
    });

    it('should render Table.Row and Table.Cell components', () => {
        const roles = ['Admin'];
        const { container } = render(<RoleList roles={roles} type="ERole" />);

        expect(container.querySelector('tr')).toBeInTheDocument();
        expect(container.querySelectorAll('td').length).toBe(2);
    });
})