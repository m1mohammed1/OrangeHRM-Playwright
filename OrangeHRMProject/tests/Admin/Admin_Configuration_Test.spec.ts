import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Admin_Configuration_Test', () => {
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
    
    test('TC01 - Verify Email Subscription Lifecycle: Add, Verify @regression', async ({ adminPage }) => {
        const subscriberName = "Automation Subscriber";
        const subscriberEmail = "selenium@automated.com";

        await test.step('Navigate to Email Subscriptions', async () => {
            await adminPage.navigateToSection("Configuration", "Email Subscriptions");
        });

        await test.step('Add New Subscriber', async () => {
            await adminPage.clickSubscribe("Leave Applications");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", subscriberName);
            await adminPage.typeInField("Email", subscriberEmail);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(subscriberName);
        });
    });

    test('TC02 - Verify Email Subscription Lifecycle: Add, Verify, Edit, Delete @regression', async ({ adminPage }) => {
        const subscriberName = "Ai Subscriber";
        const subscriberEmail = "auto_script@test.com";
        const subscriberEmailSec = "automation_sub@script.com";

        await test.step('Create Subscriber', async () => {
            await adminPage.navigateToSection("Configuration", "Email Subscriptions");
            await adminPage.clickSubscribe("Leave Applications");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", subscriberName);
            await adminPage.typeInField("Email", subscriberEmail);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Edit Subscriber', async () => {
            await adminPage.verifyRecordVisible(subscriberName);
            await adminPage.editRecord(subscriberName);
            await adminPage.typeInField("Email", subscriberEmailSec);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Delete Subscriber', async () => {
            await adminPage.deleteRecord(subscriberName);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(subscriberName);
        });
    });

    test('TC03 - Verify Email Subscription Validation @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation Errors', async () => {
            await adminPage.navigateToSection("Configuration", "Email Subscriptions");
            await adminPage.clickSubscribe("Leave Applications");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error Messages', async () => {
            await adminPage.verifyFieldError("Name", "Required");
            await adminPage.verifyFieldError("Email", "Required");
        });
    });

    test('TC04 - Verify Email Configuration: Update SMTP Settings and Validation @regression', async ({ adminPage }) => {
        await test.step('Navigate to Email Configuration', async () => {
            await adminPage.navigateToSection("Configuration", "Email Configuration");
        });

        await test.step('Validate Mail Sent As Format', async () => {
            await adminPage.typeInField("Mail Sent As", "Admin");
            await adminPage.clickSave();
            await adminPage.verifyFieldError("Mail Sent As", "Expected format: admin@example.com");
        });

        await test.step('Update SMTP Settings', async () => {
            await adminPage.typeInField("Mail Sent As", "admin@test.com");
            await adminPage.clickRadio("SECURE SMTP");
            await adminPage.typeInField("SMTP Host", "smtp.gmail.com");
            await adminPage.typeInField("SMTP Port", "587");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });
    });

    test('TC05 - Verify Localization Settings: Update Default Language and Format @regression', async ({ adminPage }) => {
        await test.step('Navigate to Localization', async () => {
            await adminPage.navigateToSection("Configuration", "Localization");
        });

        await test.step('Update Language and Date Format', async () => {
            await adminPage.selectDropdownOption("Language", "English (United States)");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });
    });

    test('TC06 - Verify Language Packages Lifecycle: Add, Verify, Delete @regression', async ({ adminPage }) => {
        const langName = "English (United Kingdom)";

        await test.step('Add Language Package', async () => {
            await adminPage.navigateToSection("Configuration", "Language Packages");
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("Name", langName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Delete Language Package', async () => {
            await adminPage.deleteRecord(langName);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(langName);
        });
    });
    
    test('TC07 - Verify Social Media Authentication Lifecycle : Create, Verify, Delete @regression', async ({ adminPage }) => {
        const providerName = "Test Provider";

        await test.step('Create Provider', async () => {
            await adminPage.navigateToSection("Configuration", "Social Media Authentication");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", providerName);
            await adminPage.typeInField("Provider URL", "https://api.sandbox-auth.com/v1/oauth2/token");
            await adminPage.typeInField("Client ID", "qa-tester-9921-XyZ");
            await adminPage.typeInField("Client Secret", "sec_7f92kLp93mQn01vR_TEST_ONLY");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Delete Provider', async () => {
            await adminPage.deleteRecord(providerName);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC08 - Verify Modules Page Load and Save @regression', async ({ adminPage }) => {
        await test.step('Save Modules Configuration', async () => {
            await adminPage.navigateToSection("Configuration", "Modules");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });
    });

    test('TC09 - Verify Social Media Authentication: Add Provider Validation @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Configuration", "Social Media Authentication");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", "Test Provider");
            await adminPage.clickSave();
        });

        await test.step('Verify Errors', async () => {
            await adminPage.verifyFieldError("Provider URL", "Required");
            await adminPage.verifyFieldError("Client ID", "Required");
        });
    });

    test('TC10 - Verify OAuth Client Lifecycle: Create, Verify, Delete @regression', async ({ adminPage }) => {
        const clientId = "Test_OAuth_Client";
        const redirectUri = "https://www.google.com";

        await test.step('Create OAuth Client', async () => {
            await adminPage.navigateToSection("Configuration", "Register OAuth Client");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", clientId);
            await adminPage.typeInField("Redirect URI", redirectUri);
            await adminPage.toggleSwitch("Confidential Client"); 
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Verify and Delete', async () => {
            await adminPage.navigateToSection("Configuration", "Register OAuth Client");
            await adminPage.verifyRecordVisible(clientId);
           await adminPage.deleteRecord(clientId);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC11 - Verify OAuth Client Validation Errors @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation', async () => {
            await adminPage.navigateToSection("Configuration", "Register OAuth Client");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Errors', async () => {
            await adminPage.verifyFieldError("Name", "Required");
            await adminPage.verifyFieldError("Redirect URI", "Required");
        });
    });

    test('TC12 - Verify LDAP Configuration Form Validation @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation with Empty Spaces', async () => {
            await adminPage.navigateToSection("Configuration", "LDAP Configuration");
            await adminPage.typeInField("Host", " ");
            await adminPage.typeInField("Port", " ");
            await adminPage.typeInField("Distinguished Name", " ");
            await adminPage.typeInField("Base Distinguished Name", " ");
            await adminPage.clickSave();
        });

        await test.step('Verify Errors', async () => {
            await adminPage.verifyFieldError("Host", "Required");
            await adminPage.verifyFieldError("Port", "Required");
            await adminPage.verifyFieldError("Distinguished Name", "Required");
            await adminPage.verifyFieldError("Base Distinguished Name", "Required");
        });
    });

    test('TC13 - Verify LDAP Configuration Save @regression', async ({ adminPage }) => {
        await test.step('Fill LDAP Form', async () => {
            await adminPage.navigateToSection("Configuration", "LDAP Configuration");
            await adminPage.typeInField("Host", "ldap.test.com");
            await adminPage.typeInField("Port", "777");
            await adminPage.selectDropdownOption("Encryption", "SSL");
            await adminPage.selectDropdownOption("LDAP Implementation", "Open LDAP v3");
            await adminPage.typeInField("Distinguished Name", "adminorangehrm.com");
            await adminPage.typeInField("Password", "SecretPass123");
            await adminPage.typeInField("Base Distinguished Name", "Admin");
        });

        await test.step('Save and Verify', async () => {
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });
    });

});