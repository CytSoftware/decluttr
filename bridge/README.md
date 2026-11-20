# Decluttr CLI bridge

Control Decluttr from the terminal: list tabs, close, keep or save them, and read the history of every swipe. Useful for scripts and for AI agents that triage tabs for you.

```
$ decluttr tabs --older-than 2d
  4121    3d  w2   x10  www.linkedin.com              Feed | LinkedIn
  4188    2d  w1        vercel.com                    Token Pass
$ decluttr close 4121 4188
{"closed": [4121, 4188], "missing": []}
$ decluttr stats --since 30d
domain                             close  keep  save  close%
www.linkedin.com                      14     1     0     93%
```

## Install (macOS / Linux)

1. `./bridge/install.sh` (Firefox and Zen; add `--chrome-id <extension id>` for Chrome, Brave, Chromium or Arc).
2. In Decluttr Settings, turn on **Enable the decluttr CLI** and accept the permission prompt.
3. `decluttr status` should print `"connected": true`.

Needs `python3` (stdlib only). Uninstall with `./bridge/install.sh --uninstall`.

## Commands

| Command | What it does |
|---|---|
| `decluttr status` | Is the browser connected (exit 0) or not (exit 2) |
| `decluttr tabs [--json] [--older-than 2d] [--domain x] [--dupes]` | List triageable tabs (pinned and excluded tabs never appear) |
| `decluttr close ID...` | Close tabs. Pass `-` to read ids from stdin |
| `decluttr save ID...` | Save for later, then close |
| `decluttr keep ID...` | Record a keep decision (tab stays open) |
| `decluttr focus ID` | Switch to a tab |
| `decluttr saved [--json]` | Saved-for-later list |
| `decluttr log [--since 7d] [--json]` | Every close/keep/save/undo, from swipes and the CLI |
| `decluttr stats [--since 30d]` | Keep/close/save counts per domain |

## How it works

```
decluttr CLI ──writes──▶ ~/.decluttr/inbox/<id>.json
                                   │
              host.py (started by the browser via native messaging)
                                   │ stdio
                         Decluttr background script ──▶ browser.tabs
                                   │
decluttr CLI ◀──reads─── ~/.decluttr/outbox/<id>.json
```

The CLI talks to a folder, not a socket, so it also works from a VM or sandbox that mounts `~/.decluttr` (set `DECLUTTR_HOME` to the mount path). The host writes a heartbeat to `status.json` every 5s while the browser is open.

Every swipe in the deck is also logged (`decisions.jsonl` in the bridge folder, plus the last 5,000 in extension storage), with domain, title, tab age and duplicate count. That history is what an agent uses to learn which tabs you keep.

## Security

- The bridge is off until you grant the optional `nativeMessaging` permission.
- Only the Decluttr extension id may start the host.
- `~/.decluttr` is created `0700`; any process running as your user can drive the bridge, the same as any local CLI.
- Pinned and excluded tabs are never listed or closed.
