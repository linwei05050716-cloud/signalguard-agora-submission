# Publication Checklist

These are the external actions that remain after the local package is ready.

## 1. Create the public GitHub repo

Suggested repo name:

```text
signalguard-agora
```

Description:

```text
Receipt-first prediction-market intelligence agent for the Agora Agents Hackathon.
```

After creating an empty public repo on GitHub, run:

```bash
git remote add origin git@github.com:<your-user>/signalguard-agora.git
git push -u origin main
```

Or upload:

```text
artifacts/signalguard-agora-submission.zip
```

## 2. Deploy the static site

Recommended fastest path:

1. Enable GitHub Pages from the repo default branch root.
2. Use the GitHub Pages URL as the live product link.

Alternative hosts: Cloudflare Pages, Vercel, Netlify. Build command is empty; output directory is `.`.

## 3. Record and upload the demo video

Local video artifact:

```text
artifacts/signalguard-demo-v4.mp4
```

Source recorder:

```text
scripts/record_demo_video.mjs
```

The checked-in `artifacts/signalguard-demo-v4.mp4` is the final male-voiced video with burned-in subtitles and the updated receipt-switching flow. Use `docs/demo-v4-voiceover.md` for the generated male English voiceover, `artifacts/signalguard-demo-v4.srt` for subtitles, or `docs/demo-script.md` for a shorter manual version.

Required by the hackathon page:

```text
Loom, YouTube, or Vimeo demo video, recommended under 3 minutes.
```

## 4. Submit the form

Use:

```text
docs/form-answers.md
```

Update the GitHub repo URL, live product URL, and video URL before submitting.

Attach or reference the judge-oriented review path:

```text
docs/judge-brief.md
```

Keep traction wording honest. Do not claim public users, testnet deployment, or uploaded media until those actions are actually completed.
