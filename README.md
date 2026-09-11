# Homey Dashboard

Vite + React dashboards for Homey (Stue `/`, Entre `/entre`, 2. etasje `/andre`). Express serves the production build and API routes.

For a structured map of routes, Homey helpers, weather, speakers, Insights, and reuse patterns, see [`docs/codebase-map.md`](docs/codebase-map.md).

Requires **Node.js LTS** via nvm (`.nvmrc` → `lts/*`, currently **^24.19.0** in `package.json` `engines`).

## Scripts

| Script                      | Purpose                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `npm start` / `npm run dev` | Vite (port 3000) + Express API (port 3080; `/api` proxied)                             |
| `npm run start:api`         | Express API only (port 3080)                                                           |
| `npm run build`             | Production build → `build/`                                                            |
| `npm run start:production`  | Express static + API (`PORT`, default 80; use `sudo` on the Pi if binding to 80)       |
| `npm test`                  | Vitest                                                                                 |
| `npm run lint`              | ESLint                                                                                 |
| `npm run format`            | Prettier                                                                               |
| `npm run verify`            | HTTP 200 checks for `/`, `/entre`, `/andre`, temperature API, and weather API          |
| `npm run deploy`            | From your Mac: pull/build on the living-room Pi, reboot both kiosk Pis (SSH keys only) |

## Environment

Browser (Vite) only exposes prefixed vars:

```
REACT_APP_HOMEY_TOKEN=...
# or
VITE_HOMEY_TOKEN=...
```

Server/API also accepts `HOMEY_TOKEN` (and the same `VITE_` / `REACT_APP_` names).

Optional: `HOMEY_ADDRESS` (default `http://192.168.68.80`), `PORT`.

## Verify after changes

```bash
npm run build
PORT=3080 npm run start:production &
VERIFY_BASE_URL=http://localhost:3080 npm run verify
```

Kiosk on the Pi (server + fullscreen Chromium):

```bash
./scripts/start.sh
```

## Deploy (Raspberry Pi)

Living-room Pi **192.168.68.91** runs the production server and the `/` kiosk. Entre Pi **192.168.68.99** (`rpi`) only opens `/entre` in a browser (it does not run Node).

From your Mac, after the branch is on GitHub:

```bash
npm run deploy
```

The script uses **SSH keys only** (`BatchMode` — it will not ask for a password). One-time setup in your own terminal:

```bash
ssh-copy-id pi@192.168.68.91
ssh-copy-id rpi@192.168.68.99
```

On the main Pi, `git pull` should use a **passphrase-less read-only GitHub deploy key** (so deploy is not blocked by a key passphrase). The deploy script also forwards your Mac ssh-agent as a fallback.

See [`scripts/deploy.sh`](scripts/deploy.sh) and [`docs/codebase-map.md`](docs/codebase-map.md) (Production).
