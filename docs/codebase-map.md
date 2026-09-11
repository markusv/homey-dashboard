# Homey dashboard — codebase map

Last updated: 2026-09-11. Prefer reading this file over broad codebase exploration when adding dashboards or Homey features.

## Stack

- Vite + React 19 + `react-router-dom` 7
- Express serves `build/` + `/api` (SPA catch-all `*`)
- `homey-api` (local Homey at `HOMEY_ADDRESS`, default `http://192.168.68.80`)
- Shoelace 2.20.1 (dark theme)
- Node `^24.19.0` via nvm (`.nvmrc` → `lts/*`)

## Routes (client)

Registered in `src/index.js`:

| Path     | Page                        | Notes                                                                                |
| -------- | --------------------------- | ------------------------------------------------------------------------------------ |
| `/`      | `src/pages/Stue/Stue.jsx`   | Living room landscape                                                                |
| `/entre` | `src/pages/Entre/Entre.jsx` | Entrance + Ruter iframe                                                              |
| `/andre` | `src/pages/Andre/Andre.jsx` | 2nd floor, 720×1280 portrait (component folders + `hooks/` / `helpers/` / `common/`) |

New SPA routes: add to `src/index.js` + `scripts/verify.js` (+ `.cursor/rules/verify-http.mdc`). Express already serves all paths via catch-all.

## Config / IDs

| Location                             | Contents                                                     |
| ------------------------------------ | ------------------------------------------------------------ |
| `src/constants.js`                   | Shared device/flow IDs (1st floor, Roborock…)                |
| `src/pages/Stue/constants.js`        | `STUE_MOODS`                                                 |
| `src/pages/Entre/constants.js`       | `ENTRE_MOODS`                                                |
| `src/pages/Andre/rooms.constants.js` | Data-driven 2nd-floor rooms                                  |
| `src/server/rooms.js`                | Temperature Insights room → device (e.g. loft)               |
| Env                                  | `VITE_HOMEY_TOKEN` / `REACT_APP_HOMEY_TOKEN` / `HOMEY_TOKEN` |

## Homey (client)

| File                                                          | Role                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `src/helpers/getHomey.js`                                     | Local HomeyAPI singleton                                                 |
| `src/helpers/useGetDevices.js`                                | `devices.getDevices()` once                                              |
| `src/components/Devices/helpers/useGetDevice.js`              | Single device by id                                                      |
| `src/components/Devices/helpers/useMakeCapabilityInstance.js` | Live capability updates                                                  |
| `src/components/Devices/helpers/updateCapabolityOnDevice.js`  | Optimistic local patch                                                   |
| `src/components/Devices/helpers/hasCapability.js`             | Capability check                                                         |
| Setting values                                                | `homeyApi.devices.setCapabilityValue({ deviceId, capabilityId, value })` |
| `src/helpers/useGetFlows.js`                                  | Flows + advanced flows                                                   |
| `src/components/Flows/helpers/triggerFlow.js`                 | `triggerFlow` → advanced fallback                                        |
| `src/helpers/useGetLogicVariable.js` / `setLogicVariable`     | Logic variables                                                          |

Zones: used on `/andre` via `room.homeyZoneId` + device `zone`. Stue/Entre use hard-coded device IDs.

## Homey (server)

| File                               | Role                      |
| ---------------------------------- | ------------------------- |
| `src/server/homeyClient.js`        | Server HomeyAPI           |
| `src/server/insights.js`           | `bucketHourlyPoints`      |
| `src/server/routes/temperature.js` | Insights temperature      |
| `src/server/routes/weather.js`     | MET Norway forecast cache |

### Temperature API

- `GET /api/read/temperature/:room` — mapped rooms in `src/server/rooms.js` (e.g. `loft`)
- `GET /api/read/temperature/device/:deviceId?range=day|week|month` — Insights by device (`last24Hours` / `last7Days` / `last31Days`)
- `GET /api/read/insights/device/:deviceId?capability=measure_co2&range=day|week|month` — generic Insights by capability

Response shape: `{ current, points, unit, range, … }`.

## Weather (MET / “Yr”)

- Server: `GET /api/read/weather` → MET Locationforecast compact (lat/lon in route), 1h cache
- Client: `getWeather` → `useFetchForecast` (hourly refresh)
- UI: `Weather`, `WeatherLarge`, `ForecastDay`, `ForecastItem`
- Day slots: `getForecastItemsForDay` (4 points/day; past hours mostly absent from MET)
- Icons: `public/dashboardAssets/weatherIcons/{symbol_code}.svg`
- `/andre` uses horizontal `WeatherStrip`: remaining hours today + all MET days (4 points/day, swipe row)

## Speakers

| Implementation      | Path                                       | Notes                                                                                                                             |
| ------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Sonos** (Stue)    | `src/components/Devices/Sonos/*`           | Capabilities: play/pause, volume (`useVolume` debounce 750ms), favorites, album art. `SonosFocus` accepts `deviceId` + `embedded` |
| **Spotify Connect** | same `SonosFocus` UI                       | `/andre` Fabian via `speakerDeviceId` → Homey app `nl.pendo.spotify` (speaker caps; no Sonos favorites)                           |
| **AudioPro**        | `src/components/Devices/AudioProSpeaker/*` | Flow-driven fallback when device lacks `speaker_playing`                                                                          |

