import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Performance_MyReviews_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Performance');
        });
    });

    test('TC01 - Verify Manage Reviews Add Reviews Life Cycle @regression', async ({ performancePage }) => {
        const employeeName = 'Dev Sec Ops';
        const SupervisorName = 'Script';

        await test.step('Navigate and Add Review', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.clickAdd();
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.selectFromList();
            await performancePage.typeInField('Supervisor Reviewer', SupervisorName);
            await performancePage.selectFromList();
            await performancePage.typeInField('Due Date', '2025-03-30');
            await performancePage.typeInField('Review Period Start Date', '2025-03-15');
            await performancePage.typeInField('Review Period End Date', '2025-03-20');
            await performancePage.typeInField('Due Date', '2025-03-30');
            await performancePage.closePopups();
            await performancePage.clickSave();
            await performancePage.verifySuccessToast();
        });
    });

    test('TC02 - Verify Manage Reviews Activate Review @regression', async ({ performancePage }) => {
        const employeeName = 'Dev Ops';
        const supervisorName = 'Script';

        await test.step('Add Review', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.clickAdd();
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.selectFromList();
            await performancePage.typeInField('Supervisor Reviewer', supervisorName);
            await performancePage.selectFromList();
            await performancePage.typeInField('Review Period Start Date', '2025-01-01');
            await performancePage.typeInField('Review Period End Date', '2025-12-31');
            await performancePage.typeInField('Due Date', '2026-01-15');
            await performancePage.closePopups();
            await performancePage.clickSave();
            await performancePage.verifySuccessToast();
        });

        await test.step('Activate Review', async () => {
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.selectFromList();
            await performancePage.clickSearch();
            await performancePage.hardWait(2);
            await performancePage.editRecord("Dev Ops");
            await performancePage.clickActivate();
            await performancePage.verifySuccessToast();
        });
    });

    test('TC03 - Verify Manage Reviews Complete Review @regression', async ({ performancePage }) => {
        await test.step('Complete Review', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.selectDropdownOption('Review Status', 'Activated');
            await performancePage.clickSearch();
            await performancePage.clickViewReview();
            await performancePage.submitFinalRating();
            await performancePage.verifySuccessToast();
        });
    });

    test('TC04 - Verify Manage Reviews Reset Filters @regression', async ({ performancePage }) => {
        await test.step('Reset Filters', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.selectDropdownOption('Status', 'Activated');
            await performancePage.typeInField('From Date', '2024-01-01');
            await performancePage.clickReset();
            await performancePage.verifySearchTable();
        });
    });

    test('TC05 - Verify My Reviews Page Display @regression', async ({ performancePage }) => {
        await test.step('Display My Reviews', async () => {
            await performancePage.navigateToSection('My Reviews');
            await performancePage.verifyRecordTable();
        });
    });

    test('TC06 - Verify My Trackers Page Display @regression', async ({ performancePage }) => {
        await test.step('Display My Trackers', async () => {
            await performancePage.navigateToSection('My Trackers');
            await performancePage.verifyRecordTable();
        });
    });

    test('TC07 - Verify Employee Trackers Page Display @regression', async ({ performancePage }) => {
        await test.step('Display Employee Trackers', async () => {
            await performancePage.navigateToSection('Employee Trackers');
            await performancePage.verifySearchTable();
        });
    });

    test('TC08 - Verify Employee Trackers Filter by Employee @regression', async ({ performancePage }) => {
        const employeeName = 'Script Automation';

        await test.step('Filter by Employee', async () => {
            await performancePage.navigateToSection('Employee Trackers');
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.selectFromList();
            await performancePage.clickSearch();
            await performancePage.verifySearchTable();
        });
    });

    test('TC09 - Verify Manage Reviews Search by Employee @regression', async ({ performancePage }) => {
        const employeeName = 'Script';

        await test.step('Search by Employee', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.hardWait(2);
            await performancePage.selectFromList();
            await performancePage.clickSearch();
            await performancePage.verifySearchTable();
        });
    });


    test('TC10 - Verify Manage Reviews Search by Reviewer @regression', async ({ performancePage }) => {
        const reviewerName = 'Script Automation';

        await test.step('Search by Reviewer', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.typeInField('Reviewer', reviewerName);
            await performancePage.selectFromList();
            await performancePage.clickSearch();
            await performancePage.verifySearchTable();
        });
    });

    test('TC11 - Verify Manage Reviews Filter by Status @regression', async ({ performancePage }) => {
        await test.step('Filter by Status', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.selectDropdownOption('Review Status', 'Activated');
            await performancePage.clickSearch();
            await performancePage.verifySearchTable();
        });
    });

    test('TC12 - Verify Review Validation Errors @regression', async ({ performancePage }) => {
        await test.step('Submit without Required Fields', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Manage Reviews');
            await performancePage.clickAdd();
            await performancePage.clickSave();
            await performancePage.verifyFieldError('Employee Name', 'Required');
            await performancePage.verifyFieldError('Supervisor Reviewer', 'Required');
        });
    });
});
