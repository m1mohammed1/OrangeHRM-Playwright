import { Page, Locator } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class ClaimPage extends CommonPage {

    readonly expenseSection: Locator;
    readonly expensesHeading: Locator;
    readonly addButton: Locator;
    readonly viewDetailsButton: Locator;
    readonly eyeIcon: Locator;
    readonly payButton: Locator;
    readonly rejectButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page);
        this.expenseSection = page.locator('.orangehrm-horizontal-padding');
        this.expensesHeading = page.getByRole('heading', { name: 'Expenses', exact: true });
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.viewDetailsButton = page.getByRole('button', { name: 'View Details' });
        this.eyeIcon = page.locator("button i[class*='bi-eye']");
        this.payButton = page.getByRole('button', { name: 'Pay' });
        this.rejectButton = page.getByRole('button', { name: 'Reject' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
        return this;
    }

    async clickAddExpense() {
        const expenseHeader = this.expenseSection.filter({ has: this.expensesHeading });
        await expenseHeader.locator(this.addButton).click();
        return this;
    }

    async clickViewDetails() {
        await this.viewDetailsButton.first().click();
        return this;
    }

    async clickViewClaim() {
        await this.eyeIcon.or(this.viewDetailsButton).first().click();
        return this;
    }

    async clickPayClaim() {
        await this.payButton.click();
        return this;
    }

    async clickCancelClaim() {
        await this.rejectButton.or(this.cancelButton).first().click();
        return this;
    }

}
