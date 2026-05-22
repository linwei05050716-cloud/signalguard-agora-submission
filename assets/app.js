const fallbackReceipts = [
  {
    id: "sg-demo-20260521-095646",
    project: "SignalGuard",
    receipt_version: "agora-0.1",
    market: {
      venue: "prediction-market adapter",
      title: "BTC 5m direction",
      outcome: "Up",
      observed_price: 0.6,
      estimated_fair_probability: 0.642,
      edge: 0.042
    },
    agent_thesis: {
      summary: "Short-window upward displacement persisted long enough to pass the signal gate, but execution remains capped because the market is thin and time-sensitive.",
      evidence: [
        "direction held for 106 seconds",
        "absolute move exceeded live threshold",
        "two-sided depth check passed",
        "ask remained inside configured price range"
      ],
      confidence: "medium"
    },
    agent_loop: [
      {
        stage: "observe",
        input: "price, momentum, time in market, and two-sided depth",
        output: "candidate market state"
      },
      {
        stage: "score",
        input: "observed price 0.60 versus estimated fair probability 0.642",
        output: "positive but narrow edge"
      },
      {
        stage: "gate",
        input: "price cap, USDC notional cap, liquidity, and one-submit limit",
        output: "allow capped submit"
      },
      {
        stage: "act",
        input: "approved BUY Up candidate",
        output: "single capped submit, no repeat"
      },
      {
        stage: "anchor",
        input: "canonical decision receipt",
        output: "Arc-ready USDC receipt proof"
      },
      {
        stage: "reconcile",
        input: "submit without terminal exchange acknowledgement",
        output: "unresolved lifecycle surfaced for review"
      }
    ],
    risk_governor: {
      action: "allow_capped_submit",
      max_buy_price: 0.68,
      max_notional_usdc: 1.2,
      max_live_submits: 1,
      hard_blocks: [
        "no live execution without explicit cap",
        "no repeat submit after one live action",
        "no unbounded martingale or averaging down"
      ]
    },
    execution_adapter: {
      mode: "replay_from_sanitized_log",
      side: "BUY",
      price: 0.6,
      size: 2,
      order_id: "",
      lifecycle_status: "submitted_without_result_receipt",
      note: "The demo treats missing exchange acknowledgement as a first-class risk state rather than hiding it."
    },
    arc_receipt_layer: {
      settlement_currency: "USDC",
      intent: "hash decision receipt for low-cost attribution and audit on Arc-compatible rails",
      max_notional_microusd: 1200000,
      anchor_proof_ref: "data/arc_receipt_anchor.json"
    }
  },
  {
    id: "sg-demo-risk-block",
    project: "SignalGuard",
    receipt_version: "agora-0.1",
    market: {
      venue: "prediction-market adapter",
      title: "BTC 5m direction",
      outcome: "Down",
      observed_price: 0.74,
      estimated_fair_probability: 0.651,
      edge: -0.089
    },
    agent_thesis: {
      summary: "The model found directionality, but the price exceeded the capped-entry envelope and the edge was negative after fees.",
      evidence: [
        "ask price exceeded hard cap",
        "expected edge below threshold",
        "depth became one-sided"
      ],
      confidence: "low"
    },
    agent_loop: [
      {
        stage: "observe",
        input: "price, edge estimate, and depth snapshot",
        output: "candidate market state"
      },
      {
        stage: "score",
        input: "observed price 0.74 versus estimated fair probability 0.651",
        output: "negative edge after costs"
      },
      {
        stage: "gate",
        input: "0.68 max buy price and liquidity checks",
        output: "block before submit"
      },
      {
        stage: "act",
        input: "blocked candidate",
        output: "no order, no exposure"
      },
      {
        stage: "anchor",
        input: "non-action receipt",
        output: "auditable refusal record"
      },
      {
        stage: "reconcile",
        input: "no submit event",
        output: "terminal state is blocked before execution"
      }
    ],
    risk_governor: {
      action: "block",
      max_buy_price: 0.68,
      max_notional_usdc: 1.2,
      max_live_submits: 1,
      hard_blocks: [
        "price 0.74 exceeds cap 0.68",
        "negative edge after estimated costs"
      ]
    },
    execution_adapter: {
      mode: "simulation",
      side: "BUY",
      price: 0.74,
      size: 0,
      order_id: "",
      lifecycle_status: "blocked_before_submit",
      note: "The safest trade is often the one the agent refuses to place."
    },
    arc_receipt_layer: {
      settlement_currency: "USDC",
      intent: "publish a non-execution receipt so downstream users can audit why no trade occurred",
      max_notional_microusd: 0,
      anchor_proof_ref: "data/arc_receipt_anchor.json"
    }
  }
];

