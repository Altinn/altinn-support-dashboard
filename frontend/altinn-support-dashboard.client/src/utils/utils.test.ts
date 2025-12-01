// utils.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getBaseUrl,
  authorizedFetch,
  getFormattedDateTime,
  capitalizeFirstCharacter,
  filterUserClaims,
} from "./utils";

describe("Utils tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("capitalizeFirstCharacter", () => {
    it("should capitalize the first letter", () => {
      expect(capitalizeFirstCharacter("hello")).toBe("Hello");
    });

    it("should return empty string if input is empty", () => {
      expect(capitalizeFirstCharacter("")).toBe("");
    });
  });

  describe("getBaseUrl", () => {
    const originalLocation = window.location;

    beforeAll(() => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: {
          ...originalLocation,
          hostname: "localhost",
        } as unknown as Location,
      });
    });
    afterAll(() => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: originalLocation,
      });
    });

    it("should return local dev URL if localhost", () => {
      expect(getBaseUrl()).toContain(":5237/api");
    });

    it("should return environment-specific URL", () => {
      expect(getBaseUrl("TT02")).toContain("/api/TT02");
      expect(getBaseUrl("PROD")).toContain("/api/Production");
    });
  });

  describe("getFormattedDateTime", () => {
    it("should format date and time correctly", () => {
      const date = new Date("2025-12-01T15:30:45");
      const result = getFormattedDateTime(date);
      expect(result.formattedTime).toBe("15:30:45");
      expect(result.formattedDate).toContain("Mandag, 1. Desember 2025");
    });
  });

  describe("filterUserClaims", () => {
    const user = {
      user_claims: [
        { typ: "name", val: "Alice" },
        { typ: "preferred_username", val: "alice@example.com" },
      ],
    };

    it("should find claim by type", () => {
      expect(filterUserClaims(user, "name")?.val).toBe("Alice");
      expect(filterUserClaims(user, "preferred_username")?.val).toBe(
        "alice@example.com",
      );
    });

    it("should return undefined if claim not found", () => {
      expect(filterUserClaims(user, "role")).toBeUndefined();
    });
  });

  describe("authorizedFetch", () => {
    beforeEach(() => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
        ) as unknown as typeof fetch,
      );

      vi.stubGlobal("localStorage", {
        getItem: vi.fn(() => "123"),
        setItem: vi.fn(),
      });
    });

    it("should add Authorization header", async () => {
      await authorizedFetch("/test");
      expect(fetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Basic 123",
          }),
        }),
      );
    });
  });
});
