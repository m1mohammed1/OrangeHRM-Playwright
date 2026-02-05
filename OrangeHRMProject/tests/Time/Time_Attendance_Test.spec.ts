import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Time_Attendance_Test', () => {

    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
            await dashboardPage.navigateToModule('Time');
        });
    });

    test('TC01 - Verify Punch Punch In/Out Workflow @regression', async ({ timePage }) => {
        await test.step('Navigate to Punch In/Out', async () => {
            await timePage.navigateToSection('Attendance', 'Punch In/Out');
        });

        await test.step('Punch In', async () => {
            await timePage.typeInField('Date', '2027-12-15');
            await timePage.typeInField('Time', '09:00 AM');
            await timePage.typeInField('Note', 'Started working on Automation');
            await timePage.clickPunchIn();
            await timePage.verifySuccessToast();
        });

        await test.step('Punch Out', async () => {
            await timePage.hardWait(1);
            await timePage.typeInField('Date', '2027-12-30');
            await timePage.typeInField('Time', '05:00 PM');
            await timePage.typeInField('Note', 'Leaving for the day');
            await timePage.clickPunchOut();
            await timePage.verifySuccessToast();
        });
    });

    test('TC02 - Verify Punch Punch In/Out Verify, Edit, Delete Workflow @regression', async ({ timePage }) => {
        await test.step('Navigate to Punch In/Out', async () => {
            await timePage.navigateToSection('Attendance', 'Punch In/Out');
        });

        await test.step('Punch In', async () => {
            await timePage.typeInField('Date', '2026-07-15');
            await timePage.typeInField('Time', '09:00 AM');
            await timePage.typeInField('Note', 'Started working on Scripting');
            await timePage.clickPunchIn();
            await timePage.verifySuccessToast();
        });

        await test.step('Punch Out', async () => {
            await timePage.hardWait(1);
            await timePage.typeInField('Date', '2026-07-30');
            await timePage.typeInField('Time', '05:00 PM');
            await timePage.typeInField('Note', 'Deploying to Sleep Mode');
            await timePage.clickPunchOut();
            await timePage.verifySuccessToast();
        });

        await test.step('Navigate to My Records', async () => {
            await timePage.navigateToSection('Attendance', 'My Records');
            await timePage.typeInField('Date', '2026-07-15');
            await timePage.clickView();
        });

        await test.step('Edit Record', async () => {
            await timePage.editRecord('368.00');
            await timePage.typeInField('Time', '06:00 PM');
            await timePage.typeInField('Date', '2026-07-27');
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });

        await test.step('Delete Record', async () => {
            await timePage.deleteRecord('71.00');
            await timePage.verifySuccessToast();
        });
    });

    test('TC03 - Verify Employee Record Lifecycle: Create, Edit, Delete @regression', async ({ timePage }) => {
        const employeeName = 'Script Automation Tester';
        const searchDate = '2024-12-01';

        await test.step('Navigate to Employee Records and Search', async () => {
            await timePage.navigateToSection('Attendance', 'Employee Records');
            await timePage.typeInField('Employee Name', employeeName);
            await timePage.selectFromList();
            await timePage.typeInField('Date', searchDate);
            await timePage.clickView();
            await timePage.verifySearchTable();
        });

        await test.step('Add Punch In Record', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Date', '2025-07-15');
            await timePage.typeInField('Note', 'Code pushed System: On');
            await timePage.clickPunchIn();
            await timePage.verifySuccessToast();
        });

        await test.step('Add Punch Out Record', async () => {
            await timePage.hardWait(1);
            await timePage.clickAdd();
            await timePage.typeInField('Date', '2025-07-25');
            await timePage.typeInField('Note', 'Code pushed System: On');
            await timePage.clickPunchOut();
            await timePage.verifySuccessToast();
        });

        await test.step('Edit Record', async () => {
            await timePage.typeInField('Date', '2025-07-15');
            await timePage.clickView();
            await timePage.editRecord('240.00');
            await timePage.typeInField('Date', '2025-07-05');
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });
    });

    test('TC04 - Verify My Attendance Records @regression', async ({ timePage }) => {
        const searchDate = '2025-07-30';

        await test.step('Navigate to My Records and View', async () => {
            await timePage.navigateToSection('Attendance', 'My Records');
            await timePage.typeInField('Date', searchDate);
            await timePage.clickView();
            await timePage.verifySearchTable();
        });
    });
});
