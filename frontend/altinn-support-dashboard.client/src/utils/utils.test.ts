// utils.test.ts
import { describe, it, expect, beforeEach, vi, beforeAll, afterAll, afterEach } from "vitest";
import {
  getBaseUrl,
  authorizedFetch,
  getFormattedDateTime,
  capitalizeFirstCharacter,
  filterUserClaims,
  authorizedPost,
  fetchUserDetails,
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

    it("should return base URL for other environments", () => {
      expect(getBaseUrl("DEV")).toContain("/api");
      expect(getBaseUrl("DEV")).not.toContain("/DEV");
    })
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

    it("should use sessionStorage if localStorage is empty", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn(() => null),
      });
      vi.stubGlobal("sessionStorage", {
        getItem: vi.fn(() => "456"),
      });

      await authorizedFetch("/test");
      expect(fetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Basic 456",
          }),
        }),
      );
    });
  });

  describe("authorizedPost", () => {
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

    it("should POST with Authorization header and JSON body", async () => {
      const body = { test: "data" };
      await authorizedPost("/test", body);

      expect(fetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
          headers: expect.objectContaining({
            Authorization: "Basic 123",
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should use sessionStorage if localStorage is empty", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn(() => null),
      });
      vi.stubGlobal("sessionStorage", {
        getItem: vi.fn(() => "456"),
      });

      await authorizedPost("/test", { data: "test" });
      expect(fetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Basic 456",
          }),
        }),
      );
    })
  });

  describe("fetchUserDetails", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    })

    it("should return user details from auth response", async () => {
      const mockUser = {
        user_claims: [
          { typ: "name", val: "Test User" },
          { typ: "preferred_username", val: "test@test.com" },
        ],
      };

      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve([mockUser]),
          }),
        ) as unknown as typeof fetch);

      const result = await fetchUserDetails();
      expect(result).toEqual({
        name: "Test User",
        email: "test@test.com",
      });
    });

    it("should return default values on error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.reject(new Error("Failed")))
      );

      const result = await fetchUserDetails();

      expect(result).toEqual({
        name: "Ukjent Bruker",
        email: "Ingen e-post funnet",
      });
    });

    it("should return default values when auth respone is an empty array", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          }),
        ) as unknown as typeof fetch);
      
      const result = await fetchUserDetails();

      expect(result).toEqual({
        name: "Ukjent Bruker",
        email: "Ingen e-post funnet",
      });
    });

    it("should use defaults when claims are missing", async () => {
      const mockUser = {
        user_claims: [
          { typ: "name", val: "Test User" },
        ],
      };

      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve([mockUser]),
          }),
        ) as unknown as typeof fetch);
      
      const result = await fetchUserDetails();

      expect(result).toEqual({
        name: "Test User",
        email: "Ingen e-post funnet",
      });
    });

    it("should use defaults when name claim is missing", async () => {
    const mockUser = {
      user_claims: [
        { typ: "preferred_username", val: "test@test.com" },
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockUser]),
        }),
      ) as unknown as typeof fetch);

      const result = await fetchUserDetails();

      expect(result).toEqual({
        name: "Ukjent Bruker",
        email: "test@test.com",
      });
    });
  });
});
