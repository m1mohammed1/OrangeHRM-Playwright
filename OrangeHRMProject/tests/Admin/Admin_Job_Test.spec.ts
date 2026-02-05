import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Admin_Job_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Verify Dashboard and Navigate to Admin', async () => {
            await dashboardPage.verifyDashboard("Dashboard");
            await dashboardPage.navigateToModule("Admin");
        });
    });

    test('TC01 - Verify Job Title Lifecycle: Create, Verify, Delete @foundation', async ({ adminPage }) => {
        const jobTitle = "Principal SDET Engineer";

        await test.step('Navigate to Job Titles', async () => {
            await adminPage.navigateToSection("Job", "Job Titles");
        });

        await test.step('Create Job Title', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Job Title", jobTitle);
            await adminPage.typeInField("Job Description", "Responsible for Test Architecture");
            await adminPage.typeInField("Note", "Created by Auto-Test");
            await adminPage.clickSave();
        });

        await test.step('Verify and Delete', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(jobTitle);
            await adminPage.deleteRecord(jobTitle);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC02 - Verify validation error for empty Job Title @regression', async ({ adminPage }) => {
        await test.step('Navigate and Trigger Error', async () => {
            await adminPage.navigateToSection("Job", "Job Titles");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error Message', async () => {
            await adminPage.verifyFieldError("Job Title", "Required");
        });
    });

    test('TC03 - Verify error when creating a duplicate Job Title @regression', async ({ adminPage }) => {
        const duplicateTitle = "Duplicate Job Title";

        await test.step('Create Job Title', async () => {
            await adminPage.navigateToSection("Job", "Job Titles");
            await adminPage.clickAdd();
            await adminPage.typeInField("Job Title", duplicateTitle);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Job Title", duplicateTitle);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Job Title", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateTitle);
        });
    });

    test('TC04 - Verify Pay Grade Lifecycle with Currency: Create, Add Currency @foundation', async ({ adminPage }) => {
        const gradeName = "Grade 5 - Executive";

        await test.step('Navigate to Pay Grades', async () => {
            await adminPage.navigateToSection("Job", "Pay Grades");
        });

        await test.step('Create Pay Grade', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", gradeName);
            await adminPage.clickSave();
            await adminPage.verifyInfoToast();
        });

        await test.step('Add Currency to Pay Grade', async () => {
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("Currency", "EUR - Euro");
            await adminPage.typeInField("Minimum Salary", "4000");
            await adminPage.typeInField("Maximum Salary", "8000");
            await adminPage.clickSave(1);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC05 - Verify validation error for empty Pay Grade Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Job", "Pay Grades");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC06 - Verify error when creating a duplicate Pay Grade @regression', async ({ adminPage }) => {
        const duplicateGrade = "Duplicate Grade";

        await test.step('Create Pay Grade', async () => {
            await adminPage.navigateToSection("Job", "Pay Grades");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateGrade);
            await adminPage.clickSave();
            await adminPage.verifyInfoToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.navigateToSection("Job", "Pay Grades");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateGrade);
            await adminPage.clickSave();
            await adminPage.verifyFieldError("Name", "Already exists");
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateGrade);
        });
    });

    test('TC07 - Verify Employment Status Lifecycle: Create and Delete @regression', async ({ adminPage }) => {
        const statusName = "Freelance - Project Based";

        await test.step('Create Employment Status', async () => {
            await adminPage.navigateToSection("Job", "Employment Status");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", statusName);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(statusName);
            await adminPage.deleteRecord(statusName);
        });
    });

    test('TC08 - Verify validation error for empty Employment Status Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Job", "Employment Status");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC09 - Verify error when creating a duplicate Employment Status @regression', async ({ adminPage }) => {
        const duplicateStatus = "Duplicate Status";

        await test.step('Create Employment Status', async () => {
            await adminPage.navigateToSection("Job", "Employment Status");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateStatus);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateStatus);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateStatus);
        });
    });

    test('TC10 - Verify updating an existing Job Title @regression', async ({ adminPage }) => {
        const oldTitle = "Junior QA Automation Tester";
        const newTitle = "Senior QA Automation Tester";

        await test.step('Create Job Title', async () => {
            await adminPage.navigateToSection("Job", "Job Titles");
            await adminPage.clickAdd();
            await adminPage.typeInField("Job Title", oldTitle);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Update Job Title', async () => {
            await adminPage.editRecord(oldTitle);
            await adminPage.typeInField("Job Title", newTitle);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Verify Update and Cleanup', async () => {
            await adminPage.verifyRecordVisible(newTitle);
            await adminPage.deleteRecord(newTitle);
        });
    });

    test('TC11 - Verify updating Pay Grade Currency Salary @regression', async ({ adminPage }) => {
        const gradeName = "Grade Update Test";

        await test.step('Create Pay Grade with Currency', async () => {
            await adminPage.navigateToSection("Job", "Pay Grades");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", gradeName);
            await adminPage.clickSave();
            await adminPage.verifyInfoToast();

            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("Currency", "CAD - Canadian Dollar");
            await adminPage.typeInField("Minimum Salary", "2000");
            await adminPage.typeInField("Maximum Salary", "4000");
            await adminPage.clickSave(1);
            await adminPage.verifySuccessToast();
        });

        await test.step('Update Currency Salary', async () => {
            await adminPage.editRecord("Canadian Dollar");
            await adminPage.typeInField("Minimum Salary", "3000");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Cleanup', async () => {
            await adminPage.navigateToSection("Job", "Pay Grades");
            await adminPage.deleteRecord(gradeName);
        });
    });

    test('TC12 - Verify updating Employment Status Name @regression', async ({ adminPage }) => {
        const oldStatus = "Freelance Part Time ";
        const newStatus = "Part Time (Contract)";

        await test.step('Create Employment Status', async () => {
            await adminPage.navigateToSection("Job", "Employment Status");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", oldStatus);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Update Employment Status', async () => {
            await adminPage.editRecord(oldStatus);
            await adminPage.typeInField("Name", newStatus);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Verify Update and Cleanup', async () => {
            await adminPage.verifyRecordNotVisible(oldStatus);
            await adminPage.verifyRecordVisible(newStatus);
            await adminPage.deleteRecord(newStatus);
        });
    });

    test('TC13 - Verify Job Category Lifecycle: Create, Verify, and Delete @regression', async ({ adminPage }) => {
        const categoryName = "Professionals - َQA Engineer";

        await test.step('Create Job Category', async () => {
            await adminPage.navigateToSection("Job", "Job Categories");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", categoryName);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(categoryName);
        });
    });

    test('TC14 - Verify updating an existing Job Category @regression', async ({ adminPage }) => {
        const oldCategory = "Solutions Architect";
        const newCategory = "Skilled Solutions Architect";

        await test.step('Create Job Category', async () => {
            await adminPage.navigateToSection("Job", "Job Categories");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", oldCategory);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Update Job Category', async () => {
            await adminPage.editRecord(oldCategory);
            await adminPage.typeInField("Name", newCategory);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Verify Update and Cleanup', async () => {
            await adminPage.verifyRecordNotVisible(oldCategory);
            await adminPage.verifyRecordVisible(newCategory);
            await adminPage.deleteRecord(newCategory);
        });
    });

    test('TC15 - Verify validation error for empty Job Category Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Job", "Job Categories");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC16 - Verify error when creating a duplicate Job Category @regression', async ({ adminPage }) => {
        const duplicateName = "Cyber Operatives";

        await test.step('Create Job Category', async () => {
            await adminPage.navigateToSection("Job", "Job Categories");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateName);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateName);
        });
    });

    test('TC17 - Verify Work Shift Lifecycle: Create, Verify, and Delete @regression', async ({ adminPage }) => {
        const shiftName = "Night Shift - B";

        await test.step('Create Work Shift', async () => {
            await adminPage.navigateToSection("Job", "Work Shifts");
            await adminPage.clickAdd();
            await adminPage.typeInField("Shift Name", shiftName);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(shiftName);
        });
    });

    test('TC18 - Verify updating an existing Work Shift @regression', async ({ adminPage }) => {
        const oldShift = "Morning Shift";
        const newShift = "Morning Shift Extended";

        await test.step('Create Work Shift', async () => {
            await adminPage.navigateToSection("Job", "Work Shifts");
            await adminPage.clickAdd();
            await adminPage.typeInField("Shift Name", oldShift);
            await adminPage.typeInField("From", "08:00 AM");
            await adminPage.typeInField("To", "4:00 PM");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Update Work Shift', async () => {
            await adminPage.editRecord(oldShift);
            await adminPage.typeInField("Shift Name", newShift);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Verify Update and Cleanup', async () => {
            await adminPage.verifyRecordNotVisible(oldShift);
            await adminPage.verifyRecordVisible(newShift);
            await adminPage.deleteRecord(newShift);
        });
    });

    test('TC19 - Verify validation error for empty Work Shift Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Job", "Work Shifts");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Shift Name", "Required");
        });
    });

    test('TC20 - Verify error when creating a duplicate Work Shift @regression', async ({ adminPage }) => {
        const duplicateShift = "Standard Day";

        await test.step('Create Work Shift', async () => {
            await adminPage.navigateToSection("Job", "Work Shifts");
            await adminPage.clickAdd();
            await adminPage.typeInField("Shift Name", duplicateShift);
            await adminPage.typeInField("From", "09:00 AM");
            await adminPage.typeInField("To", "05:00 PM");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Shift Name", duplicateShift);
            await adminPage.typeInField("From", "09:00 AM");
            await adminPage.typeInField("To", "05:00 PM");
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Shift Name", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateShift);
        });
    });

});
