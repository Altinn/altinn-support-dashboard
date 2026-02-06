import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputComponent from "../../src/components/ManualRoleSearch/ManualRoleSearchInput";

vi.mock("../../src/components/ManualRoleSearch/utils/storageUtils", () => ({
  getLocalStorageValue: vi.fn(),
  setLocalStorageValue: vi.fn(),
}));

import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../../src/components/ManualRoleSearch/utils/storageUtils";

describe("ManualRoleSearchInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders both input fields with correct labels", () => {
    render(
      <InputComponent
        searchTrigger={0}
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Tilganger fra")).toBeInTheDocument();
    expect(screen.getByLabelText("Tilganger til")).toBeInTheDocument();
  });

  it("loads initial values from localStorage", () => {
    vi.mocked(getLocalStorageValue).mockImplementation((key: string) => {
      if (key === "rollegiver") return "123456789";
      if (key === "rollehaver") return "987654321";
      return "";
    });

    render(
      <InputComponent
        searchTrigger={0}
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
    expect(screen.getByDisplayValue("987654321")).toBeInTheDocument();
  });

  it("updates localStorage on rollegiver input change", async () => {
    const user = userEvent.setup();

    render(
      <InputComponent
        searchTrigger={0}
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Tilganger fra");
    await user.clear(input);
    await user.type(input, "123");

    expect(setLocalStorageValue).toHaveBeenLastCalledWith("rollegiver", "123");
  });

  it("updates localStorage on rollehaver input change", async () => {
    const user = userEvent.setup();

    render(
      <InputComponent
        searchTrigger={0}
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Tilganger til");
    await user.clear(input);
    await user.type(input, "456");

    expect(setLocalStorageValue).toHaveBeenLastCalledWith("rollehaver", "456");
  });

  it("calls setters when searchTrigger changes", () => {
    const mockSetRollehaver = vi.fn();
    const mockSetRollegiver = vi.fn();

    vi.mocked(getLocalStorageValue).mockImplementation((key: string) => {
      if (key === "rollegiver") return "111";
      if (key === "rollehaver") return "222";
      return "";
    });

    const { rerender } = render(
      <InputComponent
        searchTrigger={0}
        setRollehaver={mockSetRollehaver}
        setRollegiver={mockSetRollegiver}
      />,
    );

    // Trigger search
    rerender(
      <InputComponent
        searchTrigger={1}
        setRollehaver={mockSetRollehaver}
        setRollegiver={mockSetRollegiver}
      />,
    );

    expect(mockSetRollegiver).toHaveBeenCalledWith("111");
    expect(mockSetRollehaver).toHaveBeenCalledWith("222");
  });
});

