import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "assets/app.js",
  "assets/styles.css",
  "data/decision_receipts.json",
  "data/arc_receipt_anchor.json",
  "data/timeline.json",
  "contracts/SignalGuardReceiptRegistry.sol",
  "scripts/build_arc_receipt_proof.mjs",
  "scripts/reconcile_polymarket_jsonl.py",
  "docs/submission.md",
  "docs/demo-script.md",
  "docs/demo-v4-voiceover.md",
  "docs/form-answers.md",
  "docs/requirements-check.md",
  "docs/judge-brief.md",
  "README.md"
];

const requiredArtifacts = [
  "artifacts/signalguard-demo-v4.mp4",
  "artifacts/signalguard-demo-v4.srt"
];

const forbiddenFiles = [
  "artifacts/signalguard-demo-v3.mp4",
  "artifacts/signalguard-demo-v3.srt",
  "docs/demo-v3-voiceover.md"
];

const textFilesForSecretScan = requiredFiles;

const secretPatterns = [
  /PRIVATE_KEY\s*=/i,
  /MNEMONIC\s*=/i,
  /POLYMARKET_API_KEY\s*=/i,
  /CLOB_API_KEY\s*=/i,
  /-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----/
];

for (const file of requiredFiles) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

for (const file of requiredArtifacts) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) {
    throw new Error(`Missing required artifact: ${file}`);
  }
}

for (const file of forbiddenFiles) {
  if (existsSync(new URL(`../${file}`, import.meta.url))) {
    throw new Error(`Forbidden stale artifact still exists: ${file}`);
  }
}

const receiptText = await readFile(new URL("../data/decision_receipts.json", import.meta.url), "utf8");
const receipts = JSON.parse(receiptText);
const receipt = receipts[0];
const blockReceipt = receipts.find(item => item.risk_governor?.action === "block");
const requiredReceiptPaths = [
  ["id", receipt.id],
  ["market.title", receipt.market?.title],
  ["agent_thesis.summary", receipt.agent_thesis?.summary],
  ["agent_loop", Array.isArray(receipt.agent_loop) && receipt.agent_loop.length >= 5],
  ["risk_governor.action", receipt.risk_governor?.action],
  ["risk_governor.max_notional_usdc", receipt.risk_governor?.max_notional_usdc],
  ["execution_adapter.lifecycle_status", receipt.execution_adapter?.lifecycle_status],
  ["arc_receipt_layer.settlement_currency", receipt.arc_receipt_layer?.settlement_currency]
];

for (const [name, value] of requiredReceiptPaths) {
  if (value === undefined || value === null || value === "" || value === false) {
    throw new Error(`Receipt missing ${name}`);
  }
}

if (!blockReceipt) {
  throw new Error("Missing blocked refusal receipt");
}

const appText = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
const requiredAppSnippets = [
  "data-receipt-index",
  "data-copy",
  "data-download",
  "downloadJson",
  "copyText"
];

for (const snippet of requiredAppSnippets) {
  if (!appText.includes(snippet)) {
    throw new Error(`App missing interaction snippet: ${snippet}`);
  }
}

for (const file of textFilesForSecretScan) {
  const text = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.test(text)) {
      throw new Error(`Potential secret pattern found in ${file}: ${pattern}`);
    }
  }
}

console.log("Submission self-check OK");
