import { test, expect } from '@playwright/test';
import { SetupPage } from '../pages/SetupPage';
import { ControllerPage } from '../pages/ControllerPage';
import { DisplayPage } from '../pages/DisplayPage';

test.describe('Museum Mode E2E Flow', () => {
  test.beforeEach(async ({ request }) => {
    // 1. Reset game scores and state variables
    await request.post('/api/game/reset');
    // 2. Set game mode to IDLE so the Setup lobby is displayed
    await request.post('/api/controller/mode', { data: { mode: 'IDLE' } });
  });

  test('should complete the full museum mode user flow', async ({ context }) => {
    // 1. Launch controller page and display page in parallel
    const controllerTab = await context.newPage();
    const displayTab = await context.newPage();

    const setupPage = new SetupPage(controllerTab);
    const controllerPage = new ControllerPage(controllerTab);
    const displayPage = new DisplayPage(displayTab);

    // 2. Open pages
    await setupPage.goto();
    await displayPage.goto();

    // 3. Switch language on controller
    await setupPage.selectLanguage('TH');
    await expect(setupPage.langThBtn).toHaveClass(/bg-\[#FFEBF0\]/);

    await setupPage.selectLanguage('EN');
    await expect(setupPage.langEnBtn).toHaveClass(/bg-\[#FFEBF0\]/);

    // 4. Start Museum Mode
    await setupPage.startMuseumMode();

    // Verify exit button is visible on controller
    await expect(controllerPage.exitBtn).toBeVisible();

    // 5. Select a landmark on the controller map
    // We target landmark "lm_01" (e.g. Wat Benchamabophit)
    const landmark1 = controllerTab.locator('[data-testid="landmark-path-lm_01"]');
    await expect(landmark1).toBeVisible();
    await landmark1.click();

    // Verify display monitor updates to show active exploring details
    await expect(displayTab.locator('text=exploring')).toBeVisible();

    // 6. Exit Museum Mode back to lobby
    await controllerPage.exitToLobby();
    await expect(setupPage.modeMuseumBtn).toBeVisible();
  });
});
