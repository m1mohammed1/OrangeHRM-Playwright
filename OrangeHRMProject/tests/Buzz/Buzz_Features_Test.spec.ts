import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Buzz_Features_Test', () => {
    
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login and Navigate to Buzz', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
            await dashboardPage.navigateToModule("Buzz");
        });
    });

    test('TC01 - Verify "Most Liked Posts" Widget @regression', async ({ buzzPage }) => {
        await buzzPage.verifyElementVisible("Most Liked Posts");
    });

    test('TC02 - Verify Empty Post Validation @regression', async ({ buzzPage }) => {
        await buzzPage.createPost("");
        await buzzPage.verifyFieldError("Post", "Required");
    });
});
