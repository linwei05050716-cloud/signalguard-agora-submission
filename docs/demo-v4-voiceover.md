# SignalGuard Demo V4 Voiceover

This version matches the interactive receipt switcher and export controls added after the judge-readiness pass.

## Script

Hi, this is SignalGuard, a receipt-first prediction-market intelligence agent for Agora RFB 02.

The new version makes the agent loop visible. SignalGuard observes market data, scores the edge, gates the action, acts or refuses, anchors a receipt, and reconciles the lifecycle.

Here is the capped-submit path. The agent sees a positive but narrow edge, checks price, liquidity, and timing, then limits the action to one dollar and twenty cents of USDC.

That cap is not decorative. It is the control surface. The agent can only act inside the limits the operator can audit.

Now I switch to the blocked-refusal receipt. The same system sees a candidate, but the price is too high and the edge is negative after costs.

So the agent refuses before exposure. No order, no retry loop, and still a receipt that explains the refusal.

The decision receipt is the main artifact. It includes the thesis, evidence, risk gates, action, adapter state, and the six-step agent loop.

Judges can copy or download the active receipt directly from the interface. That makes the reasoning trace portable, not trapped inside the dashboard.

For Circle and Arc, the capped-submit receipt is canonicalized and hashed. The proof is denominated in USDC microunits and points to an Arc-compatible registry event.

The hash can be copied, the proof can be downloaded, and a builder wallet can anchor it later as DecisionReceiptAnchored.

Judge Mode maps this back to the criteria: agent sophistication, Circle and Arc usage, innovation, and the honest traction path.

The local package is safe to inspect. It has no private keys, no wallet secrets, no live trading switch, and no hidden retry behavior.

What remains external is intentionally separate: publish the repo, deploy the static link, upload this video, and collect real user feedback.

SignalGuard is not just a trading bot. It is a control plane for autonomous market agents that can prove why they acted and why they refused.
