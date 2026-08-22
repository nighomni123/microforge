# Prompt: Kill / Improve / Scale Review

Run per live tool at day 7 and day 14 (Sunday review).

```text
Act as a portfolio manager for micro web tools. Here is a tool's data:

Tool: [SLUG + one-line description]
Age: [days] | Sessions: [n] | Organic impressions/clicks trend: [numbers]
Bounce rate: [%] | Median time on page: [t]
tool_compute events/session: [n] | related_click rate: [%]
Ad RPM (if enabled): [$] | Revenue total: [$]
Search position for primary keyword: [#]

Decision framework:
- KILL if organic trend flat-to-down AND bounce > 85% AND no related_clicks after ~500 sessions
- IMPROVE if traffic exists but engagement is weak (pick exactly ONE lever)
- SCALE if returning visitors grow and revenue-per-session positive

Deliver:
1. Verdict: kill / improve / scale — with the single number that drove it
2. If improve: the ONE highest-leverage change (title? FAQ? placement? speed?)
3. If scale: which sibling tool to build next from the same template and why
4. What data point would have changed your verdict — so I can track it properly
```
