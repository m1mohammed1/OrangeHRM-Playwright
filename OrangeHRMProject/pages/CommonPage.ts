import { Page, expect, test, Locator } from '@playwright/test';
import { BasePage } from 'base/BasePage';

export enum ButtonType {
    SUBMIT = 'SUBMIT',
    SEARCH = 'SEARCH',
    RESET = 'RESET',
    SAVE = 'SAVE',
    CANCEL = 'CANCEL',
    CONFIRM = 'CONFIRM',
    DELETE = 'DELETE',
    EDIT = 'EDIT',
    VIEW = 'VIEW',
    ADD = 'ADD',
    GENERATE = 'GENERATE',
    APPROVE = 'APPROVE',
    ASSIGN = 'ASSIGN',
    REJECT = 'REJECT',
    ACTIVATE = 'ACTIVATE',
    CONFIRM_DELETE = 'CONFIRM DELETE',
    DOWNLOAD = 'DOWNLOAD',
    OK = 'OK',
    DELETE_SELECTED = 'DELETE SELECTED',
    ADD_COMMENT = 'ADD COMMENT',
    NO_CANCEL = 'No, Cancel',
    CREATE = 'CREATE',
}

const BUTTON_SELECTOR: Record<ButtonType, string> = {
    [ButtonType.SUBMIT]: "button:has-text('Submit')",
    [ButtonType.SEARCH]: "button:has-text('Search')",
    [ButtonType.RESET]: "button:has-text('Reset')",
    [ButtonType.SAVE]: "button:has-text('Save')",
    [ButtonType.CANCEL]: "button:has-text('Cancel')",
    [ButtonType.CONFIRM]: "button:has-text('Confirm')",
    [ButtonType.DELETE]: "button:has-text('Delete')",
    [ButtonType.EDIT]: "button:has-text('Edit')",
    [ButtonType.VIEW]: "button:has-text('View')",
    [ButtonType.ADD]: "button:has-text('Add')",
    [ButtonType.GENERATE]: "button:has-text('Generate')",
    [ButtonType.APPROVE]: "button:has-text('Approve')",
    [ButtonType.ASSIGN]: "button:has-text('Assign')",
    [ButtonType.REJECT]: "button:has-text('Reject')",
    [ButtonType.ACTIVATE]: "button:has-text('Activate')",
    [ButtonType.CONFIRM_DELETE]: "button:has-text('Yes, Delete')",
    [ButtonType.DOWNLOAD]: "button:has-text('Download')",
    [ButtonType.OK]: "button:has-text('Ok')",
    [ButtonType.DELETE_SELECTED]: "button:has-text('Delete Selected')",
    [ButtonType.ADD_COMMENT]: "button:has-text('Add Comment')",
    [ButtonType.NO_CANCEL]: "button:has-text('No, Cancel')",
    [ButtonType.CREATE]: "button:has-text('Create')",
};

export class CommonPage extends BasePage {

    readonly dropdownclickable: Locator;
    readonly inputFieldContainer: Locator;
    readonly closePopupButton: Locator;
    readonly listboxOptions: Locator;
    readonly tableRow: Locator;
    readonly treeNodeContent: Locator;
    readonly deleteIconButton: Locator;
    readonly editIconButton: Locator;
    readonly viewIconButton: Locator;
    readonly switchInputGroup: Locator;
    readonly checkboxCell: Locator;
    readonly checkboxHeader: Locator;
    readonly sidebarLink: Locator;
    readonly topMenuItem: Locator;
    readonly subMenuItem: Locator;
    readonly optionItem: Locator;
    readonly addSectionContainer: Locator;
    readonly genericHeaderElement: Locator;
    readonly switchInput: Locator;
    readonly pageHeaderLocator: Locator;
    readonly searchFilterLocator: Locator;
    readonly tableSearchLocator: Locator;
    readonly successToastLocator: Locator;
    readonly infoToastLocator: Locator;
    readonly errorToastLocator: Locator;
    readonly dialogSheetLocator: Locator;
    readonly dialogCloseLocator: Locator;
    readonly bodyTagLocator: Locator;
    readonly fieldErrorMessage: Locator;
    readonly inputSelector: Locator;

