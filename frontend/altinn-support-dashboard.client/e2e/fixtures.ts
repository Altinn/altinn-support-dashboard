import {test as base, expect} from "@playwright/test";

const mockOrg = {
    name: "Test Organization",
    organizationNumber: "314246241",
    unitType: "AS",
    isDeleted: false
};

const mockContacts = [
    {
        name: "Cosmo Test",
        nationalIdentityNumber: "12345678901",
        email: "cosmo@test.com",
        phone: "12345678",
        lastChanged: "2025-01-01T00:00:00"
    },
    {
        name: "Anders Testesen",
        nationalIdentityNumber: "09876543210",
        email: "anders@test.com",
        phone: "87654321",
        lastChanged: "2025-01-01T00:00:00"
    }
];

const mockERoles = {
    rollegrupper: [
        {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2025-01-01T00:00:00",
            roller: [
                {
                    type: { kode: "DAGL", beskrivelse: "Daglig leder" },
                    person: {
                        fodselsdato: "1980-01-01",
                        navn: { fornavn: "Test", mellomnavn: null, etternavn: "Person" },
                        erDoed: false
                    },
                    avregistrert: false
                }
            ]
        }
    ]
};

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

        await page.route('**/serviceowner/organizations/altinn3/search*', async (route) => {
            const url = new URL(route.request().url());
            const query = url.searchParams.get('query');

            // Small delay so tests can observe the loading/progressbar state
            await new Promise(resolve => setTimeout(resolve, 100));

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(query === '314246241' ? [mockOrg] : []),
            });
        });

        await page.route('**/personalcontacts/**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockContacts),
            });
        });

        await page.route('**/brreg/**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockERoles),
            });
        });

        await page.route('**/officialcontacts*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
            });
        });

        await page.route('**/notificationaddresses*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
            });
        });

        await use(page);
    },
});

export { expect };
