#!/usr/bin/env bash
# Installs the Decluttr CLI bridge for the current user.
#   ./install.sh                    Firefox + Zen (macOS or Linux)
#   ./install.sh --chrome-id <ID>   also Chrome/Brave/Chromium/Arc for that extension id
#   ./install.sh --uninstall
set -euo pipefail

NAME="app.getdecluttr.bridge"
FIREFOX_ID="decluttr@getdecluttr.app"
HERE="$(cd "$(dirname "$0")" && pwd)"
DHOME="${DECLUTTR_HOME:-$HOME/.decluttr}"
BIN="$DHOME/bin"
CHROME_ID=""
UNINSTALL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --chrome-id) CHROME_ID="$2"; shift 2 ;;
    --uninstall) UNINSTALL=1; shift ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ "$(uname)" == "Darwin" ]]; then
  AS="$HOME/Library/Application Support"
  GECKO_DIRS=("$AS/Mozilla/NativeMessagingHosts" "$AS/zen/NativeMessagingHosts")
  CHROME_DIRS=("$AS/Google/Chrome/NativeMessagingHosts" "$AS/BraveSoftware/Brave-Browser/NativeMessagingHosts"
               "$AS/Chromium/NativeMessagingHosts" "$AS/Arc/User Data/NativeMessagingHosts")
else
  GECKO_DIRS=("$HOME/.mozilla/native-messaging-hosts" "$HOME/.zen/native-messaging-hosts")
  CHROME_DIRS=("$HOME/.config/google-chrome/NativeMessagingHosts" "$HOME/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts"
               "$HOME/.config/chromium/NativeMessagingHosts")
fi

if [[ $UNINSTALL == 1 ]]; then
  for d in "${GECKO_DIRS[@]}" "${CHROME_DIRS[@]}"; do rm -f "$d/$NAME.json"; done
  rm -rf "$BIN"
  [[ -L "$HOME/.local/bin/decluttr" ]] && rm -f "$HOME/.local/bin/decluttr"
  echo "Removed. Decision history kept in $DHOME (delete it yourself if you want)."
  exit 0
fi

PY="$(command -v python3 || true)"
[[ -x /usr/bin/python3 ]] && PY=/usr/bin/python3   # browsers launch hosts with a minimal PATH
[[ -n "$PY" ]] || { echo "python3 not found" >&2; exit 1; }

mkdir -p "$BIN" "$DHOME/inbox" "$DHOME/outbox"
chmod 700 "$DHOME" "$DHOME/inbox" "$DHOME/outbox"
for f in host.py decluttr; do
  sed "1s|.*|#!$PY|" "$HERE/$f" > "$BIN/$f"
  chmod 755 "$BIN/$f"
done

write_manifest() { # dir, allowed-key, allowed-value
  # Only for browsers that are installed (their profile folder exists),
  # except Mozilla's shared folder, which Firefox and most forks read.
  local parent; parent="$(dirname "$1")"
  if [[ ! -d "$parent" && "$1" != *Mozilla* && "$1" != *.mozilla* ]]; then return 0; fi
  mkdir -p "$1"
  cat > "$1/$NAME.json" <<JSON
{
  "name": "$NAME",
  "description": "Decluttr CLI bridge",
  "path": "$BIN/host.py",
  "type": "stdio",
  "$2": [$3]
}
JSON
  echo "  manifest: $1/$NAME.json"
}

echo "Installed host to $BIN"
for d in "${GECKO_DIRS[@]}"; do write_manifest "$d" allowed_extensions "\"$FIREFOX_ID\""; done
if [[ -n "$CHROME_ID" ]]; then
  for d in "${CHROME_DIRS[@]}"; do write_manifest "$d" allowed_origins "\"chrome-extension://$CHROME_ID/\""; done
fi

mkdir -p "$HOME/.local/bin"
ln -sf "$BIN/decluttr" "$HOME/.local/bin/decluttr"
echo "CLI: $HOME/.local/bin/decluttr"
case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) echo "  (add ~/.local/bin to PATH)";; esac
echo
echo "Next: open Decluttr Settings, turn on 'Enable the decluttr CLI', then run: decluttr status"
