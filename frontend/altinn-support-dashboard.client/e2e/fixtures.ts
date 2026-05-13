import {test as base, expect} from "@playwright/test";

export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('**/azure-auth/auth-status', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    isLoggedIn: true,
                    name: "Test User",
                    azureAuthActive: true,
                    roles: []
                }),
            });
        });
        await use(page);
    },
});

export { expect };