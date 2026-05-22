#!/usr/bin/env python3
"""Build SignalGuard receipts from sanitized Polymarket JSONL logs.

This is intentionally read-only. It parses local/exported JSONL files and marks
missing result/fill/rejected events as an explicit unresolved lifecycle state.
"""
from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path
from typing import Any

TERMINAL_PHASES = {"result", "fill", "rejected", "settle", "resolved"}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return rows


def normalize_submit(row: dict[str, Any]) -> str:
    return "|".join([
        str(row.get("account", "")),
        str(row.get("token_id", ""))[:18],
        str(row.get("side", "")),
        str(row.get("price", "")),
        str(row.get("size", "")),
    ])


def reconcile(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    terminal_by_order = defaultdict(list)
    terminal_by_token = defaultdict(list)
    submits: list[dict[str, Any]] = []

    for row in rows:
        phase = row.get("phase", "")
        if phase == "submit":
            submits.append(row)
        if phase in TERMINAL_PHASES:
            order_id = row.get("order_id") or ""
            token_id = row.get("token_id") or ""
            if order_id:
                terminal_by_order[order_id].append(row)
            if token_id:
                terminal_by_token[token_id].append(row)

    receipts = []
    for submit in submits:
        order_id = submit.get("order_id") or ""
        token_id = submit.get("token_id") or ""
        matches = []
        if order_id:
            matches.extend(terminal_by_order.get(order_id, []))
        if token_id:
            matches.extend(terminal_by_token.get(token_id, []))

        if matches:
            status = matches[-1].get("status") or matches[-1].get("phase")
        elif order_id:
            status = "submitted_without_terminal_receipt"
        else:
            status = "submitted_without_order_id_or_terminal_receipt"

        receipts.append({
            "id": normalize_submit(submit),
            "submit": submit,
            "terminal_events": matches,
            "lifecycle_status": status,
            "risk_note": "unresolved lifecycle requires reconciliation" if not matches else "terminal event found",
        })
    return receipts


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("jsonl", type=Path)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()

    receipts = reconcile(read_jsonl(args.jsonl))
    payload = {"source": str(args.jsonl), "submit_count": len(receipts), "receipts": receipts}
    text = json.dumps(payload, indent=2, ensure_ascii=False)
    if args.out:
        args.out.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)


if __name__ == "__main__":
    main()
