import { Page, expect, Locator } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class MaintenancePage extends CommonPage {

    readonly errorAlert: Locator;
    readonly purgeButton: Locator;
    readonly yesPurgeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.errorAlert = page.locator('.oxd-alert-content-text');
        this.purgeButton = page.locator("button:has-text('Purge')");
        this.yesPurgeButton = page.locator("button:has-text('Yes, Purge')");
    }

    async verifyAccessPassword(password: string) {
        await this.typeInField('Password', password);
        await this.clickConfirm();
        return this;
    }

    async verifyError() {
        await expect(this.errorAlert, "Verify Invalid Credentials Error").toBeVisible();
        await expect(this.errorAlert).toContainText('Invalid credentials');
        return this;
    }

    async clickPurge() {
        await this.click(this.purgeButton.first(), 'Purge Button');
        return this;
    }

    async clickYesPurge() {
        await this.click(this.yesPurgeButton.first(), 'Yes, Purge Button');
        return this;
    }
}
