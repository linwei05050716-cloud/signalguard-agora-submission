import { chromium } from "playwright";
import { mkdir, rename, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const outDir = new URL("artifacts/demo-video-v3/", root);
const finalPath = new URL(process.env.DEMO_OUTPUT || "artifacts/signalguard-demo-v4-silent.webm", root);
const appUrl = process.env.SIGNALGUARD_URL || "http://127.0.0.1:5177/";

await mkdir(outDir, { recursive: true });
await rm(finalPath, { force: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_EXECUTABLE_PATH || undefined
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: {
    dir: fileURLToPath(outDir),
    size: { width: 1280, height: 720 }
  }
});

const page = await context.newPage();
await page.goto(appUrl, { waitUntil: "load" });

await page.addStyleTag({
  content: `
    [data-demo-marker] {
      position: fixed;
      top: 92px;
      right: 32px;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 11px 14px;
      border: 2px solid #0b1713;
      background: #93ff28;
      color: #0b1713;
      box-shadow: 5px 5px 0 rgba(11, 23, 19, 0.22);
      font: 800 14px/1 Inter, system-ui, sans-serif;
      letter-spacing: 0;
    }
    [data-demo-marker]::before {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #17a7e8;
      border: 2px solid #0b1713;
    }
    [data-demo-focus] {
      position: relative;
      z-index: 3;
      outline: 4px solid #93ff28 !important;
      outline-offset: 5px;
      box-shadow: 0 0 0 10px rgba(147, 255, 40, 0.18), 10px 10px 0 rgba(11, 23, 19, 0.16) !important;
      transition: outline-color 240ms ease, box-shadow 240ms ease;
    }
  `
});

async function marker(text) {
  await page.evaluate(value => {
    let el = document.querySelector("[data-demo-marker]");
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("data-demo-marker", "true");
      document.body.appendChild(el);
    }
    el.textContent = value;
  }, text);
}

async function wait(ms) {
  await page.waitForTimeout(ms);
}

async function openView(view) {
  await page.click(`button[data-view="${view}"]`);
  await wait(700);
}

async function focus(selector) {
  await page.evaluate(sel => {
    document.querySelectorAll("[data-demo-focus]").forEach(el => el.removeAttribute("data-demo-focus"));
    const target = document.querySelector(sel);
    if (target) target.setAttribute("data-demo-focus", "true");
  }, selector);
}

async function clearFocus() {
  await page.evaluate(() => {
    document.querySelectorAll("[data-demo-focus]").forEach(el => el.removeAttribute("data-demo-focus"));
  });
}

await marker("RFB 02: Trader Intelligence");
await focus(".market-panel");
await wait(10000);

await marker("Can we audit the pick tomorrow?");
await focus(".hero-copy");
await wait(13000);

await marker("Every agent leaves a receipt");
await focus(".market-panel");
await wait(12000);

await marker("Fair probability vs market ask");
await focus(".price-row");
await wait(13000);

await page.click('a[href="#agent"]');
await wait(900);
await marker("Risk governor before any trade");
await focus(".metrics-grid");
await wait(11000);

await marker("USDC-sized controls");
await focus(".view.active .module");
await wait(13000);

await marker("Controlled autonomy, not larger size");
await focus(".view.active .module");
await wait(12000);

await openView("receipt");
await marker("Decision receipt as product surface");
await focus(".view.active .module");
await wait(14000);

await openView("replay");
await marker("Lifecycle replay");
await focus(".timeline");
await wait(13000);

await marker("Unresolved is explicit risk");
await focus(".timeline");
await wait(12000);

await openView("arc");
await marker("Circle + Arc proof path");
await focus(".arc-proof-grid");
await wait(14000);

await marker("DecisionReceiptAnchored");
await focus(".proof-hash");
await wait(13000);

await openView("judge");
await marker("Judge Mode");
await focus(".judge-grid");
await wait(11000);

await openView("submit");
await marker("Submission-ready package");
await focus(".packet-grid");
await wait(9000);

await clearFocus();
await marker("Control plane for market agents");
await wait(8500);

const video = page.video();
await context.close();
await browser.close();

if (video) {
  await rename(await video.path(), finalPath);
  console.log(`Wrote ${fileURLToPath(finalPath)}`);
}
