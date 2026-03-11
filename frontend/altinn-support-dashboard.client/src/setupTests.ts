import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import '@testing-library/jest-dom';

expect.extend(matchers);

if (typeof CSS === 'undefined' || !CSS.supports) {
  Object.defineProperty(globalThis, 'CSS', {
    value: { supports: () => false },
    writable: true,
  });
}

// jsdom doesn't support the Popover API used by @digdir/designsystemet-web tooltips
if (!HTMLElement.prototype.showPopover) {
  HTMLElement.prototype.showPopover = () => {};
}
if (!HTMLElement.prototype.hidePopover) {
  HTMLElement.prototype.hidePopover = () => {};
}