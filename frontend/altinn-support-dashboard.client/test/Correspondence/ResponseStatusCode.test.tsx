import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ResponseStatusCode from "../../src/components/Correspondence/ResponseStatusCode";


describe("ResponseStatusCode", () => {

    it("should render status code when provided", () => {

        render(<ResponseStatusCode statuscode={200} />);

        expect(screen.getByText("Status Code: 200")).toBeInTheDocument();
    });

    it('should apply succes styling for 200 status code', () => {
        render(<ResponseStatusCode statuscode={200} />);
        const cardElement = screen.getByText("Status Code: 200").closest('div');
        expect(cardElement?.className).toContain('containerSuccess');
        //Checks that the success class is applied by checking that the class name contains 'containerSuccess'
    });

    it('should apply not success styling for 404 status code', () => {
        render(<ResponseStatusCode statuscode={404} />);
        const cardElement = screen.getByText("Status Code: 404").closest('div');
        expect(cardElement?.className).toContain('containerNotSuccess');
    });

    it('should apply error styling for 500 status code', () => {
        render(<ResponseStatusCode statuscode={500} />);
        const cardElement = screen.getByText("Status Code: 500").closest('div');
        expect(cardElement?.className).toContain('containerNotSuccess');
    });

    it('should apply error styling for 300 status code', () => {
        render(<ResponseStatusCode statuscode={300} />);
        const cardElement = screen.getByText("Status Code: 300").closest('div');
        expect(cardElement?.className).toContain('containerNotSuccess');
    });

    it("should not render anything when status code is not provided", () => {

        const { container } = render(<ResponseStatusCode />);
        expect(container.firstChild).toBeEmptyDOMElement();
    });
});