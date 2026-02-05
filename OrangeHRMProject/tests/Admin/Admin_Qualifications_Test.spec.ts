import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Admin_Qualifications_Test', () => {
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

    test('TC01 - Verify Skill Lifecycle: Create @foundation', async ({ adminPage }) => {
        const skillName = "Java Automation";

        await test.step('Create Skill', async () => {
            await adminPage.navigateToSection("Qualifications", "Skills");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", skillName);
            await adminPage.typeInField("Description", "Backend and Frontend Testing");
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(skillName);
        });
    });

    test('TC02 - Verify Skill Lifecycle: Create, Edit and Delete @regression', async ({ adminPage }) => {
        const skillName = "Python Automation";
        const updatedSkillName = "Python Playwright Automation";

        await test.step('Create Skill', async () => {
            await adminPage.navigateToSection("Qualifications", "Skills");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", skillName);
            await adminPage.typeInField("Description", "Backend and Frontend Testing");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(skillName);
        });

        await test.step('Edit Skill', async () => {
            await adminPage.editRecord(skillName);
            await adminPage.typeInField("Name", updatedSkillName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(skillName);
            await adminPage.verifyRecordVisible(updatedSkillName);
        });

        await test.step('Delete Skill', async () => {
            await adminPage.deleteRecord(updatedSkillName);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(updatedSkillName);
        });
    });

    test('TC03 - Verify validation error for empty Skill Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Qualifications", "Skills");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC04 - Verify error when creating a duplicate Skill @regression', async ({ adminPage }) => {
        const duplicateSkill = "Java Scripting";

        await test.step('Create Skill', async () => {
            await adminPage.navigateToSection("Qualifications", "Skills");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateSkill);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateSkill);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateSkill);
        });
    });

    test('TC05 - Verify Education Level Lifecycle: Create @regression', async ({ adminPage }) => {
        const eduLevel = "Master of Science";

        await test.step('Create Education Level', async () => {
            await adminPage.navigateToSection("Qualifications", "Education");
            await adminPage.clickAdd();
            await adminPage.typeInField("Level", eduLevel);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(eduLevel);
        });
    });

    test('TC06 - Verify Education Level Lifecycle: Create, Edit, Delete @regression', async ({ adminPage }) => {
        const eduLevel = "Master of artificial intelligence";
        const updatedEduLevel = "PhD in AI";

        await test.step('Create Education Level', async () => {
            await adminPage.navigateToSection("Qualifications", "Education");
            await adminPage.clickAdd();
            await adminPage.typeInField("Level", eduLevel);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(eduLevel);
        });

        await test.step('Edit Education Level', async () => {
            await adminPage.editRecord(eduLevel);
            await adminPage.typeInField("Level", updatedEduLevel);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(updatedEduLevel);
        });

        await test.step('Delete Education Level', async () => {
            await adminPage.deleteRecord(updatedEduLevel);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(updatedEduLevel);
        });
    });

    test('TC07 - Verify validation error for empty Education Level @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Qualifications", "Education");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Level", "Required");
        });
    });

    test('TC08 - Verify error when creating a duplicate Education Level @regression', async ({ adminPage }) => {
        const duplicateEdu = "Bachelor of Arts";

        await test.step('Create Education Level', async () => {
            await adminPage.navigateToSection("Qualifications", "Education");
            await adminPage.clickAdd();
            await adminPage.typeInField("Level", duplicateEdu);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Level", duplicateEdu);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Level", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateEdu);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC09 - Verify License Lifecycle: Create @regression', async ({ adminPage }) => {
        const licenseName = "ISTQB Foundation";

        await test.step('Create License', async () => {
            await adminPage.navigateToSection("Qualifications", "Licenses");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", licenseName);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(licenseName);
        });
    });

    test('TC10 - Verify License Lifecycle: Create, Edit, Delete @regression', async ({ adminPage }) => {
        const licenseName = "OWASP Foundation";
        const updatedLicense = "OWASP Advanced";

        await test.step('Create License', async () => {
            await adminPage.navigateToSection("Qualifications", "Licenses");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", licenseName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(licenseName);
        });

        await test.step('Edit License', async () => {
            await adminPage.editRecord(licenseName);
            await adminPage.typeInField("Name", updatedLicense);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(updatedLicense);
        });

        await test.step('Delete License', async () => {
            await adminPage.deleteRecord(updatedLicense);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC11 - Verify validation error for empty License Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Qualifications", "Licenses");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC12 - Verify error when creating a duplicate License @regression', async ({ adminPage }) => {
        const duplicateLicense = "Certified Scrum Master";

        await test.step('Create License', async () => {
            await adminPage.navigateToSection("Qualifications", "Licenses");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateLicense);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateLicense);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateLicense);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC13 - Verify Language Lifecycle: Create @regression', async ({ adminPage }) => {
        const langName = "German-Arabic";

        await test.step('Create Language', async () => {
            await adminPage.navigateToSection("Qualifications", "Languages");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", langName);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(langName);
        });
    });

    test('TC14 - Verify Language Lifecycle: Create, Edit, Delete @regression', async ({ adminPage }) => {
        const langName = "English-Arabic";
        const updatedLang = "Arabic (Bidi)";

        await test.step('Create Language', async () => {
            await adminPage.navigateToSection("Qualifications", "Languages");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", langName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(langName);
        });

        await test.step('Edit Language', async () => {
            await adminPage.editRecord(langName);
            await adminPage.typeInField("Name", updatedLang);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(updatedLang);
        });

        await test.step('Delete Language', async () => {
            await adminPage.deleteRecord(updatedLang);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(updatedLang);
        });
    });

    test('TC15 - Verify validation error for empty Language Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Qualifications", "Languages");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC16 - Verify error when creating a duplicate Language @regression', async ({ adminPage }) => {
        const duplicateLang = "Arabic-Bidi";

        await test.step('Create Language', async () => {
            await adminPage.navigateToSection("Qualifications", "Languages");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateLang);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateLang);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateLang);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC17 - Verify Membership Lifecycle: Create @regression', async ({ adminPage }) => {
        const membershipName = "IEEE Member";

        await test.step('Create Membership', async () => {
            await adminPage.navigateToSection("Qualifications", "Memberships");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", membershipName);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(membershipName);
        });
    });

    test('TC18 - Verify Membership Lifecycle: Create, Edit, Delete @regression', async ({ adminPage }) => {
        const membershipName = "IEEE Senior Member";
        const updatedMembership = "IEEE Associate Member";

        await test.step('Create Membership', async () => {
            await adminPage.navigateToSection("Qualifications", "Memberships");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", membershipName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(membershipName);
        });

        await test.step('Edit Membership', async () => {
            await adminPage.editRecord(membershipName);
            await adminPage.typeInField("Name", updatedMembership);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(updatedMembership);
        });

        await test.step('Delete Membership', async () => {
            await adminPage.deleteRecord(updatedMembership);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(updatedMembership);
        });
    });

    test('TC19 - Verify validation error for empty Membership Name @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Qualifications", "Memberships");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC20 - Verify error when creating a duplicate Membership @regression', async ({ adminPage }) => {
        const duplicateMember = "Rotary Club";

        await test.step('Create Membership', async () => {
            await adminPage.navigateToSection("Qualifications", "Memberships");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateMember);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateMember);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(duplicateMember);
            await adminPage.verifySuccessToast();
        });
    });

});
