import { test, expect } from './fixtures';

test.describe("DashboardPage", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/dashboard");
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        //This is so the versiondialog doesn't block the tests, as it is set to show on first visit. The version is not relevant for these tests, so we can just set it to a value.
        await page.evaluate(async () => {
            try {
                const response = await fetch('/version.json');
                const data = await response.json();
                localStorage.setItem("altinn_support_dashboard_version", data.version);
            } catch {
                localStorage.setItem("altinn_support_dashboard_version", "0.0.0");
            }
        })
        await page.goto("/dashboard");
    });

    test("should display page heading and form fields", async ({ page }) => {
        await expect (
            page.getByRole("heading", { name: "Søk etter Organisasjoner" })
        ).toBeVisible();
        await expect(
            page.getByRole('textbox', { name: 'Mobilnummer / E-post /' })
        ).toBeVisible();
        await expect(page.getByRole("button", { name: "X" })).toBeVisible();
        await expect(page.getByTestId("search-button")).toBeVisible();
    });
})