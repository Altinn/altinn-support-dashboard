import { describe, expect, it } from "vitest";
import {
  buildRecipientUrn,
  parseRecipientUrn,
  validateAttachments,
  validateRecipientIdentifier,
} from "../../src/components/Correspondence/utils/correspondenceValidation";

describe("correspondenceValidation", () => {
  describe("validateRecipientIdentifier", () => {
    it("requires person identifier to be 11 digits", () => {
      expect(validateRecipientIdentifier("person", "123")).toBe(
        "Fødselsnummer må være 11 siffer"
      );
      expect(validateRecipientIdentifier("person", "12345678901")).toBeUndefined();
    });

    it("requires organization identifier to be 9 digits", () => {
      expect(validateRecipientIdentifier("organization", "12345")).toBe(
        "Organisasjonsnummer må være 9 siffer"
      );
      expect(validateRecipientIdentifier("organization", "123456789")).toBeUndefined();
    });
  });

  describe("buildRecipientUrn", () => {
    it("builds person and organization urns", () => {
      expect(buildRecipientUrn("person", "12345678901")).toBe(
        "urn:altinn:person:identifier-no:12345678901"
      );
      expect(buildRecipientUrn("organization", "123456789")).toBe(
        "urn:altinn:organization:identifier-no:123456789"
      );
    });
  });

  describe("parseRecipientUrn", () => {
    it("parses valid urns", () => {
      expect(parseRecipientUrn("urn:altinn:person:identifier-no:12345678901")).toEqual({
        type: "person",
        identifier: "12345678901",
      });
      expect(
        parseRecipientUrn("urn:altinn:organization:identifier-no:123456789")
      ).toEqual({
        type: "organization",
        identifier: "123456789",
      });
    });
  });

  describe("validateAttachments", () => {
    it("requires at least one attachment", () => {
      expect(validateAttachments([])).toBe("Minst 1 vedlegg er påkrevd");
    });

    it("rejects unsupported file types", () => {
      const file = new File(["content"], "test.exe", { type: "application/octet-stream" });
      expect(validateAttachments([file])).toBe(
        'Filtypen for "test.exe" er ikke tillatt'
      );
    });

    it("accepts allowed file types", () => {
      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      expect(validateAttachments([file])).toBeUndefined();
    });
  });
});
