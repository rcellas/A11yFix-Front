import { Injectable } from '@angular/core';
import { Finding } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class PlaywrightGeneratorService {
  /**
   * Generates a deterministic Playwright + @axe-core/playwright regression test suite
   */
  generateTestSnippet(targetUrl: string, finding: Finding): string {
    const safeSelector = finding.selector.replace(/'/g, "\\'");
    const safeRuleId = finding.ruleId.replace(/'/g, "\\'");
    const safeUrl = targetUrl || 'https://example.com';

    return `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('verify fix for ${safeRuleId} on ${safeSelector}', async ({ page }) => {
  await page.goto('${safeUrl}');
  const results = await new AxeBuilder({ page })
    .include('${safeSelector}')
    .withRules(['${safeRuleId}'])
    .analyze();
  expect(results.violations).toEqual([]);
});`;
  }
}
