import { Page, Locator } from '@playwright/test';

export class SetupPage {
  readonly page: Page;
  readonly langEnBtn: Locator;
  readonly langThBtn: Locator;
  readonly langDeBtn: Locator;
  readonly modeMuseumBtn: Locator;
  readonly modeGameBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.langEnBtn = page.locator('[data-testid="lang-btn-EN"]');
    this.langThBtn = page.locator('[data-testid="lang-btn-TH"]');
    this.langDeBtn = page.locator('[data-testid="lang-btn-DE"]');
    this.modeMuseumBtn = page.locator('[data-testid="mode-museum-btn"]');
    this.modeGameBtn = page.locator('[data-testid="mode-game-btn"]');
  }

  async goto() {
    await this.page.goto('/controller');
  }

  async selectLanguage(lang: 'EN' | 'TH' | 'DE') {
    if (lang === 'EN') await this.langEnBtn.click();
    else if (lang === 'TH') await this.langThBtn.click();
    else if (lang === 'DE') await this.langDeBtn.click();
  }

  async startMuseumMode() {
    await this.modeMuseumBtn.click();
  }

  async startGameMode() {
    await this.modeGameBtn.click();
  }
}
