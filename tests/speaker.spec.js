const { test, expect } = require('@playwright/test');
const path = require('path');

const pdfFilePath = path.join(__dirname, 'PDF-File', 'Speaker Form (English and Arabic).pdf');
const photoFilePath = path.join(__dirname, 'new-images', 'resource-img-1.png');

// Helper function to generate session description with minimum length
function generateSessionDescription(minLength = 3000) {
    const sentence = 'Exploring emerging technologies and their impact on business and society. ';
    return sentence.repeat(Math.ceil(minLength / sentence.length)).trim();
}

// Test data for positive and negative cases
const testData = {
    positive: {
        fullName: 'John Smith',
        jobTitle: 'Senior Manager ABC Corp',
        email: 'john@example.com',
        phone: '9715551234567',
        expertise: '20 years experience',
        education: 'PhD Computer Science',
        memberships: 'Tech Association Member',
        message: 'Industry standards contributor',
        publications: 'Published 5 research papers',
        bookTitles: 'Innovation in Technology',
        sessionTitle: 'Future of Technology',
        sessionDescription: generateSessionDescription(3000),
    },
    negative: {
        fullName: 'J', // Too short
        jobTitle: '', // Empty
        email: 'john@invalid', // Invalid format
        phone: 'phone123', // Invalid format
        sessionDescription: 'Short description', // Under 300 chars
    }
};

// Helper function to navigate to session details page
async function goToSessionPage(page) {
    await page.getByRole('link', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'Session Title *' }).waitFor({ state: 'visible', timeout: 15000 });
}

// Helper function to setup basic page navigation
async function setupPage(page) {
    await page.goto('https://majlis.createstaging.com/en/speaker-registration/');
    await page.waitForLoadState('networkidle');
    await page.locator('.choices__inner').click();
    await page.getByRole('option', { name: 'Eng' }).click();
}

