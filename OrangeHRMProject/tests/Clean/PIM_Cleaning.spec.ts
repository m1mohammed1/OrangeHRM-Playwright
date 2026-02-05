import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('PIM Test Cleaning', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateTo(TestConfig.BASE_URL);
        await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        await dashboardPage.navigateToModule("PIM");
    });

    test('TC01 - Cleanup Custom Field - Automation Badge ID @regression', async ({ pimPage }) => {
        await pimPage.navigateToSection("Configuration", "Custom Fields");
        await pimPage.deleteIfExists("Automation Badge ID");
    });

    test('TC02 - Cleanup Reporting Method - Weekly Scrum Report @regression', async ({ pimPage }) => {
        await pimPage.navigateToSection("Configuration", "Reporting Methods");
        await pimPage.deleteIfExists("Weekly Scrum Report");
    });

    test('TC03 - Cleanup Termination Reason - Better Salary Opportunity @regression', async ({ pimPage }) => {
        await pimPage.navigateToSection("Configuration", "Termination Reasons");
        await pimPage.deleteIfExists("Better Salary Opportunity");
    });

    test('TC04 - Cleanup Employee - Script Automation Tester (ID: 77777) @regression', async ({ pimPage }) => {
        await pimPage.navigateToSection("Employee List");
        await pimPage.typeInField("Employee Id", "77777");
        await pimPage.selectDropdownOption("Include", "Current Employees Only");
        await pimPage.clickSearch();
        await pimPage.deleteIfExists("77777");
    });

    test('TC05 - Cleanup Employee - Dev Sec Ops (ID: 0777) @regression', async ({ pimPage }) => {
        await pimPage.navigateToSection("Employee List");
        await pimPage.typeInField("Employee Id", "0777");
        await pimPage.selectDropdownOption("Include", "Current Employees Only");
        await pimPage.clickSearch();
        await pimPage.deleteIfExists("0777");
    });

    test('TC06 - Cleanup Employee - Dev Ops Trem (ID: 0333) @regression', async ({ pimPage }) => {
        await pimPage.navigateToSection("Employee List");
        await pimPage.typeInField("Employee Id", "0333");
        await pimPage.selectDropdownOption("Include", "Current and Past Employees");
        await pimPage.clickSearch();
        await pimPage.deleteIfExists("0333");
    });

    test('TC07 - Cleanup Report - QA Employee Audit Report @regression', async ({ pimPage }) => {
        await pimPage.navigateToSection("Reports");
        await pimPage.deleteRecord("QA Employee Audit Report"); // Reports table might not use bi-trash directly or needs specific name
    });
});
