# Submission Form Answers

Use these as copy-paste answers for the Agora project form.

## Project name

SignalGuard

## One-liner

A receipt-first prediction-market intelligence agent that turns market recommendations into auditable decisions, applies hard USDC risk limits, and anchors decision receipts for Arc-compatible attribution.

## RFB

Primary: RFB 02 — Prediction Market Trader Intelligence

Secondary: RFB 06 — Social Trading Intelligence

## What problem does it solve?

Prediction-market agents usually show picks without enough accountability. Users cannot easily tell why an agent acted, whether the action was properly sized, what risk limits were applied, or whether an exchange response was missing after execution. SignalGuard makes every recommendation or refusal produce an auditable receipt, so users and downstream agents can inspect the thesis, evidence, risk gates, lifecycle state, and Arc-ready receipt hash.

## What did you build?

SignalGuard is a browser-based workbench for prediction-market agents. It includes:

- a market thesis panel,
- a risk governor for price, notional, liquidity, and submit-count controls,
- a visible agent decision loop from observation through reconciliation,
- an interactive switch between capped-action and blocked-refusal receipts,
- copy and download controls for receipts, proof hash, and Arc proof JSON,
- JSON decision receipts,
- a replay timeline for execution lifecycle,
- a read-only reconciler for exported Polymarket JSONL logs,
- an Arc-compatible receipt registry contract,
- and a generated receipt anchor proof denominated in USDC.

The demo intentionally keeps execution bounded and safe. If an exchange result, fill, or rejection is missing, SignalGuard marks that as an unresolved risk state instead of hiding it.

The core agent loop is:

```text
observe -> score -> gate -> act/refuse -> anchor -> reconcile
```

That loop is visible in the product and encoded in the sample receipt, so the judge can inspect how the agent got from market data to a bounded action or a refusal.

## Circle / Arc usage

SignalGuard uses USDC as the native denomination for risk limits and receipt metadata. The project includes an Arc-compatible Solidity registry, `SignalGuardReceiptRegistry.sol`, which anchors a canonical decision receipt hash and emits `DecisionReceiptAnchored`. The generated anchor proof in `data/arc_receipt_anchor.json` shows the receipt hash, market, action, USDC max notional, and unresolved lifecycle status.

Circle / Arc are not only labels in the demo. USDC is the unit for capped exposure and future recommendation fees; Arc is the intended low-cost rail for anchoring attribution and settlement records; and the receipt hash links the onchain proof back to the full offchain reasoning trace.

## Innovation

The product treats the reasoning trace as the product, not just the trade. It makes both action and non-action inspectable. A blocked trade, a capped submit, or a missing terminal exchange receipt all become first-class auditable artifacts.

## GitHub repository

Pending public publish: `https://github.com/<your-user>/signalguard-agora`

## Live product link

Pending deploy: `https://<your-host>/signalguard-agora`

## Demo video

Stronger local demo video generated:

```text
artifacts/signalguard-demo-v4.mp4
```

Runtime: about 2:28. Includes male English voiceover, burned-in subtitles, receipt switching, copy/export controls, Arc proof, Judge Mode, honest traction wording, and submission artifact walkthrough. Upload this to Loom, YouTube, or Vimeo before final submission.

## Judge brief

Use this for the one-page verification path:

```text
docs/judge-brief.md
```

## Users / validation

Do not fabricate traction. Suggested honest wording before outreach:

> Pre-launch demo. We have one operator-validated workflow from a capped prediction-market execution replay and are collecting feedback from prediction-market users/builders before final submission.

Suggested wording after outreach:

> Shared with [N] prediction-market users/builders. Feedback centered on [summarize real feedback]. Changes made: [summarize actual changes].
