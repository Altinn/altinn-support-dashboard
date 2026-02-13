import { describe, vi, it, expect } from "vitest";
import { ErrorAlert } from "../../../src/components/Dashboard/components/ErrorAlert";
import { render, screen } from "@testing-library/react";




vi.mock("@digdir/designsystemet-react", () => ({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Alert: ({ children, ...props }: any) => <div role="alert" {...props}>{children}</div>,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}));


describe('ErrorAlert', () => {
    it('should render error message', () => {
        const error = { message: 'An error occurred' };
        render(<ErrorAlert error={error} />);

        expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    it('should render error message and response', () => {
        const error = { message: 'An error occurred', response: 'Error details' };
        render(<ErrorAlert error={error} />);

        expect(screen.getByText('An error occurred')).toBeInTheDocument();
        expect(screen.getByText('Error details')).toBeInTheDocument();
    });

    it('should render nothing when message is empty', () =>{
        const error = { message: '' };
        const { container } = render(<ErrorAlert error={error} />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null when error message is missing', () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = { response: 'Error details' } as any;
        const { container } = render(<ErrorAlert error={error} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render Alert with danger color', () => {
        const error = { message: 'An error occurred' };
        const { container } = render(<ErrorAlert error={error} />);

        expect(container.querySelector('[data-color="danger"]')).toBeInTheDocument();
    });

    it('should return null when error is undefined', () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = undefined as any;
        const { container } = render(<ErrorAlert error={error} />);
        expect(container.firstChild).toBeNull();
    });

    it('should not render response when it is undefined', () => {
        const error = { message: 'An error occurred', response: undefined };
        render(<ErrorAlert error={error} />);
        expect(screen.getByText('An error occurred')).toBeInTheDocument();
        expect(screen.getAllByRole('heading').length).toBe(1);
    });
})