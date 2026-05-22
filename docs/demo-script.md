# 3-Minute Demo Script

## 0:00-0:20 — Hook

Prediction-market agents should not be judged only by whether they call buy or sell. The important question is whether a user can audit why the agent acted, why it refused to act, and what happened after execution.

This is SignalGuard: a receipt-first intelligence workbench for prediction-market agents.

## 0:20-0:55 — Agent thesis

Here the agent is watching a short-horizon market. It estimates fair probability, compares that to the market ask, and builds a thesis from price action, direction hold, depth, and timing.

The agent is allowed to recommend, but it is not allowed to trade by itself yet.

## 0:55-1:30 — Risk governor

Every recommendation goes through hard controls: max price, max notional, max live submits, liquidity checks, and lifecycle checks.

This example is capped at $1.20 USDC and one live submit. Another example is blocked because the price is too high and edge is negative.

## 1:30-2:10 — Decision receipt and replay

Every decision becomes a JSON receipt. It includes the market, the agent thesis, evidence, risk limits, intended action, adapter status, and a receipt hash.

The replay shows the full lifecycle. If an exchange does not return a result, fill, or rejection, SignalGuard does not hide that. It marks the state as unresolved for reconciliation.

## 2:10-2:40 — Arc / USDC layer

The receipt layer is designed for Arc-compatible rails. In the Arc Proof tab, the app shows the generated receipt hash, the USDC max notional, and the registry event that would anchor the receipt on Arc testnet.

This matters because the reasoning trace itself becomes a product. Users can evaluate and copy how an agent thinks, not just blindly copy a trade.

## 2:40-3:00 — Close

SignalGuard makes prediction-market agents bounded, auditable, and composable. It is not a black-box trading bot. It is the control plane around autonomous market action.
