#!/usr/bin/env bash
# Deploy Homey dashboard from your Mac to the living-room Pi, then reboot both kiosks.
#
# Security: uses existing SSH keys only. Never prompts for a password
# (BatchMode). Do not put passwords, tokens, or private keys in this file.
#
# One-time on your Mac (you type any password locally; the agent never sees it):
#   ssh-copy-id pi@192.168.68.91
#   ssh-copy-id rpi@192.168.68.99
#
# Usage (from the repo root):
#   npm run deploy
#   ./scripts/deploy.sh
#
# Optional env:
#   MAIN_PI     default pi@192.168.68.91
#   ENTRE_PI    default rpi@192.168.68.99
#   APP_DIR     default /home/pi/Projects/homey-dashboard
#   BRANCH      default: current local git branch (must already be on origin)
#   SKIP_ENTRE=1   skip rebooting the entre kiosk
#   SKIP_VERIFY=1  skip HTTP 200 checks after the main Pi is back

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MAIN_PI="${MAIN_PI:-pi@192.168.68.91}"
ENTRE_PI="${ENTRE_PI:-rpi@192.168.68.99}"
APP_DIR="${APP_DIR:-/home/pi/Projects/homey-dashboard}"
BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
SKIP_ENTRE="${SKIP_ENTRE:-0}"
SKIP_VERIFY="${SKIP_VERIFY:-0}"
SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=10 -o ServerAliveInterval=15)

main_host="${MAIN_PI#*@}"
VERIFY_BASE_URL="${VERIFY_BASE_URL:-http://${main_host}}"

ssh_pi() {
  ssh "${SSH_OPTS[@]}" "$@"
}

die() {
  echo "error: $*" >&2
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
    if ssh "${SSH_OPTS[@]}" -o ConnectTimeout=5 "$target" true 2>/dev/null; then
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
  local timeout="${2:-180}"
  local start
  start="$(date +%s)"
  echo "Waiting for HTTP 200: $url ..."
  while true; do
    if curl -fsS -o /dev/null --connect-timeout 5 --max-time 10 "$url"; then
      echo "HTTP OK: $url"
      return 0
    fi
    if (( $(date +%s) - start > timeout )); then
      die "timed out waiting for $url"
    fi
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

if [[ "$BRANCH" == "HEAD" ]]; then
  die "detached HEAD — check out a branch (or set BRANCH=...) before deploying"
fi

git fetch origin "$BRANCH" || die "could not fetch origin/$BRANCH — push this branch first"

local_sha="$(git rev-parse HEAD)"
if ! remote_sha="$(git rev-parse "origin/$BRANCH" 2>/dev/null)"; then
  die "origin/$BRANCH does not exist — git push -u origin $BRANCH"
fi

if [[ "$local_sha" != "$remote_sha" ]]; then
  if git merge-base --is-ancestor "$remote_sha" "$local_sha"; then
    die "local $BRANCH is ahead of origin — git push before deploying (the Pi pulls from GitHub)"
  fi
  echo "warning: local $BRANCH differs from origin; the Pi will deploy origin/$BRANCH ($remote_sha)"
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "warning: working tree is dirty; the Pi still deploys whatever is on origin/$BRANCH"
fi

preflight_ssh "$MAIN_PI"
if [[ "$SKIP_ENTRE" != "1" ]]; then
  preflight_ssh "$ENTRE_PI"
fi

echo "Pull + install + build on $MAIN_PI ..."
ssh_pi "$MAIN_PI" \
  "APP_DIR=$(printf '%q' "$APP_DIR") BRANCH=$(printf '%q' "$BRANCH") bash -s" <<'REMOTE'
set -euo pipefail

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
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

npm install
npm run build
node -v
echo "Build finished on $(hostname)"
REMOTE

reboot_pi "$MAIN_PI"
wait_for_ssh "$MAIN_PI"
wait_for_http "$VERIFY_BASE_URL/"

if [[ "$SKIP_VERIFY" != "1" ]]; then
  echo "Verifying production endpoints on $VERIFY_BASE_URL ..."
  VERIFY_BASE_URL="$VERIFY_BASE_URL" npm run verify
fi

if [[ "$SKIP_ENTRE" != "1" ]]; then
  reboot_pi "$ENTRE_PI"
  wait_for_ssh "$ENTRE_PI"
fi

echo "Deploy done. Stue kiosk: $VERIFY_BASE_URL/  Entre kiosk: $VERIFY_BASE_URL/entre"
