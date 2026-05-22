# SignalGuard

Receipt-first prediction-market intelligence agent for the Agora Agents Hackathon.

## Live Demo

- Live app: https://linwei05050716-cloud.github.io/signalguard-agora-submission/
- Demo video: https://github.com/linwei05050716-cloud/signalguard-agora-submission/blob/main/artifacts/signalguard-demo-v4.mp4
- Judge brief: [docs/judge-brief.md](docs/judge-brief.md)
- Full project README: [README-full.md](README-full.md)

## What It Does

SignalGuard turns prediction-market signals into auditable decision receipts before any action can happen. Each receipt captures the agent thesis, observed price and fair-value edge, hard risk gates, lifecycle state, and an Arc-ready receipt hash.

The demo shows two important behaviors:

- Capped action: a single bounded BUY candidate with max notional and submit-count limits.
- Blocked refusal: a trade candidate that fails risk gates and becomes an auditable refusal.

## Why It Matters

Prediction-market agents usually expose picks without enough accountability. A user cannot tell why a trade was allowed, whether it respected price, notional, liquidity, and submit-count limits, or whether an exchange result, fill, or rejection is missing.

SignalGuard makes unknown states explicit. If an order has a submit receipt but no terminal result, fill, or rejection, the UI keeps that lifecycle unresolved instead of hiding it.

## Hackathon Fit

Primary RFB: **Prediction Market Trader Intelligence**

SignalGuard also connects naturally to Arc and Circle because every decision can be represented as a USDC-denominated, hashable receipt. The repository includes:

- Static HTML/CSS/JavaScript demo app.
- JSON decision receipts.
- Arc-compatible receipt proof artifact.
- Solidity registry contract for anchoring canonical receipt hashes.
- Read-only JSONL reconciler for exported prediction-market logs.
- Self-check script for submission integrity.

## Fast Judge Path

1. Open the live app.
2. Click **Open workbench**.
3. Review **Overview**, **Decision Receipt**, **Arc Proof**, **Judge Mode**, and **Submit Packet**.
4. Watch the under-three-minute demo video with subtitles.
5. Inspect `data/decision_receipts.json` and `contracts/SignalGuardReceiptRegistry.sol`.
6. Run the local checks if desired:

```bash
node scripts/verify_submission.mjs
node scripts/build_arc_receipt_proof.mjs --check
```

## Safety

- No secrets committed.
- No live trading switch in the submitted app.
- No unbounded order loop.
- No hidden retries after a capped submit.
- Missing exchange responses remain visible as unresolved states.
