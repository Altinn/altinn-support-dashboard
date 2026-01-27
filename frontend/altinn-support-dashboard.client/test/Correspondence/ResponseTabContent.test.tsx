import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ResponseTabContent from "../../src/components/Correspondence/ResponseTabContent";




describe("ResponseTabContent", () => {
  

    it('both heading labels should be rendered', () => {

        render(
            <ResponseTabContent body="Sample body content" headers="Sample header content" />
        );

        expect(screen.getByRole('heading', { name: /Headers/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Body/i })).toBeInTheDocument();
    });

    it('should render body and headers contenct correctly', () => {

        render(
            <ResponseTabContent body="Sample body content" headers="Sample header content" />
        );

        expect(screen.getByText("Sample body content")).toBeInTheDocument();
        expect(screen.getByText("Sample header content")).toBeInTheDocument();
    });

    it('should handle empty body and headers', () => {

        render(
            <ResponseTabContent body="" headers="" />
        );

        expect(screen.getByRole('heading', { name: /Headers/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Body/i })).toBeInTheDocument();
    });

});


