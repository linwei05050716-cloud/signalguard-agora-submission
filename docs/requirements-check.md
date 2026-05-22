# Agora Requirements Check

This file maps SignalGuard against the Agora Agents Hackathon requirements visible on the Canteen x Circle hackathon page (`https://agora.thecanteenapp.com/`), checked on 2026-05-22.

## Required deliverables

| Requirement | Status | Evidence |
| --- | --- | --- |
| Public GitHub repository | Ready to publish | Source is clean, self-check passes, no secrets are required. |
| Demo video, max 3 minutes recommended | Local artifact ready | `artifacts/signalguard-demo-v4.mp4` is a 2:28 male-voiced subtitled walkthrough; upload it to Loom, YouTube, or Vimeo before final submission. |
| Live product link | Ready to deploy | Static app can be served from GitHub Pages, Cloudflare Pages, Vercel, or any static host. |
| Project submission form | Draft ready | `docs/form-answers.md` contains copy-paste answers. |
| Judge-oriented verification path | Ready | `docs/judge-brief.md` maps scoring criteria to files and artifacts. |
| Real users / validation | Needs real outreach | Use the live link with 3-5 prediction-market users or builders before final submission. Do not fabricate traction. |

## Judging criteria

| Criterion | Weight | Current fit |
| --- | ---: | --- |
| Agent sophistication | 30% | Strong: autonomous thesis, risk governor, receipt lifecycle, replay, reconciliation. |
| Traction | 30% | Weak until the live link is shared and user feedback is collected. |
| Circle tools usage | 20% | Strong local artifact: USDC-denominated risk, Arc-ready receipt registry, generated anchor proof, and explicit settlement path. Stronger after a testnet deploy. |
| Innovation | 20% | Strong: receipt-first prediction-market agents, unresolved lifecycle as explicit risk, reasoning trace as auditable product. |

## Scoring evidence by artifact

| Artifact | What it proves |
| --- | --- |
| `index.html` | Product flow, Judge Mode, agent loop, receipt view, replay, Arc proof. |
| `assets/app.js` | Receipt switching plus copy/download controls for receipts and Arc proof. |
| `data/decision_receipts.json` | Agent thesis, evidence, risk gates, action/refusal, lifecycle state, Arc receipt intent. |
| `data/arc_receipt_anchor.json` | Canonical receipt hash, USDC microunits, lifecycle status, Arc deployment target. |
| `contracts/SignalGuardReceiptRegistry.sol` | Minimal registry interface for anchoring decision receipts. |
| `scripts/reconcile_polymarket_jsonl.py` | Read-only lifecycle reconciliation instead of hiding missing exchange states. |
| `docs/judge-brief.md` | Fast judge path and honest pending external actions. |

## RFB alignment

Primary: **RFB 02 — Prediction Market Trader Intelligence**

SignalGuard targets the RFB 02 prompt by finding a candidate +EV prediction-market action, sizing it under explicit USDC limits, and producing an audit trail for both action and non-action.

Secondary: **RFB 06 — Social Trading Intelligence**

The receipt layer makes reasoning traces inspectable and copyable, so users can evaluate how an agent thinks instead of blindly mirroring trades.

## Honest current status

SignalGuard is not yet claiming a production Arc deployment or real public traction. It is a functional static demo plus an Arc-compatible receipt registry and generated proof artifact. The remaining high-impact work is:

1. Publish a public GitHub repository.
2. Deploy the static site to a public URL.
3. Upload the prepared demo video.
4. Share with real users and capture feedback.
5. Optionally deploy `SignalGuardReceiptRegistry.sol` to Arc testnet with a builder wallet.
