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

    test("should add a new recipient field", async ({ page }) => {
        await expect(page.getByText("Recipient 1")).toBeVisible();
        await expect(page.getByText("Recipient 2")).not.toBeVisible();

        await page.getByRole("button", { name: "Add recipient" }).click();

        await expect(page.getByText("Recipient 2")).toBeVisible();
    });

    test("should remove a recipient field", async ({ page }) => {
        await page.getByRole("button", { name: "Add recipient" }).click();
        await expect(page.getByText("Recipient 2")).toBeVisible();

        await page.getByRole("button", { name: "X" }).nth(1).click();

        await expect(page.getByText("Recipient 2")).not.toBeVisible();
    });

    test("should not remove the last recipient", async ({ page }) => {
        await expect(page.getByText("Recipient 1")).toBeVisible();

        await page.getByRole("button", { name: "X" }).first().click();

        await expect(page.getByText("Recipient 1")).toBeVisible();
    });

    test("should fill in message fields", async ({ page }) => {
        const titleField = page.getByText("Melding title").locator("..").getByRole("textbox");
        const summaryField = page.getByText("Melding summary").locator("..").getByRole("textbox");
        const bodyField = page.getByText("Melding body").locator("..").getByRole("textbox");

        await titleField.fill("Test Title");
        await summaryField.fill("Test Summary");
        await bodyField.fill("Test Body");

        await expect(titleField).toHaveValue("Test Title");
        await expect(summaryField).toHaveValue("Test Summary");
        await expect(bodyField).toHaveValue("Test Body");
    });

    test("should toggle confirmation checkbox", async ({ page }) => {
        const checkbox = page.getByRole("checkbox", { name: "Ja" });
        await expect(checkbox).not.toBeChecked();

        await checkbox.check();
        await expect(checkbox).toBeChecked();

        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
    });

    test("should select notification channel", async ({ page }) => {
        const select = page.getByText("Varslingsinstillinger").locator("..").getByRole("combobox");

        await select.selectOption("0");
        await expect(select).toHaveValue("0");

        await select.selectOption("1");
        await expect(select).toHaveValue("1");

        await select.selectOption("4");
        await expect(select).toHaveValue("4");
    });

    test("should select resource type", async ({ page }) => {
        const select = page.getByText("Hvem skal kunne lese meldingen?").locator("..").getByRole("combobox");

        await select.selectOption("selfIdentified");
        await expect(select).toHaveValue("selfIdentified");

        await select.selectOption("confidentiality");
        await expect(select).toHaveValue("confidentiality");

        await select.selectOption("default");
        await expect(select).toHaveValue("default");
    });

    test("should persist form values to localStorage", async ({ page }) => {
        const titleField = page.getByText("Melding title").locator("..").getByRole("textbox");
        await titleField.fill("Persistent Title");

        const stored = await page.evaluate(() => localStorage.getItem("title"));
        expect(stored).toBe("Persistent Title");
    });

    test("should persist confirmation checkbox to localStorage", async ({ page }) => {
        await page.getByRole("checkbox", { name: "Ja" }).check();

        const stored = await page.evaluate(() => localStorage.getItem("confirmationNeeded"));
        expect(stored).toBe("true");
    });

    test("should persist recipients to localStorage", async ({ page }) => {
        const input = page.getByText("Recipient 1").locator("..").locator("input");
        await input.fill("12345678901");

        const stored = await page.evaluate(() => localStorage.getItem("recipients"));
        expect(stored).toContain("12345678901");
    });

    test("should restore form values from localStorage on reload", async ({ page }) => {
        await page.evaluate(() => {
            localStorage.setItem("title", "Restored Title");
            localStorage.setItem("summary", "Restored Summary");
            localStorage.setItem("body", "Restored Body");
            localStorage.setItem("confirmationNeeded", "true");
            localStorage.setItem("recipients", JSON.stringify(["12345678901"]));
            localStorage.setItem("notificationChannel", "1");
            localStorage.setItem("resourceType", "confidentiality");
        });

        await page.reload();

        const titleField = page.getByText("Melding title").locator("..").getByRole("textbox");
        const summaryField = page.getByText("Melding summary").locator("..").getByRole("textbox");
        const bodyField = page.getByText("Melding body").locator("..").getByRole("textbox");
        const checkbox = page.getByRole("checkbox", { name: "Ja" });
        const recipientInput = page.getByText("Recipient 1").locator("..").locator("input");
        const notificationSelect = page.getByText("Varslingsinstillinger").locator("..").getByRole("combobox");
        const resourceTypeSelect = page.getByText("Hvem skal kunne lese meldingen?").locator("..").getByRole("combobox");

        await expect(titleField).toHaveValue("Restored Title");
        await expect(summaryField).toHaveValue("Restored Summary");
        await expect(bodyField).toHaveValue("Restored Body");
        await expect(checkbox).toBeChecked();
        await expect(recipientInput).toHaveValue("12345678901");
        await expect(notificationSelect).toHaveValue("1");
        await expect(resourceTypeSelect).toHaveValue("confidentiality");
    });

    test("should disable send when recipients are empty", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Send melding" })).toBeDisabled();
    });

    test("should enable send button when recipient has value", async ({ page }) => {
        const input = page.getByText("Recipient 1").locator("..").locator("input");
        await input.fill("12345678901");

        await expect(page.getByRole("button", { name: "Send melding" })).toBeEnabled();
    });

    test("should display response after sending", async ({ page }) => {
        await page.route("**/api/correspondence/upload", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    statusCode: 200,
                    responseBody: '{"correspondenceId":"12345"}',
                    responseHeader: "content-type: application/json",
                    requestBody: '{"recipients":["12345678901"]}',
                    requestHeader: "content-type: application/json"
                }),
            });
        });

        const input = page.getByText("Recipient 1").locator("..").locator("input");
        await input.fill("12345678901");

        const titleField = page.getByText("Melding title").locator("..").getByRole("textbox");
        await titleField.fill("Test Title");

        await page.getByRole("button", { name: "Send melding" }).click();

        await expect(page.getByText("Status Code: 200")).toBeVisible();
        await expect(page.getByRole("tab", { name: "Response"})).toBeVisible();
        await expect(page.getByRole("tab", { name: "Request" })).toBeVisible();
    });

    test("should switch between response and request tabs", async ({ page }) => {
        await page.route("**/api/correspondence/upload", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    statusCode: 200,
                    responseBody: '{"correspondenceId":"12345"}',
                    responseHeader: "content-type: application/json",
                    requestBody: '{"recipients":["12345678901"]}',
                    requestHeader: "content-type: application/json"
                }),
            });
        });

        const input = page.getByText("Recipient 1").locator("..").locator("input");
        await input.fill("12345678901");
        await page.getByRole("button", { name: "Send melding" }).click();

        await expect(page.getByRole("tab", { name: "Response" })).toBeVisible();
        await page.getByRole("tab", { name: "Request" }).click();
        await expect(page.getByText('{"recipients":["12345678901"]}')).toBeVisible();
    });

    test("should display error status code on failed send", async ({ page }) => {
        await page.route("**/api/correspondence/upload", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    statusCode: 400,
                    responseBody: '{"error":"Bad Request"}',
                    responseHeader: "content-type: application/json",
                    requestBody: '{"recipients":["12345678901"]}',
                    requestHeader: "content-type: application/json"
                }),
            });
        });

        const input = page.getByText("Recipient 1").locator("..").locator("input");
        await input.fill("12345678901");

        const titleField = page.getByText("Melding title").locator("..").getByRole("textbox");
        await titleField.fill("Test Title");

        await page.getByRole("button", { name: "Send melding" }).click();

        await expect(page.getByText("Status Code: 400")).toBeVisible();
        await expect(page.getByRole("tab", { name: "Response"})).toBeVisible();
        await expect(page.getByRole("tab", { name: "Request" })).toBeVisible();
    });

    test("should set due date", async ({ page }) => {
        const dateInput = page.getByText("Frist").locator("..").locator("input");
        await dateInput.fill("2026-01-01");
        await expect(dateInput).toHaveValue("2026-01-01");

        const stored = await page.evaluate(() => localStorage.getItem("dueDate"));
        expect(stored).toBe("2026-01-01");
    });

    test("should persist multiple recipients", async ({ page }) => {
        await page.getByRole("button", { name: "Add recipient" }).click();
        const recipientInput1 = page.getByText("Recipient 1").locator("..").locator("input");
        const recipientInput2 = page.getByText("Recipient 2").locator("..").locator("input");

        await recipientInput1.fill("12345678901");
        await recipientInput2.fill("10987654321");

        const stored = await page.evaluate(() => localStorage.getItem("recipients"));
        expect(stored).toContain("12345678901");
        expect(stored).toContain("10987654321");
    });
})
