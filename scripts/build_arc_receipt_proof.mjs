import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const receiptPath = new URL("../data/decision_receipts.json", import.meta.url);
const outPath = new URL("../data/arc_receipt_anchor.json", import.meta.url);
const checkOnly = process.argv.includes("--check");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, canonicalize(value[key])])
    );
  }
  return value;
}

function toMicrousd(value) {
  return Math.round(Number(value) * 1_000_000);
}

const receipts = JSON.parse(await readFile(receiptPath, "utf8"));
const receipt = receipts[0];
const canonicalReceipt = JSON.stringify(canonicalize(receipt));
const receiptHash = "0x" + createHash("sha256").update(canonicalReceipt).digest("hex");
const maxNotionalMicrousd = toMicrousd(receipt.risk_governor.max_notional_usdc);

const proof = {
  proof_version: "signalguard-arc-anchor-0.1",
  network: {
    target: "Arc testnet",
    settlement_currency: "USDC",
    note: "Generated without a private key. Ready for Arc deployment once a builder wallet is provided."
  },
  contract: {
    path: "contracts/SignalGuardReceiptRegistry.sol",
    event: "DecisionReceiptAnchored(bytes32,address,string,string,string,uint256,uint256)"
  },
  receipt: {
    id: receipt.id,
    hash_algorithm: "sha256",
    hash: receiptHash,
    market: receipt.market.title,
    action: receipt.risk_governor.action,
    max_notional_usdc: receipt.risk_governor.max_notional_usdc,
    max_notional_microusd: maxNotionalMicrousd
  },
  audit_state: {
    lifecycle_status: receipt.execution_adapter.lifecycle_status,
    terminal_exchange_receipt_present: Boolean(receipt.execution_adapter.order_id),
    unresolved_states_are_visible: true
  }
};

if (checkOnly) {
  if (!existsSync(outPath)) {
    throw new Error("data/arc_receipt_anchor.json is missing. Run npm run proof.");
  }
  const existing = JSON.parse(await readFile(outPath, "utf8"));
  if (existing.receipt.hash !== proof.receipt.hash) {
    throw new Error(`receipt hash mismatch: ${existing.receipt.hash} !== ${proof.receipt.hash}`);
  }
  console.log(`Arc receipt proof OK: ${proof.receipt.hash}`);
} else {
  await writeFile(outPath, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`Wrote ${outPath.pathname}`);
  console.log(`Receipt hash: ${proof.receipt.hash}`);
}