    constructor(page: Page) {
        super(page);
        this.dropdownclickable = page.locator('.oxd-select-text');
        this.inputFieldContainer = page.locator('.oxd-input-group');
        this.closePopupButton = page.locator('.oxd-date-input-link.--close');
        this.listboxOptions = page.locator("//div[@role='listbox']//span");
        this.tableRow = page.getByRole('row');
        this.treeNodeContent = page.locator('.oxd-tree-node-content');
        this.deleteIconButton = page.locator("button i[class*='bi-trash']");
        this.editIconButton = page.locator("button i[class*='bi-pencil']");
        this.viewIconButton = page.locator("button i[class*='bi-eye']");
        this.switchInputGroup = page.locator('.oxd-input-group, .oxd-grid-item, .oxd-layout');
        this.checkboxCell = page.locator('.oxd-table-card-cell-checkbox');
        this.checkboxHeader = page.locator('.oxd-table-header-cell-checkbox');
        this.sidebarLink = page.getByRole('link');
        this.topMenuItem = page.getByRole('listitem');
        this.subMenuItem = page.getByRole('menuitem');
        this.optionItem = page.getByRole('option');
        this.addSectionContainer = page.locator('.orangehrm-horizontal-padding, .oxd-grid-item, .orangehrm-card-container');
        this.genericHeaderElement = page.locator('h6, h5, p');
        this.switchInput = page.locator('.oxd-switch-input');
        this.pageHeaderLocator = page.locator(".oxd-topbar-header-title h6");
        this.searchFilterLocator = page.locator(".oxd-table-filter");
        this.tableSearchLocator = page.locator("div.orangehrm-container, div.orangehrm-paper-container, div.orangehrm-card-container");
        this.successToastLocator = page.locator(".oxd-toast--success");
        this.infoToastLocator = page.locator(".oxd-toast--info");
        this.errorToastLocator = page.locator(".oxd-toast--error");
        this.dialogSheetLocator = page.locator(".oxd-dialog-sheet");
        this.dialogCloseLocator = page.locator(".oxd-dialog-close-button");
        this.bodyTagLocator = page.locator("body");
        this.fieldErrorMessage = page.locator('.oxd-input-group__message');
        this.inputSelector = page.locator('input, textarea');
    }

    async navigateToModule(moduleName: string) {
        const moduleLink = this.sidebarLink
            .filter({ hasText: moduleName })
            .first();
        await expect(moduleLink).toBeVisible();
        await this.click(moduleLink, 'Side Menu Module: ' + moduleName);
    }

    async navigateToSection(mainCategory: string, subCategory?: string) {
        const mainItem = this.topMenuItem
            .filter({ hasText: mainCategory })
            .first();
        await expect(mainItem).toBeVisible();
        await this.click(mainItem, 'Top Menu: ' + mainCategory);
        if (subCategory) {
            const subItem = this.subMenuItem
                .filter({ hasText: subCategory })
                .first();
            await expect(subItem).toBeVisible();
            await this.click(subItem, 'Sub Menu: ' + subCategory);
        }
        return this;
    }

    async closePopup() {
        await expect(this.closePopupButton).toBeVisible();
        await this.click(this.closePopupButton, 'Close Popup Button');
        return this;
    }

    async typeInField(fieldName: string, text: string) {
        const targetInput = this.inputFieldContainer
            .filter({ has: this.page.getByText(fieldName, { exact: true }) })
            .locator('input, textarea')
            .first();
        await expect(targetInput).toBeVisible();
        await this.type(targetInput, text, fieldName);
        return this;
    }

    async selectDropdownOption(labelName: string, visibleText: string) {
        const dropdownTrigger = this.inputFieldContainer
            .filter({ has: this.page.getByText(labelName, { exact: true }) })
            .locator(this.dropdownclickable)
            .first();
        await expect(dropdownTrigger).toBeVisible();
        await this.click(dropdownTrigger, 'Open Dropdown: ' + labelName);
        const optionItem = this.optionItem
            .filter({ hasText: visibleText })
            .first();
        await expect(optionItem).toBeVisible();
        await this.click(optionItem, 'Select Option: ' + visibleText);
        return this;
    }

    async selectFromList() {
        const firstOption = this.listboxOptions.first();
        await expect(firstOption).toBeVisible();
        await this.click(firstOption, 'Select First Option from List');
        return this;
    }

    async clickStandardButton(buttonType: ButtonType, index: number = 0) {
        const selector = BUTTON_SELECTOR[buttonType];
        const locator = this.page.locator(selector).nth(index);
        await this.click(locator, `${buttonType} Button (Index: ${index})`);
        return this;
    }

