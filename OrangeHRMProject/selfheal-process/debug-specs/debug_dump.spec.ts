
import { test } from '@playwright/test';
import { TestConfig } from '@utils/TestConfig';

test('dump row html', async ({ page }) => {
    await page.goto(TestConfig.BASE_URL);
    await page.fill('input[name="username"]', TestConfig.USERNAME);
    await page.fill('input[name="password"]', TestConfig.PASSWORD);
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard/index');
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewEmailNotification');
    
    await page.waitForSelector('.oxd-table');
    const row = page.locator('.oxd-table-row').filter({ hasText: 'Leave Applications' });
    const subscribeBtn = row.locator('button i[class*="bi-person"]').first();
    await subscribeBtn.click();
    
    await page.waitForTimeout(2000); // Wait for transition
    const body = await page.innerHTML('body');
    console.log('DEBUG_PAGE_AFTER_CLICK:', body.includes('Add') ? 'ADD_BUTTON_FOUND' : 'ADD_BUTTON_NOT_FOUND');
    const buttons = await page.locator('button').allInnerTexts();
    console.log('DEBUG_BUTTONS:', buttons);
});
