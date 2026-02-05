import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Claim_EmployeeClaims_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Navigate to Claim Module', async () => {
            await dashboardPage.navigateToModule("Claim");
        });
    });

    test('TC01 - Verify Employee Claims Page Display @regression', async ({ claimPage }) => {
        await test.step('Display Employee Claims', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC02 - Verify Employee Claims Search by Employee @regression', async ({ claimPage }) => {
        const employeeName = "Script Automation Tester";

        await test.step('Search by Employee Name', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.typeInField("Employee Name", employeeName);
            await claimPage.selectFromList();
            await claimPage.clickSearch();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC03 - Verify Employee Claims Search by Reference ID @regression', async ({ claimPage }) => {
        await test.step('Search by Reference ID', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.typeInField("Reference Id", "CLM");
            await claimPage.clickSearch();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC04 - Verify Employee Claims Search by Event @regression', async ({ claimPage }) => {
        await test.step('Search by Event', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.selectDropdownOption("Event Name", "Global QA Summit 2025");
            await claimPage.clickSearch();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC05 - Verify Employee Claims Search by Status @regression', async ({ claimPage }) => {
        await test.step('Search by Status', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.selectDropdownOption("Status", "Submitted");
            await claimPage.clickSearch();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC06 - Verify Employee Claims Filter by Date Range @regression', async ({ claimPage }) => {
        const fromDate = "2024-01-01";
        const toDate = "2025-12-31";

        await test.step('Filter by Date Range', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.typeInField("From Date", fromDate);
            await claimPage.typeInField("To Date", toDate);
            await claimPage.clickSearch();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC07 - Verify Employee Claims Approve Action @regression', async ({ claimPage }) => {
        await test.step('Approve Claim', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.selectDropdownOption("Status", "Initiated");
            await claimPage.clickSearch();
            await claimPage.clickViewDetails();
            await claimPage.clickSubmit();
            await claimPage.verifySuccessToast();
        });
    });

    test('TC08 - Verify Employee Claims Reject Action @regression', async ({ claimPage }) => {
        await test.step('Reject Claim', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.selectDropdownOption("Status", "Submitted");
            await claimPage.clickSearch();
            await claimPage.clickViewDetails();
            await claimPage.clickCancelClaim();
            await claimPage.verifySuccessToast();
        });
    });

    test('TC09 - Verify Employee Claims View Details @regression', async ({ claimPage }) => {
        await test.step('View Claim Details', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.clickSearch();
            await claimPage.clickViewDetails();
            await claimPage.verifyElementVisible("Claim Details");
        });
    });

    test('TC10 - Verify Employee Claims Pay Action @regression', async ({ claimPage }) => {
        await test.step('Pay Claim', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.selectDropdownOption("Status", "Approved");
            await claimPage.clickSearch();
            await claimPage.clickViewClaim();
            await claimPage.clickPayClaim();
            await claimPage.verifySuccessToast();
        });
    });

    test('TC11 - Verify Employee Claims Cancel Action @regression', async ({ claimPage }) => {
        await test.step('Cancel Claim', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.selectDropdownOption("Status", "Submitted");
            await claimPage.clickSearch();
            await claimPage.clickViewClaim();
            await claimPage.clickCancelClaim();
            await claimPage.verifySuccessToast();
        });
    });

    test('TC12 - Verify Employee Claims Reset Filters @regression', async ({ claimPage }) => {
        await test.step('Reset Filters', async () => {
            await claimPage.navigateToSection("Employee Claims");
            await claimPage.selectDropdownOption("Status", "Submitted");
            await claimPage.typeInField("From Date", "2024-01-01");
            await claimPage.clickReset();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC13 - Verify My Claims View Details @regression', async ({ claimPage }) => {
        await test.step('View My Claim Details', async () => {
            await claimPage.navigateToSection("My Claims");
            await claimPage.clickSearch();
            await claimPage.clickViewClaim();
            await claimPage.verifyElementVisible("Claim Details");
        });
    });

    test('TC14 - Verify My Claims Filter by Event @regression', async ({ claimPage }) => {
        await test.step('Filter by Event', async () => {
            await claimPage.navigateToSection("My Claims");
            await claimPage.selectDropdownOption("Event Name", "Global QA Summit 2025");
            await claimPage.clickSearch();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC15 - Verify My Claims Filter by Status @regression', async ({ claimPage }) => {
        await test.step('Filter by Status', async () => {
            await claimPage.navigateToSection("My Claims");
            await claimPage.selectDropdownOption("Status", "Submitted");
            await claimPage.clickSearch();
            await claimPage.verifyFilterVisible();
        });
    });

    test('TC16 - Verify My Claims Reset Filters @regression', async ({ claimPage }) => {
        await test.step('Reset Filters', async () => {
            await claimPage.navigateToSection("My Claims");
            await claimPage.selectDropdownOption("Status", "Submitted");
            await claimPage.typeInField("From Date", "2024-01-01");
            await claimPage.clickReset();
            await claimPage.verifyFilterVisible();
        });
    });

});
