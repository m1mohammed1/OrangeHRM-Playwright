import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from './CommonPage';


export class PIMPage extends CommonPage {

    readonly gridCard: Locator;
    readonly plusButtonSelector: Locator;
    readonly menuContainer: Locator;
    readonly tabSelector: Locator;
    readonly tableRow: Locator;
    readonly terminateButton: Locator;

    constructor(page: Page) {
        super(page);
        this.tableRow = page.locator('.oxd-form-row')
        this.menuContainer = page.locator('.orangehrm-tabs')
        this.tabSelector = page.locator('link')
        this.gridCard = page.locator('.oxd-grid-item')
        this.plusButtonSelector = page.locator("button[type='button']")
        this.terminateButton = page.locator("button:has-text('Terminate Employment')");
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
        return this;
    }

    async plusButton(value: string) {
        const targetButton = this.gridCard
            .filter({ has: this.page.getByText(value, { exact: true }) })
            .locator(this.plusButtonSelector)
            .first();
        await expect(targetButton).toBeVisible();
        await this.click(targetButton, 'Plus Button for' + value);
        return this;
    }

    async typeInNameField(groupLabel: string, fieldLabel: string, text: string) {
        const nameGroup = this.tableRow
            .filter({ has: this.page.getByText(groupLabel) })
            .first();
        const targetInput = nameGroup.getByPlaceholder(fieldLabel);
        await expect(targetInput).toBeVisible();
        await this.type(targetInput, text, groupLabel + ' -> ' + fieldLabel);
        return this;
    }

    async clickSidebarTab(tabName: string) {
        const sideMenu = this.menuContainer
            .locator(this.tabSelector)
            .filter({ hasText: tabName })
            .first();
        await expect(sideMenu).toBeVisible();
        await this.click(sideMenu, 'Sidebar Tab' + tabName);
        return this;
    }

    async clickTerminate() {
        await this.click(this.terminateButton.first(), 'Terminate Employment Button');
        return this;
    }
}