const fallbackTimeline = [
  {
    ts: "09:56:25 CST",
    title: "Capped live run armed",
    body: "Agent adapter launched with $1.20 max notional, 0.68 max buy price, one live submit, and a 900 second timeout."
  },
  {
    ts: "09:56:46 CST",
    title: "Signal converted to capped action",
    body: "BUY Up candidate at 0.60 passed the hard risk gates. The action was limited to size 2.0 and one submit only."
  },
  {
    ts: "09:56:47 CST",
    title: "Submit recorded",
    body: "A submit event was written to the execution log. The exchange order id was empty, so the lifecycle remains unresolved until reconciliation."
  },
  {
    ts: "10:00:06 CST",
    title: "Guard stopped the runner",
    body: "The guard detected submit_count new=1 and stopped both bot and guard processes. No repeat action was allowed."
  },
  {
    ts: "Current demo state",
    title: "Unknown is treated as risk",
    body: "SignalGuard surfaces missing result/fill/rejected receipts as an explicit unresolved state for operator review and reconciliation."
  }
];

const fallbackArcProof = {
  proof_version: "signalguard-arc-anchor-0.1",
  network: {
    target: "Arc testnet",
    settlement_currency: "USDC",
    note: "Generated without a private key. Ready for Arc deployment once a builder wallet is provided."
  },
  contract: {
    path: "contracts/SignalGuardReceiptRegistry.sol",
    event: "DecisionReceiptAnchored(bytes32,address,string,string,string,uint256,uint256)"
  },
  receipt: {
    id: "sg-demo-20260521-095646",
    hash_algorithm: "sha256",
    hash: "pending",
    market: "BTC 5m direction",
    action: "allow_capped_submit",
    max_notional_usdc: 1.2,
    max_notional_microusd: 1200000
  },
  audit_state: {
    lifecycle_status: "submitted_without_result_receipt",
    terminal_exchange_receipt_present: false,
    unresolved_states_are_visible: true
  }
};

