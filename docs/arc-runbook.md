# Arc / Circle Runbook

SignalGuard is built to make the Arc path explicit without committing private keys.

## What is already implemented

- `contracts/SignalGuardReceiptRegistry.sol`
- `scripts/build_arc_receipt_proof.mjs`
- `data/arc_receipt_anchor.json`
- USDC-denominated risk and receipt fields in `data/decision_receipts.json`
- Arc Proof view in the dashboard

## Builder setup

The Agora page recommends installing the ARC CLI:

```bash
uv tool install git+https://github.com/the-canteen-dev/ARC-cli
```

It also recommends joining the Canteen Discord and Arc Builder Discord, mentioning `Canteen + Agora` in the Arc Builder registration flow.

## Testnet deployment path

1. Create or choose a builder wallet.
2. Fund it with Arc testnet resources through the hackathon / builder flow.
3. Deploy `contracts/SignalGuardReceiptRegistry.sol`.
4. Anchor the generated proof hash:

```text
receiptHash: data/arc_receipt_anchor.json -> receipt.hash
receiptId: sg-demo-20260521-095646
market: BTC 5m direction
action: allow_capped_submit
maxNotionalMicrousd: 1200000
```

## Safety

Do not commit private keys, seed phrases, wallet exports, production API keys, or live trading credentials. The repo is safe to publish because all Arc and execution artifacts are generated from sanitized local data.
