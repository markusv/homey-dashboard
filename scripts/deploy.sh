#!/usr/bin/env bash
# Deploy Homey dashboard from your Mac to the living-room Pi, then reboot both kiosks.
#
# Screens:
#   Stue  (pi@192.168.68.91)  official Raspberry Pi 7" touch v1, 800x480, kiosk /
#   Entre (rpi@192.168.68.99) 13.1" touch, 1920x1080, kiosk /entre (no Node)
#
# Security: uses existing SSH keys only. Never prompts for a password
# (BatchMode). Do not put passwords, tokens, or private keys in this file.
#
# One-time on your Mac (you type any password locally; the agent never sees it):
#   ssh-copy-id pi@192.168.68.91
#   ssh-copy-id rpi@192.168.68.99
#   ssh-add --apple-use-keychain   # optional: forward this Mac's GitHub key during deploy
#
# GitHub on the Pi: prefer a passphrase-less read-only deploy key for `git pull`.
# This script also forwards your Mac ssh-agent so deploy stays non-interactive.
#
# Usage (from the repo root):
#   npm run deploy
#   ./scripts/deploy.sh
#
# Optional env:
#   MAIN_PI     default pi@192.168.68.91
#   ENTRE_PI    default rpi@192.168.68.99
#   APP_DIR     default /home/pi/Projects/homey-dashboard
#   SKIP_ENTRE=1   skip rebooting the entre kiosk
#   SKIP_VERIFY=1  skip HTTP 200 checks after the main Pi is back
#
# Deploys origin/main. This Mac and the main Pi must both be on main.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MAIN_PI="${MAIN_PI:-pi@192.168.68.91}"
ENTRE_PI="${ENTRE_PI:-rpi@192.168.68.99}"
APP_DIR="${APP_DIR:-/home/pi/Projects/homey-dashboard}"
BRANCH="main"
SKIP_ENTRE="${SKIP_ENTRE:-0}"
SKIP_VERIFY="${SKIP_VERIFY:-0}"
SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=10 -o ServerAliveInterval=15)
SSH_GIT_OPTS=("${SSH_OPTS[@]}" -o ForwardAgent=yes)

main_host="${MAIN_PI#*@}"
VERIFY_BASE_URL="${VERIFY_BASE_URL:-http://${main_host}}"

ssh_pi() {
  # -n: do not read stdin (otherwise later ssh can consume the rest of the script)
  ssh -n "${SSH_OPTS[@]}" "$@"
}

ssh_pi_git() {
  ssh "${SSH_GIT_OPTS[@]}" "$@"
}

die() {
  echo "error: $*" >&2
  exit 1
}

ensure_mac_agent() {
  if ssh-add -l >/dev/null 2>&1; then
    echo "SSH agent has keys (forwarded to the Pi for GitHub)"
    return 0
  fi
  ssh-add --apple-load-keychain >/dev/null 2>&1 || ssh-add --apple-use-keychain >/dev/null 2>&1 || true
  if ssh-add -l >/dev/null 2>&1; then
    echo "SSH agent has keys (forwarded to the Pi for GitHub)"
    return 0
  fi
  cat >&2 <<EOF
No SSH keys in the agent. The Pi cannot unlock its own GitHub key without a passphrase.

On this Mac (passphrase stays in your terminal):
  ssh-add --apple-use-keychain
  ssh-add -l
EOF
  exit 1
}

preflight_ssh() {
  local target="$1"
  if ssh_pi "$target" true; then
    echo "SSH key auth OK: $target"
    return 0
  fi
  cat >&2 <<EOF
Cannot SSH to $target with a key (no password prompt will be shown).

On this Mac, set up key login yourself (the password stays in your terminal):
  ssh-copy-id $target
  ssh -o BatchMode=yes $target true
EOF
  exit 1
}

