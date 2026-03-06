import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import '@testing-library/jest-dom';

expect.extend(matchers);

// JSDOM does not implement CSS.supports — polyfill for component libraries that use it
if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
  Object.defineProperty(globalThis, 'CSS', {
    value: { supports: () => false },
    writable: true,
  });
}