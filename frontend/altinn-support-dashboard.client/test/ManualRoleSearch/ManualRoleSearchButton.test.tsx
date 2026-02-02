import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchButton from "../../src/components/ManualRoleSearch/ManualRoleSearchButton";

describe("SearchButton", () => {
  it("calls handleSearch when button is clicked", async () => {
    const mockHandleSearch = vi.fn();
    const user = userEvent.setup();

    render(
      <SearchButton
        rollehaver="123"
        rollegiver="456"
        handleSearch={mockHandleSearch}
      />,
    );

    const button = screen.getByRole("button", { name: "Søk" });
    await user.click(button);

    expect(mockHandleSearch).toHaveBeenCalled();
  });
});

