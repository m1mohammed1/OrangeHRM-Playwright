import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Admin Test Cleaning', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateTo(TestConfig.BASE_URL);
        await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        await dashboardPage.navigateToModule("Admin");
    });

    test('TC01 - Cleanup Job Title - Principal SDET Engineer @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Job", "Job Titles");
        await adminPage.deleteIfExists("Principal SDET Engineer");
    });

    test('TC02 - Cleanup Pay Grade - Grade 5 - Executive @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Job", "Pay Grades");
        await adminPage.deleteIfExists("Grade 5 - Executive");
    });

    test('TC03 - Cleanup Employment Status - Freelance - Project Based @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Job", "Employment Status");
        await adminPage.deleteIfExists("Freelance - Project Based");
    });

    test('TC04 - Cleanup Job Category - Professionals - QA Engineer @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Job", "Job Categories");
        await adminPage.deleteIfExists("Professionals - QA Engineer");
    });

    test('TC05 - Cleanup Work Shift - Night Shift - B @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Job", "Work Shifts");
        await adminPage.deleteIfExists("Night Shift - B");
    });

    test('TC06 - Cleanup Location - Cairo Innovation Hub @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Organization", "Locations");
        await adminPage.typeInField("Name", "Cairo Innovation Hub");
        await adminPage.clickSearch();
        await adminPage.deleteIfExists("Cairo Innovation Hub");
    });

    test('TC07 - Cleanup Skill - Java Automation @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Qualifications", "Skills");
        await adminPage.deleteIfExists("Java Automation");
    });

    test('TC08 - Cleanup Education - Master of Science @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Qualifications", "Education");
        await adminPage.deleteIfExists("Master of Science");
    });

    test('TC09 - Cleanup License - ISTQB Foundation @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Qualifications", "Licenses");
        await adminPage.deleteIfExists("ISTQB Foundation");
    });

    test('TC10 - Cleanup Language - German-Arabic @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Qualifications", "Languages");
        await adminPage.deleteIfExists("German-Arabic");
    });

    test('TC11 - Cleanup Membership - IEEE Member @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Qualifications", "Memberships");
        await adminPage.deleteIfExists("IEEE Member");
    });

    test('TC12 - Cleanup Email Subscription - Automation Subscriber @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Configuration", "Email Subscriptions");
        await adminPage.clickSubscribe("Leave Applications");
        await adminPage.deleteIfExists("Automation Subscriber");
    });

    test('TC13 - Cleanup Nationality - Automation Tester Nationality @regression', async ({ adminPage }) => {
        await adminPage.navigateToSection("Nationalities");
        await adminPage.deleteIfExists("1-Automation Tester Nationality");
    });
});
