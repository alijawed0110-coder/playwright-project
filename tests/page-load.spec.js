import { test, expect } from '@playwright/test';
import { positiveTestCases } from './test-data/positive-cases.spec.js';
import { negativeTestCases } from './test-data/negative-cases.spec.js';
const baseUrl = 'https://technyxsystems-nextjs-payload.vercel.app/';

const positiveCases = [
  {
    name: 'Page loads successfully and shows contact form',
    url: baseUrl,
    visibleSelectors: [
      { role: 'textbox', name: 'First name*' },
      { role: 'textbox', name: 'Email*' },
      { role: 'textbox', name: 'Message*' },
      { testId: 'discuss-form-submit' }
    ]
  },
  {
    name: 'Contact form fields are enabled for user input',
    url: baseUrl,
    enabledSelectors: [
      { role: 'textbox', name: 'First name*' },
      { role: 'textbox', name: 'Email*' },
      { role: 'textbox', name: 'Message*' }
    ]
  },
  {
    name: 'Submit button is visible and accessible',
    url: baseUrl,
    visibleSelectors: [
      { testId: 'discuss-form-submit' }
    ],
    enabledSelectors: [
      { testId: 'discuss-form-submit' }
    ]
  }
];

const negativeCases = [
  {
    name: 'Invalid page route should not show contact form fields',
    url: `${baseUrl}invalid-page-route`,
    hiddenSelectors: [
      { role: 'textbox', name: 'First name*' },
      { role: 'textbox', name: 'Email*' },
      { role: 'textbox', name: 'Message*' }
    ]
  }
];

const locatorFor = (page, selector) => {
  if (selector.testId) return page.getByTestId(selector.testId);
  return page.getByRole(selector.role, { name: selector.name });
};

positiveCases.forEach((testCase) => {
  test(testCase.name, async ({ page }) => {
    await page.goto(testCase.url, { waitUntil: 'networkidle' });

    if (testCase.visibleSelectors) {
      for (const selector of testCase.visibleSelectors) {
        await expect(locatorFor(page, selector)).toBeVisible();
      }
    }

    if (testCase.enabledSelectors) {
      for (const selector of testCase.enabledSelectors) {
        await expect(locatorFor(page, selector)).toBeEnabled();
      }
    }
  });
});

negativeCases.forEach((testCase) => {
  test(testCase.name, async ({ page }) => {
    await page.goto(testCase.url, { waitUntil: 'networkidle' });

    if (testCase.hiddenSelectors) {
      for (const selector of testCase.hiddenSelectors) {
        await expect(locatorFor(page, selector)).not.toBeVisible();
      }
    }
  });
});
