import { describe, it, expect } from "vitest";
import { formatDate } from "../../../src/components/Dashboard/utils/dateUtils";



describe('formatDate', () => {

    it('should format valid ISO date string', () => {
        const result = formatDate('2026-01-01T14:30:00');
        expect(result).toBe('01.01.2026, 14:30');
    });

    it('should return "-" for empty string', () => {
        const result = formatDate('');
        expect(result).toBe('-');
    });

    it('should return "Invalid Date" for invalid date string', () => {
        const result = formatDate('invalid-date-string');
        expect(result).toBe('Invalid Date');
    });

    it('should return "-" for dates starting with "0001-01-01"', () => {
        const result = formatDate('0001-01-01T00:00:00');
        expect(result).toBe('-');
    });

    it('should handle different valid date format', () => {
        const result = formatDate('2026/01/01 10:00:00');
        expect(result).toBe('01.01.2026, 10:00');
    });
})