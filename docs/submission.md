# Agora Submission Draft

## Project name

SignalGuard

## One-liner

A receipt-first prediction-market intelligence agent that turns recommendations into auditable decisions, applies hard risk gates, and surfaces unresolved execution states instead of hiding them.

## Category / RFB

Primary: RFB 02 — Prediction Market Trader Intelligence

Secondary: RFB 06 — Social Trading Intelligence

## Description

SignalGuard is a workbench for autonomous prediction-market agents. It helps an agent form a market thesis, decide whether an opportunity is worth acting on, pass that action through hard risk limits, and emit an auditable decision receipt that can be hashed for Arc-compatible attribution and USDC-denominated settlement flows.

The demo focuses on a prediction-market adapter. A recommendation can become a capped execution candidate only if the risk governor approves price, notional, liquidity, and submit-count limits. If the exchange does not return a terminal result, fill, or rejection, SignalGuard treats that missing lifecycle step as a first-class unresolved risk state.

The decision loop is intentionally visible:

```text
observe -> score -> gate -> act/refuse -> anchor -> reconcile
```

This makes the agent legible. Judges can verify not only that the agent found an opportunity, but also which evidence it used, what limits protected the user, whether the action was allowed or blocked, and how the final lifecycle state is represented.

## Why it matters

Most trading agents show only their picks. SignalGuard shows the chain of accountability behind a pick:

- the agent thesis,
- the evidence,
- the risk decision,
- the allowed or blocked action,
- the execution lifecycle,
- and the receipt hash that can anchor the decision for downstream users or builders.

This makes prediction-market agents safer to evaluate, copy, monetize, and audit.

## Circle / Arc angle

SignalGuard uses USDC as the native risk and settlement denomination. Its receipt layer includes an Arc-compatible Solidity registry, `SignalGuardReceiptRegistry.sol`, plus a generated anchor proof in `data/arc_receipt_anchor.json`.

Each recommendation or non-action can be canonicalized, hashed, and anchored as `DecisionReceiptAnchored`. Circle / Arc give the project three concrete primitives:

- USDC-denominated caps and future recommendation fees.
- Arc-compatible attribution for the agent/operator behind a decision receipt.
- Low-cost settlement records that point back to the complete offchain reasoning trace.

The local package does not claim a production Arc deployment. It includes the registry, proof generator, proof artifact, and deployment runbook so the final step can be performed with a builder wallet.

## What judges can verify

- Static dashboard and product flow.
- Decision receipt JSON schema.
- Visible agent loop: observe, score, gate, act/refuse, anchor, reconcile.
- Receipt case switching for capped action and blocked refusal.
- Copy/download controls for receipt JSON, proof hash, and Arc proof.
- Risk-governor states: allow, block, unresolved.
- Sanitized replay of a capped prediction-market adapter.
- Read-only JSONL reconciler that detects whether submits have terminal events.
- Arc-compatible receipt registry contract.
- Generated USDC receipt anchor proof.
- Judge brief with the scoring map: `docs/judge-brief.md`.

## Demo video outline, under 3 minutes

0:00-0:20 — Problem: market agents need accountable action, not just picks.

0:20-0:55 — Show the workbench: market thesis, observed price, estimated fair value, and edge.

0:55-1:30 — Show the risk governor: price cap, notional cap, submit cap, and why blocked trades remain useful receipts.

1:30-2:10 — Show the decision receipt JSON and replay timeline.

2:10-2:40 — Explain Arc / USDC receipt layer: hash the decision, attribute recommendations, settle fees cheaply.

2:40-3:00 — Close: SignalGuard makes prediction-market agents auditable, bounded, and composable.

## Public repo checklist

- [x] Remove all secrets and private configs.
- [x] Include README.
- [x] Include dashboard source.
- [x] Include sample receipts.
- [x] Include read-only reconciler.
- [x] Include Arc receipt registry.
- [x] Include generated receipt anchor proof.
- [x] Include local demo video artifact: `artifacts/signalguard-demo-v4.mp4`.
- [ ] Include uploaded demo video link.
- [ ] Include live product link if deployed.

## Suggested final tagline

The safest autonomous trading agent is the one that can explain both why it acted and why it refused to act.
