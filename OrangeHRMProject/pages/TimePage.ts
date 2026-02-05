import { Page, Locator } from '@playwright/test';
import { CommonPage, ButtonType } from './CommonPage';

export class TimePage extends CommonPage {

    readonly punchInButton: Locator;
    readonly punchOutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.punchInButton = page.locator("button:has-text('In')");
        this.punchOutButton = page.locator("button:has-text('Out')");
    }

    async clickPunchIn() {
        await this.click(this.punchInButton.first(), 'Punch In Button');
        return this;
    }

    async clickPunchOut() {
        await this.click(this.punchOutButton.first(), 'Punch Out Button');
        return this;
    }
}