wait_for_ssh() {
  local target="$1"
  local timeout="${2:-240}"
  local start
  start="$(date +%s)"
  echo "Waiting for SSH on $target ..."
  while true; do
    if ssh -n "${SSH_OPTS[@]}" -o ConnectTimeout=5 "$target" true 2>/dev/null; then
      echo "SSH is up: $target"
      return 0
    fi
    if (( $(date +%s) - start > timeout )); then
      die "timed out waiting for SSH on $target"
    fi
    sleep 5
  done
}

wait_for_http() {
  local url="$1"
  local timeout="${2:-300}"
  local start
  start="$(date +%s)"
  echo "Waiting for HTTP 200: $url ..."
  while true; do
    if curl -fs -o /dev/null --connect-timeout 5 --max-time 10 "$url" 2>/dev/null; then
      echo
      echo "HTTP OK: $url"
      return 0
    fi
    if (( $(date +%s) - start > timeout )); then
      die "timed out waiting for $url"
    fi
    printf '.'
    sleep 5
  done
}

reboot_pi() {
  local target="$1"
  echo "Rebooting $target ..."
  # Reboot drops the SSH connection (often exit 255). sudo -n never asks for a password.
  set +e
  ssh_pi "$target" "sudo -n /sbin/reboot"
  local code=$?
  set -e
  if (( code == 0 || code == 255 )); then
    return 0
  fi
  die "reboot failed on $target (exit $code). On that Pi, allow passwordless reboot, e.g. sudoers: ${target%%@*} ALL=NOPASSWD: /sbin/reboot"
}

echo "Deploy branch: $BRANCH"
echo "Main Pi:       $MAIN_PI  ($APP_DIR)"
echo "Entre Pi:      $ENTRE_PI"

local_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$local_branch" != "main" ]]; then
  die "this Mac must be on main (currently $local_branch)"
fi

preflight_ssh "$MAIN_PI"
if [[ "$SKIP_ENTRE" != "1" ]]; then
  preflight_ssh "$ENTRE_PI"
fi
ensure_mac_agent

echo "Pull + install + build on $MAIN_PI ..."
ssh_pi_git "$MAIN_PI" \
  "APP_DIR=$(printf '%q' "$APP_DIR") BRANCH=$(printf '%q' "$BRANCH") bash -s" <<'REMOTE'
set -euo pipefail

if ssh-add -l >/dev/null 2>&1; then
  # Ignore the Pi's passphrase-protected GitHub key; use the Mac agent.
  export GIT_SSH_COMMAND="ssh -o BatchMode=yes -o IdentitiesOnly=no -F /dev/null"
  echo "Using forwarded Mac SSH agent for GitHub"
else
  echo "No forwarded agent keys; trying the Pi's GitHub SSH key (must have no passphrase)"
  export GIT_SSH_COMMAND="ssh -o BatchMode=yes"
fi

if [ -s "$HOME/.config/nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.config/nvm"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
elif [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
fi

command -v node >/dev/null || {
  echo "node not found on PATH after nvm. Install Node LTS with nvm on the Pi." >&2
  exit 1
}

cd "$APP_DIR"
git fetch origin main
git checkout main
git pull --ff-only origin main
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
  echo "Pi is not on main (currently $(git rev-parse --abbrev-ref HEAD))" >&2
  exit 1
fi

npm install
npm run build
node -v
echo "Build finished on $(hostname)"
REMOTE

reboot_pi "$MAIN_PI"
wait_for_ssh "$MAIN_PI"
# systemd Type=idle + Node binding :80 often lags SSH by a bit
sleep 8
wait_for_http "${VERIFY_BASE_URL}/"

if [[ "${SKIP_VERIFY}" != "1" ]]; then
  echo "Verifying production endpoints on ${VERIFY_BASE_URL} ..."
  VERIFY_BASE_URL="${VERIFY_BASE_URL}" npm run verify
fi

if [[ "${SKIP_ENTRE}" != "1" ]]; then
  reboot_pi "${ENTRE_PI}"
  wait_for_ssh "${ENTRE_PI}"
fi

printf 'Deploy done. Stue kiosk: %s/  Entre kiosk: %s/entre\n' \
  "${VERIFY_BASE_URL}" "${VERIFY_BASE_URL}"
