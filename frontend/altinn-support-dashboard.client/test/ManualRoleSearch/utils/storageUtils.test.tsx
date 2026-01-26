import { describe, expect } from "vitest";
import { getLocalStorageValue, setLocalStorageValue } from "../../../src/components/ManualRoleSearch/utils/storageUtils";




describe('storageUtils', () => {
    beforeEach(() => {
        localStorage.clear();
        //Clears storage before each test
    });

    it('setLocalStorageValue sets a value', () => {
        setLocalStorageValue('testKey', 'testValue');
        expect(localStorage.getItem('testKey')).toBe('testValue');
    });

    it('getLocalStorageValue retrieves a value', () => {
        localStorage.setItem('testKey', 'storedValue');
        expect(getLocalStorageValue('testKey')).toBe('storedValue');
    });

    it('getLocalStorageValue returns null when no default provided', () => {
        expect(getLocalStorageValue('nonExistentKey')).toBe("");
    });

    it('getLocalStorageValue returns default value when key does not exist', () => {
        expect(getLocalStorageValue('nonExistentKey', 'defaultValue')).toBe('defaultValue');
    });

    it('setLocalStorageValue sets same value getLocalStorageValue retrieves', () => {
        setLocalStorageValue('anotherTestKey', 'anotherTestValue');
        expect(getLocalStorageValue('anotherTestKey')).toBe('anotherTestValue');
    });
});