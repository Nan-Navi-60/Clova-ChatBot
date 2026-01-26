import { test, expect } from '@playwright/test';

test.describe('Chatbot Frontend Tests', () => {
  // Assuming the Vite dev server runs on port 5173
  // And the backend server on port 3000
  // For these tests to run, both servers need to be active.
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('Case 1: Send message using Enter key', async ({ page }) => {
    const message = '안녕하세요';
    const userInput = page.locator('#userInput');
    const chatMessages = page.locator('.message');

    // Action: Type message and press Enter
    await userInput.fill(message);
    await userInput.press('Enter');

    // Expected Result 1: Message is added to the chat list
    // It might take a moment for the message to appear and for the bot to respond.
    // We'll wait for a new message to appear.
    // We'll also check for the specific user message.
    await expect(chatMessages.last()).toHaveText(message);

    // Expected Result 2: Input field is cleared
    await expect(userInput).toHaveValue('');
  });

  test('Case 2: Send message using Send button', async ({ page }) => {
    const message = '반갑습니다';
    const userInput = page.locator('#userInput');
    const sendButton = page.locator('#sendBtn');
    const chatMessages = page.locator('.message');

    // Action: Type message and click Send button
    await userInput.fill(message);
    await sendButton.click();

    // Expected Result 1: Message is added to the chat list
    // Similar to the first test, wait for the message and then check content.
    await expect(chatMessages.last()).toHaveText(message);

    // Expected Result 2: Input field is cleared
    await expect(userInput).toHaveValue('');
  });
});
