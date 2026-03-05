import {test as base, expect} from "@playwright/test";

export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('**/auth/auth-status', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    isLoggedIn: true,
                    name: "Test User",
                    orgName: "Test Org",
                    ansattportenActive: false,
                    userPolicies: []
                }),
            });
        });
        await use(page);
    },
});

export { expect };