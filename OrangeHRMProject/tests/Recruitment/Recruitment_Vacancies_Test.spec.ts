import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Recruitment_Vacancies_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Recruitment');
        });
    });

    test('TC01 - Verify Vacancy Lifecycle: Create, Verify @foundation', async ({ recruitmentPage }) => {
        const vacancyName = 'Senior Java SDET';
        const jobTitle = 'QA Engineer';
        const hiringManager = 'Script Automation Tester';

        await test.step('Navigate to Vacancies', async () => {
            await recruitmentPage.navigateToSection('Vacancies');
        });

        await test.step('Create Vacancy', async () => {
            await recruitmentPage.clickAdd();
            await recruitmentPage.typeInField('Vacancy Name', vacancyName);
            await recruitmentPage.selectDropdownOption('Job Title', jobTitle);
            await recruitmentPage.typeInField('Description', 'Hiring for Automation Team');
            await recruitmentPage.typeInField('Hiring Manager', hiringManager);
            await recruitmentPage.selectFromList();
            await recruitmentPage.typeInField('Number of Positions', '2');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Verify Vacancy', async () => {
            await recruitmentPage.navigateToSection('Vacancies');
            await recruitmentPage.selectDropdownOption('Job Title', jobTitle);
            await recruitmentPage.clickSearch();
            await recruitmentPage.verifyRecordVisible(vacancyName);
        });
    });

    test('TC02 - Verify Vacancy Lifecycle: Create, Verify, Edit, Delete @regression', async ({ recruitmentPage }) => {
        const vacancyName = 'Senior Quality Engineer';
        const jobTitle = 'QA Engineer';
        const hiringManager = 'Script Automation Tester';

        await test.step('Navigate to Vacancies', async () => {
            await recruitmentPage.navigateToSection('Vacancies');
        });

        await test.step('Create Vacancy', async () => {
            await recruitmentPage.clickAdd();
            await recruitmentPage.typeInField('Vacancy Name', vacancyName);
            await recruitmentPage.selectDropdownOption('Job Title', jobTitle);
            await recruitmentPage.typeInField('Description', 'Hiring for Automation Team');
            await recruitmentPage.typeInField('Hiring Manager', hiringManager);
            await recruitmentPage.selectFromList();
            await recruitmentPage.typeInField('Number of Positions', '2');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Edit Vacancy', async () => {
            await recruitmentPage.typeInField('Vacancy Name', 'Java Automation Lead');
            await recruitmentPage.clickSave();
            await recruitmentPage.verifySuccessToast();
        });

        await test.step('Verify and Delete', async () => {
            await recruitmentPage.navigateToSection('Vacancies');
            await recruitmentPage.selectDropdownOption('Job Title', jobTitle);
            await recruitmentPage.clickSearch();
            await recruitmentPage.verifyRecordVisible('Java Automation Lead');
            await recruitmentPage.deleteRecord('Java Automation Lead');
            await recruitmentPage.verifySuccessToast();
        });
    });

    test('TC03 - Verify Vacancy Validation Errors @regression', async ({ recruitmentPage }) => {
        await test.step('Navigate to Vacancies', async () => {
            await recruitmentPage.navigateToSection('Vacancies');
        });

        await test.step('Submit without Required Fields', async () => {
            await recruitmentPage.clickAdd();
            await recruitmentPage.clickSave();
            await recruitmentPage.verifyFieldError('Vacancy Name', 'Required');
            await recruitmentPage.verifyFieldError('Job Title', 'Required');
            await recruitmentPage.verifyFieldError('Hiring Manager', 'Required');
        });
    });
});
