# SignalGuard Judge Brief

SignalGuard is a receipt-first prediction-market intelligence agent. It is built for the Agora Agents Hackathon, primarily for RFB 02: Prediction Market Trader Intelligence.

## Fast review path

1. Open `index.html`.
2. Check **Overview** for the agent decision loop.
3. Toggle **Capped submit** and **Blocked refusal** to verify both action and non-action paths.
4. Check **Decision Receipt** for the full JSON receipt and export controls.
5. Check **Market Replay** for the capped submit lifecycle.
6. Check **Arc Proof** for the generated USDC receipt anchor and proof-copy controls.
7. Check **Judge Mode** for the scoring map and remaining external steps.

## What the agent does

The demo agent follows this loop:

```text
observe -> score -> gate -> act/refuse -> anchor -> reconcile
```

The sample capped action observes a BTC 5m direction market, estimates fair probability, verifies price and depth, applies USDC exposure limits, records one capped submit, anchors the decision receipt, and surfaces the missing exchange acknowledgement as unresolved risk.

The sample block receipt shows the opposite path: when price and edge fail the hard gates, the agent refuses to trade and still emits an auditable non-action receipt.

## Scoring map

| Criterion | Weight | Evidence |
| --- | ---: | --- |
| Agent sophistication | 30% | Agent loop, evidence-backed thesis, hard risk gates, action/refusal receipts, replay, reconciliation. |
| Traction | 30% | Honest pre-launch state plus `docs/user-validation.md` outreach plan. Needs real user feedback before final submission. |
| Circle tools usage | 20% | USDC-denominated caps, Arc-compatible registry, generated receipt anchor proof, proof-copy controls, settlement-ready receipt format. |
| Innovation | 20% | Turns the reasoning trace into the product and treats unresolved exchange states as explicit risk. |

## Verifiable files

- `data/decision_receipts.json` contains the action receipt and the block receipt.
- `data/arc_receipt_anchor.json` contains the generated receipt hash and USDC microunits.
- `contracts/SignalGuardReceiptRegistry.sol` defines the receipt anchor event.
- `scripts/build_arc_receipt_proof.mjs` generates and checks the proof.
- `scripts/reconcile_polymarket_jsonl.py` reconciles exported JSONL logs without placing orders.
- `assets/app.js` lets judges switch receipts, copy receipt JSON, copy the proof hash, and download proof artifacts.
- `artifacts/signalguard-demo-v4.mp4` is the under-three-minute narrated demo.

## Honest status

Ready locally:

- Dashboard
- Receipts
- Replay
- Reconciler
- Arc-compatible contract
- Generated proof
- Demo video
- Submission answers

External actions still required:

- Publish the GitHub repo.
- Deploy the static live link.
- Upload the demo video to Loom, YouTube, or Vimeo.
- Gather real user/builder feedback.
- Optionally deploy the receipt registry to Arc testnet with a builder wallet.

SignalGuard does not include private keys, wallet secrets, live credentials, or a live trading switch.
