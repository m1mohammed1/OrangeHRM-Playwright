import { Page, Locator } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class DashboardPage extends CommonPage {

    readonly userDropdown: Locator;
    readonly timeClockBtn: Locator;
    readonly logoutLink: Locator;
    readonly aboutLink: Locator;
    readonly iconGear: Locator;
    readonly quickLaunchButtons: Locator; 
    readonly widgetContainers: Locator;   
    readonly todoItems: Locator;          
    readonly iconButtons: Locator;

    constructor(page: Page) {
        super(page);
        this.userDropdown = page.locator(".oxd-userdropdown-tab");
        this.timeClockBtn = page.locator(".oxd-icon-button.oxd-icon-button--solid-main");
        this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
        this.aboutLink = page.getByRole('menuitem', { name: 'About' });
        this.iconGear = page.locator("i.bi-gear-fill, i.bi-gear");
        this.quickLaunchButtons = page.locator("button.oxd-icon-button"); 
        this.widgetContainers = page.locator(".oxd-grid-item");
        this.iconButtons = page.locator("button"); 
        this.todoItems = page.locator(".orangehrm-todo-list").getByRole("button");
    }

    async clickGearIcon(): Promise<DashboardPage> {
        await this.click(this.iconGear, "Gear Icon");
        return this;
    }

    private getWidgetToggle(widgetName: string): Locator {
        return this.page.locator('.oxd-sheet, .oxd-dialog-container div, .oxd-grid-item')
            .filter({ hasText: widgetName })
            .locator(".oxd-switch-input")
            .first();
    }

    async clickQuickItem(itemName: string): Promise<DashboardPage> {
        const itemLocator = this.page.getByRole('button', { name: itemName, exact: true }).first();
        await this.click(itemLocator, `Quick Launch Item: ${itemName}`);
        return this;
    }

    async openUserMenu(): Promise<DashboardPage> {
        await this.click(this.userDropdown, "User Dropdown");
        return this;
    }

    async clickLogout(): Promise<DashboardPage> {
        await this.openUserMenu();
        await this.click(this.logoutLink, "Logout Link");
        return this;
    }

    async clickAbout(): Promise<DashboardPage> {
        await this.openUserMenu();
        await this.click(this.aboutLink, "About Link");
        return this;
    }

    async clickTimeClockButton(): Promise<DashboardPage> {
        await this.click(this.timeClockBtn, "Time Clock Button");
        return this;
    }

    async clickFirstPendingAction(): Promise<DashboardPage> {
        await this.click(this.todoItems.first(), "First Pending Action");
        return this;
    }

    async toggleWidgetVisibility(widgetName: string): Promise<DashboardPage> {
        const toggle = this.getWidgetToggle(widgetName);
        await this.click(toggle, `Toggle Widget: ${widgetName}`);
        return this;
    }

    async verifyDashboard(expectedHeader: string = "Dashboard"): Promise<DashboardPage> {
        await this.verifyHeader(expectedHeader);
        return this;
    }

    async verifyPageTitle(expectedTitle: string): Promise<DashboardPage> {
        await this.verifyTitle(expectedTitle);
        return this;
    }

    async verifySuccessMessage(): Promise<DashboardPage> {
        await this.verifySuccessToast();
        return this;
    }

    async verifyDialogContains(expectedText: string): Promise<DashboardPage> {
        await this.verifyDialogText(expectedText);
        return this;
    }
    
    async isWidgetVisible(widgetName: string): Promise<boolean> {
        return await this.isElementVisible(widgetName);
    }
}