const appState = {
  receipts: fallbackReceipts,
  activeReceiptIndex: 0,
  arcProof: fallbackArcProof
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function activeReceipt() {
  return appState.receipts[appState.activeReceiptIndex] || appState.receipts[0] || fallbackReceipts[0];
}

function receiptLabel(receipt) {
  return receipt.risk_governor?.action === "block" ? "Blocked refusal" : "Capped submit";
}

function receiptTitle(receipt) {
  return receipt.risk_governor?.action === "block"
    ? "Blocked before exposure"
    : "Allowed action with unresolved lifecycle";
}

function receiptSummary(receipt) {
  if (receipt.risk_governor?.action === "block") {
    return "The agent found a candidate, rejected it under hard price and edge gates, and still produced a receipt.";
  }
  return "The agent passed hard risk gates, submitted once, and left an auditable unresolved state for reconciliation.";
}

function formatUsdc(value) {
  return `$${Number(value || 0).toFixed(2)} USDC`;
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function renderReceiptSwitchers() {
  const buttons = appState.receipts.map((receipt, index) => `
    <button class="segment-btn ${index === appState.activeReceiptIndex ? "active" : ""}" data-receipt-index="${index}">
      ${escapeHtml(receiptLabel(receipt))}
    </button>
  `).join("");

  document.querySelectorAll(".receipt-switcher").forEach(el => {
    el.innerHTML = buttons;
  });
}

function renderOverview(receipt) {
  setText("#case-label", receiptLabel(receipt));
  setText("#case-title", receiptTitle(receipt));
  setText("#case-summary", receiptSummary(receipt));
  setText("#current-action", receipt.risk_governor?.action === "block" ? "Blocked before submit" : "Watchlist + capped buy candidate");
  setText("#current-outcome", receipt.market?.outcome || "Unknown");
  setText("#current-notional", formatUsdc(receipt.risk_governor?.action === "block" ? 0 : receipt.risk_governor?.max_notional_usdc));
  setText("#current-confidence", `${receipt.agent_thesis?.confidence || "unknown"} confidence`);

  const riskEl = document.querySelector("#risk-checks");
  if (!riskEl) return;

  if (receipt.risk_governor?.action === "block") {
    riskEl.innerHTML = `
      <div class="checkline warn">Price cap blocked: ask ${receipt.market?.observed_price} > ${receipt.risk_governor?.max_buy_price}</div>
      <div class="checkline warn">Edge blocked: ${(Number(receipt.market?.edge || 0) * 100).toFixed(1)}% after costs</div>
      <div class="checkline pass">Exposure protected: no order submitted</div>
      <div class="checkline pass">Lifecycle terminal: blocked before execution</div>
    `;
    return;
  }

  riskEl.innerHTML = `
    <div class="checkline pass">Price cap passed: ask ${receipt.market?.observed_price} <= ${receipt.risk_governor?.max_buy_price}</div>
    <div class="checkline pass">Exposure cap passed: ${formatUsdc(receipt.risk_governor?.max_notional_usdc)} max</div>
    <div class="checkline pass">Submit cap passed: one live action only</div>
    <div class="checkline warn">Lifecycle pending: no result/fill receipt yet</div>
  `;
}

function renderReceipt(receipt) {
  const receiptEl = document.querySelector("#receipt-json");
  if (receiptEl) receiptEl.textContent = JSON.stringify(receipt, null, 2);
}

function renderAgentLoop(receipt) {
  const loopEl = document.querySelector("#agent-loop");
  if (!loopEl) return;
  const loop = receipt.agent_loop || fallbackReceipts[0].agent_loop;
  loopEl.innerHTML = loop.map((item, index) => `
    <div class="loop-step">
      <span class="loop-index">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(item.stage)}</strong>
        <p><b>Input:</b> ${escapeHtml(item.input)}</p>
        <p><b>Output:</b> ${escapeHtml(item.output)}</p>
      </div>
    </div>
  `).join("");
}

function renderTimeline(timeline) {
  const timelineEl = document.querySelector("#timeline");
  if (!timelineEl) return;
  timelineEl.innerHTML = timeline.map(item => `
    <li>
      <time>${escapeHtml(item.ts)}</time>
      <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.body)}</p></div>
    </li>
  `).join("");
}

function renderArcProof(proof) {
  const proofEl = document.querySelector("#arc-proof-json");
  if (proofEl) proofEl.textContent = JSON.stringify(proof, null, 2);

  const values = {
    "#arc-network": proof.network?.target,
    "#arc-currency": proof.network?.settlement_currency,
    "#arc-receipt-id": proof.receipt?.id,
    "#arc-notional": formatUsdc(proof.receipt?.max_notional_usdc),
    "#arc-lifecycle": proof.audit_state?.lifecycle_status,
    "#arc-terminal": proof.audit_state?.terminal_exchange_receipt_present ? "present" : "missing / unresolved"
  };

  Object.entries(values).forEach(([selector, value]) => {
    setText(selector, value || "Unknown");
  });
}

function renderAll() {
  const receipt = activeReceipt();
  renderReceiptSwitchers();
  renderOverview(receipt);
  renderReceipt(receipt);
  renderAgentLoop(receipt);
  renderArcProof(appState.arcProof);
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return fallback;
  }
}

function downloadJson(filename, data) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text, statusSelector) {
  const statusEl = document.querySelector(statusSelector);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  if (statusEl) {
    statusEl.textContent = "Copied";
    window.setTimeout(() => {
      statusEl.textContent = "";
    }, 1800);
  }
}

async function boot() {
  appState.receipts = await loadJson("data/decision_receipts.json", fallbackReceipts);
  const timeline = await loadJson("data/timeline.json", fallbackTimeline);
  appState.arcProof = await loadJson("data/arc_receipt_anchor.json", fallbackArcProof);
  renderTimeline(timeline);
  renderAll();
}

function activateView(view) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach(panel => {
    panel.classList.toggle("active", panel.id === `view-${view}`);
  });
}

document.addEventListener("click", event => {
  const receiptButton = event.target.closest("[data-receipt-index]");
  if (receiptButton) {
    appState.activeReceiptIndex = Number(receiptButton.dataset.receiptIndex);
    renderAll();
    return;
  }

  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) {
    const mode = copyButton.dataset.copy;
    if (mode === "receipt") {
      copyText(JSON.stringify(activeReceipt(), null, 2), "#receipt-copy-status");
    } else if (mode === "hash") {
      copyText(appState.arcProof.receipt?.hash || "", "#proof-copy-status");
    } else if (mode === "proof") {
      copyText(JSON.stringify(appState.arcProof, null, 2), "#proof-copy-status");
    }
    return;
  }

  const downloadButton = event.target.closest("[data-download]");
  if (downloadButton) {
    const mode = downloadButton.dataset.download;
    if (mode === "receipt") {
      downloadJson(`${activeReceipt().id || "signalguard-receipt"}.json`, activeReceipt());
    } else if (mode === "proof") {
      downloadJson("signalguard-arc-proof.json", appState.arcProof);
    }
  }
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => activateView(button.dataset.view));
});

document.querySelectorAll("[data-open-view]").forEach(trigger => {
  trigger.addEventListener("click", () => activateView(trigger.dataset.openView));
});

boot();
