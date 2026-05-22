# SignalGuard

SignalGuard is an autonomous prediction-market intelligence workbench built for the Agora Agents Hackathon.

It does not try to present a trading bot as magic. It turns every recommendation into an auditable decision receipt, sends that receipt through hard risk gates, and treats missing exchange acknowledgements as explicit risk states.

## Why this exists

Most market agents optimize for action. Prediction markets need accountable action:

- What did the agent believe?
- What evidence changed the recommendation?
- What hard limits protected the user?
- Was a trade actually submitted, filled, rejected, or left unresolved?
- Can another system audit the decision without trusting the operator?

SignalGuard answers those questions with a receipt-first workflow.

## Hackathon fit

Primary Agora RFB: **RFB 02 — Prediction Market Trader Intelligence**

Secondary fit:

- RFB 06 — Social Trading Intelligence, because the useful artifact is not only the trade but the reasoning trace.
- Arc / USDC settlement layer, because decision receipts can be hashed and attributed cheaply while execution remains bounded.

## Judge path

If you have only a few minutes:

1. Open `index.html` and use **Overview**, **Decision Receipt**, **Arc Proof**, and **Judge Mode**.
2. Watch `artifacts/signalguard-demo-v4.mp4` for the narrated under-three-minute walkthrough.
3. Toggle the **Capped submit** and **Blocked refusal** receipts to verify that the agent can act and refuse.
4. Use the copy/export controls to inspect the active receipt and Arc proof outside the UI.
5. Inspect `data/decision_receipts.json` to see the agent thesis, hard gates, decision loop, and unresolved lifecycle state.
6. Inspect `data/arc_receipt_anchor.json` and `contracts/SignalGuardReceiptRegistry.sol` to see how the decision receipt can be anchored on Arc-compatible rails.
7. Read `docs/judge-brief.md` for the scoring map and remaining external actions.

## What is in this demo

- A static dashboard for judges and users.
- A decision receipt schema for market recommendations.
- A risk-governor model that can allow, block, or escalate a recommendation.
- A receipt case switcher that shows both capped action and blocked refusal.
- Copy/download controls for receipt JSON, proof hash, and Arc proof.
- A sanitized replay of a capped prediction-market execution adapter.
- A local reconciler script for exported Polymarket JSONL logs.
- An Arc-compatible receipt registry contract.
- A generated USDC-denominated receipt anchor proof.

The dashboard is intentionally safe: it contains no API keys, no wallet secrets, and no live trading switch.

## Product concept

SignalGuard has four layers:

1. **Market Intelligence Agent**
   Builds a thesis from market price, order-book conditions, and external context.

2. **Risk Governor**
   Applies non-negotiable controls such as max price, max notional, max live submits, liquidity checks, and lifecycle reconciliation.

3. **Execution Adapters**
   Optional adapters can submit to venues such as Polymarket, but the core product remains venue-neutral.

4. **Receipt Layer**
   Every decision becomes a JSON receipt that can be hashed for Arc-compatible attribution, audit, and USDC-denominated settlement flows.

The agent loop is explicit:

```text
observe -> score -> gate -> act/refuse -> anchor -> reconcile
```

That loop matters because the product is not just a trade signal. It is a way to prove what the agent saw, how it scored the opportunity, which hard limits were applied, whether it acted or refused, and whether the exchange lifecycle reached a terminal state.

## Circle / Arc implementation

This repo includes an Arc-compatible receipt registry:

```text
contracts/SignalGuardReceiptRegistry.sol
```

The local proof generator canonicalizes the first sample decision receipt, hashes it, and writes a public proof artifact:

```bash
node scripts/build_arc_receipt_proof.mjs
```

The generated proof lives at:

```text
data/arc_receipt_anchor.json
```

It is denominated in USDC microunits and is displayed in the dashboard's **Arc Proof** tab.

Circle / Arc are used for three concrete jobs:

- **Risk denomination:** max notional and future recommendation fees are represented in USDC.
- **Attribution:** a canonical decision receipt can be hashed and attributed to an agent/operator.
- **Settlement readiness:** the registry event creates a path for low-cost Arc settlement records without hiding the offchain reasoning trace.

The demo does not claim a production Arc deployment. It ships the contract, proof artifact, and runbook so a builder wallet can deploy the registry as the next external step.

## Run locally

From this directory:

```bash
python3 -m http.server 5177
```

Then open:

```text
http://localhost:5177
```

## Reconcile exported logs

The reconciler is read-only and works on local/exported JSONL files:

```bash
python3 scripts/reconcile_polymarket_jsonl.py path/to/trades.jsonl --out reconciled.json
```

It marks missing `result`, `fill`, or `rejected` events as unresolved instead of hiding them.

## Submission self-check

```bash
node scripts/verify_submission.mjs
node scripts/build_arc_receipt_proof.mjs --check
```

The check verifies required files, receipt structure, and common secret patterns.

## Submission docs

- `docs/requirements-check.md` maps the project against the hackathon requirements.
- `docs/judge-brief.md` is a one-page judge-oriented verification path.
- `docs/form-answers.md` contains draft answers for the submission form.
- `artifacts/signalguard-demo-v4.mp4` is the prepared male-voiced demo video with subtitles.
- `docs/demo-v4-voiceover.md` is the matching voiceover script.
- `docs/demo-script.md` is a shorter manual video script.
- `docs/deploy.md` explains how to publish the static app.
- `docs/arc-runbook.md` explains the Arc testnet deployment path.
- `docs/publication.md` lists the remaining external publishing steps.

## Demo story

The sample replay shows a capped market recommendation:

- BUY Up candidate at 0.60.
- Max notional capped at $1.20 USDC.
- One live submit maximum.
- Submit recorded without a terminal exchange receipt.
- The guard stops the runner after one submit.
- The unresolved lifecycle is surfaced for reconciliation.

This is the point of SignalGuard: unknown states are risk states, not footnotes.

## What is new versus the prior bot

SignalGuard is not a direct copy of an existing trading bot. Prior trading infrastructure is used only as an adapter pattern and sample evidence. The hackathon product is the independent intelligence, risk, receipt, and audit workbench around prediction-market agents.

## Safety

- No live trading by default.
- No secrets committed.
- No unbounded order loops.
- No averaging down.
- No hidden retries after a capped live submit.
- Missing exchange responses remain visible as unresolved states.