    async clickAdd(sectionName?: string, index: number = 0) {
        if (sectionName) {
            const section = this.addSectionContainer
                .filter({ has: this.genericHeaderElement.filter({ hasText: sectionName }) })
                .first();
            const selector = BUTTON_SELECTOR[ButtonType.ADD];
            await this.click(section.locator(selector).nth(index), `Add Button in ${sectionName} (Index: ${index})`);
            return this;
        }
        return await this.clickStandardButton(ButtonType.ADD, index);
    }

    async clickSave(index: number = 0) {
        return await this.clickStandardButton(ButtonType.SAVE, index);
    }

    async clickReset() {
        return await this.clickStandardButton(ButtonType.RESET);
    }

    async clickCancel() {
        return await this.clickStandardButton(ButtonType.CANCEL);
    }

    async clickConfirm() {
        return await this.clickStandardButton(ButtonType.CONFIRM);
    }

    async clickSubmit() {
        return await this.clickStandardButton(ButtonType.SUBMIT);
    }

    async clickApprove() {
        return await this.clickStandardButton(ButtonType.APPROVE);
    }

    async clickAssign() {
        return await this.clickStandardButton(ButtonType.ASSIGN);
    }

    async clickGenerate() {
        return await this.clickStandardButton(ButtonType.GENERATE);
    }

    async clickReject() {
        return await this.clickStandardButton(ButtonType.REJECT);
    }

    async clickActivate() {
        return await this.clickStandardButton(ButtonType.ACTIVATE);
    }

    async clickSearch() {
        return await this.clickStandardButton(ButtonType.SEARCH);
    }

    async clickView() {
        return await this.clickStandardButton(ButtonType.VIEW);
    }

    async clickCreate() {
        return await this.clickStandardButton(ButtonType.CREATE);
    }

    async confirmDeletion() {
        return await this.clickStandardButton(ButtonType.CONFIRM_DELETE);
    }

    async clickDownload() {
        return await this.clickStandardButton(ButtonType.DOWNLOAD);
    }

    async clickOk() {
        return await this.clickStandardButton(ButtonType.OK);
    }

    async clickAddComment() {
        return await this.clickStandardButton(ButtonType.ADD_COMMENT);
    }

    async clickNoCancel() {
        return await this.clickStandardButton(ButtonType.NO_CANCEL);
    }


    async deleteRecord(recordName: string) {
        const row = this.tableRow
            .filter({ hasText: recordName })
            .first();
        await expect(row).toBeVisible();
        const deleteBtn = this.deleteIconButton.filter({ has: row }).first();
        const targetDeleteBtn = row.locator(this.deleteIconButton).first(); 
        await expect(targetDeleteBtn).toBeVisible();
        await this.click(targetDeleteBtn, 'Delete Button for: ' + recordName);
        await this.confirmDeletion();
        return this;
    }

    async deleteIfExists(recordName: string) {
        return await test.step(`Delete Record if Exists: ${recordName}`, async () => {
            const row = this.tableRow.filter({ hasText: recordName }).first();
            if (await row.isVisible()) {
                const deleteBtn = row.locator(this.deleteIconButton).first();
                await expect(deleteBtn).toBeVisible();
                await this.click(deleteBtn, `Delete Button for: ${recordName}`);
                await this.confirmDeletion();
                await this.verifySuccessToast();
            } else {
                console.log(`INFO: Record '${recordName}' not found. Skipping deletion.`);
            }
            return this;
        });
    }

    async editRecord(recordName: string) {
        const row = this.tableRow
            .filter({ hasText: recordName })
            .first();
        await expect(row).toBeVisible();
        const editBtn = row.locator(this.editIconButton).first();
        await expect(editBtn).toBeVisible();
        await this.click(editBtn, 'Edit Button for: ' + recordName);
        return this;
    }

    async viewRecord(recordName: string) {
        const row = this.tableRow
            .filter({ hasText: recordName })
            .first();
        await expect(row).toBeVisible();
        const viewBtn = row.locator(this.viewIconButton).first();
        await expect(viewBtn).toBeVisible();
        await this.click(viewBtn, 'View Button for: ' + recordName);
        return this;
    }

    async toggleSwitch(labelName: string) {
        const switchGroup = this.switchInputGroup
            .filter({ has: this.page.getByText(labelName, { exact: true }) })
            .first();
        await expect(switchGroup).toBeVisible();
        const switchNode = switchGroup.locator(this.switchInput).first();
        await expect(switchNode).toBeVisible();
        await switchNode.click({ force: true });
        return this;
    }

