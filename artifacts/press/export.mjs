#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve("/workspace/artifacts/press");
mkdirSync(resolve(root, "slides"), { recursive: true });
mkdirSync(resolve(root, "reel"), { recursive: true });

const browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function shot(file, ids, dir, size) {
  await page.setViewportSize(size);
  await page.goto(pathToFileURL(resolve(root, file)).href, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  for (const id of ids) {
    const el = page.locator(`#${id}`);
    await el.screenshot({
      path: resolve(dir, `${id}.png`),
      type: "png",
    });
    console.log("shot", id);
  }
}

await shot(
  "slides.html",
  ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"],
  resolve(root, "slides"),
  { width: 1920, height: 1080 },
);

await shot(
  "reel-cards.html",
  ["open", "close", "lt-protect"],
  resolve(root, "reel"),
  { width: 1080, height: 1920 },
);

await browser.close();
console.log("export ok");
