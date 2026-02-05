import { Page, Locator } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class PerformancePage extends CommonPage {

    readonly tableCellActions: Locator;
    readonly tableRow: Locator;
    readonly statusButton: Locator;

    constructor(page: Page) {
        super(page);
        this.tableCellActions = page.locator('.oxd-table-cell-actions button');
        this.tableRow = page.getByRole('row');
        this.statusButton = page.getByRole('button');
    }

    async closePopups() {
        await this.closePopup();
        return this;
    }

    async clickViewReview() {
        await this.tableCellActions.first().click();
        return this;
    }

    async submitFinalRating() {
        await this.typeInField('Final Rating', '100');
        await this.clickSubmit();
        return this;
    }

    async verifyRecordTable() {
        await this.verifySearchTable();
        return this;
    }

    async clickActionStatus(status: string) {
        if (status === 'Evaluate') {
            await this.tableCellActions.first().click();
        } else {
            await this.statusButton.filter({ hasText: status }).click();
        }
        return this;
    }

    async setRatingForKPI(kpiName: string, rating: string) {
        const row = this.tableRow.filter({ hasText: kpiName });
        await row.locator('input').first().fill(rating);
        return this;
    }
}
