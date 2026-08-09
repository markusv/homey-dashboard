# Homey Dashboard

Vite + React dashboards for Homey (Stue `/` and Entre `/entre`). Express serves the production build and API routes.

Requires **Node.js LTS** via nvm (`.nvmrc` → `lts/*`, currently **^24.19.0** in `package.json` `engines`).

## Scripts

| Script                      | Purpose                                                                          |
| --------------------------- | -------------------------------------------------------------------------------- |
| `npm start` / `npm run dev` | Vite dev server (port 3000)                                                      |
| `npm run start:api`         | Express API only (port 3080; used by Vite `/api` proxy)                          |
| `npm run build`             | Production build → `build/`                                                      |
| `npm run start:production`  | Express static + API (`PORT`, default 80; use `sudo` on the Pi if binding to 80) |
| `npm test`                  | Vitest                                                                           |
| `npm run lint`              | ESLint                                                                           |
| `npm run format`            | Prettier                                                                         |
| `npm run verify`            | HTTP 200 checks for `/`, `/entre`, and temperature API                           |

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
