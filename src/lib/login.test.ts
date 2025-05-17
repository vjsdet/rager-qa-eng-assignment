import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;
const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }
    /** STEP: Navigate to URL */
    await page.goto('/');
    /** STEP: Click on the English Wikipedia link */
    await page.click('a#js-link-box-en');

    /** STEP: Click on the login link */
    await page.click('a[href*="w/index.php?title=Special:UserLogin"]');

    /** STEP: Fill in the username and password */
    await expect(page.locator('input[name="wpName"]')).toBeVisible();
    await page.fill('input[name="wpName"]', wikipediaUsername);
    await page.fill('input[name="wpPassword"]', wikipediaPassword);

    /** STEP: Click the login button */
    await page.click('button[name="wploginattempt"]');

    /** STEP: Ensure login is successful */
    await expect(page.locator('#vector-user-links-dropdown-checkbox')).toBeVisible();
    await expect(page.locator('input[name="wpName"]')).toBeHidden();
    await expect(page.locator('#pt-userpage-2')).toHaveText(wikipediaUsername);

    /** STEP: Store login session */
    await page.context().storageState({ path: authFile });
});
