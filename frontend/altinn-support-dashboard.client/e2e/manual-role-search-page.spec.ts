import { test, expect, Page } from '@playwright/test';

const mockRoles = [
    {
        name: 'Role 1',
        authorizedAccessPackages: ["regnskapspakke"],
        authorizedResources: [],
        authorizedRoles: [],
        authorizedInstances: []
    },
    {
        name: 'Role 2',
        authorizedAccessPackages: [],
        authorizedResources: [],
        authorizedRoles: ["DAGL"],
        authorizedInstances: []
    },
    {
        name: 'Role 3',
        authorizedAccessPackages: [],
        authorizedResources: ["skatt-resource"],
        authorizedRoles: [],
        authorizedInstances: []
    },
    {
        name: 'Role 4',
        authorizedAccessPackages: [],
        authorizedResources: [],
        authorizedRoles: [],
        authorizedInstances: ["instance-123"]
    },
];

async function setupMocks(page: Page) {
    await page.route("**/auth/auth-status", (route) => 
        route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                isLoggedIn: true,
                name: "Test User",
                orgName: "Test Org",
                ansattportenActive: true,
                userPolicies: [],
            }),
        }),
    );
}

test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto("/manualrolesearch");
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.goto("/manualrolesearch");
});

