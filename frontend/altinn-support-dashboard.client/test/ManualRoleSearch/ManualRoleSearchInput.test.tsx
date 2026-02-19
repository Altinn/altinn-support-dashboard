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
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Tilganger fra")).toBeInTheDocument();
    expect(screen.getByLabelText("Tilganger til")).toBeInTheDocument();
  });

  it("renders the Søk button", () => {
    render(
      <InputComponent
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Søk" })).toBeInTheDocument();
  });

  it("loads initial values from localStorage", () => {
    vi.mocked(getLocalStorageValue).mockImplementation((key: string) => {
      if (key === "rollegiver") return "123456789";
      if (key === "rollehaver") return "987654321";
      return "";
    });

    render(
      <InputComponent
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
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Tilganger til");
    await user.clear(input);
    await user.type(input, "456");

    expect(setLocalStorageValue).toHaveBeenLastCalledWith("rollehaver", "456");
  });

  it("calls setRollehaver and setRollegiver with current values when Søk is clicked", async () => {
    const mockSetRollehaver = vi.fn();
    const mockSetRollegiver = vi.fn();
    const user = userEvent.setup();

    vi.mocked(getLocalStorageValue).mockImplementation((key: string) => {
      if (key === "rollegiver") return "111";
      if (key === "rollehaver") return "222";
      return "";
    });

    render(
      <InputComponent
        setRollehaver={mockSetRollehaver}
        setRollegiver={mockSetRollegiver}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Søk" }));

    expect(mockSetRollegiver).toHaveBeenCalledWith("111");
    expect(mockSetRollehaver).toHaveBeenCalledWith("222");
  });

  it("does not show Tøm søk button when inputs are empty", () => {
    vi.mocked(getLocalStorageValue).mockReturnValue("");

    render(
      <InputComponent
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Tøm søk" })).not.toBeInTheDocument();
  });

  it("shows Tøm søk button when an input has a value", async () => {
    vi.mocked(getLocalStorageValue).mockImplementation((key: string) => {
      if (key === "rollehaver") return "123";
      return "";
    });

    render(
      <InputComponent
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Tøm søk" })).toBeInTheDocument();
  });

  it("clears inputs and localStorage when Tøm søk is clicked", async () => {
    const user = userEvent.setup();

    vi.mocked(getLocalStorageValue).mockImplementation((key: string) => {
      if (key === "rollegiver") return "111";
      if (key === "rollehaver") return "222";
      return "";
    });

    render(
      <InputComponent
        setRollehaver={vi.fn()}
        setRollegiver={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Tøm søk" }));

    expect(setLocalStorageValue).toHaveBeenCalledWith("rollegiver", "");
    expect(setLocalStorageValue).toHaveBeenCalledWith("rollehaver", "");
    expect(screen.queryByRole("button", { name: "Tøm søk" })).not.toBeInTheDocument();
  });
});
