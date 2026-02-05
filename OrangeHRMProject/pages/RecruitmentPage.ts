import { Page, Locator } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class RecruitmentPage extends CommonPage {

    readonly formRow: Locator;
    readonly switchInput: Locator;

    constructor(page: Page) {
        super(page);
        this.formRow = page.locator('.oxd-form-row');
        this.switchInput = page.locator('.oxd-switch-input');
    }

    async typeInNameField(groupLabel: string, fieldLabel: string, text: string) {
        const nameGroup = this.formRow.filter({ hasText: groupLabel });
        const inputField = nameGroup.locator('input')
            .filter({ hasText: fieldLabel })
            .or(nameGroup.locator(`input[placeholder*="${fieldLabel}"]`));
        await this.type(inputField.first(), text, `${groupLabel} - ${fieldLabel}`);
        return this;
    }

    async clickEyeStatus(candidateName: string) {
        await this.viewRecord(candidateName);
        return this;
    }

    async clickToButton(buttonName: string) {
        await this.page.getByRole('button', { name: buttonName }).click();
        return this;
    }

    async clickEditSwitch() {
        await this.switchInput.first().click();
        return this;
    }

    async toggleEditMode() {
        await this.clickEditSwitch();
        return this;
    }
}
