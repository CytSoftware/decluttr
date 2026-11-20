#!/usr/bin/env python3
"""End-to-end test for the CLI bridge, with a fake browser on the other side
of the native host. No browser or dependencies needed:

    python3 bridge/test_bridge.py
"""
import json
import os
import struct
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOST = HERE / "host.py"
CLI = HERE / "decluttr"


class FakeBrowser:
    """Plays the extension: starts host.py, answers requests from a tab table."""

    def __init__(self, home: Path):
        now = time.time() * 1000
        self.tabs = {
            101: {"id": 101, "title": "Feed | LinkedIn", "url": "https://www.linkedin.com/feed/",
                  "domain": "www.linkedin.com", "window": 2, "lastAccessed": now - 3 * 86400e3,
                  "duplicateCount": 10},
            102: {"id": 102, "title": "Positioning", "url": "https://x.gshr.page/",
                  "domain": "x.gshr.page", "window": 3, "lastAccessed": now - 4 * 3600e3},
            103: {"id": 103, "title": "Token Pass", "url": "https://vercel.com/docs/token-pass",
                  "domain": "vercel.com", "window": 1, "lastAccessed": now - 86400e3},
        }
        self.saved = []
        self.ready = threading.Event()
        env = {**os.environ, "DECLUTTR_HOME": str(home)}
        self.proc = subprocess.Popen([sys.executable, str(HOST)], stdin=subprocess.PIPE,
                                     stdout=subprocess.PIPE, env=env)
        self.send({"event": "hello", "data": {"version": "test"}})
        self.thread = threading.Thread(target=self.serve, daemon=True)
        self.thread.start()

    def send(self, msg):
        data = json.dumps(msg).encode()
        self.proc.stdin.write(struct.pack("=I", len(data)) + data)
        self.proc.stdin.flush()

    def decision(self, tab, action):
        self.send({"event": "decision", "data": {
            "ts": time.time() * 1000, "action": action, "source": "cli", "url": tab["url"],
            "title": tab["title"], "domain": tab["domain"], "ageMs": 1000,
            "isDuplicate": bool(tab.get("duplicateCount")), "duplicateCount": tab.get("duplicateCount")}})

    def serve(self):
        while True:
            raw = self.proc.stdout.read(4)
            if len(raw) < 4:
                return
            (n,) = struct.unpack("=I", raw)
            msg = json.loads(self.proc.stdout.read(n))
            if msg.get("event") == "ready":
                self.ready.set()
                continue
            cmd, ids = msg["cmd"], msg["args"].get("ids", [])
            if cmd == "tabs":
                result = list(self.tabs.values())
            elif cmd in ("close", "save", "keep"):
                done = [i for i in ids if i in self.tabs]
                for i in done:
                    self.decision(self.tabs[i], cmd)
                    if cmd == "save":
                        self.saved.append({**self.tabs[i], "savedAt": time.time() * 1000})
                    if cmd != "keep":
                        self.tabs.pop(i)
                key = {"close": "closed", "save": "saved", "keep": "kept"}[cmd]
                result = {key: done, "missing": [i for i in ids if i not in done]}
            elif cmd == "saved":
                result = self.saved
            else:
                result = {"version": "test"}
            self.send({"id": msg["id"], "ok": True, "result": result})

    def stop(self):
        if self.proc.poll() is None:
            self.proc.stdin.close()
            self.proc.wait(timeout=5)
        self.thread.join(timeout=2)
        self.proc.stdout.close()


class BridgeTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.home = Path(self.tmp.name) / "dh"
        self.browser = FakeBrowser(self.home)
        self.assertTrue(self.browser.ready.wait(5), "host never sent ready")

    def tearDown(self):
        try:
            self.browser.stop()
        except Exception:
            self.browser.proc.kill()
        self.tmp.cleanup()

    def cli(self, *args, stdin=None, check=True):
        env = {**os.environ, "DECLUTTR_HOME": str(self.home), "DECLUTTR_TIMEOUT": "5"}
        r = subprocess.run([sys.executable, str(CLI), *args], input=stdin, capture_output=True,
                           text=True, env=env, timeout=15)
        if check:
            self.assertEqual(r.returncode, 0, r.stderr)
        return r

    def test_status_and_tabs(self):
        self.assertTrue(json.loads(self.cli("status").stdout)["connected"])
        tabs = json.loads(self.cli("tabs", "--json").stdout)
        self.assertEqual({t["id"] for t in tabs}, {101, 102, 103})
        old = json.loads(self.cli("tabs", "--json", "--older-than", "2d").stdout)
        self.assertEqual([t["id"] for t in old], [101])
        dupes = json.loads(self.cli("tabs", "--json", "--dupes").stdout)
        self.assertEqual([t["id"] for t in dupes], [101])

    def test_actions_and_history(self):
        res = json.loads(self.cli("close", "-", stdin="101 999").stdout)
        self.assertEqual(res, {"closed": [101], "missing": [999]})
        self.assertEqual(json.loads(self.cli("save", "102").stdout)["saved"], [102])
        self.assertEqual(json.loads(self.cli("keep", "103").stdout)["kept"], [103])
        remaining = json.loads(self.cli("tabs", "--json").stdout)
        self.assertEqual([t["id"] for t in remaining], [103])
        self.assertEqual(len(json.loads(self.cli("saved", "--json").stdout)), 1)
        time.sleep(0.3)  # decision events are written asynchronously
        log = json.loads(self.cli("log", "--json").stdout)
        self.assertEqual([r["action"] for r in log], ["close", "save", "keep"])
        self.assertIn("www.linkedin.com", self.cli("stats").stdout)

    def test_bad_requests_are_contained(self):
        inbox = self.home / "inbox"
        (inbox / "a.json").write_text('{"id":"../../escape","cmd":"rm"}')
        (inbox / "b.json").write_text("not json")
        time.sleep(0.8)
        self.assertEqual(list(inbox.iterdir()), [])
        self.assertFalse((Path(self.tmp.name) / "escape.json").exists())
        err = json.loads((self.home / "outbox" / "escape.json").read_text())
        self.assertFalse(err["ok"])
        # bridge still works afterwards
        self.assertEqual(len(json.loads(self.cli("tabs", "--json").stdout)), 3)

    def test_disconnect_is_reported(self):
        self.browser.stop()
        r = self.cli("status", check=False)
        self.assertEqual(r.returncode, 2)
        r = self.cli("tabs", check=False)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("not connected", r.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
