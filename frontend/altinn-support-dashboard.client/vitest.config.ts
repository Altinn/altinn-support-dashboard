/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],

    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
    },
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
