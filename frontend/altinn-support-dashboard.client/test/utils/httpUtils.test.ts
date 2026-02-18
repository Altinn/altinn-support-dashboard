import { describe, expect, it } from "vitest";
import { isSuccess, isError } from "../../src/utils/httpUtils";


describe('httpUtils', () => {
    describe('isSuccess', () => {
        it('should return true for 2xx status codes', () =>{
            expect(isSuccess(200)).toBe(true);
            expect(isSuccess(250)).toBe(true);
            expect(isSuccess(299)).toBe(true);
        });

        it('should return false for non-2xx status codes', () => {
            expect(isSuccess(199)).toBe(false);
            expect(isSuccess(300)).toBe(false);
            expect(isSuccess(400)).toBe(false);
            expect(isSuccess(500)).toBe(false);
        });
    });

    describe('isError', () => {
        it('should return true for 4xx and 5xx status codes', () => {
            expect(isError(400)).toBe(true);
            expect(isError(404)).toBe(true);
            expect(isError(500)).toBe(true);
        });

        it('should return false for non-4xx and non-5xx status codes', () => {
            expect(isError(199)).toBe(false);
            expect(isError(200)).toBe(false);
            expect(isError(300)).toBe(false);
        });
    });
})