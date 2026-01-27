import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CorrespondenceResponseField from "../../src/components/Correspondence/CorrespondenceResponseField";

describe('CorrespondenceResponseField', () => {

    const responseData = {
            responseBody: "Response body content",
            responseHeader: "Response header content",
            requestBody: "Request body content",
            requestHeader: "Request header content",
            statusCode: "200"
        };

    it('should render tabs when responseData is provided', () => {
        render(<CorrespondenceResponseField responseData={responseData} />);

        expect(screen.getByRole('tab', { name: /Response/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Request/i })).toBeInTheDocument();
    });

    it('should not render tabs when responseData is not provided', () => {

        const { container } = render(<CorrespondenceResponseField />);
        expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('should display response content by default', () => {
        render(<CorrespondenceResponseField responseData={responseData} />);

        expect(screen.getByText("Response body content")).toBeInTheDocument();
        expect(screen.getByText("Response header content")).toBeInTheDocument();
    });

    it('should switch to request tab when clicked', async () => {
        const user = userEvent.setup();
        render(<CorrespondenceResponseField responseData={responseData} />);

        const requestTab = screen.getByRole('tab', { name: /Request/i });
        await user.click(requestTab);

        expect(screen.getByText("Request body content")).toBeInTheDocument();
        expect(screen.getByText("Request header content")).toBeInTheDocument();
    });
    
    it('should switch back to response tab when clicked', async () => {
        const user = userEvent.setup();
        render(<CorrespondenceResponseField responseData={responseData} />);

        const requestTab = screen.getByRole('tab', { name: /Request/i });
        await user.click(requestTab);

        const responseTab = screen.getByRole('tab', { name: /Response/i });
        await user.click(responseTab);

        expect(screen.getByText("Response body content")).toBeInTheDocument();
        expect(screen.getByText("Response header content")).toBeInTheDocument();
    });
});