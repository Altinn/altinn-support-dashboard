import { describe, expect, it } from "vitest";
import formatDate from "../../../src/components/VersionDialog/utils/formatDateutils";



describe('formatDate', () => {

    it('should format valid ISO date string', () => {
        const result = formatDate('2026-01-01');

        expect(result).toBe('1. januar 2026');
    });

    it('should format date with time correctly', () => {
        const result = formatDate('2026-01-01T12:00:00Z');

        expect(result).toBe('1. januar 2026');
    });

    it('should return "Invalid Date" for invalid date', () => {
        const result = formatDate('invalid-date-string');

        expect(result).toBe('Invalid Date');
    });

    it('should return "Invalid Date" for empty string', () => {
        const result = formatDate('');

        expect(result).toBe('Invalid Date');
    });

    it('should handle different valid date format', () => {
        const result = formatDate('2026/01/01');

        expect(result).toBe('1. januar 2026');
    });
})