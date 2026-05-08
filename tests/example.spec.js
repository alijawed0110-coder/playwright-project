import { test } from '@playwright/test';
const path = require('path');

// ✅ Correct PDF path (make sure file is inside project folder)
const filePath = path.join(
  __dirname,
  'PDF-File',
  'Speaker Form (English and Arabic).pdf'
);

test('moderator', async ({ page }) => {

  await page.goto('https://majlis.createstaging.com/en/moderator-registration/');

  // Title
  await page.getByRole('option', { name: 'Mr' }).click();

  // Basic Info
  await page.getByRole('textbox', { name: /Full name \(English\)/ })
    .fill('Ali Khan');

  await page.getByRole('textbox', { name: /Full name \(Arabic\)/ })
    .fill('علی خان');

  await page.getByRole('textbox', { name: /Job Title & Organisation \(English\)/ })
    .fill('QA Engineer');

  await page.getByRole('textbox', { name: /Job Title & Organisation \(Arabic\)/ })
    .fill('مهندس جودة');

  await page.getByRole('textbox', { name: /Email/ })
    .fill('test@test.com');

  await page.getByRole('textbox', { name: /Phone Number/ })
    .fill('03001234567');

  await page.getByRole('textbox', { name: /Emirates ID/ })
    .fill('123-4567-1234567-1');

  // City
  await page.locator('li.option', { Sharjah: 'Option 3' }).click();

  // Upload PDF (ONLY ONCE)
  await page.setInputFiles('input[type="file"]', filePath);

  // Next
  await page.getByRole('link', { name: 'Next' }).click();

  // Invitee section
  await page.getByRole('link', { name: 'Add Invitee' }).click();

  await page.getByRole('textbox', { name: 'Full Name', exact: true })
    .fill('Test User');

  await page.getByRole('textbox', { name: 'Job Title', exact: true })
    .fill('Tester');

  await page.getByRole('textbox', { name: 'Email Address' })
    .fill('invite@test.com');

  await page.getByRole('textbox', { name: 'Phone Number', exact: true })
    .fill('03123456789');

  // Upload again (invitee file)
  await page.setInputFiles('input[type="file"]', filePath);

  // Confirmation
  await page.getByText('I confirm that all').click();

  // Submit
  await page.getByRole('link', { name: 'Submit' }).click();

});