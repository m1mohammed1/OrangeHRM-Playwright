import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class DirectoryPage extends CommonPage {

    readonly employeeCard: Locator;
    readonly employeePopup: Locator;

    constructor(page: Page) {
        super(page);
        this.employeeCard = page.locator('.orangehrm-directory-card');
        this.employeePopup = page.locator('.oxd-dialog-sheet');
    }

    async clickEmployeeCard(employeeName: string) {
        const card = this.employeeCard.filter({ hasText: employeeName }).first();
        await this.click(card, `Employee Card: ${employeeName}`);
        return this;
    }

    async verifyEmployeeDetailsPopup() {
        await expect(this.employeePopup, "Verify Employee Details Popup").toBeVisible();
        return this;
    }
}
