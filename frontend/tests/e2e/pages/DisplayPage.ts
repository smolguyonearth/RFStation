import { Page, Locator } from '@playwright/test';

export class DisplayPage {
  readonly page: Page;

  readonly p1Card: Locator;
  readonly p1Score: Locator;
  readonly p2Card: Locator;
  readonly p2Score: Locator;
  readonly phaseBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.p1Card = page.locator('[data-testid="monitor-p1-card"]');
    this.p1Score = page.locator('[data-testid="monitor-p1-score"]');
    this.p2Card = page.locator('[data-testid="monitor-p2-card"]');
    this.p2Score = page.locator('[data-testid="monitor-p2-score"]');
    this.phaseBadge = page.locator('[data-testid="monitor-phase-badge"]');
  }

  async goto() {
    await this.page.goto('/display');
  }

  async getPlayer1Score(): Promise<number> {
    const text = await this.p1Score.innerText();
    return parseInt(text.trim(), 10);
  }

  async getPlayer2Score(): Promise<number> {
    const text = await this.p2Score.innerText();
    return parseInt(text.trim(), 10);
  }

  async getActivePlayer(): Promise<1 | 2 | null> {
    const p1Class = await this.p1Card.getAttribute('class');
    const p2Class = await this.p2Card.getAttribute('class');
    
    if (p1Class && p1Class.includes('scale-102')) return 1;
    if (p2Class && p2Class.includes('scale-102')) return 2;
    return null;
  }

  async getPhase(): Promise<string> {
    const text = await this.phaseBadge.innerText();
    return text.trim();
  }

  getLandmarkLocator(id: string): Locator {
    return this.page.locator(`[data-testid="landmark-path-${id}"]`);
  }

  async clickLandmark(id: string) {
    const landmark = this.getLandmarkLocator(id);
    await landmark.click();
  }
}
