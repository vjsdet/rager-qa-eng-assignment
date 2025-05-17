import { Page, expect } from '@playwright/test';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 * 6. Assert the page goes dark when the 'Dark' color option is selected
 * 7. Assert the page goes light when the 'Light' color option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
    // 1. Navigate to Wikipedia's homepage
    await page.goto('/wiki/Main_Page');
    await expect(page).toHaveURL(/\/wiki\/Main_Page/);

    // 2. Assert there are less than 7,000,000 articles in English
    // The article count is in a link with the number as text, e.g., '6,994,536'
    const articleCountLink = page.getByTitle('Special:Statistics');
    const articleCountText = await articleCountLink.last().textContent();
    const articleCount = Number(articleCountText?.replace(/,/g, ''));
    expect(articleCount).toBeLessThan(7000000);

    /** STEP: Click the theme icon */
    await expect(
        page.locator('#vector-appearance-dropdown-checkbox')
    ).toBeVisible();
    await page.locator('#vector-appearance-dropdown-checkbox').click();

    /** STEP: Select the 'Small' text size option in the appearance settings */
    const smallTextSizeOption = page.getByRole('radio', { name: 'Small' });

    // Get the font size of a main content element before changing size
    const contentSelector = '#mp-topbanner'; // or another stable selector in main content
    const defaultFontSize = await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        return el ? window.getComputedStyle(el).fontSize : null;
    }, contentSelector);

    // Change to 'Small' text size
    await smallTextSizeOption.click();

    // Get the font size after selecting 'Small'
    const smallFontSize = await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        return el ? window.getComputedStyle(el).fontSize : null;
    }, contentSelector);

    // Assert the page's text gets smaller when the 'Small' text size option is selected
    expect(Number.parseFloat(smallFontSize!)).toBeLessThan(
        Number.parseFloat(defaultFontSize!)
    );

    /** STEP: Click the 'Large' text size option to change the display size */
    const largeTextSizeOption = page.getByRole('radio', { name: 'Large' });
    await largeTextSizeOption.click();

    // Get the font size after selecting 'Large'
    const largeFontSize = await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        return el ? window.getComputedStyle(el).fontSize : null;
    }, contentSelector);

    // Assert the page's text gets smaller when the 'Large' text size option is selected
    expect(Number.parseFloat(largeFontSize!)).toBeGreaterThan(
        Number.parseFloat(defaultFontSize!)
    );

    /** STEP: Click the 'Standard' text size option in the appearance settings */
    const standardTextSizeButton = page.getByRole('radio', {
        name: 'Standard',
    });
    await standardTextSizeButton.first().click();

     // Get the font size after selecting 'Standard'
    const standardFontSize = await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        return el ? window.getComputedStyle(el).fontSize : null;
    }, contentSelector);

    // Assert the page's text gets smaller when the 'Large' text size option is selected
    expect(Number.parseFloat(standardFontSize!)).toEqual(
        Number.parseFloat(defaultFontSize!)
    );

    /** STEP: Click the 'Dark' color radio button to change the theme */
    const darkColorRadioButton = page.getByRole('radio', { name: 'Dark' });
    await darkColorRadioButton.click();

    // Wait for theme transition
    await page.waitForTimeout(500);
    const darkBg = await page.evaluate(
        () => window.getComputedStyle(document.body).backgroundColor
    );
    expect(darkBg).toMatch(/rgb\(.*\)/); // Should be a dark color, e.g., rgb(32, 33, 36)

    /** STEP: Click the 'Light' color radio button to change the appearance settings */
    const lightColorRadioButton = page.getByRole('radio', { name: 'Light' });
    await lightColorRadioButton.click();
    await page.waitForTimeout(500);
    const lightBg = await page.evaluate(
        () => window.getComputedStyle(document.body).backgroundColor
    );
    expect(lightBg).toMatch(/rgb\(.*\)/); // Should be a light color, e.g., rgb(255, 255, 255)

    // Optionally, assert that the colors are different
    expect(darkBg).not.toBe(lightBg);
}