    async dismissDialog() {
        const dialogCloseButton = this.dialogCloseLocator.first();
        await expect(dialogCloseButton).toBeVisible();
        await this.click(dialogCloseButton, 'Close Dialog Button');
        return this;
    }

    async verifyHeader(expectedHeader: string) {
        await expect(this.pageHeaderLocator.first(), 'Verify Page Header').toContainText(expectedHeader);
        return this;
    }

    async verifySearchTable() {
        await expect(
            this.tableSearchLocator.first(),
            'Verify Table Search Area'
        ).toBeVisible();
        return this;
    }

    async verifyTitle(expectedTitle: string) {
        const titleLocator = this.genericHeaderElement
            .filter({ hasText: expectedTitle })
            .first();
        await expect(titleLocator, 'Verify Page Title').toContainText(expectedTitle);
        return this;
    }

    async verifySection(elementText: string) {
        const sectionLocator = this.genericHeaderElement
            .filter({ hasText: elementText })
            .first();
        await expect(sectionLocator, `Verify Section: ${elementText}`).toBeVisible();
        return this;
    }

    async verifySuccessToast() {
        return await test.step('Verify Success Notification', async () => {
            const successToast = this.successToastLocator.first();
            await expect(successToast, 'Success Toast should be visible').toBeVisible({ timeout: 10000 });
            return this;
        });
    }

    async verifyInfoToast() {
        const infoToast = this.infoToastLocator.first();
        await this.softAssertVisible(infoToast, 'Verify Info Toast');
        return this;
    }

    async verifyErrorToast() {
        const errorToast = this.errorToastLocator.first();
        await this.softAssertVisible(errorToast, 'Verify Error Toast');
        return this;
    }

    async verifyRecordVisible(recordName: string) {
        const row = this.tableRow
            .filter({ hasText: recordName })
            .first();
        await expect(row, `Verify Record Visible: ${recordName}`).toBeVisible();
        return this;
    }

    async verifyRecordNotVisible(recordName: string) {
        const row = this.tableRow
            .filter({ hasText: recordName })
            .first();
        await expect(row, `Verify Record Deleted: ${recordName}`).toBeHidden();
        return this;
    }

    async verifyFieldError(fieldName: string, errorMessage: string) {
        const inputGroup = this.inputFieldContainer
            .filter({ has: this.page.getByText(fieldName, { exact: true }) })
            .first();
        await expect(inputGroup).toBeVisible();
        const errorMessageLocator = inputGroup.locator(this.fieldErrorMessage).first();
        await expect(errorMessageLocator, `Verify Field Error for: ${fieldName}`).toHaveText(errorMessage);
        return this;
    }


    async verifyFilterVisible() {
        const searchFilter = this.searchFilterLocator.first();
        await expect(searchFilter, 'Verify Search Filter is Visible').toBeVisible();
        return this;
    }

    async verifyDialogText(expectedText: string) {
        const dialogSheet = this.dialogSheetLocator.first();
        await expect(dialogSheet, `Verify Dialog Contains: ${expectedText}`).toContainText(expectedText);
        return this;
    }

    async verifyDialogNotVisible() {
        const dialogSheet = this.dialogSheetLocator.first();
        await expect(dialogSheet, 'Verify Dialog Not Visible').toBeHidden();
        return this;
    }

    async verifyBodyContains(expectedText: string) {
        const bodyTag = this.bodyTagLocator.first();
        await expect(bodyTag, `Verify Body Contains: ${expectedText}`).toContainText(expectedText);
        return this;
    }

    async clickFirstCheckbox() {
        const firstCheckbox = this.checkboxCell.first();
        await expect(firstCheckbox).toBeVisible();
        await this.click(firstCheckbox, 'First Checkbox in Table');
        return this;
    }

    async clickSelectAllCheckbox() {
        const selectAllCheckbox = this.checkboxHeader.first();
        await expect(selectAllCheckbox).toBeVisible();
        await this.click(selectAllCheckbox, 'Select All Checkbox');
        return this;
    }

    async verifyElementVisible(elementText: string) {
        const element = this.page.getByText(elementText).first();
        await expect(element, `Verify Element Visible: ${elementText}`).toBeVisible();
        return this;
    }

    async verifyElementNotVisible(elementText: string) {
        const element = this.page.getByText(elementText).first();
        await expect(element, `Verify Element Not Visible: ${elementText}`).toBeHidden();
        return this;
    }

    async isElementVisible(elementText: string): Promise<boolean> {
        const element = this.page.getByText(elementText).first();
        return await element.isVisible();
    }
}