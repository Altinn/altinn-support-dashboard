import { test, expect } from '@playwright/test';

test.describe("ManualRoleSearchPage", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/manualrolesearch");
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
        await page.goto("/manualrolesearch");
    });

    test("should display page heading and form fields", async ({ page }) => {
        await expect(
            page.getByRole("heading", { name: "Manuelt Rollesøk" })
        ).toBeVisible();
        await expect(page.getByLabel("Tilganger fra")).toBeVisible();
        await expect(page.getByLabel("Tilganger til")).toBeVisible();
        await expect(page.getByRole("button", { name: "Søk" , exact: true })).toBeVisible();
    });

    test("should open and close information dialog", async ({ page }) => {
        await page.getByTestId("info-button").click();

        await expect(
            page.getByText("Dette verktøyet skal kun brukes til å bekrefte informasjon"),
        ).toBeVisible();

        await page.keyboard.press("Escape");

        await expect(
            page.getByText("Dette verktøyet skal kun brukes til å bekrefte informasjon"),
        ).not.toBeVisible();
    });

    test("should persist input values to localStorage", async ({ page }) => {
        await page.getByLabel("Tilganger fra").fill("314246241");
        await page.getByLabel("Tilganger til").fill("13849199395");

        const rollegiver = await page.evaluate(() =>
            localStorage.getItem("rollegiver")        
        );
        const rollehaver = await page.evaluate(() =>
            localStorage.getItem("rollehaver")        
        );

        expect(rollegiver).toBe("314246241");
        expect(rollehaver).toBe("13849199395");
    });

    test("should show clear button when fields have values", async ({ page }) => {
        await expect(
            page.getByRole("button", { name: "Tøm søk" }),
        ).not.toBeVisible();

        await page.getByLabel("Tilganger fra").fill("314246241");
        await page.getByLabel("Tilganger til").fill("13849199395");

        await expect(
            page.getByRole("button", { name: "Tøm søk" }),
        ).toBeVisible();
    });

    test("should clear fields and localStorage on clear button click", async ({ page }) => {
        await page.getByLabel("Tilganger fra").fill("314246241");
        await page.getByLabel("Tilganger til").fill("13849199395");

        await page.getByRole("button", { name: "Tøm søk" }).click();

        await expect(page.getByLabel("Tilganger fra")).toHaveValue("");
        await expect(page.getByLabel("Tilganger til")).toHaveValue("");

        const rollegiver = await page.evaluate(() =>
            localStorage.getItem("rollegiver")        
        );
        const rollehaver = await page.evaluate(() =>
            localStorage.getItem("rollehaver")        
        );

        expect(rollegiver).toBe("");
        expect(rollehaver).toBe("");
    });

    test("should search and display roles in the table", async ({ page }) => {
        await page.getByLabel("Tilganger fra").fill("314246241");
        await page.getByLabel("Tilganger til").fill("13849199395");
        await page.getByRole("button", { name: "Søk", exact: true }).click();

        await expect(page.getByRole("table")).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "Rolletype"}),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "Rollenavn" }),
        ).toBeVisible();
    });

    test("should show empty state for unknown orgs", async ({ page }) => {
        await page.getByLabel("Tilganger fra").fill("000000000");
        await page.getByLabel("Tilganger til").fill("000000000");
        await page.getByRole("button", { name: "Søk", exact: true }).click();

        await expect(
            page.getByText("Ingen roller funnet"),
        ).toBeVisible();
    });

    test("should filter roles by name", async ({ page }) => {
        await page.getByLabel("Tilganger fra").fill("314246241");
        await page.getByLabel("Tilganger til").fill("13849199395");
        await page.getByRole("button", { name: "Søk", exact: true }).click();

        await expect(
            page.getByRole("columnheader", { name: "Rollenavn" },)
        ).toBeVisible();

        const rowsBefore = await page.getByRole("row").count();
        expect(rowsBefore).toBeGreaterThan(1);

        await page.getByLabel("Søk etter rolle").fill("a");
        const rowsAfter = await page.getByRole("row").count();

        expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
    });

    test("should filter roles by type using checkbox", async ({ page }) => {
        await page.getByLabel("Tilganger fra").fill("314246241");
        await page.getByLabel("Tilganger til").fill("13849199395");
        await page.getByRole("button", { name: "Søk", exact: true }).click();

        await expect(
            page.getByRole("columnheader", { name: "Rolletype" },)
        ).toBeVisible();

        const rowsBefore = await page.getByRole("row").count();
        expect(rowsBefore).toBeGreaterThan(1);

        await page.getByRole("checkbox", { name: "Tilgangspakke" }).check();

        const rowsAfter = await page.getByRole("row").count();

        expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
    });

    test("should restore state from localStorage on reload", async ({ page }) => {
        await page.evaluate(() => {
            localStorage.setItem("rollegiver", "314246241");
            localStorage.setItem("rollehaver", "13849199395");
        });

        await page.reload();

        await expect(page.getByLabel("Tilganger fra")).toHaveValue("314246241");
        await expect(page.getByLabel("Tilganger til")).toHaveValue("13849199395");
    });

    test("should not search with only one field filled", async ({ page }) => {
        await page.getByLabel("Tilganger fra").fill("314246241");
        await page.getByRole("button", { name: "Søk", exact: true }).click();

        await expect(
            page.getByText("Ingen roller funnet"),
        ).toBeVisible();
    });
})
