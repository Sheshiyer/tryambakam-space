import { expect, test } from "@playwright/test";

/**
 * All 13 wing slugs from src/wing-page/data.ts.
 * Routing is hash-based: navigating to `/#<slug>` opens the wing overlay.
 */
const WING_SLUGS = [
  "hero",
  "witness-yourself",
  "self-integration",
  "three-pillars",
  "sixteen-engines",
  "somatic-canticles",
  "financial-biosensor",
  "witness-agents",
  "initiation-protocols",
  "infinite-treasure",
  "apothecary",
  "first-rule",
  "begin-journey",
] as const;

/** Selector present on every wing page (the template wrapper div). */
const TEMPLATE_WRAPPER = "[class*='templateWrapper']";

/** Screenshot comparison threshold — allows minor anti-aliasing diffs. */
const SCREENSHOT_THRESHOLD = 0.2;

test.describe("Wing Page Visual Regression", () => {
  for (const slug of WING_SLUGS) {
    test(`wing/${slug} matches baseline screenshot`, async ({ page }) => {
      // Navigate directly to the wing via hash routing
      await page.goto(`/#${slug}`);

      // Wait for the lazy-loaded template wrapper to appear
      await page.waitForSelector(TEMPLATE_WRAPPER, { timeout: 10_000 });

      // Allow animations/transitions to settle
      await page.waitForTimeout(2_000);

      // Take a full-page screenshot and compare to baseline
      await expect(page).toHaveScreenshot(`wing-${slug}.png`, {
        fullPage: true,
        maxDiffPixelRatio: SCREENSHOT_THRESHOLD,
      });
    });
  }
});
