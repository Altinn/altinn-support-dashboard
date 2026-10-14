import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { LinkButton } from "../src/components/LinkButton";

describe("LinkButton", () => {
  it("should render children as a button", () => {
    render(<LinkButton onClick={() => {}}>Click me</LinkButton>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LinkButton onClick={onClick}>Click me</LinkButton>);
    await user.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should apply a custom className", () => {
    render(
      <LinkButton onClick={() => {}} className="custom">
        Click me
      </LinkButton>
    );
    expect(screen.getByRole("button", { name: "Click me" })).toHaveClass(
      "custom"
    );
  });
});
