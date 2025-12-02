/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],

    coverage: {
      provider: "v8",
      reporter: ["cobertura", "text-summary"],
      reportsDirectory: "./.coverage",
      include: [
        "src/components/*",
        "src/utils/*",
        "src/services/*",
        "src/pages/*",
        "src/hooks/*",
      ],
      exclude: ["**/styles/**", "**/models/**"],
    },
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