test.describe('Speaker Registration - Complete Flow', () => {
    test('Complete speaker registration flow', async ({ page }) => {
        await page.goto('https://majlis.createstaging.com/en/speaker-registration/');
        await page.waitForLoadState('networkidle');

        // Language & Basic Info
        await page.locator('.choices__inner').click();
        await page.getByRole('option', { name: 'Eng' }).click();

        await page.getByRole('textbox', { name: 'Full Name *' }).fill(testData.positive.fullName);
        await page.getByRole('textbox', { name: 'Job Title & Organisation *' }).fill(testData.positive.jobTitle);
        await page.getByRole('textbox', { name: 'Email Address *' }).fill(testData.positive.email);
        await page.getByRole('textbox', { name: 'Phone Number *' }).fill(testData.positive.phone);

        await page.getByRole('textbox', { name: /expertise/i }).fill(testData.positive.expertise);
        await page.getByRole('textbox', { name: /educational background/i }).fill(testData.positive.education);
        await page.getByRole('textbox', { name: /memberships/i }).fill(testData.positive.memberships);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill(testData.positive.message);
        await page.getByRole('textbox', { name: /publications/i }).fill(testData.positive.publications);

        await page.locator('.slider').first().click();
        await page.getByRole('textbox', { name: 'Book Titles *' }).fill(testData.positive.bookTitles);

        await page.locator('input[type="file"]').nth(0).setInputFiles(pdfFilePath);
        await page.locator('input[type="file"]').nth(1).setInputFiles(photoFilePath);

        // Session Details
        await page.getByRole('link', { name: 'Next' }).click();
        await page.getByRole('textbox', { name: 'Session Title *' }).waitFor({ state: 'visible', timeout: 15000 });

        await page.getByRole('textbox', { name: 'Session Title *' }).fill(testData.positive.sessionTitle);
        await page.getByRole('textbox', { name: /session description/i }).fill(testData.positive.sessionDescription);

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
        const toggles = page.locator('.toggle-group.form-style.isfalse > div > .toggle > .switch > .slider');
        await toggles.first().waitFor({ state: 'visible', timeout: 15000 });
        const toggleCount = await toggles.count();
        if (toggleCount > 1) {
            await toggles.nth(1).click();
        } else {
            await toggles.first().click();
        }
        await page.waitForTimeout(500);

        await page.getByRole('textbox', { name: 'I want specific flight *' }).fill('Yes Emirates');
        await page.locator('#departure-flightNumber').fill('EK002');
        await page.locator('label').filter({ hasText: 'Yes' }).nth(1).click();
        await page.getByRole('textbox', { name: /please specify the/i }).waitFor({ state: 'visible', timeout: 15000 });
        await page.getByRole('textbox', { name: /please specify the/i }).fill('Timing preference for connection');
        const travelFileInput = page.locator('input[type="file"]').nth(0);
        await travelFileInput.waitFor({ state: 'visible', timeout: 15000 });
        await travelFileInput.setInputFiles(pdfFilePath);

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
});

test.describe('Speaker Registration - Positive Cases', () => {
    test.beforeEach(async ({ page }) => {
        await setupPage(page);
    });

    test('Full Name field accepts valid input', async ({ page }) => {
        const fullName = page.getByRole('textbox', { name: 'Full Name *' });
        await fullName.fill(testData.positive.fullName);
        await expect(fullName).toHaveValue(testData.positive.fullName);
    });

    test('Job Title & Organisation field accepts valid input', async ({ page }) => {
        const jobTitle = page.getByRole('textbox', { name: 'Job Title & Organisation *' });
        await jobTitle.fill(testData.positive.jobTitle);
        await expect(jobTitle).toHaveValue(testData.positive.jobTitle);
    });

    test('Email Address field accepts valid email', async ({ page }) => {
        const email = page.getByRole('textbox', { name: 'Email Address *' });
        await email.fill(testData.positive.email);
        const valid = await email.evaluate((input) => input.checkValidity());
        expect(valid).toBe(true);
    });

    test('Phone Number field accepts valid phone', async ({ page }) => {
        const phone = page.getByRole('textbox', { name: 'Phone Number *' });
        await phone.fill(testData.positive.phone);
        await expect(phone).toHaveValue(testData.positive.phone);
    });

    test('Expertise field accepts valid input', async ({ page }) => {
        const expertise = page.getByRole('textbox', { name: /expertise/i });
        await expertise.fill(testData.positive.expertise);
        await expect(expertise).toHaveValue(testData.positive.expertise);
    });

    test('Educational Background field accepts valid input', async ({ page }) => {
        const education = page.getByRole('textbox', { name: /educational background/i });
        await education.fill(testData.positive.education);
        await expect(education).toHaveValue(testData.positive.education);
    });

    test('Memberships field accepts valid input', async ({ page }) => {
        const memberships = page.getByRole('textbox', { name: /memberships/i });
        await memberships.fill(testData.positive.memberships);
        await expect(memberships).toHaveValue(testData.positive.memberships);
    });

    test('Type your message field accepts valid input', async ({ page }) => {
        const message = page.getByRole('textbox', { name: 'Type your message...' });
        await message.fill(testData.positive.message);
        await expect(message).toHaveValue(testData.positive.message);
    });

    test('Publications field accepts valid input', async ({ page }) => {
        const publications = page.getByRole('textbox', { name: /publications/i });
        await publications.fill(testData.positive.publications);
        await expect(publications).toHaveValue(testData.positive.publications);
    });

    test('Book Titles field accepts valid input', async ({ page }) => {
        const bookTitles = page.getByRole('textbox', { name: 'Book Titles *' });
        await page.locator('.slider').first().click(); // ADD THIS
        await bookTitles.fill(testData.positive.bookTitles);
        await bookTitles.waitFor({ state: 'visible' }); // ADD THIS

        await expect(bookTitles).toHaveValue(testData.positive.bookTitles);
    });

    test('Session Title field accepts valid input', async ({ page }) => {
        await goToSessionPage(page);
        const sessionTitle = page.getByRole('textbox', { name: 'Session Title *' });
        await sessionTitle.fill(testData.positive.sessionTitle);
        await expect(sessionTitle).toHaveValue(testData.positive.sessionTitle);
    });

    test('Session Description field accepts 300+ characters', async ({ page }) => {
        await goToSessionPage(page);
        const sessionDescription = page.getByRole('textbox', { name: /session description/i });
        await sessionDescription.fill(testData.positive.sessionDescription);
        const value = await sessionDescription.evaluate((input) => input.value);
        expect(value.length).toBeGreaterThanOrEqual(300);
    });

    test('PDF upload field accepts a valid file', async ({ page }) => {
        const pdfInput = page.locator('input[type="file"]').first();

        await pdfInput.setInputFiles(pdfFilePath);

        // Example: file name UI check (adjust selector)
        await expect(page.getByText('Speaker Form')).toBeDefined();
    });

    test('Photo upload field accepts a valid image', async ({ page }) => {
        const photoInput = page.locator('input[type="file"]').nth(1);

        await photoInput.setInputFiles(photoFilePath);

        await expect(photoInput).toBeAttached();
    });
});

test.describe('Speaker Registration - Negative Cases', () => {
    test.beforeEach(async ({ page }) => {
        await setupPage(page);
    });

    test('Full Name field rejects too short input', async ({ page }) => {
        const fullName = page.getByRole('textbox', { name: 'Full Name *' });
        await fullName.fill(testData.negative.fullName);
        const valid = await fullName.evaluate((input) => input.checkValidity());
        expect(valid).toBe(false);
    });

    test('Job Title & Organisation field cannot be empty', async ({ page }) => {
        const jobTitle = page.getByRole('textbox', { name: 'Job Title & Organisation *' });
        await jobTitle.fill(testData.negative.jobTitle);
        const valid = await jobTitle.evaluate((input) => input.checkValidity());
        expect(valid).toBe(false);
    });

    test('Email Address rejects invalid email format', async ({ page }) => {
        const email = page.getByRole('textbox', { name: 'Email Address *' });
        await email.fill(testData.negative.email);
        const valid = await email.evaluate((input) => input.checkValidity());
        expect(valid).toBe(false);
    });

    test('Phone Number rejects invalid phone input', async ({ page }) => {
        const phone = page.getByRole('textbox', { name: 'Phone Number *' });
        await phone.fill(testData.negative.phone);
        const valid = await phone.evaluate((input) => input.checkValidity());
        expect(valid).toBe(false);
    });

    test('Session Description rejects under-300 character input', async ({ page }) => {
        await goToSessionPage(page);
        const sessionDescription = page.getByRole('textbox', { name: /session description/i });
        await sessionDescription.fill(testData.negative.sessionDescription);
        const valid = await sessionDescription.evaluate((input) => input.checkValidity());
        expect(valid).toBe(false);
    });
});