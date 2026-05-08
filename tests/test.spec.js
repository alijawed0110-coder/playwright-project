import { test, expect } from '@playwright/test';
import { positiveTestCases } from './test-data/positive-cases.spec.js';
import { negativeTestCases } from './test-data/negative-cases.spec.js';
import { url } from 'inspector';


const path = require('path');
const pdfFilePath = path.join(__dirname, 'PDF-File', 'Speaker Form (English and Arabic).pdf');
const photoFilePath = path.join(__dirname, 'new-images', 'resource-img-1.png');
const URL = 'https://majlis.createstaging.com/en/moderator-registration/';

positiveTestCases.forEach((testCase) => {
  test(`POSITIVE: ${testCase.name}`, async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on the dropdown to open it
    await page.locator('div:nth-child(1) > .choices > .choices__inner').click();
    // Select the title option
    await page.getByRole('option', { name: testCase.title }).click();
    await page.getByRole('textbox', { name: 'Full name (English) *' }).fill(testCase.fullNameEn);
    await page.getByRole('textbox', { name: 'Full name (Arabic) *' }).fill(testCase.fullNameAr);
    await page.getByRole('textbox', { name: 'Job Title & Organisation (English) *' }).fill(testCase.jobTitleEn);
    await page.getByRole('textbox', { name: 'Job Title & Organisation (Arabic) *' }).fill(testCase.jobTitleAr);
    await page.getByRole('textbox', { name: 'Email *' }).fill(testCase.email);
    await page.getByRole('textbox', { name: 'Phone Number *' }).fill(testCase.phone);
    await page.getByRole('textbox', { name: 'Emirates ID *' }).fill(testCase.emiratesId);
    await page.locator('div:nth-child(2) > .choices > .choices__inner').click();
    await page.getByRole('option', { name: testCase.location }).click();
    await page.getByRole('textbox', { name: 'Please provide one point here related to expertise relevant to the session\'s' }).fill(testCase.expertise);
    await page.getByRole('textbox', { name: 'Please provide one point here related to educational background. *' }).fill(testCase.education);
    await page.getByRole('textbox', { name: 'Please provide one point here related to memberships or previous experience. *' }).fill(testCase.membership);
    await page.getByRole('textbox', { name: 'Type your message...' }).fill(testCase.additionalMessage);
    await page.getByRole('textbox', { name: 'Please provide one point here related to publications or awards. *' }).fill(testCase.publications);
    await page.locator('input[type="file"]').nth(0).setInputFiles(pdfFilePath);
    await page.locator('input[type="file"]').nth(1).setInputFiles(photoFilePath);
    await page.getByText('I confirm that all').click();
    const submitBtn = page.getByRole('button', { name: /submit/i });

    console.log(await submitBtn.count());
  });
});

// Parameterized negative test cases
negativeTestCases.forEach((testCase) => {
  test(`NEGATIVE: ${testCase.name}`, async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    if (testCase.fullNameEn) {
      // Click on the dropdown to open it
      await page.locator('div:nth-child(1) > .choices > .choices__inner').click();
      // Select the title option
      await page.getByRole('option', { name: testCase.title }).click();
      await page.getByRole('textbox', { name: 'Full name (English) *' }).fill(testCase.fullNameEn);
      await page.getByRole('textbox', { name: 'Full name (Arabic) *' }).fill(testCase.fullNameAr);
      await page.getByRole('textbox', { name: 'Job Title & Organisation (English) *' }).fill(testCase.jobTitleEn);
      await page.getByRole('textbox', { name: 'Job Title & Organisation (Arabic) *' }).fill(testCase.jobTitleAr);
      await page.getByRole('textbox', { name: 'Email *' }).fill(testCase.email);
      await page.getByRole('textbox', { name: 'Phone Number *' }).fill(testCase.phone);
      await page.getByRole('textbox', { name: 'Emirates ID *' }).fill(testCase.emiratesId);
      if (testCase.location) {
        await page.locator('div:nth-child(2) > .choices > .choices__inner').click();
        await page.getByRole('option', { name: testCase.location }).click();
      }
      await page.getByRole('textbox', { name: 'Please provide one point here related to expertise relevant to the session\'s' }).fill(testCase.expertise);
      await page.getByRole('textbox', { name: 'Please provide one point here related to educational background. *' }).fill(tezstCase.education);
      await page.getByRole('textbox', { name: 'Please provide one point here related to memberships or previous experience. *' }).fill(testCase.membership);
      await page.getByRole('textbox', { name: 'Type your message...' }).fill(testCase.additionalMessage);
      await page.getByRole('textbox', { name: 'Please provide one point here related to publications or awards. *' }).fill(testCase.publications);
      await page.locator('input[type="file"]').nth(0).setInputFiles(pdfFilePath);
      await page.locator('input[type="file"]').nth(1).setInputFiles(photoFilePath);
      await page.getByText('I confirm that all').click();

      const submitBtn = page.getByRole('button', { name: /submit/i });

      console.log(await submitBtn.count());

    }
    // Check for error state or validation message
    const errorElement = page.locator('[role="alert"]');
    if (testCase.shouldFail) {
      await expect(
        errorElement.or(page.locator('.error'))
      ).toBeVisible();
    }
  });
});