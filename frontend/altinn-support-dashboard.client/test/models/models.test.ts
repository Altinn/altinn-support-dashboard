import { describe, expect, it } from "vitest";
import {
  Organization,
  UserContactInformationAltinn3,
  isOrganization,
  isUserContactInfo,
} from "../../src/models/models";

describe("models", () => {
  const mockOrg: Organization = {
    name: "Test Org",
    organizationNumber: "123456789",
    unitType: "AS",
    isDeleted: false,
  };

  const mockUser: UserContactInformationAltinn3 = {
    name: "Test Person",
    isReserved: false,
    displayedSocialSecurityNumber: "123456*****",
    ssnToken: "token-123",
  };

  describe("isOrganization", () => {
    it("should return true for an Organization", () => {
      expect(isOrganization(mockOrg)).toBe(true);
    });

    it("should return false for a UserContactInformationAltinn3", () => {
      expect(isOrganization(mockUser)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isOrganization(null)).toBe(false);
    });
  });

  describe("isUserContactInfo", () => {
    it("should return true for a UserContactInformationAltinn3", () => {
      expect(isUserContactInfo(mockUser)).toBe(true);
    });

    it("should return false for an Organization", () => {
      expect(isUserContactInfo(mockOrg)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isUserContactInfo(null)).toBe(false);
    });
  });
});
