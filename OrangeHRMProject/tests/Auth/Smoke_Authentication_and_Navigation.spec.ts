import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('SmokeAuthenticationandNavigation', () => {
    
    test('TC01 - Verify Login Success and Dashboard Display @regression', async ({ loginPage, dashboardPage }) => {
        await test.step('Navigate to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
        });

        await test.step('Perform Login with Default Admin', async () => {
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Verify Success Redirection to Dashboard', async () => {
            await dashboardPage.verifyDashboard('Dashboard');
        });
    });

    test('TC02 - Verify Authentication Security with Invalid Credentials @regression', async ({ loginPage }) => {
        await test.step('Navigate to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
        });

        await test.step('Attempt Login with Unauthorized Credentials', async () => {
            await loginPage.login('InvalidUser_QA', 'SecurityTest123!');
        });

        await test.step('Verify "Invalid credentials" Alert Message Display', async () => {
            await loginPage.verifyInvalidCredentialsError();
        });
    });
});
