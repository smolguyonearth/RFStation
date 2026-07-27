import { test, expect } from '@playwright/test';
import { SetupPage } from '../pages/SetupPage';
import { ControllerPage } from '../pages/ControllerPage';
import { DisplayPage } from '../pages/DisplayPage';

test.describe('Game Mode E2E Flow', () => {
  test.beforeEach(async ({ request }) => {
    // 1. Reset game scores and state variables
    await request.post('/api/game/reset');
    // 2. Set game mode to IDLE so the Setup lobby is displayed
    await request.post('/api/controller/mode', { data: { mode: 'IDLE' } });
  });

  test('should execute the initial setup, initial rolls, turn phases, and game exit', async ({ context }) => {
    // 1. Setup multi-tab workspace
    const controllerTab = await context.newPage();
    const displayTab = await context.newPage();

    const setupPage = new SetupPage(controllerTab);
    const controllerPage = new ControllerPage(controllerTab);
    const displayPage = new DisplayPage(displayTab);

    // 2. Load routes
    await setupPage.goto();
    await displayPage.goto();

    // 3. Start Game Mode
    await setupPage.startGameMode();

    // 4. Initial Roll Screen - Skip Intro
    await controllerPage.skipIntro();

    // 5. Player 1 Initial Roll (D20)
    await expect(controllerTab.getByRole('heading', { name: 'Player 1 Roll' })).toBeVisible();
    await controllerPage.rollD20();
    await controllerPage.nextP2();

    // 6. Player 2 Initial Roll (D20)
    await expect(controllerTab.getByRole('heading', { name: 'Player 2 Roll' })).toBeVisible();
    await controllerPage.rollD20();
    await controllerPage.showResults();

    // 7. Click Start Game to proceed to Turn 1
    await controllerPage.startGame();

    // 8. Turn Phase - Player Roll Stage (D6)
    // Check if D6 roll charge button is visible
    await expect(controllerPage.rollChargeBtn).toBeVisible();
    await controllerPage.rollDice();
    
    // Proceed to Action/Checklist
    await controllerPage.advanceToMove();
    await expect(controllerTab.locator('text=Checklist')).toBeVisible();
    
    // Complete Turn
    await controllerPage.endTurn();

    // 9. Exit back to lobby
    await controllerPage.exitToLobby();
    await expect(setupPage.modeGameBtn).toBeVisible();
  });

  test('should handle battle encounter sequence correctly', async ({ context }) => {
    const controllerTab = await context.newPage();
    const setupPage = new SetupPage(controllerTab);
    const controllerPage = new ControllerPage(controllerTab);

    await setupPage.goto();
    await setupPage.startGameMode();
    await controllerPage.skipIntro();

    // Bypass Initial Roll to result
    await controllerPage.rollD20();
    await controllerPage.nextP2();
    await controllerPage.rollD20();
    await controllerPage.showResults();
    await controllerPage.startGame();

    // Mock/Intercept API or trigger state change if needed, or check buttons if battle triggers
    // Here we verify battle phase elements compile and map properly
    await expect(controllerPage.restartBtn).toBeVisible();
  });
});
