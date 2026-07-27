import { Page, Locator } from '@playwright/test';

export class ControllerPage {
  readonly page: Page;

  // Header and Global Buttons
  readonly restartBtn: Locator;
  readonly exitBtn: Locator;

  // Init Roll Phase Buttons
  readonly skipIntroBtn: Locator;
  readonly rollD20Btn: Locator;
  readonly p1RollNextBtn: Locator;
  readonly p2RollNextBtn: Locator;
  readonly startGameBtn: Locator;

  // Turn Phase Buttons
  readonly rollChargeBtn: Locator;
  readonly nextMoveBtn: Locator;
  readonly endTurnBtn: Locator;

  // Battle Phase Buttons
  readonly attackerRollNextBtn: Locator;
  readonly defenderRollNextBtn: Locator;
  readonly battleResolveBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header and Global
    this.restartBtn = page.locator('[data-testid="restart-btn"]');
    this.exitBtn = page.locator('[data-testid="exit-btn"]');

    // Init Roll
    this.skipIntroBtn = page.locator('[data-testid="skip-intro-btn"]');
    this.rollD20Btn = page.locator('[data-testid="roll-d20-btn"]');
    this.p1RollNextBtn = page.locator('[data-testid="p1-roll-next-btn"]');
    this.p2RollNextBtn = page.locator('[data-testid="p2-roll-next-btn"]');
    this.startGameBtn = page.locator('[data-testid="start-game-btn"]');

    // Turn
    this.rollChargeBtn = page.locator('[data-testid="roll-charge-btn"]');
    this.nextMoveBtn = page.locator('[data-testid="next-move-btn"]');
    this.endTurnBtn = page.locator('[data-testid="end-turn-btn"]');

    // Battle
    this.attackerRollNextBtn = page.locator('[data-testid="attacker-roll-next-btn"]');
    this.defenderRollNextBtn = page.locator('[data-testid="defender-roll-next-btn"]');
    this.battleResolveBtn = page.locator('[data-testid="battle-resolve-btn"]');
  }

  async skipIntro() {
    // Wait for the websocket update to render the intro screen
    await this.skipIntroBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await this.skipIntroBtn.isVisible()) {
      await this.skipIntroBtn.click();
    }
  }

  async rollD20() {
    await this.rollD20Btn.click();
  }

  async nextP2() {
    await this.p1RollNextBtn.click();
  }

  async showResults() {
    await this.p2RollNextBtn.click();
  }

  async startGame() {
    await this.startGameBtn.click();
  }

  async rollDice() {
    await this.rollChargeBtn.click();
  }

  async advanceToMove() {
    await this.nextMoveBtn.click();
  }

  async endTurn() {
    await this.endTurnBtn.click();
  }

  async confirmAttackerRoll() {
    await this.attackerRollNextBtn.click();
  }

  async confirmDefenderRoll() {
    await this.defenderRollNextBtn.click();
  }

  async resolveBattle() {
    await this.battleResolveBtn.click();
  }

  async restartGame() {
    await this.restartBtn.click();
  }

  async exitToLobby() {
    await this.exitBtn.click();
  }
}
