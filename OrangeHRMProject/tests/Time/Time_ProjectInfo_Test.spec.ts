import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Time_ProjectInfo_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Time');
        });
    });

    test('TC01 - Verify Customer Add @foundation', async ({ timePage }) => {
        const customerName = 'Auto Test Customer';

        await test.step('Navigate to Customers', async () => {
            await timePage.navigateToSection('Project Info', 'Customers');
        });

        await test.step('Add Customer', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', customerName);
            await timePage.typeInField('Description', 'Customer added via automation');
            await timePage.clickSave();
            await timePage.verifySuccessToast();
            await timePage.verifyRecordVisible(customerName);
        });
    });

    test('TC02 - Verify Project Add @foundation', async ({ timePage }) => {
        const projectName = 'Automation Project';
        const customerName = 'Auto Test Customer';

        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Add Project', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', projectName);
            await timePage.typeInField('Customer Name', customerName);
            await timePage.selectFromList();
            await timePage.typeInField('Description', 'Project for automation testing');
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });
    });

    test('TC03 - Verify Project Add with Admin @foundation', async ({ timePage }) => {
        const projectName = 'Project With Admin';
        const customerName = 'Auto Test Customer';
        const adminName = 'Script Automation Tester';

        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Add Project with Admin', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', projectName);
            await timePage.typeInField('Customer Name', customerName);
            await timePage.selectFromList();
            await timePage.typeInField('Project Admin', adminName);
            await timePage.selectFromList();
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });
    });

    test('TC04 - Verify Customer Edit @regression', async ({ timePage }) => {
        const customerName = 'Edit Test Customer';
        const updatedName = 'Updated Customer Name';

        await test.step('Navigate to Customers', async () => {
            await timePage.navigateToSection('Project Info', 'Customers');
        });

        await test.step('Add Customer', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', customerName);
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });

        await test.step('Edit Customer', async () => {
            await timePage.editRecord(customerName);
            await timePage.typeInField('Name', updatedName);
            await timePage.clickSave();
            await timePage.verifySuccessToast();
            await timePage.verifyRecordVisible(updatedName);
        });

        await test.step('Delete Customer', async () => {
            await timePage.deleteRecord(updatedName);
            await timePage.verifySuccessToast();
        });
    });

    test('TC05 - Verify Customer Delete @regression', async ({ timePage }) => {
        const customerName = 'Delete Test Customer';

        await test.step('Navigate to Customers', async () => {
            await timePage.navigateToSection('Project Info', 'Customers');
        });

        await test.step('Add Customer', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', customerName);
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });

        await test.step('Delete Customer', async () => {
            await timePage.deleteRecord(customerName);
            await timePage.verifySuccessToast();
            await timePage.verifyRecordNotVisible(customerName);
        });
    });

    test('TC06 - Verify Customer Validation @regression', async ({ timePage }) => {
        await test.step('Navigate to Customers', async () => {
            await timePage.navigateToSection('Project Info', 'Customers');
        });

        await test.step('Attempt to Save without Name', async () => {
            await timePage.clickAdd();
            await timePage.clickSave();
            await timePage.verifyFieldError('Name', 'Required');
        });
    });

    test('TC07 - Verify Customer Duplicate @regression', async ({ timePage }) => {
        const customerName = 'Duplicate Customer';

        await test.step('Navigate to Customers', async () => {
            await timePage.navigateToSection('Project Info', 'Customers');
        });

        await test.step('Add Customer', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', customerName);
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });

        await test.step('Attempt to Add Duplicate', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', customerName);
            await timePage.clickSave();
            await timePage.verifyFieldError('Name', 'Already exists');
        });

        await test.step('Cleanup', async () => {
            await timePage.navigateToSection('Project Info', 'Customers');
            await timePage.deleteRecord(customerName);
        });
    });

    test('TC08 - Verify Project Edit @regression', async ({ timePage }) => {
        const projectName = 'Edit Project';
        const updatedName = 'Updated Project Name';
        const customerName = 'ACME Ltd';

        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Add Project', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', projectName);
            await timePage.typeInField('Customer Name', customerName);
            await timePage.selectFromList();
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });

        await test.step('Add Project Admin', async () => {
            await timePage.typeInField('Project Admin', 'Script Automation');
            await timePage.selectFromList();
            await timePage.clickSave();
        });

        await test.step('Edit Project', async () => {
            await timePage.editRecord(customerName);
            await timePage.typeInField('Name', updatedName);
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });

        await test.step('Delete Project', async () => {
            await timePage.deleteRecord(updatedName);
            await timePage.verifySuccessToast();
        });
    });

    test('TC09 - Verify Project Delete @regression', async ({ timePage }) => {
        const projectName = 'Delete Project';
        const customerName = 'Apache Software Foundation';

        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Add Project', async () => {
            await timePage.clickAdd();
            await timePage.typeInField('Name', projectName);
            await timePage.typeInField('Customer Name', customerName);
            await timePage.selectFromList();
            await timePage.typeInField('Project Admin', 'Script Automation');
            await timePage.selectFromList();
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });

        await test.step('Delete Project', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
            await timePage.deleteRecord(customerName);
            await timePage.verifySuccessToast();
        });
    });

    test('TC10 - Verify Project Validation @regression', async ({ timePage }) => {
        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Attempt to Save without Required Fields', async () => {
            await timePage.clickAdd();
            await timePage.clickSave();
            await timePage.verifyFieldError('Name', 'Required');
            await timePage.verifyFieldError('Customer Name', 'Required');
        });
    });

    test('TC11 - Verify Project Search by Customer @regression', async ({ timePage }) => {
        const customerName = 'Apache Software Foundation';

        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Search by Customer', async () => {
            await timePage.typeInField('Customer Name', customerName);
            await timePage.selectFromList();
            await timePage.clickSearch();
          //  await timePage.verifySearchTable();
        });
    });

    test('TC12 - Verify Project Search by Project Name @regression', async ({ timePage }) => {
        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Search by Project Name', async () => {
            await timePage.typeInField('Project', 'Automation');
            await timePage.clickSearch();
        //    await timePage.verifySearchTable();
        });
    });

    test('TC13 - Verify Project Search by Admin @regression', async ({ timePage }) => {
        const adminName = 'Script Automation';

        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Search by Admin', async () => {
            await timePage.typeInField('Project Admin', adminName);
            await timePage.selectFromList();
            await timePage.clickSearch();
       //     await timePage.verifySearchTable();
        });
    });

    test('TC14 - Verify Project Reset Filters @regression', async ({ timePage }) => {
        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Apply and Reset Filters', async () => {
            await timePage.typeInField('Project', 'Test');
            await timePage.typeInField('Customer Name', 'Apache Software Foundation');
            await timePage.selectFromList();
            await timePage.clickSubmit();
            await timePage.clickReset();
       //     await timePage.verifySearchTable();
        });
    });

    test('TC15 - Cleanup: Delete Test Projects and Customer @regression', async ({ timePage }) => {
        await test.step('Navigate to Projects', async () => {
            await timePage.navigateToSection('Project Info', 'Projects');
        });

        await test.step('Search and Delete Projects', async () => {
            await timePage.typeInField('Customer Name', 'Auto Test Customer');
            await timePage.clickSearch();
            await timePage.deleteRecord('Automation Project');
            await timePage.deleteRecord('Project With Admin');
        });

        await test.step('Delete Customer', async () => {
            await timePage.navigateToSection('Project Info', 'Customers');
            await timePage.deleteRecord('Auto Test Customer');
            await timePage.verifySuccessToast();
        });
    });
});
