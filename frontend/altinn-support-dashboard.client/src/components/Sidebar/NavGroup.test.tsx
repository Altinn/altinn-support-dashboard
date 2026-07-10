import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NavGroup from "./NavGroup";

const renderNavGroup = (
  props: Partial<React.ComponentProps<typeof NavGroup>> = {},
  initialEntries: string[] = ["/"]
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <NavGroup
        title="Core"
        icon={<span data-testid="group-icon" />}
        isCollapsed={false}
        paths={["/notification", "/identifier-conversion"]}
        {...props}
      >
        <div data-testid="child">Child item</div>
      </NavGroup>
    </MemoryRouter>
  );
};

describe("NavGroup", () => {
  it("renders the title and children when expanded", () => {
    renderNavGroup();

    expect(screen.getByText("Core")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("starts closed when no child route is active", () => {
    renderNavGroup({}, ["/dashboard"]);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("starts open when the current path matches one of the given paths", () => {
    renderNavGroup({}, ["/notification/search"]);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("toggles open state when the header button is clicked", async () => {
    const user = userEvent.setup();
    renderNavGroup({}, ["/dashboard"]);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the icon instead of the title text when collapsed", () => {
    renderNavGroup({ isCollapsed: true });

    expect(screen.getByTestId("group-icon")).toBeInTheDocument();
    expect(screen.queryByText("Core")).not.toBeInTheDocument();
  });
});
