import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Recruitment_Search_And_Data_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Recruitment');
        });
    });

    test('TC01 - Verify Search Candidate by Name and Status @regression', async ({ recruitmentPage }) => {
        const candidateName = 'E2E';

        await test.step('Search Candidate', async () => {
            await recruitmentPage.typeInField('Candidate Name', candidateName);
            await recruitmentPage.selectFromList();
            await recruitmentPage.selectDropdownOption('Status', 'Application Initiated');
            await recruitmentPage.clickSearch();
            await recruitmentPage.verifyRecordVisible('Software Engineer');
        });
    });

    test('TC02 - Verify Reset Search Filters @regression', async ({ recruitmentPage }) => {
        await test.step('Reset Filters', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.selectDropdownOption('Job Title', 'Software Engineer');
            await recruitmentPage.clickSearch();
            await recruitmentPage.verifySearchTable();
        });
    });

    test('TC03 - Verify Editing Candidate Details (Email/Phone) @regression', async ({ recruitmentPage }) => {
        const oldEmail = 'wrong@test.com';
        const newEmail = 'correct@test.com';

        await test.step('Add Candidate', async () => {
            await recruitmentPage.clickAdd();
            await recruitmentPage.typeInNameField('Full Name', 'First Name', 'EditMe');
            await recruitmentPage.typeInNameField('Full Name', 'Last Name', 'User');
            await recruitmentPage.typeInField('Email', oldEmail);
            await recruitmentPage.selectDropdownOption('Vacancy', 'Software Engineer');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Edit Candidate', async () => {
            await recruitmentPage.clickEditSwitch();
            await recruitmentPage.typeInField('Email', newEmail);
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Delete Candidate', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.typeInField('Candidate Name', 'EditMe');
            await recruitmentPage.selectFromList();
            await recruitmentPage.clickSearch();
            await recruitmentPage.deleteRecord('Software Engineer');
            await recruitmentPage.verifySuccessToast();
        });
    });
});
