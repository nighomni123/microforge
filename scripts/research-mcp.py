#!/usr/bin/env python3
"""Parallel search-MCP research client. Usage: mcp.py "<objective>" "q1" "q2" ..."""
import json, sys, time, urllib.request, urllib.error

BASE = "https://search.parallel.ai/mcp"
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
    "User-Agent": "microforge-research/1.0",
}

def post(payload, session=None):
    headers = dict(HEADERS)
    if session:
        headers["Mcp-Session-Id"] = session
    req = urllib.request.Request(BASE, data=json.dumps(payload).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return r.headers.get("Mcp-Session-Id"), r.read().decode()
    except urllib.error.HTTPError as e:
        return None, f"__HTTP_{e.code}__ {e.read().decode()[:200]}"

def parse(body):
    if "\ndata:" in body[:200] or body.startswith("event:") or body.startswith("data:"):
        for line in body.splitlines():
            if line.startswith("data:"):
                body = line[5:].strip()
                break
    return json.loads(body)

def search(objective, queries):
    last = None
    for attempt in range(3):
        sid, body = post({"jsonrpc": "2.0", "id": 1, "method": "initialize",
                          "params": {"protocolVersion": "2025-03-26", "capabilities": {},
                                     "clientInfo": {"name": "microforge", "version": "1.0"}}})
        if not sid:
            last = Exception(body)
            time.sleep(3 * (attempt + 1))
            continue
        post({"jsonrpc": "2.0", "method": "notifications/initialized"}, sid)
        _, rbody = post({"jsonrpc": "2.0", "id": 2, "method": "tools/call",
                         "params": {"name": "web_search", "arguments": {
                             "objective": objective, "search_queries": queries,
                             "max_results": 8, "max_chars_per_result": 700}}}, sid)
        try:
            d = parse(rbody)
            txt = d["result"]["content"][0]["text"]
            data = json.loads(txt) if isinstance(txt, str) else txt
            return data
        except Exception as e:
            last = Exception(f"{e} :: {rbody[:300]}")
            time.sleep(3 * (attempt + 1))
    raise last

def main():
    objective, queries = sys.argv[1], sys.argv[2:]
    data = search(objective, queries)
    for r in data.get("results", []):
        print(f"- {r.get('title','')[:100]}")
        print(f"  {r.get('url','')}")
        exc = " ".join((r.get("excerpts") or [""])[:1])
        print(f"  {exc[:450].replace(chr(10), ' ')}")

if __name__ == "__main__":
    main()
