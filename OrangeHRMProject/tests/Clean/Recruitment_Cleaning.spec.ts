import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Recruitment Test Cleaning', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateTo(TestConfig.BASE_URL);
        await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        await dashboardPage.navigateToModule("Recruitment");
    });

    test('TC01 - Cleanup Candidate - E2E Candidate @regression', async ({ recruitmentPage }) => {
        await recruitmentPage.navigateToSection("Candidates");
        await recruitmentPage.deleteIfExists("E2E Candidate");
    });

    test('TC02 - Cleanup Candidate - Decline Candidate @regression', async ({ recruitmentPage }) => {
        await recruitmentPage.navigateToSection("Candidates");
        await recruitmentPage.deleteIfExists("Decline Candidate");
    });

    test('TC03 - Cleanup Vacancy - Senior Java SDET @regression', async ({ recruitmentPage }) => {
        await recruitmentPage.navigateToSection("Vacancies");
        await recruitmentPage.deleteIfExists("Senior Java SDET");
    });

    test('TC04 - Cleanup Candidate - Workflow Candidate @regression', async ({ recruitmentPage }) => {
        await recruitmentPage.navigateToSection("Candidates");
        await recruitmentPage.deleteIfExists("Workflow Candidate");
    });

    test('TC05 - Cleanup Candidate - Failed Candidate @regression', async ({ recruitmentPage }) => {
        await recruitmentPage.navigateToSection("Candidates");
        await recruitmentPage.deleteIfExists("Failed Candidate");
    });
});
