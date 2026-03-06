import { test, expect } from "./fixtures";

test.describe("CorrespondencePage", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/correspondence");
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });

        await page.evaluate(() => {
            localStorage.setItem("app-storage", JSON.stringify({
                state: { environment: "TT02", isDarkMode: false },
                version: 0
            }));
        });

        await page.evaluate(async () => {
            try {
                const response = await fetch('/version.json');
                const data = await response.json();
                localStorage.setItem("altinn_support_dashboard_version", data.version);
            } catch {
                localStorage.setItem("altinn_support_dashboard_version", "0.0.0");
            }
        })
        await page.goto("/correspondence");
    });

    test("should display page heading", async ({ page }) => {
        await expect (
            page.getByRole('heading', { name: 'Opprett melding for testBeta' })
        ).toBeVisible();
    });

    test("should display all form fields", async ({ page }) => {
        await expect(page.getByText("Recipient 1")).toBeVisible();
        await expect(page.getByRole("button", { name: "Add recipient" })).toBeVisible();
        await expect(page.getByText("Melding title")).toBeVisible();
        await expect(page.getByText("Melding summary")).toBeVisible();
        await expect(page.getByText("Melding body")).toBeVisible();
        await expect(page.getByText("Trengs det bekreftelse?")).toBeVisible();
        await expect(page.getByText("Send varsling?")).toBeVisible();
        await expect(page.getByText("Hvem skal kunne lese meldingen?")).toBeVisible();
        await expect(page.getByText("Frist")).toBeVisible();
        await expect(page.getByRole("button", { name: "Send melding" })).toBeVisible();
    });
})