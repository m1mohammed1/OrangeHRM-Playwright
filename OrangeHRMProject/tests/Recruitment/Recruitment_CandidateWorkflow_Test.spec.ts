import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Recruitment_CandidateWorkflow_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Recruitment');
        });
    });

    test('TC01 - Verify Add Candidate with All Fields @regression', async ({ recruitmentPage }) => {
        const firstName = 'Workflow';
        const lastName = 'Candidate';
        const email = 'workflow.candidate@test.com';

        await test.step('Navigate and Add Candidate', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.clickAdd();
            await recruitmentPage.typeInNameField('Full Name', 'First Name', firstName);
            await recruitmentPage.typeInNameField('Full Name', 'Last Name', lastName);
            await recruitmentPage.typeInField('Email', email);
            await recruitmentPage.typeInField('Contact Number', '01234567890');
            await recruitmentPage.selectDropdownOption('Vacancy', 'Software Engineer');
            await recruitmentPage.typeInField('Notes', 'Added via Automation Test');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });
    });

    test('TC02 - Verify Add Candidate Validation @regression', async ({ recruitmentPage }) => {
        await test.step('Submit without Required Fields', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.clickAdd();
            await recruitmentPage.clickSave();
            await recruitmentPage.verifyFieldError('Full Name', 'Required');
            await recruitmentPage.verifyFieldError('Email', 'Required');
        });
    });

    test('TC03 - Verify Shortlist Candidate @regression', async ({ recruitmentPage }) => {
        await test.step('Search and Shortlist', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.typeInField('Candidate Name', 'Workflow');
            await recruitmentPage.selectFromList();
            await recruitmentPage.clickSearch();
            await recruitmentPage.clickEyeStatus('Workflow Candidate');
            await recruitmentPage.clickToButton('Shortlist');
            await recruitmentPage.typeInField('Notes', 'Shortlisted - Good Profile');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifyErrorToast();
        });
    });

    test('TC04 - Verify Schedule Interview @regression', async ({ recruitmentPage }) => {
        await test.step('Schedule Interview', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.selectDropdownOption('Status', 'Shortlisted');
            await recruitmentPage.clickSearch();
            await recruitmentPage.clickEyeStatus('Senior QA Lead');
            await recruitmentPage.clickToButton('Schedule Interview');
            await recruitmentPage.typeInField('Interview Title', 'Technical Interview');
            await recruitmentPage.typeInField('Interviewer', 'Script Automation Tester');
            await recruitmentPage.selectFromList();
            await recruitmentPage.typeInField('Notes', 'Technical Round 1');
            await recruitmentPage.typeInField('Date', '2025-01-25');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });
    });

    test('TC05 - Verify Schedule Interview Validation @regression', async ({ recruitmentPage }) => {
        await test.step('Validation Check', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.selectDropdownOption('Status', 'Shortlisted');
            await recruitmentPage.clickSearch();
            await recruitmentPage.clickEyeStatus('Senior QA Lead');
            await recruitmentPage.clickToButton('Schedule Interview');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifyFieldError('Interview Title', 'Required');
            await recruitmentPage.verifyFieldError('Interviewer', 'Required');
            await recruitmentPage.verifyFieldError('Date', 'Required');
        });
    });

    test('TC06 - Verify Mark Interview Passed @regression', async ({ recruitmentPage }) => {
        await test.step('Mark Interview Passed', async () => {
            await recruitmentPage.navigateToSection('Candidates');
            await recruitmentPage.selectDropdownOption('Status', 'Interview Scheduled');
            await recruitmentPage.clickSearch();
            await recruitmentPage.clickEyeStatus('Senior QA Lead');
            await recruitmentPage.clickToButton('Mark Interview Passed');
            await recruitmentPage.typeInField('Notes', 'Passed - Strong technical skills');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifyErrorToast();
            // Defect
        });
    });
});
