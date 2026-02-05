import { Page, Locator, test, expect } from '@playwright/test';

// This is a test comment to verify file writes
export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private async safeStep(name: string, cb: () => Promise<any>) {
        return await cb();
    }

    async navigateTo(url: string) {
        await this.safeStep(`Navigate to ${url}`, async () => {
            await this.page.goto(url);
            await this.page.waitForLoadState('networkidle');
        });
        return this;
    }

    protected async click(locator: Locator, description: string): Promise<void> {
        await this.safeStep(`Click on ${description}`, async () => {
            await locator.click();
        });
    }

    protected async type(locator: Locator, text: string, description: string): Promise<void> {
        console.log(`TYPE ACTION: ${description}`);
        await this.safeStep(`Type "${text}" into ${description}`, async () => {
            await locator.click();
            await locator.press('Control+a');
            await locator.press('Backspace');
            await locator.fill(text);
        });
    }

    protected async softAssertVisible(locator: Locator, description: string): Promise<void> {
        await this.safeStep(`Soft Assert: Verify ${description} is visible`, async () => {
             await expect.soft(locator, description).toBeVisible();
        });
    }

    async hardWait(seconds: number): Promise<void> {
        await this.page.waitForTimeout(seconds * 1000);
    }
}