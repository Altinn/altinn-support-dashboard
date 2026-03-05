import { test, expect } from './fixtures';

test.describe("DashboardPage", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/dashboard");
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

    test("should search and display organization results", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();

        await expect(page.getByText("Org Nr: 314246241")).toBeVisible();
    });

    test("should clear search bar", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByRole("button", { name: "X" }).click();
        await expect(searchBar).toHaveValue("");
    });

    test("should trigger search on Enter key", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await searchBar.press("Enter");

        await expect(page.getByText("Org Nr: 314246241")).toBeVisible();
    });

    test("should show not found for unknown org number", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314236242");
        await page.getByTestId("search-button").click();

        await expect(page.getByRole('heading', { name: 'Ingen organisasjoner funnet' })).toBeVisible();
    });

    test("should display detailed org view when clicking a result", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();

        await page.getByText("Org Nr: 314246241").click();

        await expect(page.getByText("Type:")).toBeVisible();
        await expect(page.getByText("IsDeleted:")).toBeVisible();
        await expect(page.getByText("Varslingsadresser for virksomheten")).toBeVisible();
    });

    test("should clear results when clearing search", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();
        await expect(page.getByText("Org Nr: 314246241")).toBeVisible();

        await page.getByRole("button", { name: "X" }).click();

        await expect(page.getByText("Org Nr: 314246241")).not.toBeVisible();
    });

    test("should display contacts table when org is selected", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();
        await page.getByText("Org Nr: 314246241").click();

        await expect(page.getByText("Din kontaktinformasjon")).toBeVisible();
        await expect(page.getByRole("button", { name: "Navn" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Fødselsnummer" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Mobilnummer" })).toBeVisible();
        await expect(page.getByRole("button", { name: "E-post" })).toBeVisible();
    });

    test("should display ER-roles when org is selected", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();
        await page.getByText("Org Nr: 314246241").click();

        await expect(page.getByRole("heading", { name: "ER-roller" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Rolletype" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Person/Virksomhet" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Dato Endret" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
    });

    test("should open role details when clicking 'Vis' on a contact", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();
        await page.getByText("Org Nr: 314246241").click();

        const visButton = page.getByRole("button", { name: "Vis", exact: true }).first();
        await expect(visButton).toBeVisible();
        await visButton.click();

        await expect(page.getByText("Roller knyttet til ")).toBeVisible();
        await expect(page.getByRole("button", { name: "Tilbake til oversikt" })).toBeVisible();
    });

    test("should navigate back from role details to contacts", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();
        await page.getByText("Org Nr: 314246241").click();

        const visButton = page.getByRole("button", { name: "Vis", exact: true }).first();
        await expect(visButton).toBeVisible();
        await visButton.click();

        await page.getByRole("button", { name: "Tilbake til oversikt" }).click();

        await expect(page.getByText("Din kontaktinformasjon")).toBeVisible();
    });

    test("should filter contacts by contact searchbar", async ({ page }) => {
        const searchBar = page.getByRole('textbox', { name: 'Mobilnummer / E-post /' });
        await searchBar.fill("314246241");
        await page.getByTestId("search-button").click();
        await page.getByText("Org Nr: 314246241").click();

        const contactSearchBar = page.getByRole('textbox', { name: 'Søk i kontakter' });
        await expect(contactSearchBar).toBeVisible();

        const contactsTable = page.locator('table', { has: page.getByText('Din kontaktinformasjon') });
        const rowsBefore = await contactsTable.getByRole("row").count();
        expect(rowsBefore).toBeGreaterThan(1);

        await contactSearchBar.fill("Cos");
        const rowsAfter = await contactsTable.getByRole("row").count();

        expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
    });
})