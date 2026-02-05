import { Page, Locator } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class LoginPage extends CommonPage {

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly forgotPasswordLink: Locator;
    readonly invalidCredsMsg: Locator;
    readonly requiredMsg: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator("input[name='username']");
        this.passwordInput = page.locator("input[name='password']");
        this.loginBtn = page.locator("button[type='submit']");
        this.forgotPasswordLink = page.locator(".orangehrm-login-forgot-header");
        this.invalidCredsMsg = page.locator(".oxd-alert-content-text");
        this.requiredMsg = page.locator("span.oxd-input-group__message");
    }

    async enterUsername(username: string) {
        await this.type(this.usernameInput, username, "Username Field");
        return this;
    }

    async enterPassword(password: string) {
        await this.type(this.passwordInput, password, "Password Field");
        return this;
    }

    async clickLogin() {
        await this.click(this.loginBtn, "Login Button");
        return this;
    }

    async clickForgetPassword() {
        await this.click(this.forgotPasswordLink, "Forget Password Link");
        return this;
    }


    async login(user: string, pass: string) {
        await this.enterUsername(user);
        await this.enterPassword(pass);
        await this.clickLogin();
        return this;
    }


    async verifyInvalidCredentialsError() {
        await this.softAssertVisible(this.invalidCredsMsg, "Invalid Credentials Message");
        return this;
    }

    async verifyRequiredFieldError() {
        await this.softAssertVisible(this.requiredMsg.first(), "Required Field Message");
        return this;
    }
    async navigateTo(url: string) {
        await this.page.goto(url, { waitUntil: 'load' });
        return this;
    }

}