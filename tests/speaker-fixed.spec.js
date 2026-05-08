const { test, expect } = require('@playwright/test');
const path = require('path');

const pdfFilePath = path.join(__dirname, 'PDF-File', 'Speaker Form (English and Arabic).pdf');
const photoFilePath = path.join(__dirname, 'new-images', 'resource-img-1.png');

test('Speaker Registration - Complete Flow', async ({ page }) => {
  await page.goto('https://majlis.createstaging.com/en/speaker-registration/');
  await page.waitForLoadState('networkidle');

  // Language & Basic Info
  await page.locator('.choices__inner').click();
  await page.getByRole('option', { name: 'Eng' }).click();

  await page.getByRole('textbox', { name: 'Full Name *' }).fill('John Smith');
  await page.getByRole('textbox', { name: 'Job Title & Organisation *' }).fill('Senior Manager ABC Corp');
  await page.getByRole('textbox', { name: 'Email Address *' }).fill('john@example.com');
  await page.getByRole('textbox', { name: 'Phone Number *' }).fill('9715551234567');

  await page.getByRole('textbox', { name: /expertise/i }).fill('20 years experience');
  await page.getByRole('textbox', { name: /educational background/i }).fill('PhD Computer Science');
  await page.getByRole('textbox', { name: /memberships/i }).fill('Tech Association Member');
  await page.getByRole('textbox', { name: 'Type your message...' }).fill('Industry standards contributor');
  await page.getByRole('textbox', { name: /publications/i }).fill('Published 5 research papers');

  await page.locator('.slider').first().click();
  await page.getByRole('textbox', { name: 'Book Titles *' }).fill('Innovation in Technology');

  await page.locator('input[type="file"]').nth(0).setInputFiles(pdfFilePath);
  await page.locator('input[type="file"]').nth(1).setInputFiles(photoFilePath);

  // Session Details
  await page.getByRole('link', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Session Title *' }).waitFor({ state: 'visible', timeout: 15000 });

  await page.getByRole('textbox', { name: 'Session Title *' }).fill('Future of Technology');
  await page.getByRole('textbox', { name: /session description/i }).fill('Exploring emerging technologies and their impact on business and society');

  await page.getByRole('textbox', { name: '1', exact: true }).fill('AI and Machine Learning trends');
  await page.getByRole('textbox', { name: '2' }).fill('Blockchain applications');
  await page.getByRole('textbox', { name: '3', exact: true }).fill('Cybersecurity challenges');

  // Travel Details
  await page.getByRole('link', { name: 'Next' }).click();
  await page.locator('label').filter({ hasText: 'No' }).first().waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('label').filter({ hasText: 'No' }).first().click();
  await page.getByRole('textbox', { name: 'Outbound Date *' }).waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);

  await page.getByRole('textbox', { name: 'Outbound Date *' }).fill('08/10/2026');
  await page.keyboard.press('Escape');
  await page.locator('body').click();
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: 'Outbound From *' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('textbox', { name: 'Outbound From *' }).fill('Dubai');

  await page.getByRole('textbox', { name: 'Outbound To *' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('textbox', { name: 'Outbound To *' }).fill('Abu Dhabi');
  await page.waitForTimeout(500);

  await page.locator('.toggle-group.form-style.isfalse > div > .toggle > .switch > .slider').first().click();
  await page.getByRole('textbox', { name: 'Airline *' }).fill('Emirates');
  await page.getByRole('textbox', { name: 'Flight Number *' }).fill('EK001');

  await page.getByRole('textbox', { name: 'Return Date *' }).fill('08/12/2026');
  await page.keyboard.press('Escape');
  await page.locator('body').click();
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: 'Return From *' }).fill('Abu Dhabi');
  await page.getByRole('textbox', { name: 'Return To *' }).fill('Dubai');
  await page.waitForTimeout(500);

  // Toggle for specific flight preference
  const toggles = await page.locator('.toggle-group.form-style.isfalse > div > .toggle > .switch > .slider').all();
  if (toggles.length > 1) {
    await toggles[1].click();
  }
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: 'I want specific flight *' }).fill('Yes Emirates');
  await page.locator('#departure-flightNumber').fill('EK002');
  await page.locator('label').filter({ hasText: 'Yes' }).nth(1).click();
  await page.getByRole('textbox', { name: /please specify the/i }).fill('Timing preference for connection');
  await page.locator('input[type="file"]').nth(0).setInputFiles(pdfFilePath);

  // Questions
  await page.getByRole('link', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Question' }).waitFor({ state: 'visible', timeout: 15000 });

  await page.getByRole('textbox', { name: 'Question' }).fill('What is the biggest AI trend?');
  await page.getByRole('textbox', { name: 'Correct Answer' }).fill('Machine Learning');
  await page.getByRole('textbox', { name: 'Wrong Answer(s) (up to 3' }).fill('Quantum Computing');
  await page.locator('#wrong-answer-2').fill('Blockchain');
  await page.locator('#wrong-answer-3').fill('Virtual Reality');

  await page.getByRole('link', { name: 'Add question' }).click();
  await page.locator('#question-2').fill('Which is critical for security?');
  await page.getByRole('textbox', { name: 'Limited water resources,' }).fill('Zero Trust Architecture');
  await page.locator('#questions-2 #wrong-answer-1').fill('Firewalls only');
  await page.locator('#questions-2 #wrong-answer-2').fill('Air-gap networks');
  await page.locator('#questions-2 #wrong-answer-3').fill('VPNs exclusively');

  // Invitations
  await page.getByRole('link', { name: 'Next' }).click();
  await page.getByRole('link', { name: 'Add Invitee' }).click();

  await page.getByRole('textbox', { name: 'Full Name', exact: true }).fill('Jane Doe');
  await page.getByRole('textbox', { name: 'Job Title', exact: true }).fill('Director Innovation');
  await page.getByRole('textbox', { name: 'Email Address', exact: true }).fill('jane@example.com');
  await page.getByRole('textbox', { name: 'Phone Number', exact: true }).fill('9715559876543');

  await page.locator('input[type="file"]').nth(0).setInputFiles(photoFilePath);
  await page.getByText('By clicking the box, I').click();
  await page.getByRole('link', { name: 'Submit' }).click();

  await page.waitForTimeout(3000);
});
