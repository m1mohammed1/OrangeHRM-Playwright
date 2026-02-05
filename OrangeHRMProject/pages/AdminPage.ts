import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class AdminPage extends CommonPage {


    readonly radioContainer: Locator;
    readonly radioInputSelector: Locator;
    readonly tableRows: Locator;
    readonly subscribeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.radioContainer = page.locator('label');
        this.radioInputSelector = page.locator('span.oxd-radio-input')
        this.tableRows = page.getByRole('row');
        this.subscribeButton = page.locator('button:has(i[class*="bi-person"])');
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
        return this;
    }

    async clickRadio(value: string) {
        const radioGroup = this.radioContainer
            .filter({ hasText: value })
            .locator(this.radioInputSelector)
            .first();
        await this.click(radioGroup, 'RadioOption' + value);
        return this;
    }

    async clickSubscribe(value: string) {
        const subscribeButton = this.tableRows
            .filter({ has: this.page.getByText(value, { exact: true }) })
            .locator(this.subscribeButton)
            .first();
        await expect(subscribeButton).toBeVisible()
        await this.click(subscribeButton, 'Subscribe Action for' + value)
        return this;
    }

}