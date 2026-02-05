import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Recruitment_Candidate_E2E_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Recruitment');
        });
    });

    test('TC01 - E2E Hiring Flow: Add -> Shortlist -> Interview -> Offer -> Hire @regression', async ({ recruitmentPage }) => {
        const firstName = 'E2E';
        const lastName = 'Candidate';
        const email = 'e2e@test.com';
        const vacancy = 'Software Engineer';

        await test.step('Add Candidate', async () => {
            await recruitmentPage.clickAdd();
            await recruitmentPage.typeInNameField('Full Name', 'First Name', firstName);
            await recruitmentPage.typeInNameField('Full Name', 'Last Name', lastName);
            await recruitmentPage.typeInField('Email', email);
            await recruitmentPage.typeInField('Contact Number', '010000000');
            await recruitmentPage.selectDropdownOption('Vacancy', vacancy);
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Add Notes', async () => {
            await recruitmentPage.clickEditSwitch();
            await recruitmentPage.typeInField('Notes', 'Candidate looks good');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Shortlist Candidate', async () => {
            await recruitmentPage.clickToButton('Shortlist');
            await recruitmentPage.typeInField('Notes', 'Candidate is Impressive');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifyErrorToast();
            // Defect in Candidate steps
        });
    });

    test('TC02 - Verify Candidate Declines Job Offer @regression', async ({ recruitmentPage }) => {
        const firstName = 'Decline';
        const lastName = 'Candidate';
        const email = 'decline.candidate@test.com';

        await test.step('Add Candidate', async () => {
            await recruitmentPage.clickAdd();
            await recruitmentPage.typeInNameField('Full Name', 'First Name', firstName);
            await recruitmentPage.typeInNameField('Full Name', 'Last Name', lastName);
            await recruitmentPage.typeInField('Email', email);
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Toggle and Add Notes', async () => {
            await recruitmentPage.toggleEditMode();
            await recruitmentPage.typeInField('Notes', 'Good profile');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifyErrorToast();
            // Defect in Candidate steps
        });
    });
});
