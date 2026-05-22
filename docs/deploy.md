# Deployment Runbook

SignalGuard is a static app. No secrets, server process, or build step is required.

## Local verification

```bash
node scripts/verify_submission.mjs
node scripts/build_arc_receipt_proof.mjs --check
python3 -m http.server 5177
```

Open:

```text
http://127.0.0.1:5177/
```

## GitHub Pages

1. Publish this directory as a public GitHub repo.
2. In the repo settings, enable GitHub Pages from the default branch root.
3. Use the generated Pages URL as the live product link.

The `.nojekyll` file is included so GitHub Pages serves the static files without Jekyll processing.

## Cloudflare Pages / Vercel / Netlify

Use these settings:

```text
Framework preset: None / Static
Build command: none
Output directory: .
```

## Final form fields

After deployment, update:

- `docs/form-answers.md` GitHub repository URL
- `docs/form-answers.md` live product link
- `docs/submission.md` public repo checklist
- `README.md` live link section
