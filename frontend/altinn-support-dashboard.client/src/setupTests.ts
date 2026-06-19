import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
import "@testing-library/jest-dom";

expect.extend(matchers);

// jsdom doesn't implement adoptedStyleSheets as an iterable, which crashes
// the @oddbird/popover-polyfill used by @digdir/designsystemet-web
Object.defineProperty(document, "adoptedStyleSheets", {
  value: [],
  writable: true,
  configurable: true,
});

// Suppress verbose design system warnings that are irrelevant in jsdom
const originalConsoleLog = console.log;
console.log = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("Designsystemet:")) {
    return;
  }
  originalConsoleLog(...args);
};

if (typeof CSS === "undefined" || !CSS.supports) {
  Object.defineProperty(globalThis, "CSS", {
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

if (typeof globalThis.requestAnimationFrame === "undefined") {
  globalThis.requestAnimationFrame = (callback) =>
    setTimeout(callback, 0) as unknown as number;
}
if (typeof globalThis.cancelAnimationFrame === "undefined") {
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
