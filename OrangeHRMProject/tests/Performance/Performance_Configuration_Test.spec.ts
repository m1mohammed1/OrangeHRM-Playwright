import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Performance_Configuration_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Performance');
        });
    });

    test('TC01 - Verify KPI Lifecycle: Create, Link to Job @foundation', async ({ performancePage }) => {
        const kpiName = 'Zero Production Bugs';
        const jobTitle = 'QA Engineer';

        await test.step('Navigate to KPIs', async () => {
            await performancePage.navigateToSection('Configure', 'KPIs');
        });

        await test.step('Create KPI', async () => {
            await performancePage.clickAdd();
            await performancePage.typeInField('Key Performance Indicator', kpiName);
            await performancePage.selectDropdownOption('Job Title', jobTitle);
            await performancePage.typeInField('Minimum Rating', '30');
            await performancePage.typeInField('Maximum Rating', '100');
            await performancePage.clickSave();
            await performancePage.verifySuccessToast();
        });

        await test.step('Verify KPI', async () => {
            await performancePage.hardWait(3);
            await performancePage.selectDropdownOption('Job Title', 'QA Engineer');
            await performancePage.clickSearch();
            await performancePage.verifyRecordVisible(kpiName);
        });
    });

    test('TC02 - Verify KPI Lifecycle: Create, Link to Job, Edit, Delete @regression', async ({ performancePage }) => {
        const kpiName = 'Zero Bugs, Zero Compromise';
        const jobTitle = 'QA Engineer';

        await test.step('Navigate to KPIs', async () => {
            await performancePage.navigateToSection('Configure', 'KPIs');
        });

        await test.step('Create KPI', async () => {
            await performancePage.clickAdd();
            await performancePage.typeInField('Key Performance Indicator', kpiName);
            await performancePage.selectDropdownOption('Job Title', jobTitle);
            await performancePage.typeInField('Minimum Rating', '70');
            await performancePage.typeInField('Maximum Rating', '100');
            await performancePage.clickSave();
            await performancePage.verifySuccessToast();
        });

        await test.step('Edit KPI', async () => {
            await performancePage.hardWait(3);
            await performancePage.selectDropdownOption('Job Title', 'QA Engineer');
            await performancePage.clickSearch();
            await performancePage.editRecord(kpiName);
            await performancePage.typeInField('Key Performance Indicator', 'Zero Compromise');
            await performancePage.clickSave();
            await performancePage.verifySuccessToast();
        });

        await test.step('Delete KPI', async () => {
            await performancePage.hardWait(3);
            await performancePage.selectDropdownOption('Job Title', 'QA Engineer');
            await performancePage.clickSearch();
            await performancePage.verifyRecordVisible('Zero Compromise');
            await performancePage.deleteRecord('Zero Compromise');
            await performancePage.verifySuccessToast();
        });
    });

    test('TC03 - Verify KPI Validation Errors @regression', async ({ performancePage }) => {
        await test.step('Navigate to KPIs', async () => {
            await performancePage.navigateToSection('Configure', 'KPIs');
        });

        await test.step('Submit without Required Fields', async () => {
            await performancePage.clickAdd();
            await performancePage.clickSave();
            await performancePage.verifyFieldError('Key Performance Indicator', 'Required');
            await performancePage.verifyFieldError('Job Title', 'Required');
        });
    });

    test('TC04 - Verify Tracker Lifecycle: Create @regression', async ({ performancePage }) => {
        const trackerName = 'Quality Tracker 2025';
        const employeeName = 'Dev Sec Ops';
        const reviewerName = 'Script Automation Tester';

        await test.step('Navigate to Trackers', async () => {
            await performancePage.navigateToSection('Configure', 'Trackers');
        });

        await test.step('Create Tracker', async () => {
            await performancePage.clickAdd();
            await performancePage.typeInField('Tracker Name', trackerName);
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.selectFromList();
            await performancePage.typeInField('Reviewers', reviewerName);
            await performancePage.selectFromList();
            await performancePage.clickSave();
            await performancePage.verifySuccessToast();
        });
    });

    test('TC05 - Verify Tracker Validation Errors @regression', async ({ performancePage }) => {
        await test.step('Navigate to Trackers', async () => {
            await performancePage.navigateToSection('Configure', 'Trackers');
        });

        await test.step('Submit without Required Fields', async () => {
            await performancePage.clickAdd();
            await performancePage.clickSave();
            await performancePage.verifyFieldError('Tracker Name', 'Required');
            await performancePage.verifyFieldError('Employee Name', 'Required');
            await performancePage.verifyFieldError('Reviewers', 'Required');
        });
    });
});
