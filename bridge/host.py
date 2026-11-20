#!/usr/bin/env python3
"""Decluttr native messaging host.

The browser starts this process when the Decluttr extension connects
(Settings > Command Line). It bridges the extension to a plain folder,
so anything that can write a file can drive Decluttr:

    $DECLUTTR_HOME (default ~/.decluttr)
      inbox/<id>.json     requests written by the CLI  {"id","cmd","args"}
      outbox/<id>.json    responses from the extension {"id","ok","result"|"error"}
      decisions.jsonl     every close/keep/save/undo, from swipes and the CLI
      status.json         heartbeat while the browser is connected

A folder instead of a socket means the CLI also works from sandboxes and
VMs that only see a mounted copy of the folder.

Stdlib only. Messages on stdio are 4-byte native-endian length + UTF-8 JSON.
"""
import json
import os
import signal
import struct
import sys
import threading
import time
from pathlib import Path

HOME = Path(os.environ.get("DECLUTTR_HOME", Path.home() / ".decluttr"))
INBOX = HOME / "inbox"
OUTBOX = HOME / "outbox"
STATUS = HOME / "status.json"
DECISIONS = HOME / "decisions.jsonl"

COMMANDS = {"ping", "tabs", "close", "keep", "save", "focus", "saved", "log"}
MAX_REQUEST_BYTES = 64 * 1024
OUTBOX_TTL_S = 600
DECISIONS_MAX_BYTES = 5 * 1024 * 1024  # rotate: keep the newest half

_out_lock = threading.Lock()
_state = {"version": None, "since": time.time()}
_stop = threading.Event()
_status_lock = threading.Lock()


def write_json_atomic(path: Path, obj) -> None:
    tmp = path.with_name(f".{path.name}.{os.getpid()}.{threading.get_ident()}.tmp")
    tmp.write_text(json.dumps(obj, ensure_ascii=False))
    os.chmod(tmp, 0o600)
    os.replace(tmp, path)


def send(msg) -> None:
    data = json.dumps(msg).encode("utf-8")
    with _out_lock:
        sys.stdout.buffer.write(struct.pack("=I", len(data)))
        sys.stdout.buffer.write(data)
        sys.stdout.buffer.flush()


def read_message():
    raw = sys.stdin.buffer.read(4)
    if len(raw) < 4:
        return None
    (length,) = struct.unpack("=I", raw)
    data = sys.stdin.buffer.read(length)
    if len(data) < length:
        return None
    return json.loads(data.decode("utf-8"))


def write_status(connected: bool) -> None:
    with _status_lock:
        write_json_atomic(
            STATUS,
            {
                "connected": connected,
                "pid": os.getpid(),
                "extensionVersion": _state["version"],
                "since": _state["since"],
                "heartbeat": time.time(),
            },
        )


def safe_id(raw) -> str:
    return "".join(c for c in str(raw) if c.isalnum() or c in "-_")[:64]


def append_decision(record) -> None:
    with open(DECISIONS, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    os.chmod(DECISIONS, 0o600)
    if DECISIONS.stat().st_size > DECISIONS_MAX_BYTES:
        lines = DECISIONS.read_text(encoding="utf-8").splitlines(keepends=True)
        tmp = DECISIONS.with_name(".decisions.jsonl.tmp")
        tmp.write_text("".join(lines[len(lines) // 2 :]), encoding="utf-8")
        os.replace(tmp, DECISIONS)


def from_browser() -> None:
    """Responses and events coming from the extension."""
    while not _stop.is_set():
        try:
            msg = read_message()
        except (OSError, ValueError):
            msg = None
        if msg is None:  # browser closed the port
            _stop.set()
            return
        if "event" in msg:
            if msg["event"] == "hello":
                _state["version"] = (msg.get("data") or {}).get("version")
                write_status(True)
            elif msg["event"] == "decision":
                append_decision(msg.get("data"))
        elif isinstance(msg.get("id"), str):
            rid = safe_id(msg["id"])
            if rid:
                write_json_atomic(OUTBOX / f"{rid}.json", msg)


def to_browser() -> None:
    """Requests dropped into inbox/ by the CLI."""
    while not _stop.is_set():
        try:
            _pump()
        except Exception as e:  # never let one bad file kill the bridge
            print(f"decluttr host: {e!r}", file=sys.stderr)
        _stop.wait(0.25)


_timers = {"beat": 0.0, "sweep": 0.0}


def _pump() -> None:
    now = time.time()
    if now - _timers["beat"] > 5:
        write_status(True)
        _timers["beat"] = now
    if now - _timers["sweep"] > 60:
        for p in OUTBOX.glob("*.json"):
            try:
                if now - p.stat().st_mtime > OUTBOX_TTL_S:
                    p.unlink()
            except OSError:
                pass
        _timers["sweep"] = now

    for p in sorted(INBOX.glob("*.json")):
        try:
            if p.stat().st_size > MAX_REQUEST_BYTES:
                p.unlink()
                continue
            req = json.loads(p.read_text(encoding="utf-8"))
            p.unlink()
        except (OSError, ValueError):
            try:
                p.unlink()
            except OSError:
                pass
            continue
        rid = safe_id(req.get("id", "")) if isinstance(req, dict) else ""
        if not rid:
            continue
        cmd = req.get("cmd")
        if cmd not in COMMANDS:
            write_json_atomic(
                OUTBOX / f"{rid}.json",
                {"id": rid, "ok": False, "error": f"unknown command: {cmd}"},
            )
            continue
        args = req.get("args") if isinstance(req.get("args"), dict) else {}
        send({"id": rid, "cmd": cmd, "args": args})


def _on_term(signum, frame):
    _stop.set()
    try:
        write_status(False)
    finally:
        os._exit(0)


def main() -> None:
    signal.signal(signal.SIGTERM, _on_term)
    signal.signal(signal.SIGINT, _on_term)
    for d in (HOME, INBOX, OUTBOX):
        d.mkdir(parents=True, exist_ok=True)
        os.chmod(d, 0o700)
    write_status(True)
    send({"event": "ready", "data": {"home": str(HOME)}})
    t = threading.Thread(target=to_browser, daemon=True)
    t.start()
    try:
        from_browser()
    finally:
        _stop.set()
        write_status(False)


if __name__ == "__main__":
    main()