## Vacuum / Roborock

- Stue/Entre: room-picker flows in `RoborockFocus` / Entre card; shared `VacuumIcon` glyph
- `/andre`: start only via `clean_full` (or `onoff`) on configured `vacuumDeviceId`
- Unused alternate: `useToggleRoborockClean`

## Lights

- Stue/Entre: mostly mood **flows**, not direct light UI
- `/andre`: auto-discover lights by zone (`primaryLightDeviceId` for status/dim display/color; dim slider commands all dimmable lights; `excludedLightDeviceIds`; `includeChildZoneLights` for nested Homey zones)
- `/andre` room cards: lights/blinds auto; speaker/vacuum/fan via device ids; flows only when `flows[].showOnRoomCard: true` (all flows still in Handlinger)
- `/andre` Handlinger: light toggle, optional `fanDeviceId` toggle (spinning icon when on), blinds, flows, vacuum
- `/andre` heat pump: optional `heatPumpDeviceId` in room detail — on/off, heating/cooling, setpoint slider, fan speed, powerful (Daikin OneCTA)
- `/andre` overview: `overviewActions` under room grid (e.g. Kveldskos, Støvsug)
- `/andre` speaker detail: optional `speakerFlows` under the player (e.g. Spill lydbok / Spill musikk)

## Blinds / rullegardiner

- Homey capability: `windowcoverings_set` (0 = ned, 1 = opp)
- `/andre`: auto-discover by zone (`isBlindDevice`, `getRoomBlinds`, optional `excludedBlindDeviceIds`); Opp/Ned in Handlinger + room cards (`useLiveRoomBlinds`)
- Flow icons `sun-shades` / `blinds` / `rullegardin` / `gardin` / `solskjerming` render custom `BlindIcon` (not a Shoelace name)
- Existing Stue markise UI: `components/Devices/Markise/` (hard-coded device id)

## Temperature UI

- Stue focus: heat pump indoor/outdoor (`FocusTemperature`)
- Entre: outdoor from 2nd-floor heat pump id in `src/constants.js`
- `/andre`: live `measure_temperature` + Insights chart in room detail
- `/andre` air quality: Airthings Wave thresholds; same sensor + metrics on room card and detail; AirGlimpse-style overall score in detail
- Insights: `GET /api/read/insights/device/:deviceId?capability=…&range=day|week|month`; room detail combines temp + CO₂ in one dual-axis chart

## UI patterns

- Shoelace: `sl-theme-dark`, `SlButton`, `<sl-icon>`, CDN `setBasePath`
- Shared layout CSS: `src/App.css` (Stue columns)
- Entre cards: `src/pages/Entre/components/Card/*`
- Focus overlay: `FocusedElement`
- Large displays: `@media (min-width: 1900px)` bumps sizes
- `/andre`: touch-first, no hover reliance, portrait CSS in `Andre.css`

## Production (Raspberry Pi)

Two kiosk Pis on the LAN. The agent must not ask for SSH/sudo passwords; deploy is key-based and run by the user (`npm run deploy`).

| Device      | Address                 | Role                                                                                                                                                                    |
| ----------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stue (main) | `192.168.68.91` (`pi`)  | Express serves `build/` + `/api` on port 80; Chromium kiosk on `/`. Repo: `/home/pi/Projects/homey-dashboard`. systemd: `dashboard.service` (starts `scripts/start.sh`) |
| Entre       | `192.168.68.99` (`rpi`) | Chromium kiosk on `http://192.168.68.91/entre` only — no Node server                                                                                                    |

Deploy from a Mac on the same LAN (`scripts/deploy.sh`):

1. Push the branch to GitHub (the Pi only pulls `origin`).
2. SSH key auth to both Pis (`BatchMode` — no password prompt).
3. On the main Pi: `git pull`, `npm install`, `npm run build`.
4. Reboot the main Pi; wait until SSH and HTTP 200 on `/`.
5. Run `VERIFY_BASE_URL=http://192.168.68.91 npm run verify`.
6. Reboot the entre Pi so its kiosk reloads `/entre`.

One-time SSH keys (run locally, never commit keys or paste passwords into chat): `ssh-copy-id pi@192.168.68.91` and `ssh-copy-id rpi@192.168.68.99`. Reboot needs passwordless `sudo /sbin/reboot` on each Pi.

## Adding a dashboard / room

1. Prefer data-driven config (see `src/pages/Andre/rooms.constants.js`) — avoid `if (room.id === '…')`.
2. Reuse Homey helpers, weather hooks, Sonos/AudioPro, `triggerFlow`, Insights API.
3. Register route + verify endpoint.
4. Run `npm run lint`, `npm run format`; after substantial work: build + `npm run verify`.

## Homey zones (2. etasje parent)

Parent zone id: `b840a982-a3a7-4513-9d96-902d81128f5c` (“2 Etg”). Child rooms used by `/andre` are listed in `src/pages/Andre/rooms.constants.js` with live Homey IDs.
